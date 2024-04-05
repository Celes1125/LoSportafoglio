const movementsModel = require('../models/movementsModel')

module.exports = {
    create: async function (req, res, next) {
        try {
            const movement = new movementsModel(
                {
                    type: req.body.type,
                    amount: req.body.amount,
                    currency: req.body.currency,
                    notes: req.body.notes,
                    user: req.body.user,
                    category: req.body.category,
                    vendor: req.body.vendor,
                    fromPocket: req.body.fromPocket,
                    toPocket: req.body.toPocket,
                    pocket: req.body.pocket,
                    wallet: req.body.wallet                    
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
            res.send(movements)

        } catch (e) {
            next(e)
        }
    },

    getById: async function (req, res, next) {
        try {
            async function findById(id) {
                try {
                    const movement = await movementsModel.findById(id)                      
                    return movement
                } catch (e) {
                    return null
                }
            }
            const movement = await findById(req.params.id)
            if (!movement) {
                res.json({ message: "movement does not exist" });
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
                res.json({ message: "There are not movements to delete" })
                return
            }
            await movementsModel.deleteMany()
            res.json({ message: "All movements has been deleted" })
        } catch (e) {
            next(e)
        }
    },

    deleteMovementsByPocket: async function (req, res, next) {
        try {
           const movements =  await movementsModel.deleteMany({ pocket: req.params.id })
           res.json({ message: "All pocket's movements has been successfully deleted"})

        } catch (e) {
            next(e)
        }
    },

    getMovementsByPocket: async function (req, res, next) {
        try {
           const movements =  await movementsModel.findMany({ pocket: req.params.id })
           res.json(movements)

        } catch (e) {
            next(e)
        }
    },
}


