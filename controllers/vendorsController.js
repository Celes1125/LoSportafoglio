const vendorsModel = require("../models/vendorsModel")

module.exports = {
    create: async function (req, res, next) {
        try {
            const existingVendor = await vendorsModel.findOne({ 
                    name: req.body.name,
                    creator: req.body.creator,
                    is_deleted: false
                })
            if(existingVendor){
                return res.status(400).json({ message: 'The vendors name already exists for the specified user.' });
            }
            const vendor = new vendorsModel({
                name: req.body.name,
                creator: req.body.creator
            })
            const newVendor = await vendor.save()
            res.status(201).json(newVendor);
        } catch (e) {
            next(e)
            console.log('backend error creating a vendor: ', e.message)
        }
    },
    // get all users vendors, including those that were logicly eliminated
    getAll: async function (req, res, next) {
        try {
            const vendors = await vendorsModel.find({
                creator: req.params.userId
            }).
                populate({
                    path: "creator",
                    model: "users"
                })
            res.send(vendors)

        } catch (e) {
            next(e)
        }
    },
    // get all vendors of the user but just those that were not eliminated
    getAllNotDeleted: async function (req, res, next) {
        try {
            const vendors = await vendorsModel.find({
                creator: req.params.userId,
                is_deleted: false               
            })
            .populate({
                path:"creator",
                model:"users"
                   })
            res.send(vendors)

        } catch (e) {
            next(e)
        }
    },     
    getById: async function (req, res, next) {
        try {
            async function findById(id) {
                try {
                    const vendor = await vendorsModel.findById(id).
                    populate({
                        path: "creator",
                        model: "users"
                    });
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
    // get all not deleted vendors of the user
    getAllNotDeleted: async function (req, res, next) {
        try {
            const vendors = await vendorsModel.find(
                { creator: req.params.userId,
                  is_deleted: false   
            }).populate({
                path: "creator",
                model: "users"
            })
            res.send(vendors)

        } catch (e) {
            next(e)
        }
    },
    logicDelete: async function (req, res, next) {
        try {
            const vendor = await vendorsModel.updateOne(
                { _id: req.params.id }, // Filtro para encontrar el registro
                { $set: { is_deleted: true } } // Actualización que establece `is_deleted` a true
            );
            if (vendor.nModified === 0) {
                return res.status(404).json({ message: 'The vendor is not found or already deleted.' });
            }  
            res.json(vendor)
        } catch (e) {
            next(e)
        }
    },
    fisicDelete: async function (req, res, next) {
        try {
            const vendor = await vendorsModel.deleteOne({ _id: req.params.id })
            res.json(vendor)

        } catch (e) {
            next(e)
        }
    },
    fisicDeleteAll: async function (req, res, next) {
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


