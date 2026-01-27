function timeRangeMiddleware(req,res,next){
    const {timeRange} = req.query;
    if (!timeRange) {
    return res.status(400).json({
      error: "timeRange is required"
    });
  }
  const now = Date.now();
  const TR = Number(timeRange);
  const fromMs = now - TR*60*1000;
  const toMs  =  now;
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