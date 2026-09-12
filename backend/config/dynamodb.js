import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { config } from './env.js';

const memoryStore = {
  Users: [],
  CarbonListings: [],
  Requests: [],
  MatchHistory: [],
  Transactions: []
};

let docClient = null;
let useAws = false;

if (config.awsAccessKeyId && config.awsSecretAccessKey) {
  try {
    const client = new DynamoDBClient({
      region: config.awsRegion,
      credentials: {
        accessKeyId: config.awsAccessKeyId,
        secretAccessKey: config.awsSecretAccessKey
      }
    });
    docClient = DynamoDBDocumentClient.from(client);
    useAws = true;
    console.log(`[DynamoDB] Configured for AWS DynamoDB Cloud Client (${config.awsRegion})`);
  } catch (err) {
    console.warn('[DynamoDB] AWS client init fallback to Local In-Memory DB:', err.message);
  }
} else {
  console.log('[DynamoDB] AWS credentials omitted — Using high-performance Local DynamoDB Store');
}

export const db = {
  async get(tableName, key) {
    if (useAws && docClient) {
      try {
        const command = new GetCommand({
          TableName: config.dynamoTableNamePrefix + tableName,
          Key: key
        });
        const res = await docClient.send(command);
        return res.Item || null;
      } catch (err) {
        if (err.name === 'ResourceNotFoundException') {
          console.warn(`[DynamoDB] AWS Table '${config.dynamoTableNamePrefix}${tableName}' not found in AWS region ${config.awsRegion}. Falling back to Local Store.`);
        } else {
          console.error(`[DynamoDB Error]`, err.message);
        }
      }
    }
    const store = memoryStore[tableName] || [];
    const pkKey = Object.keys(key)[0];
    return store.find(item => item[pkKey] === key[pkKey]) || null;
  },

  async put(tableName, item) {
    if (useAws && docClient) {
      try {
        const command = new PutCommand({
          TableName: config.dynamoTableNamePrefix + tableName,
          Item: item
        });
        await docClient.send(command);
        return item;
      } catch (err) {
        if (err.name === 'ResourceNotFoundException') {
          console.warn(`[DynamoDB] AWS Table '${config.dynamoTableNamePrefix}${tableName}' not found in AWS region ${config.awsRegion}. Falling back to Local Store.`);
        } else {
          console.error(`[DynamoDB Error]`, err.message);
        }
      }
    }
    const store = memoryStore[tableName] || (memoryStore[tableName] = []);
    const pkKey = tableName === 'Users' ? 'userId' :
                  tableName === 'CarbonListings' ? 'listingId' :
                  tableName === 'Requests' ? 'requestId' :
                  tableName === 'MatchHistory' ? 'matchId' : 'transactionId';

    const index = store.findIndex(i => i[pkKey] === item[pkKey]);
    if (index >= 0) {
      store[index] = { ...store[index], ...item };
    } else {
      store.push(item);
    }
    return item;
  },

  async scan(tableName, filterFn) {
    if (useAws && docClient) {
      try {
        const command = new ScanCommand({
          TableName: config.dynamoTableNamePrefix + tableName
        });
        const res = await docClient.send(command);
        let items = res.Items || [];
        if (filterFn) items = items.filter(filterFn);
        return items;
      } catch (err) {
        if (err.name === 'ResourceNotFoundException') {
          console.warn(`[DynamoDB] AWS Table '${config.dynamoTableNamePrefix}${tableName}' not found in AWS region ${config.awsRegion}. Falling back to Local Store.`);
        } else {
          console.error(`[DynamoDB Error]`, err.message);
        }
      }
    }
    const store = memoryStore[tableName] || [];
    if (filterFn) return store.filter(filterFn);
    return [...store];
  },

  async delete(tableName, key) {
    if (useAws && docClient) {
      try {
        const command = new DeleteCommand({
          TableName: config.dynamoTableNamePrefix + tableName,
          Key: key
        });
        await docClient.send(command);
        return true;
      } catch (err) {
        if (err.name === 'ResourceNotFoundException') {
          console.warn(`[DynamoDB] AWS Table '${config.dynamoTableNamePrefix}${tableName}' not found in AWS region ${config.awsRegion}. Falling back to Local Store.`);
        } else {
          console.error(`[DynamoDB Error]`, err.message);
        }
      }
    }
    const store = memoryStore[tableName] || [];
    const pkKey = Object.keys(key)[0];
    const index = store.findIndex(i => i[pkKey] === key[pkKey]);
    if (index >= 0) {
      store.splice(index, 1);
      return true;
    }
    return false;
  },

  getStore() {
    return memoryStore;
  }
};
