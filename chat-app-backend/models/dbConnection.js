import mongoose from 'mongoose';


const connectDB = async () => {
    mongoose.connect(process.env.mongo_url);

    const connection = mongoose.connection;
    
    connection.on("error", () => {
      console.log("Error connecting to database");
    });
    
    connection.on("connected", () => {
      console.log("Mongo DB Connection Successful");
    });
};

export default connectDB;
