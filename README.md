# 🌐 DDNS over CloudFlare

> [!TIP]
> **Dynamic Domain Name System (DDNS)** is a mechanism for automatically updating DNS records for domain names whenever the IP address changes.

**When is DDNS useful?**

- If you have a **public white IP address** that changes periodically.
- When you need to access your device from the internet using a stable domain name.
- In cases where your internet provider assigns dynamic IP addresses.

---

## ✨ Features

- 📡 **Automatic IP Update** — Automatically tracks changes to your IP address and updates DNS records.
- 🔐 **Security** — Uses a CloudFlare token with minimal required access permissions.
- ⏱️ **Flexible Check Intervals** — Configurable frequency for checking IP addresses.
- 📋 **Multiple Record Support** — Allows monitoring and updating multiple DNS records simultaneously.
- 🐳 **Docker Compatibility** — Easy deployment via Docker Compose.
- 🌐 **IP Address Detection** — Uses the [cdn-cgi/trace](https://www.cloudflare.com/cdn-cgi/trace) service to determine the current IP address.

---

## 🛠️ Configuration — `config.yaml`

To run the project, a configuration file `config.yaml` must be located in the root directory. Example:

```yaml
zone: <zone id>
period: 30
token: <token>
records:
  - hostname: example.com
    proxied: false
  - hostname: test.example.com
    proxied: true
```

### Parameters:

- **`zone`** – CloudFlare zone ID.
- **`period`** – Interval (in seconds) for checking the current IP address *(recommended: 30 seconds)*.
- **`token`** – Bearer [CloudFlare token](https://dash.cloudflare.com/profile/api-tokens) with permissions to read and modify DNS records.
- **`records`** – List of DNS records for monitoring and updating:
  - **`hostname`** – DNS record name.
  - **`proxied`** – Enables (true) or disables (false) proxying through CloudFlare.

---

## 🚀 Getting Started

### Run via Docker Compose:

```bash
docker compose up -d
```

### Standard TypeScript Run:

1. Install dependencies:

```bash
npm install
```

2. Compile TypeScript code:

```bash
npm run build
```

3. Start the project:

```bash
npm run start
```

---

## ⚙️ How It Works

1. On startup, the application checks for DNS records in CloudFlare based on the parameters in `config.yaml`.
2. If a record is missing, it creates one with the current IP address.
3. The program enters an infinite loop, checking the IP address every `period` seconds:
   - Checks the current IP address.
   - Updates it in CloudFlare if it has changed.

> [!TIP]
> It is recommended to set the check interval to at least 30 seconds to avoid excessive requests to the CloudFlare API.

---

Created with ❤ by AndcoolSystems — *September 10, 2024.*


