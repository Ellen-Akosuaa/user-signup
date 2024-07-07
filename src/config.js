import mongoose from "mongoose";


import 'dotenv/config'

const connectionString = process.env.Mongo_url



export const dbConnection = () => {
    mongoose.connect(connectionString).then(() => {
        console.log('Database is connected')
    })
};