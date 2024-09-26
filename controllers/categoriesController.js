const categoriesModel = require("../models/categoriesModel")

module.exports = {
    create: async function (req, res, next) {
        try {
            const category = new categoriesModel(
                {
                    name: req.body.name,
                    description: req.body.description,
                    creator:req.body.creator
                    
                }
            )
            const document = await category.save()
            res.json(document)

        } catch (e) {
            next(e)
        }
    },

    getAll: async function (req, res, next) {
        try {
            const categories = await categoriesModel.find().populate({
                path: "creator",
                model: "users"
            })
            res.send(categories)

        } catch (e) {
            next(e)
        }
    },

    getById: async function (req, res, next) {
        try {
            async function findById(id) {
                try {
                    const category = await categoriesModel.findById(id).populate({
                        path: "creator",
                        model: "users"
                    });
                    return category
                } catch (e) {
                    return null
                }
            }
            const category = await findById(req.params.id)
            if (!category) {
                res.json({ message: "la categoría no existe" });
                return
            }
            res.json(category)

        } catch (e) {
            next(e)
        }
    },

    update: async function (req, res, next) {
        try {
            const category = await categoriesModel.updateOne({ _id: req.params.id }, req.body);
            res.json(category)  
        } catch (e) {
            next(e)

        }
    },

    delete: async function (req, res, next) {
        try {
            const category = await categoriesModel.deleteOne({ _id: req.params.id })
            res.json(category)

        } catch (e) {
            next(e)
        }
    },

    deleteAll: async function (req, res, next) {
        try {
            const categoriesCount = await categoriesModel.countDocuments()
            if (categoriesCount === 0) {
                res.json({ message: "No existen categorias a eliminar" })
                return
            }
            await categoriesModel.deleteMany()
            res.json({ message: "Todas las catrgorías han sido eliminadas" })
        } catch (e) {
            next(e)
        }
    }
}


