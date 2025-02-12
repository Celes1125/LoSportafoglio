const mongoose = require('../bin/mongodb')
const errorMessages = require('../utils/errorMessages')

const notificationsSchema = new mongoose.Schema({
    senderUser: {
        type: mongoose.Schema.ObjectId,
        ref: "users"
    },
    wallet: {
        type: mongoose.Schema.ObjectId,
        ref: "wallets",
        required: [true, errorMessages.general.required],
    },
    receiverEmail: {
        type: String,
        required: [true, errorMessages.general.required],
    },
    receiverUser: {
        type: mongoose.Schema.ObjectId,
        ref: "users"
    },
    type: String,
    status: String,
    createdAt: {
        type: Date,
        default: new Date()
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
}

)


module.exports = mongoose.model("notifications", notificationsSchema);


