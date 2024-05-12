import { Schema, model } from "mongoose";


const IdeaSchema = new Schema({
    userId: {required:true, type: String},
    idea: {required:true, type: String},
    createdAt: {
        type: Date,
        default: Date.now
      },
})

const IdeaModel  = model("idea", IdeaSchema)

module.exports = IdeaModel;