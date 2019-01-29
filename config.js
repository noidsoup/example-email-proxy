require("dotenv").config(); // loads evnironment variables defined in .env

// / DEVELOPMENT ///
const dev = {
  app: {
    sendgrid_api_key: process.env.SENDGRID_API_KEY,
    port: parseInt(process.env.SERVER_PORT) || 3001,
    redis_host: 'localhost'
  },
  db: {
    uri: process.env.DEV_MONGODB_URI,
    host: "localhost",
    port: parseInt(process.env.DB_PORT) || 27017,
    name: "localEmailDB",
  },
};

// / STAGING ///
const staging = {
  db: {
    uri: process.env.MONGODB_URI,
    host: process.env.STAGING_DB_HOST || "localhost",
    port: parseInt(process.env.STAGING_DB_PORT) || 27017,
    name: process.env.STAGING_DB_NAME || "statgingDB",
  },
};

// / PRODUCTION ///
const prod = {
  app: {
    sendgrid_api_key: process.env.SENDGRID_API_KEY,
    server_port: parseInt(process.env.SERVER_PORT),
    redis_host: process.env.REDIS_HOST || 'localhost',
  },
  db: {
    uri: 'mongodb://email-serice-user:e-3~8^L2aSaP/n4$@pegasus-email-service-shard-00-00-cwloz.mongodb.net:27017,pegasus-email-service-shard-00-01-cwloz.mongodb.net:27017,pegasus-email-service-shard-00-02-cwloz.mongodb.net:27017/test?ssl=true&replicaSet=pegasus-email-service-shard-0&authSource=admin&retryWrites=true',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 27017,
    name: process.env.DB_NAME,
  },
};

const config = {
  dev,
  staging,
  prod,
};

module.exports = config;