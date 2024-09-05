import mongoose from "mongoose";
import { DB_NAME } from '@/constants'

//NOTE - Connection Object to check if connection is established
type ConnectionObject = {
    isConnected?: number
}

//NOTE - Connection function to establish connection
const connection: ConnectionObject = {}

const DB_URL = String(process.env.MONGODB_URI) || ""

export async function dbConnect(): Promise<void> {

    //NOTE - Check if connection is already established
    if (connection.isConnected) {
        console.log("Already connected to database");
        return;
    }

    try {
        const db = await mongoose.connect(`${DB_URL}/${DB_NAME}`, {})
        console.log(db);

        //NOTE - Check if connection is established
        connection.isConnected = db.connections[0].readyState

        console.log(db.connections);
        console.log(db.connections[0].readyState);
        console.log(connection, "DB connected successfully");


    } catch (error) {
        console.log("Error connecting to database", error);
        process.exit(1)
    }

}