const express = require("express");
const router = express.Router();
const {getResourceData} = require("../controllers")
router.get("/", async (req, res) => {
const rawdata = await getResourceData({projectKey:req.query.projectKey,serviceName:req.query.serviceName})
const data = rawdata.map(d=>d.toObject());
res.json({
    data,
  });
});
module.exports = router;