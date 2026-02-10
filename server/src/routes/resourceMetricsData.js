const express = require("express");
const router = express.Router();
const {getResourceData} = require("../controllers")
router.get("/", async (req, res) => {
const data = await getResourceData(req.query.projectkey)
  res.json({
    data,
  });
});
module.exports = router;