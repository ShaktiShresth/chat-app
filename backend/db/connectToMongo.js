import mongoose from "mongoose";

const connectToMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to Mongo DB.");
  } catch (error) {
    console.log("Error connecting to mongo db", error.message);
  }
};

export default connectToMongo;
