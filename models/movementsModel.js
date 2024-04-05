const mongoose = require('../bin/mongodb')
const errorMessages = require('../utils/errorMessages')

const movementsSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["in", "out", "transfer"],
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
        notes: String,
        user: {            
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",                

        },
        vendor: {},
        category: {},
        fromPocket: {},
        toPocket: {},
        pocket: {},
        wallet: {}
    }

)



module.exports = mongoose.model("movements", movementsSchema);