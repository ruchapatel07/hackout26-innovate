import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure .env file in backend/ is loaded
dotenv.config({ path: path.join(__dirname, '../.env') });

export const config = {
  port: process.env.PORT || 5005,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'jay',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  awsRegion: process.env.AWS_REGION || 'ap-south-1',
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  dynamoTableNamePrefix: process.env.DYNAMODB_PREFIX || 'CarbonLink_',
  s3BucketName: process.env.S3_BUCKET_NAME || 'carbonlink-media-bucket'
};
