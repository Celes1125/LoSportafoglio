const mongoose = require('../bin/mongodb')
const errorMessages = require('../utils/errorMessages')

const transfersSchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            default: new Date()
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "users"
        },
        fromPocket: {
            type: mongoose.Schema.ObjectId,
            ref: "pockets",
            required: [true, errorMessages.general.required]

        },
        toPocket: {
            type: mongoose.Schema.ObjectId,
            ref: "pockets",
            required: [true, errorMessages.general.required]
        },        
        amount: {
            type: Number,
            required: [true, errorMessages.general.required]
        },           
        note: String,
    }
)


module.exports = mongoose.model("transfers", transfersSchema);