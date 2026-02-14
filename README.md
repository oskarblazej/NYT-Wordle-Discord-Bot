# NYT Wordle Discord Bot

A lightweight Node.js bot that fetches the daily New York Times Wordle solution and its dictionary definition, then posts it to a designated Discord channel at a scheduled time.

## Prerequisites

* **Node.js v18.0.0 or higher** (Required for native `fetch` support)
* **npm** (Node Package Manager)
* **Discord Developer Account**
* **Oracle Cloud Instance** (or any 24/7 server)

## 1. Discord Developer Portal Setup

1.  Go to the [Discord Developer Portal](https://discord.com/developers/applications).
2.  Click **New Application** and give it a name.
3.  Navigate to the **Bot** tab:
    * Click **Reset Token** to generate your unique bot token. **Copy this immediately.**
    * Under **Privileged Gateway Intents**, toggle **SERVER MEMBERS INTENT** to **ON**.
4.  Navigate to **OAuth2** -> **URL Generator**:
    * Scopes: Select `bot`.
    * Bot Permissions: Select `View Channels` and `Send Messages`.
    * Copy the generated URL and open it in your browser to invite the bot to your server.

## 2. Local Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd wordle-bot
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Configuration:**
    Create a `.env` file in the root directory:
    ```env
    DISCORD_TOKEN=your_bot_token_here
    CHANNEL_ID=your_discord_channel_id_here
    ```
    *Note: To get the `CHANNEL_ID`, enable **Developer Mode** in Discord Settings -> Advanced, right-click the channel, and select **Copy Channel ID**.*

## 3. Deployment (Oracle Cloud / Production)

To ensure the bot remains online after you close your SSH session, use **PM2**:

1.  **Install PM2 globally:**
    ```bash
    sudo npm install -g pm2
    ```

2.  **Start the bot:**
    ```bash
    pm2 start index.js --name "wordle-bot"
    ```

3.  **Manage the process:**
    * `pm2 status` - View running bots.
    * `pm2 logs wordle-bot` - View real-time output and errors.
    * `pm2 restart wordle-bot` - Restart after code changes.

## 4. Security & Best Practices

* **Secret Management:** Never commit your `.env` file to GitHub. Ensure `.gitignore` includes `.env` and `node_modules/`.
* **Server Time:** Oracle Cloud instances typically use **UTC** time. If you want the bot to post at 14:00 CET/CEST, adjust the cron schedule accordingly (e.g., `0 13 * * *` or `0 12 * * *`).
* **Token Safety:** If your token is ever exposed publicly, reset it immediately in the Developer Portal.

## License
MIT
