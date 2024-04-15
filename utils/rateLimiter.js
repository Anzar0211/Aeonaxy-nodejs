const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 15, // Limit each IP to 15 requests per `window` (here, per minute)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'You can make only 15 requests in 1 minute.', // Custom message
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json({
      error: options.message,
      remaining: options.remainingPoints,
      reset: options.resetTime,
    });
  },
});

module.exports = {limiter};