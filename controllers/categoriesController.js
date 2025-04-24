const categoriesModel = require("../models/categoriesModel")


module.exports = {
    create: async function (req, res, next) {
        try {
            // searching for duplicates inside the not eliminated categories of the user
            const existingCategory = await categoriesModel.findOne({
                name: req.body.name,
                creator: req.body.creator,  
                is_deleted: false  
            });
            // if duplication exists return error
            if (existingCategory) {               
                return res.status(400).json({ message: 'The category name already exists for the specified user.' });
            }
            //if duplication not exists proceed to create and save the new category
            const category = new categoriesModel({
                name: req.body.name,
                description: req.body.description,
                creator: req.body.creator  // userId
            });
            // saving the new category
            const newCategory = await category.save();
            // status return
            res.status(201).json(newCategory);
        } catch (e) {
            console.error('Error creating a category:', e.message);
            next(e); 
        }
    },

    //get all categories of the user
    getAll: async function (req, res, next) {
        try {
            const categories = await categoriesModel.find(
                { creator: req.params.userId }
            )
            .sort({name: 1})
            .populate({
                path: "creator",
                model: "users"
            })            
            res.send(categories)

        } catch (e) {
            next(e)
        }
    },
    // get all not deleted categories of the user
    getAllNotDeleted: async function (req, res, next) {
        try {
            const categories = await categoriesModel.find(
                { creator: req.params.userId,
                  is_deleted: false   
            })
            .sort({name: 1})
            .populate({
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

    logicDelete: async function (req, res, next) {
        try {
            const category = await categoriesModel.updateOne(
                { _id: req.params.id }, // Filtro para encontrar el registro
                { $set: { is_deleted: true } } // Actualización que establece `is_deleted` a true
            );
            if (category.nModified === 0) {
                return res.status(404).json({ message: 'The category is not found or already deleted.' });
            }  
            res.json(category)
        } catch (e) {
            next(e)
        }
    },

    fisicDelete: async function (req, res, next) {
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


