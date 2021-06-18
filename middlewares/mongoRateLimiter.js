import RateLimit from 'express-rate-limit';
import MongoStore from 'rate-limit-mongo';

export const mongoRateLimiter = (mongoUri, hourLimit, maxLimit) => (new RateLimit({
  store: new MongoStore({
    uri: mongoUri,
    // should match windowMs
    expireTimeMs: hourLimit,
    errorHandler: console.error.bind(null, 'rate-limit-mongo')
  }),
  max: maxLimit,
  windowMs: hourLimit
}));
