import fetch from "node-fetch";

const API =
  "https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json";

export async function getPrediction() {
  const res = await fetch(API + "?t=" + Date.now(), { cache: "no-store" });
  const json = await res.json();

  const latest = json?.data?.list?.[0];
  if (!latest) return null;

  const nextPeriod = (BigInt(latest.issueNumber) + 1n).toString();

  const number = parseInt(latest.number, 10);
  const prediction = number >= 5 ? "SMALL" : "BIG";

  return {
    period: nextPeriod,
    prediction
  };
}
