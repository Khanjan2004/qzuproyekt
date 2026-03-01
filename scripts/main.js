(function () {
  const content = window.WELCOME_CONTENT;

  document.getElementById('welcome-title').textContent = content.title;
  document.getElementById('welcome-subtitle').textContent = content.subtitle;
  document.getElementById('about-text').textContent = content.about;
  document.getElementById('telegram-text').textContent = content.telegramText;

  const telegramLink = document.getElementById('telegram-link');
  telegramLink.href = content.telegramUrl;
  telegramLink.addEventListener('click', function (event) {
    event.preventDefault();
    window.TelegramBridge.openTelegram(content.telegramUrl);
  });

  const button = document.getElementById('start-analytics');
  const checkbox = document.getElementById('consent-checkbox');
  const status = document.getElementById('status');

  button.addEventListener('click', async function () {
    if (!checkbox.checked) {
      status.textContent = 'Please provide consent before enabling analytics.';
      return;
    }

    try {
      const payload = window.AnalyticsCollector.buildPayload();
      const result = await window.AnalyticsCollector.sendPayload(payload);
      status.textContent = 'Analytics enabled. Session ID: ' + (result.sessionId || 'N/A');
    } catch (error) {
      status.textContent = 'Could not send analytics: ' + error.message;
    }
  });
})();
