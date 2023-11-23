const mongoose = require('../bin/mongodb')
const errorMessages = require('../utils/errorMessages')


const walletsSchemma = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, errorMessages.general.required],
            unique: true,
        },
        pockets: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "pockets",
            
        },
        creationDate: {
            type: Date,
            default: new Date()
        },
        lastModified: {
            type: Date,
            default: null
        },
        activated: {
            type: Boolean,
            default: false
        },
        creator: {
            type: mongoose.Schema.ObjectId,
            ref: "users"
        }

    }
)



module.exports = mongoose.model("wallets", walletsSchemma);