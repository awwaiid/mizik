// High scores live in score-server/ (sqlite), served from thelackthereof.org.
const API = "https://thelackthereof.org/mizik";

export async function saveScore(score) {
  // text/plain keeps this a CORS "simple request": no preflight.
  await fetch(`${API}/scores`, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify(score)
  });
}

export async function loadLeaders(days) {
  const url = days ? `${API}/leaders?days=${days}` : `${API}/leaders`;
  const { leaders } = await (await fetch(url)).json();
  return leaders.map(l => ({
    ...l,
    createdAt: new Date(l.createdAt).toLocaleDateString()
  }));
}
