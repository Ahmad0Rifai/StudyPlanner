const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

// Connection options for stability
const options = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
};

let client;
let db;

async function connectToDatabase() {
    try {
        if (!client) {
            client = new MongoClient(uri, options);
            await client.connect();
            console.log('✅ Connected to MongoDB Atlas (Frankfurt/AWS)');

            // Use 'studyplanner' database
            db = client.db('studyplanner');

            // Create collections if they don't exist
            const collections = ['users', 'courses', 'tasks'];
            for (const coll of collections) {
                try {
                    await db.createCollection(coll);
                } catch (e) {
                    // Collection already exists, ignore error
                }
            }

            // Create indexes for better performance
            await db.collection('users').createIndex({ email: 1 }, { unique: true });
            await db.collection('courses').createIndex({ userId: 1 });
            await db.collection('tasks').createIndex({ userId: 1, courseId: 1 });
            await db.collection('tasks').createIndex({ completed: 1 });

            console.log('✅ Database indexes created');
        }
        return { client, db };
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1);
    }
}

function getDb() {
    if (!db) {
        throw new Error('Database not initialized. Call connectToDatabase first.');
    }
    return db;
}

function getClient() {
    return client;
}

module.exports = { connectToDatabase, getDb, getClient };