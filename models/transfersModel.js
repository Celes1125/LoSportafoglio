const mongoose = require('../bin/mongodb')
const errorMessages = require('../utils/errorMessages')

const transfersSchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            default: new Date()
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "users"
        },
        fromPocket: {
            type: mongoose.Schema.ObjectId,
            ref: "pockets",
            required: [true, errorMessages.general.required]

        },
        toPocket: {
            type: mongoose.Schema.ObjectId,
            ref: "pockets",
            required: [true, errorMessages.general.required]
        },        
        amount: {
            // using Decimal128 to not get float numbers issues   
            type: mongoose.Schema.Types.Decimal128,            
            default: mongoose.Types.Decimal128.fromString("0.00"),   
            required: [true, errorMessages.general.required]
        },           
        note: String,
    }
)

transfersSchema.set('toJSON', {    
    transform: function (doc, ret, options) {        
        if (ret.amount && ret.amount.toString) { // Verifica que existe y tiene toString (es Decimal128)
             ret.amount = ret.amount.toString();
        }   
        return ret; 
    }
});


module.exports = mongoose.model("transfers", transfersSchema);