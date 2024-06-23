import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.dt4vuto.mongodb.net/?retryWrites=true&w=majority`;

let client;
let db;

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
        connectTimeoutMS: 30000, // Increase connection timeout to 30 seconds
        socketTimeoutMS: 45000, // Increase socket timeout to 45 seconds
      });

      await client.connect();
      console.log("Successfully connected to MongoDB");

      db = client.db("classify");

      // Verify the connection
      await db.command({ ping: 1 });
      console.log("Database connection verified");

      return db;
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
      retries -= 1;
      if (retries) {
        console.log(`Retrying connection... (${retries} attempts left)`);
        await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait for 10 seconds before retrying
      } else {
        console.error("Max retries reached. Unable to connect to MongoDB.");
        throw error;
      }
    }
  }
}

export async function getDatabase() {
  if (!db) {
    db = await connectToDatabase();
  }
  return db;
}

export async function closeConnection() {
  if (client) {
    await client.close();
    console.log("Database connection closed");
  }
}

// Initialize the connection
connectToDatabase().catch(console.error);

// export const classesCollection = db?.collection("classes");
// export const studentsCollection = db?.collection("students");

// export default db;
export default connectToDatabase;

// import { MongoClient, ServerApiVersion } from "mongodb";
// import dotenv from "dotenv";
// dotenv.config();
// // const uri = `mongodb+srv://${mongo["username"]}:${mongo["password"]}@njs-test.0xygldr.mongodb.net/`;
// const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.dt4vuto.mongodb.net/`;

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// let cluster;
// try {
//   cluster = await client.connect();
// } catch (e) {
//   console.error(e);
// }

// const db = cluster.db("classify");
// export const classesCollection = db.collection("classes");
// export const studentsCollection = db.collection("students");
// // export const usersCollection = db.collection("users");
// export default db;
