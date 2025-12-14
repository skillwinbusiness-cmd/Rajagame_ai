import fetch from "node-fetch";

export async function sendMessage(token, chatId, text) {
  if (!token || !chatId) return;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text
      })
    });
  } catch (e) {
    console.error("Telegram error:", e.message);
  }
}
