const express = require("express");
const router = express.Router();
const {getResourceData} = require("../controllers")
router.get("/", async (req, res) => {
const data = await getResourceData({projectKey:req.query.projectKey,serviceName:req.query.serviceName})
const plaindata = data.map(d=>d.toObject());
res.json({
    plaindata,
  });
});
module.exports = router;