const mongoose = require('../bin/mongodb')
const errorMessages = require('../utils/errorMessages')



const movementsSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["ingreso", "egreso"],
            required: [true, errorMessages.general.required]
        },
        date: {
            type: Date,
            default: new Date()
        },
        amount: {
            type: Number,
            required: [true, errorMessages.general.required]
        },
        currency: {
            type: String,
            enum: ["euro", "dolar", "peso"],
            required: [true, errorMessages.general.required]
        },
        note: String,
        user: {            
            type: mongoose.Schema.ObjectId,
            ref: "users",
            required: [true, errorMessages.general.required]

        },
        vendor: {
            type: mongoose.Schema.ObjectId,
            ref: "vendors",
            
        },
        category: {
            type: mongoose.Schema.ObjectId,
            ref: "categories",
            required: [true, errorMessages.general.required]

        },
        pocket: {
            type: mongoose.Schema.ObjectId,
            ref: "pockets",
            required: [true, errorMessages.general.required]

        }
    }

)



module.exports = mongoose.model("movements", movementsSchema);