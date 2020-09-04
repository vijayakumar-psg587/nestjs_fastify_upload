export const APP_CONSTANTS = {
  MANDATORY_HEADERS_NAME_LIST: [
    "FID-LOG-TRACKING-ID",
    "FID-USER-TYPE",
    "FID-CONSUMER-APP-PROCESS",
    "FID-PRINCIPAL-ROLE",
  ],
  HEADERS: {
    FID_LOG_TRACKING_ID: "FID-LOG-TRACKING-ID",
    FID_USER_ID: "FID-USER-ID",
    FID_USER_TYPE: "FID-USER-TYPE",
    FID_PRINCIPAL_ROLE: "FID-PRINCIPAL-ROLE",
    FID_CONSUMER_APP_PROCESS: "FID-CONSUMER-APP-PROCESS",
  },
  CHAR: {
    COMMA: ",",
    SLASH: "/",
    COLON: ":",
    SEMI_COLON: ";",
    HYPHEN: "-",
    AT: "@",
    UNDERSCORE: "_",
    QUESTION: "?",
    FULL_STOP: '.'
  },
  COMMON: {
    APP_ENV_DEV: "dev",
    APP_ENV_PROD: "prod",
    APP_NAME: "fastify-auth-sample",
    DEFAULT_DATE_TIME_FORMAT: "HHHH-MM-DD hh:mm:ss:SSSS",
    DEFAULT_DNS_FORMAT: "yyyy-MM-dd HH:mm:ss.SSSS",
    USER_ID: "APP-ID",
  },
  CORS: {
    HEADERS: [
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Methods",
      "Access-Control-Allow-Headers",
      "Access-Control-Max-Age",
      "Access-Control-Allow-Credentials",
    ],
    WHITELIST: [
      "127.0.0.0",
      "127.0.0.0:3002",
      "localhost:3002",
      "0.0.0.0:3002",
      "*",
      "localhost",
      "*",
    ],
    ALLOW_HEADERS: [
      "Content-type",
      "Authorization",
      "Origin",
      "X-Forwaded-for",
      "Referrer",
      "Origin",
    ],
    ALLOW_METHODS: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
    ALLOW_CRED: true,
  },
  ERR: {
    MESSG: {},
    CODE: {},
  },
  HEALTH_CHECK: {
    URL: "https://jsonplaceholder.typicode.com/posts/1",
    METHOD: "GET",
    PROXY: "http://http.proxy.fmr.com:8000",
  },
  DATABASE: {
    CONNECTION: {
      NAME: "cmsConnection",
    },
  },
  REGEX: {
    MULTIPART_CONTENT_TYPE: /^(multipart)[\/\\\-\w]*$/
  }
};
