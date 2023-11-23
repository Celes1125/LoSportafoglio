const mongoose = require('../bin/mongodb')
const errorMessages = require('../utils/errorMessages')


const vendorsSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, errorMessages.general.required], 
            unique: true, 
        }
    }

)



module.exports = mongoose.model("vendors", vendorsSchema);