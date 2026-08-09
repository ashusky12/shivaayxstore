# 🤖 ShivaayXStore Discord Live Support Integration Guide

This guide explains how to set up the Discord Bot to enable bidirectional live chat support between your Discord Server and your website ticket inbox!

---

## 1. Create a Discord Application & Bot

1. Go to the **[Discord Developer Portal](https://discord.com/developers/applications)**.
2. Click **New Application** at the top right, name it (e.g., `ShivaayX Support`), and save.
3. In the left sidebar, click **Bot**.
4. Click **Add Bot** and confirm.
5. Under the **Token** section, click **Reset Token** and copy the bot token.
   > [!IMPORTANT]
   > Keep this token secret! Save it as `DISCORD_BOT_TOKEN`.
6. Scroll down on the Bot page to **Privileged Gateway Intents** and **ENABLE** these three options:
   * **Presence Intent**
   * **Server Members Intent**
   * **Message Content Intent** (Crucial: This allows the bot to read messages in ticket channels to reply back to the web!)
7. Click **Save Changes**.

---

## 2. Invite the Bot to Your Server

1. In the sidebar of your Discord Application, click **OAuth2** -> **URL Generator**.
2. Under **Scopes**, select `bot`.
3. Under **Bot Permissions**, check these boxes:
   * **Manage Channels** (Needed to create new ticket channels!)
   * **Send Messages**
   * **Read Message History**
   * **Embed Links** / **Attach Files**
4. Copy the generated URL at the bottom and open it in a browser to invite the bot to your Discord Server.

---

## 3. Retrieve IDs (Guild ID & Category ID)

To locate these IDs, enable **Developer Mode** in Discord (`User Settings` -> `Advanced` -> `Developer Mode`).

1. **Guild ID (Server ID):** Right-click your server icon on the left sidebar and select **Copy Server ID**. Save this as `DISCORD_GUILD_ID`.
2. **Category ID (Optional but recommended):** Create a category named `Tickets` in your server. Right-click that category name and select **Copy Category ID**. Save this as `DISCORD_CATEGORY_ID`. This forces all web-created tickets to sit inside that specific category instead of cluttering your general channels list.

---

## 4. Update Environment Variables (`.env`)

Add the copied details to your backend environment files.

### For Local Testing:
Open `backend/.env` and add:
```env
DISCORD_BOT_TOKEN=your_bot_token_here
DISCORD_GUILD_ID=your_server_id_here
DISCORD_CATEGORY_ID=your_category_id_here
```

### For Production (Vercel):
Go to your **Vercel Project Dashboard** -> **Settings** -> **Environment Variables** and add:
* `DISCORD_BOT_TOKEN`
* `DISCORD_GUILD_ID`
* `DISCORD_CATEGORY_ID` (Optional)

---

## 5. Restart the Server

After updating the variables:
* On Local Dev: Restart the backend process (`npm run start` or let the watcher reload).
* On Vercel: Trigger a redeploy to inject the new environment variables into the central API server.

Once active, any customer clicking "Open Purchase Ticket" on the website will instantly spawn a dedicated text channel in your Discord! Typing inside that channel will dynamically push replies back to the customer's browser window.
