
const walletsModel = require('../models/walletsModel')
const pocketsModel = require('../models/pocketsModel')
const { logicDelete } = require('./pocketsController')

module.exports = {
    create: async function (req, res, next) {
        try {
            const wallet = new walletsModel({
                name: req.body.name,
                users: req.body.users //the array of with the objectId from the usersModel                 
            })
            const document = await wallet.save()
            res.json(document)

        } catch (e) {         
            next(e)  
            console.log('backend error on wallets model or controller: ', e.message)
        }
    },


    getAll: async function (req, res, next) {
        try {
            const wallets = await walletsModel.find()
                .populate({
                    path: "users",
                    model: "users"

                })
            res.json(wallets)

        } catch (e) {
            next(e)            
        }
    },

    getById: async function (req, res, next) {
        try {
            async function findById(id) {
                try {
                    const wallet = await walletsModel.findById(id).populate({
                        path: "users",
                        model: "users"

                    })
                    return wallet
                } catch (e) {
                    return null
                }
            }
            const wallet = await findById(req.params.id)
            if (!wallet) {
                res.json({ message: "La billetera no existe" })
                return
            }
            res.json(wallet)
        } catch (e) {
            next(e)
            
        }
    },

    update: async function (req, res, next) {
        try {
            const wallet = await walletsModel.updateOne({ _id: req.params.id }, req.body)
            res.json(wallet)

        } catch (e) {
            next(e)
            
        }
    },

    logicDelete: async function (req, res, next) {
        try {
            // Cambiar el campo `is_deleted` a `true` directamente
            const wallet = await walletsModel.updateOne(
                { _id: req.params.id }, // Filtro para encontrar el registro
                { $set: { is_deleted: true } } // Actualización que establece `is_deleted` a true
            );
    
            // Verificamos si realmente se actualizó un registro
            if (wallet.nModified === 0) {
                return res.status(404).json({ message: 'Wallet is not found or already deleted.' });
            }
    
            // Responder con éxito
            res.json({ message: 'Wallet marked as deleted logically.' });
        } catch (e) {
            next(e); // Manejo de errores
        }
    },

    fisicDelete: async function (req, res, next) {
        try {
            const wallet = await walletsModel.deleteOne({ _id: req.params.id })
            res.json(wallet)

        } catch (e) {
            next(e)
            

        }
    },
    fisicDeleteAll: async function (req, res, next) {
        try {
            const walletssCount = await walletsModel.countDocuments()
            if (walletssCount === 0) {
                res.json({ message: "No existen billeteras a eliminar" })
                return
            }
            await walletsModel.deleteMany()
            res.json({ message: "Todas las billeteras han sido eliminadas" })
        } catch (e) {
            next(e)
            
        }
    },

    getPocketsOfWallet: async function (req, res, next) {
        async function getPockets(id) {
            try {
                const pockets = await pocketsModel.find({ wallet: id })
                    .populate(
                        {
                            path: "wallet",
                            model: "wallets"
                        }
                    )
                return pockets
            } catch (e) {
                next(e)
                return null
            }
        }
        try {
            const pocketsOfWallet = await getPockets(req.params.id)
            if (!pocketsOfWallet) {
                res.json({ message: "no existen bolsillos que pertenezcan a esta cartera" })
                return
            }
            res.json(pocketsOfWallet)
        } catch (e) {           
            next(e)
        }

    },


}





