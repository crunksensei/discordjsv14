import { Schema, model } from "mongoose";


const QuoteSchema = new Schema({
    quote: {required:true, type: String},
    author: {required:true, type: String},
    category: { required: true, type: String},
})

const QuoteModel  = model("quote", QuoteSchema)

module.exports = QuoteModel;