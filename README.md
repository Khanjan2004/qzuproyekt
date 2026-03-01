# Welcome Page + Modular Collector (Telegram-Ready)

This project is a **starter architecture** for:

- A welcome page (`index.html`)
- Basic consent-based analytics collector (`scripts/collector.js`)
- Telegram redirection bridge (`scripts/telegram.js` + `backend/telegram-forward.php`)
- Backend endpoint to store events (`backend/collect.php`)

> Important: this template is intentionally **privacy-first**. It only collects basic session metadata and should be used with clear consent and a valid privacy policy.

---

## Project structure

```txt
.
├── index.html
├── styles/
│   └── welcome.css
├── scripts/
│   ├── page-content.js
│   ├── main.js
│   ├── collector.js
│   └── telegram.js
└── backend/
    ├── collect.php
    └── telegram-forward.php
```

### File responsibilities

- `index.html`: page layout and script/style imports.
- `styles/welcome.css`: visual design.
- `scripts/page-content.js`: flexible page content text and links.
- `scripts/main.js`: UI logic and orchestration.
- `scripts/collector.js`: builds and sends analytics payload.
- `scripts/telegram.js`: Telegram redirect handling.
- `backend/collect.php`: receives analytics events and logs JSON lines.
- `backend/telegram-forward.php`: validates + logs redirect before opening Telegram.

---

## What metadata is collected in this starter

Only after user consent:

- Timestamp
- Current URL/path/title
- Referrer
- Browser language
- User-Agent
- Timezone
- Screen width/height

No fingerprinting hashes, no camera/microphone access, no hidden tracking.

---

## Run locally

### Option A: PHP built-in server (recommended)

```bash
php -S 127.0.0.1:8080
```

Then open:

```txt
http://127.0.0.1:8080/index.html
```

### Option B: Any web server

Serve repository root so `/backend/*.php` routes are reachable.

---

## Telegram integration

Edit `scripts/page-content.js`:

```js
telegramUrl: 'https://t.me/your_bot_username?start=welcome'
```

When user clicks the button:
1. Browser calls `/backend/telegram-forward.php?target=...`
2. Endpoint validates URL + logs redirect metadata
3. User is sent to Telegram bot URL

---

## How to connect Telegram bot webhook

### Python example (Flask)

Use this minimal webhook receiver:

```python
from flask import Flask, request

app = Flask(__name__)

@app.post('/telegram/webhook')
def telegram_webhook():
    update = request.get_json(silent=True) or {}
    print('Telegram update:', update)
    return {'ok': True}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9000)
```

Set Telegram webhook:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-domain.com/telegram/webhook"
```

### PHP example (webhook endpoint)

Create `telegram-webhook.php`:

```php
<?php
$update = json_decode(file_get_contents('php://input'), true);
file_put_contents('telegram-updates.log', json_encode($update) . PHP_EOL, FILE_APPEND);
http_response_code(200);
echo json_encode(['ok' => true]);
```

Set webhook with same `setWebhook` API call pointing to your PHP endpoint.

---

## Future dashboard path

You can later build analytics dashboard by:

1. Replacing flat log files with a database (PostgreSQL/MySQL)
2. Adding authenticated admin panel
3. Aggregating metrics by day, source, campaign
4. Visualizing events with charts

---

## Legal & ethics checklist

Before production:

- [ ] Display clear consent checkbox/banner
- [ ] Publish privacy policy
- [ ] Explain what is collected and why
- [ ] Add data retention policy
- [ ] Provide delete/export flow where required by law

