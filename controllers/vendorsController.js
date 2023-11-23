const vendorsModel = require("../models/vendorsModel")

module.exports = {
    create: async function (req, res, next) {
        try {
            const vendor = new vendorsModel(
                {
                    name: req.body.name,
                    
                }
            )
            const document = await vendor.save()
            res.json(document)

        } catch (e) {
            next(e)
        }
    },

    getAll: async function (req, res, next) {
        try {
            const vendors = await vendorsModel.find()
            res.send(vendors)

        } catch (e) {
            next(e)
        }
    },

    getById: async function (req, res, next) {
        try {
            async function findById(id) {
                try {
                    const vendor = await vendorsModel.findById(id);
                    return vendor
                } catch (e) {
                    return null
                }
            }
            const vendor = await findById(req.params.id)
            if (!vendor) {
                res.json({ message: "el proveedor no existe" });
                return
            }
            res.json(vendor)

        } catch (e) {
            next(e)
        }
    },

    update: async function (req, res, next) {
        try {
            const vendor = await vendorsModel.updateOne({ _id: req.params.id }, req.body);
            res.json(vendor)

        } catch (e) {
            next(e)

        }
    },

    delete: async function (req, res, next) {
        try {
            const vendor = await vendorsModel.deleteOne({ _id: req.params.id })
            res.json(vendor)

        } catch (e) {
            next(e)
        }
    },

    deleteAll: async function (req, res, next) {
        try {
            const vendorsCount = await vendorsModel.countDocuments()
            if (vendorsCount === 0) {
                res.json({ message: "No existen proveedores a eliminar" })
                return
            }
            await vendorsModel.deleteMany()
            res.json({ message: "Todos los proveedores han sido eliminadas" })
        } catch (e) {
            next(e)
        }
    }
}


