// Better AWS — Popup Script

(() => {
  "use strict";

  // ── Load stats ─────────────────────────────────────────────────────────

  chrome.runtime.sendMessage({ type: "getRequests" }, (res) => {
    if (!res) return;
    const reqs = res.requests || [];

    document.getElementById("stat-requests").textContent = reqs.length;

    const services = new Set(reqs.map((r) => r.service));
    document.getElementById("stat-services").textContent = services.size;

    const errors = reqs.filter(
      (r) => r.status === "error" || (typeof r.status === "number" && r.status >= 400)
    );
    document.getElementById("stat-errors").textContent = errors.length;

    renderRequests(reqs.slice(-20).reverse());
  });

  // ── Render recent requests ─────────────────────────────────────────────

  function renderRequests(reqs) {
    const list = document.getElementById("req-list");

    if (!reqs.length) return;

    list.innerHTML = "";
    reqs.forEach((r) => {
      const statusClass =
        r.status === "error" || (typeof r.status === "number" && r.status >= 400)
          ? "err"
          : "ok";

      const div = document.createElement("div");
      div.className = "req";
      div.innerHTML = `
        <span class="req-method ${r.method}">${r.method}</span>
        <span class="req-svc">${esc(r.service)}</span>
        <span class="req-action">${esc(r.action)}</span>
        <span class="req-status ${statusClass}">${r.status}</span>
      `;
      list.appendChild(div);
    });
  }

  // ── Live updates ───────────────────────────────────────────────────────

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "request") {
      // Increment counter
      const el = document.getElementById("stat-requests");
      el.textContent = parseInt(el.textContent, 10) + 1;

      if (
        msg.payload.status === "error" ||
        (typeof msg.payload.status === "number" && msg.payload.status >= 400)
      ) {
        const errEl = document.getElementById("stat-errors");
        errEl.textContent = parseInt(errEl.textContent, 10) + 1;
      }

      // Prepend to list
      const list = document.getElementById("req-list");
      const emptyMsg = list.querySelector(".empty-msg");
      if (emptyMsg) emptyMsg.remove();

      const r = msg.payload;
      const statusClass =
        r.status === "error" || (typeof r.status === "number" && r.status >= 400)
          ? "err"
          : "ok";

      const div = document.createElement("div");
      div.className = "req";
      div.innerHTML = `
        <span class="req-method ${r.method}">${r.method}</span>
        <span class="req-svc">${esc(r.service)}</span>
        <span class="req-action">${esc(r.action)}</span>
        <span class="req-status ${statusClass}">${r.status}</span>
      `;
      list.insertBefore(div, list.firstChild);

      // Cap visible items
      while (list.children.length > 30) {
        list.removeChild(list.lastChild);
      }
    }
  });

  // ── Settings toggles ──────────────────────────────────────────────────

  chrome.runtime.sendMessage({ type: "getSettings" }, (res) => {
    if (!res || !res.settings) return;
    const s = res.settings;
    setToggle("toggle-ui", s.uiEnhancements);
    setToggle("toggle-panel", s.requestPanel);
    setToggle("toggle-graph", s.overviewGraph);
  });

  document.querySelectorAll(".toggle").forEach((el) => {
    el.addEventListener("click", () => {
      const isOn = el.classList.toggle("on");
      const key = el.dataset.key;
      chrome.runtime.sendMessage({
        type: "updateSettings",
        payload: { [key]: isOn },
      });
    });
  });

  function setToggle(id, value) {
    const el = document.getElementById(id);
    if (value) el.classList.add("on");
    else el.classList.remove("on");
  }

  // ── Buttons ────────────────────────────────────────────────────────────

  document.getElementById("btn-overview").addEventListener("click", () => {
    chrome.tabs.create({ url: chrome.runtime.getURL("overview.html") });
  });

  document.getElementById("btn-clear").addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "clearRequests" }, () => {
      document.getElementById("stat-requests").textContent = "0";
      document.getElementById("stat-services").textContent = "0";
      document.getElementById("stat-errors").textContent = "0";
      document.getElementById("req-list").innerHTML =
        '<div class="empty-msg">No requests captured yet. Open the AWS Console.</div>';
    });
  });

  // ── Helpers ────────────────────────────────────────────────────────────

  function esc(str) {
    const d = document.createElement("div");
    d.textContent = str || "";
    return d.innerHTML;
  }
})();
