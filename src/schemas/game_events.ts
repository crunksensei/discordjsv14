import { Schema, model } from "mongoose";


const GameSchema = new Schema({
    name: {required:true, type: String},
    gameName: {required:true, type: String},
    date: { required: true, type: String},
    time: { required: false, type: String},
})

const GameEventModel  = model("game", GameSchema)

module.exports = GameEventModel;