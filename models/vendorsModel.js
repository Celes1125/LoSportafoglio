const mongoose = require('../bin/mongodb')
const errorMessages = require('../utils/errorMessages')


const vendorsSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, errorMessages.general.required], 
            unique: true,            
            lowerCase:true 
        }, 
        creator: {
            type: mongoose.Schema.ObjectId,
            ref: "users"
        }
    }

)

// Compound index to ensure uniqueness of 'name' within the vendors of the same user
vendorsSchema.index({ name: 1, creator: 1 }, { unique: true });

module.exports = mongoose.model("vendors", vendorsSchema);