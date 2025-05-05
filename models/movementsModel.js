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
            required:[true, errorMessages.general.required]           
        },
        amount: {
            // using Decimal128 to not get float numbers issues   
            type: mongoose.Schema.Types.Decimal128, 
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

// Configura las opciones toJSON para que devuelva el amount como string automáticamente,
// de esta forma no tengo que modificar cada respuesta de los controladores, sólo asegurarme
// de que devuelvan un .JSON
movementsSchema.set('toJSON', {    
    transform: function (doc, ret, options) {        
        if (ret.amount && ret.amount.toString) { // Verifica que existe y tiene toString (es Decimal128)
             ret.amount = ret.amount.toString();
        }   
        return ret; 
    }
});


module.exports = mongoose.model("movements", movementsSchema);