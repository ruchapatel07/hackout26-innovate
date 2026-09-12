import { DynamoDBClient, CreateTableCommand, DescribeTableCommand } from '@aws-sdk/client-dynamodb';
import { config } from '../config/env.js';

const client = new DynamoDBClient({
  region: config.awsRegion,
  credentials: {
    accessKeyId: config.awsAccessKeyId,
    secretAccessKey: config.awsSecretAccessKey
  }
});

const tablesToCreate = [
  { name: 'Users', key: 'userId' },
  { name: 'CarbonListings', key: 'listingId' },
  { name: 'Requests', key: 'requestId' },
  { name: 'MatchHistory', key: 'matchId' },
  { name: 'Transactions', key: 'transactionId' }
];

export async function createAwsDynamoDBTables() {
  if (!config.awsAccessKeyId || !config.awsSecretAccessKey) {
    console.log('[AWS DynamoDB] AWS credentials omitted. Skipping table creation.');
    return;
  }

  console.log(`[AWS DynamoDB] Checking & Creating DynamoDB tables in AWS Region '${config.awsRegion}'...`);

  for (const t of tablesToCreate) {
    const fullTableName = config.dynamoTableNamePrefix + t.name;

    try {
      // Check if table already exists in AWS
      await client.send(new DescribeTableCommand({ TableName: fullTableName }));
      console.log(`[AWS DynamoDB] Table '${fullTableName}' already exists in AWS Cloud.`);
    } catch (err) {
      if (err.name === 'ResourceNotFoundException') {
        console.log(`[AWS DynamoDB] Creating Table '${fullTableName}' in AWS Region ${config.awsRegion}...`);
        
        try {
          await client.send(new CreateTableCommand({
            TableName: fullTableName,
            AttributeDefinitions: [
              { AttributeName: t.key, AttributeType: 'S' }
            ],
            KeySchema: [
              { AttributeName: t.key, KeyType: 'HASH' }
            ],
            BillingMode: 'PAY_PER_REQUEST'
          }));
          console.log(`[AWS DynamoDB] Successfully created Table '${fullTableName}' in AWS Cloud!`);
        } catch (createErr) {
          console.error(`[AWS DynamoDB] Failed to create table '${fullTableName}':`, createErr.message);
        }
      } else {
        console.warn(`[AWS DynamoDB] Error checking table '${fullTableName}':`, err.message);
      }
    }
  }
}

// If run directly via command line
if (process.argv[1] && process.argv[1].includes('createAwsTables.js')) {
  createAwsDynamoDBTables().then(() => {
    console.log('[AWS DynamoDB] Provisioning check complete.');
  });
}
