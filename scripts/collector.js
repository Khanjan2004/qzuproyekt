(function (global) {
  function buildPayload() {
    return {
      event: 'welcome_page_visit',
      timestamp: new Date().toISOString(),
      page: {
        url: window.location.href,
        path: window.location.pathname,
        title: document.title,
        referrer: document.referrer || null
      },
      client: {
        language: navigator.language || null,
        userAgent: navigator.userAgent || null,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || null,
        screen: {
          width: window.screen.width,
          height: window.screen.height
        }
      }
    };
  }

  async function sendPayload(payload) {
    const response = await fetch('/backend/collect.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('Collector endpoint error: ' + response.status);
    }

    return response.json();
  }

  global.AnalyticsCollector = {
    buildPayload,
    sendPayload
  };
})(window);
