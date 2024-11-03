import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const getMongoURI = () => {
  // בורסל תמיד צריך להתחבר ל-Atlas
  if (process.env.VERCEL) {
    console.log("[MongoDB] Environment: Vercel (Atlas)");
    return `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.dt4vuto.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
  }

  if (process.env.NODE_ENV === "production") {
    console.log("[MongoDB] Environment: Production (Docker)");
    return `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@mongodb:27017/?retryWrites=true&w=majority`;
  }

  console.log("[MongoDB] Environment: Development (Atlas)");
  return `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.dt4vuto.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
};

const uri = getMongoURI();

let client;
let db;
let classesCollection;
let studentsCollection;

//
// ... קוד קודם נשאר זהה ...

async function connectToDatabase(retries = 5) {
  while (retries) {
    try {
      console.log("[MongoDB] Attempting to connect...");
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
      console.log("[MongoDB] Connection established");

      db = client.db("classify");
      classesCollection = db.collection("classes");
      studentsCollection = db.collection("students");

      await db.command({ ping: 1 });
      console.log("[MongoDB] Connection verified");

      return { db, classesCollection, studentsCollection };
    } catch (error) {
      console.error("[MongoDB] Connection failed:", error.message);
      retries -= 1;
      if (retries) {
        console.log(
          `[MongoDB] Retrying connection... (${retries} attempts left)`
        );
        await new Promise((resolve) => setTimeout(resolve, 10000));
      } else {
        console.error("[MongoDB] Max retries reached. Unable to connect.");
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
