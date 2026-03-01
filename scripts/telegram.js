(function (global) {
  function openTelegram(botUrl) {
    const url = new URL('/backend/telegram-forward.php', window.location.origin);
    url.searchParams.set('target', botUrl);
    window.location.href = url.toString();
  }

  global.TelegramBridge = {
    openTelegram
  };
})(window);
