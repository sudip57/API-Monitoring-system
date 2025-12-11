const {
  getTotalRequests,
  getAverageLatency,
  getTotalErrors,
} = require("../services/statsService"); 

const totalRequests = async (req, res) => {
  try {
    const { projectKey, serviceName } = req.query;
    const total = await getTotalRequests({ projectKey, serviceName });
    res.json({ total });
  } catch (err) {
    console.error("totalRequests error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const avgLatency = async (req, res) => {
  try {
    const { projectKey, serviceName } = req.query;
    const avgLatency = await getAverageLatency({ projectKey, serviceName });
    res.json({ avgLatency });
  } catch (err) {
    console.error("avgLatency error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const totalErrors = async (req, res) => {
  try {
    const { projectKey, serviceName } = req.query;
    const total = await getTotalErrors({ projectKey, serviceName });
    res.json({ total });
  } catch (err) {
    console.error("totalErrors error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = { totalRequests, avgLatency, totalErrors };