const movementsModel = require('../models/movementsModel')

module.exports = {
    create: async function (req, res, next) {
        try {
            const movement = new movementsModel(
                {
                    type: req.body.type,
                    amount: req.body.amount,
                    currency: req.body.currency,
                    note: req.body.note,
                    user: req.body.userId,
                    category: req.body.category,
                    pocket: req.body.pocket,
                    vendor: req.body.vendor
                }
            )
            const document = await movement.save()
            res.json(document)

        } catch (e) {
            next(e)
        }
    },

    getAll: async function (req, res, next) {
        try {
            const movements = await movementsModel.find()
                .populate({
                    path: "user",
                    model: "users"
                })
                .populate({
                    path: "category",
                    model: "categories"
                })
                .populate({
                    path:"pocket",
                    model: "pockets"
                })
                .populate({
                    path:"vendor",
                    model: "vendors"
                })
            res.send(movements)

        } catch (e) {
            next(e)
        }
    },

    getById: async function (req, res, next) {
        try {
            async function findById(id) {
                try {
                    const movement = await movementsModel.findById(id);
                    return movement
                } catch (e) {
                    return null
                }
            }
            const movement = await findById(req.params.id)
            if (!movement) {
                res.json({ message: "el movimiento no existe" });
                return
            }
            res.json(movement)

        } catch (e) {
            next(e)
        }
    },

    update: async function (req, res, next) {
        try {
            const movement = await movementsModel.updateOne({ id_: req.params.id }, req.body);
            res.json(movement)

        } catch (e) {
            next(e)

        }
    },

    delete: async function (req, res, next) {
        try {
            const movement = await movementsModel.deleteOne({ _id: req.params.id })
            res.json(movement)

        } catch (e) {
            next(e)
        }
    },

    deleteAll: async function (req, res, next) {
        try {
            const movementsCount = await movementsModel.countDocuments()
            if (movementsCount === 0) {
                res.json({ message: "No existen movimientos a eliminar" })
                return
            }
            await movementsModel.deleteMany()
            res.json({ message: "Todos los movimientos han sido eliminados" })
        } catch (e) {
            next(e)
        }
    }
}


