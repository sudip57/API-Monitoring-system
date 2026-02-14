const express = require("express");
const router = express.Router();
const {getResourceData} = require("../controllers")
router.get("/", async (req, res) => {
const data = await getResourceData({projectKey:req.query.projectKey,serviceName:req.query.serviceName})
  res.json({
    data,
  });
});
module.exports = router;