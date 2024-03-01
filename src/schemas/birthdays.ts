import { Schema, model } from "mongoose";


const BirthdaySchema = new Schema({
    name: {required:true, type: String},
    birthday: {required:true, type: String},
    userId: { required: true, type: String , unique: true},
})

const BirthdayModel  = model("birthday", BirthdaySchema)

module.exports = BirthdayModel;