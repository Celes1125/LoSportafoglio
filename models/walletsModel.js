const mongoose = require('../bin/mongodb')
const errorMessages = require('../utils/errorMessages')


const walletsSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, errorMessages.general.required],
            unique: true,
            lowerCase:true
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
        users: [{
            type: mongoose.Schema.ObjectId,
            ref: "users"
        }]

    }
)

// Compound index to ensure uniqueness of 'name' within the wallets of the same user
walletsSchema.index({ name: 1, users: 1 }, { unique: true });

module.exports = mongoose.model("wallets", walletsSchema);