import { Schema, model } from "mongoose";
// import bcrypt from 'bcrypt';

const userSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
});

// userSchema.pre('save', async function(next) {
//     const user = this;
//     const hash = await bcrypt.hash(user.password, 10);
//     user.password = hash;
//     next();
//   });

export const UserModel = model('user', userSchema);