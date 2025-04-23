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
            // using Decimal128 to not get float numbers issues   
            type: mongoose.Schema.Types.Decimal128,            
            default: mongoose.Types.Decimal128.fromString("0.00")            
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
// Asegura que no haya dos pockets con el mismo nombre para la misma wallet
pocketsSchema.index({ name: 1, wallet: 1 }, {
    unique: true,
    // Important: apply this index just for not logically deleted documents
    // Importante: Aplicar el índice solo a documentos no eliminados lógicamente
    partialFilterExpression: { is_deleted: false }
});

// Configura las opciones toJSON para que devuelva el amount como string automáticamente,
// de esta forma no tengo que modificar cada respuesta de los controladores, sólo asegurarme
// de que devuelvan un .JSON
pocketsSchema.set('toJSON', {
    // getters: true, // Asegura que los getters (si tienes) se apliquen
    // virtuals: true, // Asegura que los virtuals (si tienes) se incluyan
    transform: function (doc, ret, options) {
        // 'doc' es el documento Mongoose original
        // 'ret' es el objeto plano que se va a serializar a JSON
        // 'options' son las opciones pasadas a toJSON

        // Convierte Decimal128 a string
        if (ret.amount && ret.amount.toString) { // Verifica que existe y tiene toString (es Decimal128)
             ret.amount = ret.amount.toString();
        }

        // Puedes hacer otras transformaciones aquí si lo deseas,
        // como eliminar campos internos o cambiar nombres
        // delete ret.__v;
        // delete ret._id; // Si prefieres enviar 'id' en lugar de '_id'
        // ret.id = ret._id;

        return ret; // Devuelve el objeto transformado
    }
});

module.exports = mongoose.model("pockets", pocketsSchema);