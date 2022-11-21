import dotenv from "dotenv";

dotenv.config();

const {
  PORT: port,
  SECRET_JWT: secretJwt,
  MONGODB_URL: mongoDatabaseUrl,
  MONGODB_DEBUG: mongoDbDebug,
  SALT: salt,
  DEBUG: debug,
} = process.env;

interface Environment {
  port: number;
  secretJwt: string;
  mongoDatabaseUrl: string;
  mongoDbDebug: string;
  salt: number;
  debugEnvironment: string;
}

const environment: Environment = {
  port: +port || 4003,
  secretJwt,
  salt: +salt,
  mongoDatabaseUrl,
  mongoDbDebug,
  debugEnvironment: debug,
};

export default environment;
