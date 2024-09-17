const pocketsModel = require("../models/pocketsModel")

module.exports = {
    create: async function (req, res, next) {
        try {
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
            console.log('backend error on pockets model or controller: ', e.message)
        }
    },

    getAll: async function (req, res, next) {
        try {
            const pockets = await pocketsModel.find()
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

    delete: async function (req, res, next) {
        try {
            const pocket = await pocketsModel.deleteOne({ _id: req.params.id })
            res.json(pocket)

        } catch (e) {
            next(e)
        }
    },

    deleteAll: async function (req, res, next) {
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


