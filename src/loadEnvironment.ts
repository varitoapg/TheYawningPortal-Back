import dotenv from "dotenv";

dotenv.config();

const {
  PORT: port,
  SECRET_JWT: secretJwt,
  MONGODB_URL: mongoDatabaseUrl,
  MONGODB_DEBUG: mongoDbDebug,
  DBNAME: databaseName,
  SALT: salt,
  DEBUG: debug,
  SUPABASE_KEY: supabaseKey,
  SUPABASE_PASSWORD: supabasePassword,
  SUPABASE_BUCKET: supabaseBucket,
  SUPABASE_URL: supabaseUrl,
} = process.env;

interface Environment {
  port: number;
  secretJwt: string;
  mongoDatabaseUrl: string;
  mongoDbDebug: string;
  salt: number;
  debugEnvironment: string;
  databaseName: string;
  supabaseKey: string;
  supabasePassword: string;
  supabaseBucket: string;
  supabaseUrl: string;
}

const environment: Environment = {
  port: +port || 4003,
  secretJwt,
  salt: +salt,
  mongoDatabaseUrl,
  mongoDbDebug,
  debugEnvironment: debug,
  databaseName,
  supabaseKey,
  supabaseBucket,
  supabasePassword,
  supabaseUrl,
};

export default environment;
