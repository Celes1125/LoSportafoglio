const mongoose = require('../bin/mongodb')
const users = require ('../models/usersModel')



const movementsSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["ingreso", "egreso"]
        },
        date: {
            type: Date,
            default: new Date()
        },
        amount: Number,
        currency: {
            type: String,
            enum: ["euro", "dolar", "peso"]
        },
        note: String,
        user: {            
            type: mongoose.Schema.ObjectId,
            ref: "users"
        },
        category: {
            type: mongoose.Schema.ObjectId,
            ref: "categories"
        },
        pocket: {
            type: mongoose.Schema.ObjectId,
            ref: "pockets"

        }
    }

)



module.exports = mongoose.model("movements", movementsSchema);