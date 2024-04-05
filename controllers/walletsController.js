
const walletsModel = require('../models/walletsModel')
const pocketsModel = require('../models/pocketsModel')


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
    delete: async function (req, res, next) {
        try {
            const wallet = await walletsModel.deleteOne({ _id: req.params.id })
            res.json(wallet)

        } catch (e) {
            next(e)

        }
    },
    deleteAll: async function (req, res, next) {
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





