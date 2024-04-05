const transfersModel = require('../models/transfersModel')

module.exports = {
    create: async function (req, res, next) {
        try {
            const transfer = new transfersModel(
                {
                    user: req.body.user,
                    fromPocket: req.body.fromPocket,
                    toPocket: req.body.toPocket,
                    amount: req.body.amount,                    
                    note: req.body.note,                    
                }
            )  
            const document = await transfer.save()
            res.json(document)

        } catch (e) {
            next(e)
        }
    },

    getAll: async function (req, res, next) {
        try {
            const transfers = await transfersModel.find()
                .populate({
                    path: "user",
                    model: "users"
                })
                .populate({
                    path: "fromPocket",
                    model: "pockets",
                    populate: {
                        path: "wallet",
                        model: "wallets"
                    }
                })
                .populate({
                    path:"toPocket",
                    model: "pockets",
                    populate: {
                        path: "wallet",
                        model: "wallets"
                    }
                })
                
            res.send(transfers)

        } catch (e) {
            next(e)
        }
    },

    getById: async function (req, res, next) {
        try {
            async function findById(id) {
                try {
                    const transfer = await transfersModel.findById(id)
                    .populate({
                        path: "user",
                        model: "users"
                    })
                    .populate({
                        path: "fromPocket",
                        model: "pockets",
                        populate: {
                            path: "wallet",
                            model: "wallets"
                        }
                    })
                    .populate({
                        path:"toPocket",
                        model: "pockets",
                        populate: {
                            path: "wallet",
                            model: "wallets"
                        }
                    })    
                    return transfer
                } catch (e) {
                    return null
                }
            }
            const transfer = await findById(req.params.id)
            if (!transfer) {
                res.json({ message: "la transacción no existe" });
                return
            }
            res.json(transfer)

        } catch (e) {
            next(e)
        }
    },    

    delete: async function (req, res, next) {
        try {
            const transfer = await transfersModel.deleteOne({ _id: req.params.id })
            res.json(transfer)

        } catch (e) {
            next(e)
        }
    },

    deleteAll: async function (req, res, next) {
        try {
            const transfersCount = await transfersModel.countDocuments()
            if (transfersCount === 0) {
                res.json({ message: "No existen transfers a eliminar" })
                return
            }
            await transfersModel.deleteMany()
            res.json({ message: "Todos las transfers han sido eliminadas" })
        } catch (e) {
            next(e)
        }
    },

 
}


