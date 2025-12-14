import express from "express";
import { state } from "./state.js";
import { getPrediction } from "./predictor.js";
import { sendMessage } from "./telegram.js";

const app = express();
app.use(express.json());

// 🔐 SET YOUR TELEGRAM DETAILS HERE
const BOT_TOKEN = "YOUR_BOT_TOKEN";
const CHAT_ID = "YOUR_CHAT_ID";

// 🟢 START BOT
app.post("/start", async (req, res) => {
  if (state.running) {
    return res.json({ status: "already running" });
  }

  state.running = true;

  await sendMessage(
    BOT_TOKEN,
    CHAT_ID,
    "🟢 RAJA GAME AI STARTED"
  );

  state.interval = setInterval(async () => {
    try {
      const data = await getPrediction();
      if (!data) return;

      if (state.lastPeriod === data.period) return;
      state.lastPeriod = data.period;

      const msg = `🔥 RAJA GAME AI\n\nPeriod: ${data.period}\nPrediction: ${data.prediction}`;
      await sendMessage(BOT_TOKEN, CHAT_ID, msg);
    } catch (e) {
      console.error("Loop error:", e.message);
    }
  }, 60_000); // 1 MINUTE

  res.json({ status: "started" });
});

// 🔴 STOP BOT
app.post("/stop", async (req, res) => {
  state.running = false;
  clearInterval(state.interval);

  await sendMessage(
    BOT_TOKEN,
    CHAT_ID,
    "🔴 RAJA GAME AI STOPPED"
  );

  res.json({ status: "stopped" });
});

// 🟡 STATUS
app.get("/status", (req, res) => {
  res.json({
    running: state.running
  });
});

// ROOT CHECK
app.get("/", (req, res) => {
  res.send("RAJA GAME AI BACKEND RUNNING");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log("Backend running on port", PORT)
);
