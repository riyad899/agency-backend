import { MongoClient, Db } from 'mongodb';

let db: Db;

export const connectDB = async (): Promise<Db> => {
  try {
    const client = new MongoClient(process.env.DB_URI as string);
    await client.connect();
    
    // Ping to confirm connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. Successfully connected to MongoDB!");
    
    db = client.db();
    console.log(`MongoDB Connected: ${db.databaseName}`);
    return db;
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

export const getDB = (): Db => {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return db;
};
