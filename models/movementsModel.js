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
        vendor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "vendors"
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "categories"
        },
        fromPocket: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "pockets"
        },
        toPocket: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "pockets"
        },
        pocket: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "pockets"
        },
        wallet: {
            type: mongoose.Schema.Types.Mixed,  // Permite tanto ObjectId como objetos completos
            ref: "wallets"
        }
    }

)



module.exports = mongoose.model("movements", movementsSchema);