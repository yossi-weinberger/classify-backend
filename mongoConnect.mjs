import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.dt4vuto.mongodb.net/?retryWrites=true&w=majority`;

let client;
let db;
let classesCollection;
let studentsCollection;

//
async function connectToDatabase(retries = 5) {
  while (retries) {
    try {
      console.log("Attempting to connect to MongoDB...");
      client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
        connectTimeoutMS: 30000,
        socketTimeoutMS: 45000,
      });

      await client.connect();
      console.log("Successfully connected to MongoDB");

      db = client.db("classify");
      classesCollection = db.collection("classes");
      studentsCollection = db.collection("students");

      await db.command({ ping: 1 });
      console.log("Database connection verified");

      return { db, classesCollection, studentsCollection };
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
      retries -= 1;
      if (retries) {
        console.log(`Retrying connection... (${retries} attempts left)`);
        await new Promise((resolve) => setTimeout(resolve, 10000));
      } else {
        console.error("Max retries reached. Unable to connect to MongoDB.");
        throw error;
      }
    }
  }
}

export async function getDatabase() {
  if (!db) {
    ({ db, classesCollection, studentsCollection } = await connectToDatabase());
  }
  return { db, classesCollection, studentsCollection };
}

export async function closeConnection() {
  if (client) {
    await client.close();
    console.log("Database connection closed");
    db = null;
    classesCollection = null;
    studentsCollection = null;
  }
}

// Initialize the connection
connectToDatabase().catch(console.error);

export default connectToDatabase;
