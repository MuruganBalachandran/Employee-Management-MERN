
// region imports
import { STATUS_CODE } from '../../utils/index.js';
import { env } from "../env/envConfig.js";
// endregion

// normalize CORS_ORIGIN
const allowedOrigins = Array.isArray(env?.CORS_ORIGIN)
  ? env?.CORS_ORIGIN
  : [env?.CORS_ORIGIN || ''].filter(Boolean);
// endregion

// region CORS Options
const corsConfig = {
  // use function because multiple frontend origins may exist
  origin: (origin = '', callback = () => { }) => {
    if (!origin) {
      return callback?.(null, true);
    }

    // allow request if origin matches allowed list
    if (allowedOrigins?.includes?.(origin)) {
      return callback?.(null, true);
    }

    // block request if origin is not whitelisted
    return callback?.(new Error('Not allowed by CORS'));
  },

  // allow cookies and authorization headers in requests
  credentials: true,

  // support legacy browsers that fail on 204
  optionsSuccessStatus: STATUS_CODE?.OK || 200,

  // define which HTTP methods backend accepts
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],

  // define headers client is allowed to send
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
  ],
};
// endregion

// region exports
export { corsConfig };
// endregion
