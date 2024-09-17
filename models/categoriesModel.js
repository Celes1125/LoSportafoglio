const mongoose = require('../bin/mongodb')
const errorMessages = require('../utils/errorMessages')

const categoriesSchema = new mongoose.Schema(    {
        name: {
            type: String,
            required: [true, errorMessages.general.required], 
            unique: true,
            set: function (value) {
                return value.toUpperCase()
            },
            
        },
        description: String, 
        creator: {
            type: mongoose.Schema.ObjectId,
            ref: "users"
        }
    }

)

categoriesSchema.set("toJSON", { setters: true })
module.exports = mongoose.model("categories", categoriesSchema);