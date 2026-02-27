// Better AWS — Content Script
// Injected into AWS Console pages. Provides:
//  1. Request activity panel (bottom-right)
//  2. Empty-state replacement while requests are in-flight
//  3. Minor UI enhancements

(() => {
  "use strict";

  // ── Request Panel ───────────────────────────────────────────────────────

  let panel, body, badge;
  let requestCount = 0;

  function createPanel() {
    panel = document.createElement("div");
    panel.id = "baws-panel";

    const header = document.createElement("div");
    header.id = "baws-panel-header";
    header.innerHTML = `
      <div style="display:flex;align-items:center">
        <h3>Better AWS</h3>
        <span class="baws-badge" id="baws-badge">0</span>
      </div>
      <button id="baws-panel-toggle">▾</button>
    `;

    body = document.createElement("div");
    body.id = "baws-panel-body";

    panel.appendChild(header);
    panel.appendChild(body);
    document.body.appendChild(panel);

    badge = document.getElementById("baws-badge");

    header.addEventListener("click", () => {
      panel.classList.toggle("collapsed");
      const btn = document.getElementById("baws-panel-toggle");
      btn.textContent = panel.classList.contains("collapsed") ? "▴" : "▾";
    });
  }

  function addRequestRow(req) {
    requestCount++;
    badge.textContent = requestCount;

    const row = document.createElement("div");
    row.className = "baws-req";

    const statusCode = typeof req.status === "number" ? req.status : 0;
    let statusClass = "ok";
    if (req.status === "error" || statusCode >= 500) statusClass = "err";
    else if (statusCode >= 400) statusClass = "warn";

    const time = new Date(req.ts);
    const ts = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    row.innerHTML = `
      <span class="baws-req-method ${req.method}">${req.method}</span>
      <span class="baws-req-service">${req.service}</span>
      <span class="baws-req-action" title="${escapeHtml(req.action)}">${escapeHtml(req.action)}</span>
      <span class="baws-req-status ${statusClass}">${req.status}</span>
      <span class="baws-req-time">${ts}</span>
    `;

    // Newest on top
    body.insertBefore(row, body.firstChild);

    // Keep DOM manageable
    while (body.children.length > 200) {
      body.removeChild(body.lastChild);
    }
  }

  // ── Empty-state watcher ─────────────────────────────────────────────────
  // When AWS shows "No resources" or a blank table while requests are still
  // pending, overlay a friendlier message.

  let pendingRequests = 0;

  function interceptFetch() {
    const originalFetch = window.fetch;
    window.fetch = async function (...args) {
      pendingRequests++;
      markEmptyStates();
      try {
        const res = await originalFetch.apply(this, args);
        return res;
      } finally {
        pendingRequests--;
        if (pendingRequests === 0) clearEmptyOverlays();
      }
    };

    const origOpen = XMLHttpRequest.prototype.open;
    const origSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (...args) {
      this._bawsUrl = args[1];
      return origOpen.apply(this, args);
    };

    XMLHttpRequest.prototype.send = function (...args) {
      pendingRequests++;
      markEmptyStates();
      this.addEventListener("loadend", () => {
        pendingRequests--;
        if (pendingRequests === 0) clearEmptyOverlays();
      });
      return origSend.apply(this, args);
    };
  }

  function markEmptyStates() {
    const empties = document.querySelectorAll(
      '[class*="empty-state"], [class*="EmptyState"], [class*="no-resources"], [data-testid*="empty"]'
    );
    empties.forEach((el) => {
      if (!el.classList.contains("baws-loading-overlay")) {
        el.classList.add("baws-loading-overlay");
      }
    });
  }

  function clearEmptyOverlays() {
    document.querySelectorAll(".baws-loading-overlay").forEach((el) => {
      el.classList.remove("baws-loading-overlay");
    });
  }

  // ── UI enhancements ────────────────────────────────────────────────────

  function applyUIEnhancements() {
    document.body.classList.add("baws-enhanced");
  }

  // ── Message listener ───────────────────────────────────────────────────

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "request") {
      addRequestRow(msg.payload);
    }
    if (msg.type === "settingsChanged") {
      applySettings(msg.payload);
    }
  });

  function applySettings(settings) {
    if (panel) panel.style.display = settings.requestPanel ? "" : "none";
    if (settings.uiEnhancements) {
      document.body.classList.add("baws-enhanced");
    } else {
      document.body.classList.remove("baws-enhanced");
    }
  }

  // ── Helpers ────────────────────────────────────────────────────────────

  function escapeHtml(str) {
    const d = document.createElement("div");
    d.textContent = str;
    return d.innerHTML;
  }

  // ── Bootstrap ──────────────────────────────────────────────────────────

  function init() {
    createPanel();
    interceptFetch();
    applyUIEnhancements();

    // Load existing requests captured before this content script ran
    chrome.runtime.sendMessage({ type: "getRequests" }, (res) => {
      if (res && res.requests) {
        // Show last 50 in the panel
        res.requests.slice(-50).forEach(addRequestRow);
      }
    });

    chrome.runtime.sendMessage({ type: "getSettings" }, (res) => {
      if (res && res.settings) applySettings(res.settings);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
