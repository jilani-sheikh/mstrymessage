import mongoose from "mongoose";
import dns from "dns";

dns.setServers(["8.8.8.8"]);


type ConnectionObject = {
     isConnected?:number
}

const connection: ConnectionObject = {}

async function dbConnect():Promise<void>{
     if(connection.isConnected){
        console.log("Already connected to database");
        return 
     }

     try{
         const db = await mongoose.connect(process.env.MONGODB_URI || '', {})

        connection.isConnected = db.connections[0].readyState

        console.log("DB connected Successfully");
     }
     catch(error)
     {
          console.log("Database Connection failed",error);
          process.exit(1)
     }
}

export default dbConnect;