const pocketsModel = require("../models/pocketsModel");

module.exports = {
    create: async function (req, res, next) {
        try {
            //searching for duplicates inside the not eliminated pockets of the wallet
            const existingPocket = await pocketsModel.findOne(
                {
                    name: req.body.name,
                    wallet: req.body.wallet,  
                    is_deleted: false 
                }
            )
            // if duplication exists return error
            if (existingPocket) {
                // Si ya existe una wallet con el mismo nombre y usuario, devolvemos un error
                return res.status(400).json({ message: 'The pockets name already exists for the specified users wallet' });
            }
            //if duplication not exists proceed to create and save the new pocket                      
            const pocket = new pocketsModel(
                {
                    name: req.body.name,
                    amount:req.body.amount,
                    currency:req.body.currency,
                    wallet:req.body.wallet
                    
                }
            )            
            const document = await pocket.save()
            res.json(document)           

        } catch (e) {            
            next(e)
            console.log('backend error creating a pocket: ', e.message)
        }
    },
    // get all wallets pockets, including those that were logicly eliminated
    getAll: async function (req, res, next) {
        try {
            const pockets = await pocketsModel.find({
                wallet: { $in: req.params.walletId },                
            })
            .populate({
                path:"wallet",
                model:"wallets"
                   })
            res.send(pockets)

        } catch (e) {
            next(e)
        }
    },
    // get all wallets pockets but just those that were not eliminated
    getAllNotDeleted: async function (req, res, next) {
        try {
            const pockets = await pocketsModel.find({
                wallet: { $in: req.params.walletId }, 
                is_deleted: false               
            })
            .populate({
                path:"wallet",
                model:"wallets"
                   })
            res.send(pockets)

        } catch (e) {
            next(e)
        }
    },
    getById: async function (req, res, next) {
        try {
            async function findById(id) {
                try {
                    const pocket = await pocketsModel.findById(id).populate({
                        path:"wallet",
                        model:"wallets"
                           });
                    return pocket
                } catch (e) {
                    return null
                }
            }
            const pocket = await findById(req.params.id)
            if (!pocket) {
                res.json({ message: "el bolsillo no existe" });
                return
            }
            res.json(pocket)

        } catch (e) {
            next(e)
        }
    },
    update: async function (req, res, next) {
        try {
            const pocket = await pocketsModel.updateOne({ _id: req.params.id }, req.body);
            res.json(pocket)

        } catch (e) {
            next(e)

        }
    },
    logicDelete: async function (req, res, next) {
        try {
            // Cambiar el campo `is_deleted` a `true` directamente
            const pocket = await pocketsModel.updateOne(
                { _id: req.params.id }, // Filtro para encontrar el registro
                { $set: { is_deleted: true } } // Actualización que establece `is_deleted` a true
            );
    
            // Verificamos si realmente se actualizó un registro
            if (pocket.nModified === 0) {
                return res.status(404).json({ message: 'Pocket not found or already deleted.' });
            }
    
            // Responder con éxito
            res.json({ message: 'Pocket marked as deleted logically.' });
        } catch (e) {
            next(e); // Manejo de errores
        }
    },    
    fisicDelete: async function (req, res, next) {
        try {
            const pocket = await pocketsModel.deleteOne({ _id: req.params.id })
            res.json(pocket)

        } catch (e) {
            next(e)
        }
    },
    fisicDeleteAll: async function (req, res, next) {
        try {
            const pocketsCount = await pocketsModel.countDocuments()
            if (pocketsCount === 0) {
                res.json({ message: "No existen bolsillos a eliminar" })
                return
            }
            await pocketsModel.deleteMany()
            res.json({ message: "Todos los bolsillos han sido eliminadas" })
        } catch (e) {
            next(e)
        }
    }
}


