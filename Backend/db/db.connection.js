import mongoose from "mongoose";

const connect_DB = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI || "";

        // Use mongoose.connect() to establish a connection
        await mongoose.connect(MONGO_URI, {
            dbName: "Course_selling_app",
        });

        console.log(`Connected to MongoDB successfully`);
    } catch (error) {
        console.error("db connection error", error);
        process.exit(1); // Exit the process if the connection fails
    }
};

export default connect_DB;
