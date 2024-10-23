const movementsModel = require('../models/movementsModel');
const PDFDocument = require('pdfkit'); // Asegúrate de que pdfkit esté instalado correctamente

module.exports = {
    create: async function (req, res, next) {
        try {
            const movement = new movementsModel({
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
            });
            const document = await movement.save();
            res.json(document);
        } catch (e) {
            next(e);
        }
    },

    getAll: async function (req, res, next) {
        try {
            const movements = await movementsModel.find({ user: req.params.userId })
                .populate('user', 'users')
                .populate('category', 'categories')
                .populate('vendor', 'vendors')
                .populate('fromPocket', 'pockets')
                .populate('toPocket', 'pockets')
                .populate('pocket', 'pockets')
                .populate('wallet', 'wallets');
            res.send(movements);
        } catch (e) {
            next(e);
        }
    },

    getById: async function (req, res, next) {
        try {
            const movement = await movementsModel.findById(req.params.id);
            if (!movement) {
                res.json({ message: 'movement does not exist' });
                return;
            }
            res.json(movement);
        } catch (e) {
            next(e);
        }
    },

    update: async function (req, res, next) {
        try {
            const movement = await movementsModel.updateOne({ _id: req.params.id }, req.body);
            res.json(movement);
        } catch (e) {
            next(e);
        }
    },

    delete: async function (req, res, next) {
        try {
            const movement = await movementsModel.deleteOne({ _id: req.params.id });
            res.json(movement);
        } catch (e) {
            next(e);
        }
    },

    deleteAll: async function (req, res, next) {
        try {
            const movementsCount = await movementsModel.countDocuments();
            if (movementsCount === 0) {
                res.json({ message: 'There are not movements to delete' });
                return;
            }
            await movementsModel.deleteMany();
            res.json({ message: 'All movements have been deleted' });
        } catch (e) {
            next(e);
        }
    },

    deleteMovementsByPocket: async function (req, res, next) {
        try {
            await movementsModel.deleteMany({ pocket: req.params.id });
            res.json({ message: "All pocket's movements have been successfully deleted" });
        } catch (e) {
            next(e);
        }
    },

    deleteMovementsByUser: async function (req, res, next) {
        try {
            await movementsModel.deleteMany({ user: req.params.id });
            res.json({ message: 'All movements have been successfully deleted' });
        } catch (e) {
            next(e);
        }
    },

    getMovementsByPocket: async function (req, res, next) {
        try {
            const movements = await movementsModel.find({ pocket: req.params.id });
            res.json(movements);
        } catch (e) {
            next(e);
        }
    },

    getTable: async function (req, res, next) {
        const userId = req.params.id
        const doc = new PDFDocument();

        // Configurar encabezados para la respuesta
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=generated_file.pdf');

        // Crear el PDF y enviarlo directamente a la respuesta
        doc.pipe(res);

        // Escribir contenido en el PDF
        doc.fontSize(25).text(`Este es el user id: ${userId}`, 100, 100);

        // Finalizar el documento PDF
        doc.end();
    },

    getTableF: async function (req, res, next) {
        try {
            const userId = req.params.id
            const filters = req.body
            const doc = new PDFDocument();            
            const query = {
                user: userId
            }
            // Aplicar los filtros solo si están definidos y tienen un valor válido
            if (filters.type) {
                query.type = filters.type; 
            }
            if (filters.category) {
                query.category.name = filters.category;
            }
            if (filters.vendor) {
                query.vendor.name = filters.vendor
            }
            if (filters.date){
                query.date = filters.date
            }
            const filteredMovements = await movementsModel.find(query)


            // Configurar encabezados para la respuesta
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=generated_file.pdf');

            // Crear el PDF y enviarlo directamente a la respuesta
            doc.pipe(res);

            // Escribir contenido en el PDF
            doc.fontSize(25).text(`Este es el user id: ${userId}`, 100, 100);
            doc.text(`movements: ${filteredMovements}`, 100, 150)       

            // Finalizar el documento PDF
            doc.end();

        } catch (e) {
            next(e);
        }

    }
};
