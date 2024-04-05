const mongoose = require('../bin/mongodb')
const errorMessages = require('../utils/errorMessages')

const pocketsSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, errorMessages.general.required]
           
        },
        amount: Number,
        currency: {
            type: String,
            enum: ["euro", "dolar", "peso"]
        },
        creationDate: {
            type: Date,
            default: new Date()
        },
        lastModified: {
            type: Date,
            default: null
        },
        wallet: {
            type: mongoose.Schema.ObjectId,
            ref: "wallets",
            required: [true, errorMessages.general.required],
        }
        
    
    }
)



module.exports = mongoose.model("pockets", pocketsSchema);