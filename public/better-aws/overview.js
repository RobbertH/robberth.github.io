// Better AWS — Overview Graph
// Draws a force-directed graph of services and their observed actions.

(() => {
  "use strict";

  const SERVICE_COLORS = [
    "#ff9f43", "#54a0ff", "#00b894", "#ff6b6b", "#feca57",
    "#a29bfe", "#fd79a8", "#00cec9", "#e17055", "#6c5ce7",
    "#81ecec", "#fab1a0", "#74b9ff", "#55efc4", "#fdcb6e",
  ];

  const canvas = document.getElementById("graph");
  const ctx = canvas.getContext("2d");

  let nodes = [];   // { id, label, type: "service"|"action", color, x, y, vx, vy, radius }
  let edges = [];   // { source, target }
  let animFrame;

  // ── Data loading ───────────────────────────────────────────────────────

  function loadData() {
    chrome.runtime.sendMessage({ type: "getResources" }, (res) => {
      if (!res || !res.resources) return showEmpty();
      buildGraph(res.resources);
    });

    chrome.runtime.sendMessage({ type: "getRequests" }, (res) => {
      if (!res) return;
      const reqs = res.requests || [];
      document.getElementById("stat-requests").textContent = reqs.length;

      const errors = reqs.filter((r) => r.status === "error" || (typeof r.status === "number" && r.status >= 400));
      const pct = reqs.length ? Math.round((errors.length / reqs.length) * 100) : 0;
      document.getElementById("stat-errors").textContent = pct + "%";
    });
  }

  function showEmpty() {
    const container = document.getElementById("graph-container");
    container.innerHTML = `
      <div class="empty">
        <h2>No data yet</h2>
        <p>Browse the AWS Console to start capturing API traffic.</p>
      </div>
    `;
  }

  // ── Graph construction ─────────────────────────────────────────────────

  function buildGraph(resources) {
    nodes = [];
    edges = [];

    const services = Object.keys(resources);
    document.getElementById("stat-services").textContent = services.length;

    let totalActions = 0;

    services.forEach((svc, i) => {
      const color = SERVICE_COLORS[i % SERVICE_COLORS.length];

      // Service node — larger
      nodes.push({
        id: `svc:${svc}`,
        label: svc,
        type: "service",
        color,
        x: 0, y: 0, vx: 0, vy: 0,
        radius: 24,
      });

      const actions = resources[svc] || [];
      totalActions += actions.length;

      actions.forEach((action) => {
        const actionId = `act:${svc}:${action}`;
        nodes.push({
          id: actionId,
          label: action,
          type: "action",
          color,
          x: 0, y: 0, vx: 0, vy: 0,
          radius: 10,
        });
        edges.push({ source: `svc:${svc}`, target: actionId });
      });
    });

    document.getElementById("stat-actions").textContent = totalActions;

    if (nodes.length === 0) return showEmpty();

    buildLegend(services);
    initPositions();
    resizeCanvas();
    simulate();
  }

  function buildLegend(services) {
    const el = document.getElementById("legend");
    el.innerHTML = services
      .map((svc, i) => {
        const c = SERVICE_COLORS[i % SERVICE_COLORS.length];
        return `<div class="legend-item"><span class="legend-dot" style="background:${c}"></span>${svc}</div>`;
      })
      .join("");
  }

  // ── Layout (simple force-directed) ─────────────────────────────────────

  function initPositions() {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    nodes.forEach((n) => {
      n.x = cx + (Math.random() - 0.5) * 300;
      n.y = cy + (Math.random() - 0.5) * 300;
    });
  }

  function simulate() {
    const ITERATIONS = 300;
    let i = 0;

    function step() {
      applyForces();
      draw();
      i++;
      if (i < ITERATIONS) {
        animFrame = requestAnimationFrame(step);
      }
    }

    if (animFrame) cancelAnimationFrame(animFrame);
    step();
  }

  function applyForces() {
    const REPULSION = 3000;
    const ATTRACTION = 0.005;
    const DAMPING = 0.85;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // Repulsion between all nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        let dx = a.x - b.x;
        let dy = a.y - b.y;
        let dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = REPULSION / (dist * dist);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        a.vx += fx;
        a.vy += fy;
        b.vx -= fx;
        b.vy -= fy;
      }
    }

    // Attraction along edges
    const nodeMap = {};
    nodes.forEach((n) => (nodeMap[n.id] = n));

    edges.forEach(({ source, target }) => {
      const a = nodeMap[source];
      const b = nodeMap[target];
      if (!a || !b) return;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const force = dist * ATTRACTION;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      a.vx += fx;
      a.vy += fy;
      b.vx -= fx;
      b.vy -= fy;
    });

    // Gravity toward center
    nodes.forEach((n) => {
      n.vx += (cx - n.x) * 0.0005;
      n.vy += (cy - n.y) * 0.0005;
      n.vx *= DAMPING;
      n.vy *= DAMPING;
      n.x += n.vx;
      n.y += n.vy;

      // Keep in bounds
      const pad = 40;
      n.x = Math.max(pad, Math.min(canvas.width - pad, n.x));
      n.y = Math.max(pad, Math.min(canvas.height - pad, n.y));
    });
  }

  // ── Rendering ──────────────────────────────────────────────────────────

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const nodeMap = {};
    nodes.forEach((n) => (nodeMap[n.id] = n));

    // Edges
    ctx.lineWidth = 1;
    edges.forEach(({ source, target }) => {
      const a = nodeMap[source];
      const b = nodeMap[target];
      if (!a || !b) return;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = a.color + "44"; // semi-transparent
      ctx.stroke();
    });

    // Nodes
    nodes.forEach((n) => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      ctx.fillStyle = n.type === "service" ? n.color : n.color + "88";
      ctx.fill();

      if (n.type === "service") {
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#fff3";
        ctx.stroke();
      }

      // Label
      ctx.fillStyle = "#e0e0e0";
      ctx.font = n.type === "service" ? "bold 11px sans-serif" : "10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(n.label, n.x, n.y + n.radius + 13);
    });
  }

  // ── Canvas sizing ──────────────────────────────────────────────────────

  function resizeCanvas() {
    const container = document.getElementById("graph-container");
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
  }

  window.addEventListener("resize", () => {
    resizeCanvas();
    if (nodes.length) draw();
  });

  // ── Init ───────────────────────────────────────────────────────────────

  document.getElementById("btn-refresh").addEventListener("click", loadData);

  resizeCanvas();
  loadData();
})();
