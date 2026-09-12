import app from './app.js';
import { config } from './config/env.js';

const PORT = config.port || 5000;

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 CarbonLink AI Backend Service Running on Port ${PORT}`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
  console.log(`⚡ AWS DynamoDB Client Mode: ${config.awsAccessKeyId ? 'AWS Cloud' : 'Local Memory Storage'}`);
  console.log(`=======================================================`);
});
