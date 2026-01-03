function timeRangeMiddleware(req,res,next){
    const {from , to} = req.query;
    if (!from || !to) {
    return res.status(400).json({
      error: "`from` and `to` query params are required (epoch ms)"
    });
  }
  const fromMs = Number(from);
  const toMs = Number(to);
    if (Number.isNaN(fromMs) || Number.isNaN(toMs)) {
    return res.status(400).json({
      error: "`from` and `to` must be valid numbers"
    });
  }

  if (fromMs >= toMs) {
    return res.status(400).json({
      error: "`from` must be less than `to`"
    });
  }
  req.timeRange = {
    from: new Date(fromMs),
    to: new Date(toMs)
  }
  next();
}
module.exports = timeRangeMiddleware;