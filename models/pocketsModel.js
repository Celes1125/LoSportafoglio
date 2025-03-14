const mongoose = require('../bin/mongodb')
const errorMessages = require('../utils/errorMessages')

const pocketsSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, errorMessages.general.required],
            lowercase:true           
        },
        amount: {
            type: Number, 
            default: 0
        },
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
        }, 
        is_deleted: {
            type: Boolean,
            default: false
        }     
    }
)
// Compound index to ensure uniqueness of 'name' within the same 'wallet'
//pocketsSchema.index({ name: 1, wallet: 1 }, { unique: true });

module.exports = mongoose.model("pockets", pocketsSchema);