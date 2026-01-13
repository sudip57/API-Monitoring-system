// traffic-generator.js
const axios = require("axios");

function randomUserId() {
  // 10% chance to hit error route
  if (Math.random() < 0.1) return "500";
  return Math.floor(Math.random() * 1000).toString();
}

function randomDelay() {
  // random delay between 100ms – 1500ms
  return Math.floor(Math.random() * 1400) + 100;
}

async function fireRequest() {
  const userId = randomUserId();
  try {
    await axios.get(`http://localhost:4000/user/${userId}`);
    console.log(`✅ Request sent to /user/${userId}`);
  } catch (err) {
    console.log(`❌ Error for /user/${userId}`);
  }
}

async function startTraffic() {
  while (true) {
    const burstSize = Math.floor(Math.random() * 5) + 1; // 1–5 requests per burst

    for (let i = 0; i < burstSize; i++) {
      fireRequest(); // fire-and-forget
    }

    await new Promise((res) => setTimeout(res, randomDelay()));
  }
}

startTraffic();
