// Better AWS — Background Service Worker
// Tracks AWS API requests and manages account resource discovery.

const state = {
  requests: [],       // recent requests: { url, method, status, service, ts }
  resources: {},       // service -> [resource, …]
  settings: {
    uiEnhancements: true,
    requestPanel: true,
    overviewGraph: true,
  },
};

const MAX_REQUESTS = 500;

// ── Request tracking ────────────────────────────────────────────────────────

chrome.webRequest.onCompleted.addListener(
  (details) => {
    const entry = parseRequest(details);
    state.requests.push(entry);
    if (state.requests.length > MAX_REQUESTS) {
      state.requests = state.requests.slice(-MAX_REQUESTS);
    }
    trackResource(entry);
    broadcast({ type: "request", payload: entry });
  },
  { urls: ["https://*.amazonaws.com/*", "https://*.aws.amazon.com/*"] }
);

chrome.webRequest.onErrorOccurred.addListener(
  (details) => {
    const entry = parseRequest(details, true);
    state.requests.push(entry);
    if (state.requests.length > MAX_REQUESTS) {
      state.requests = state.requests.slice(-MAX_REQUESTS);
    }
    broadcast({ type: "request", payload: entry });
  },
  { urls: ["https://*.amazonaws.com/*", "https://*.aws.amazon.com/*"] }
);

function parseRequest(details, isError = false) {
  const url = new URL(details.url);
  const service = guessService(url);
  return {
    id: details.requestId,
    url: details.url,
    method: details.method,
    status: isError ? "error" : details.statusCode,
    service,
    action: guessAction(url, details),
    ts: Date.now(),
  };
}

function guessService(url) {
  // e.g. ec2.us-east-1.amazonaws.com → ec2
  //      console.aws.amazon.com/s3 → s3
  const host = url.hostname;
  const path = url.pathname;

  // API-style endpoints: <service>.<region>.amazonaws.com
  const apiMatch = host.match(/^([a-z0-9-]+)\.[a-z0-9-]+\.amazonaws\.com$/);
  if (apiMatch) return apiMatch[1];

  // Console path-based: console.aws.amazon.com/<service>/…
  const pathMatch = path.match(/^\/([a-z0-9-]+)/);
  if (pathMatch) return pathMatch[1];

  return "unknown";
}

function guessAction(url, details) {
  const params = url.searchParams;
  // Many AWS APIs pass Action as query param
  if (params.has("Action")) return params.get("Action");
  // For newer JSON APIs look at x-amz-target or path
  return url.pathname.split("/").filter(Boolean).slice(-1)[0] || "unknown";
}

// ── Resource tracking ───────────────────────────────────────────────────────

function trackResource(entry) {
  if (!state.resources[entry.service]) {
    state.resources[entry.service] = new Set();
  }
  if (entry.action && entry.action !== "unknown") {
    state.resources[entry.service].add(entry.action);
  }
}

// ── Messaging ───────────────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  switch (msg.type) {
    case "getRequests":
      sendResponse({ requests: state.requests });
      break;
    case "getResources":
      // Convert Sets to arrays for serialization
      const resources = {};
      for (const [svc, actions] of Object.entries(state.resources)) {
        resources[svc] = [...actions];
      }
      sendResponse({ resources });
      break;
    case "getSettings":
      sendResponse({ settings: state.settings });
      break;
    case "updateSettings":
      Object.assign(state.settings, msg.payload);
      chrome.storage.local.set({ settings: state.settings });
      broadcast({ type: "settingsChanged", payload: state.settings });
      sendResponse({ ok: true });
      break;
    case "clearRequests":
      state.requests = [];
      state.resources = {};
      sendResponse({ ok: true });
      break;
  }
  return true; // keep channel open for async response
});

function broadcast(msg) {
  chrome.runtime.sendMessage(msg).catch(() => {
    // popup may not be open — ignore
  });
}

// ── Init ────────────────────────────────────────────────────────────────────

chrome.storage.local.get("settings", (data) => {
  if (data.settings) Object.assign(state.settings, data.settings);
});
