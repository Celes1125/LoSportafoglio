const movementsModel = require('../models/movementsModel');
const PDFDocument = require('pdfkit'); // Asegúrate de que pdfkit esté instalado correctamente
const walletsModel = require('../models/walletsModel')

module.exports = {
    create: async function (req, res, next) {
        try {
            const movement = new movementsModel({
                type: req.body.type,
                amount: req.body.amount, // se recibe un string
                currency: req.body.currency,
                notes: req.body.notes,
                user: req.body.user,
                category: req.body.category,
                vendor: req.body.vendor,
                fromPocket: req.body.fromPocket,
                toPocket: req.body.toPocket,
                pocket: req.body.pocket,
                wallet: req.body.wallet,
                date: req.body.date // se recibe un string
            });
            const document = await movement.save(); // se guarda un amount Decimal128
            res.json(document); // se devuelve un amount.toString()
        } catch (e) {
            next(e);
        }
    },

    getAll: async function (req, res, next) {
        try {
            // 1 => encuentro las wallets del usuario y rescato sus ids en un array
            const userWallets = await walletsModel.find({
                'users': { $in: [req.params.userId] },
                is_deleted: false
            }).populate({
                path: 'users', model: 'users'
            });

            const arrayOfUserWalletsIds = userWallets.map(wallet => wallet._id);
            console.log('arrayOfUserWalletsIds: ', arrayOfUserWalletsIds);

            // Array de IDs de todos los usuarios en todas las wallets
            const allUsersOfWallets = userWallets.flatMap(wallet => wallet.users.map(user => user._id));
            console.log('allUsersOfWallets: ', allUsersOfWallets);

            // 2 => creo un array con todos los movimientos de todos los usuarios involucrados en las mismas wallets
            const movements = await movementsModel.find({
                user: { $in: allUsersOfWallets }
            }).populate({ path: 'user', model: 'users' })
                .populate({ path: 'category', model: 'categories' })
                .populate({ path: 'vendor', model: 'vendors' })
                .populate({ path: 'fromPocket', model: 'pockets' })
                .populate({ path: 'toPocket', model: 'pockets' })
                .populate({ path: 'pocket', model: 'pockets' })
                .populate({ path: 'wallet', model: 'wallets' });
                res.json(movements)


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
        try {
            // 1 => encuentro las wallets del usuario y rescato sus ids en un array
            const userWallets = await walletsModel.find({
                'users': { $in: [req.params.userId] },
                is_deleted: false
            }).populate({
                path: 'users', model: 'users'
            });

            const arrayOfUserWalletsIds = userWallets.map(wallet => wallet._id);
            console.log('arrayOfUserWalletsIds: ', arrayOfUserWalletsIds);

            // Array de IDs de todos los usuarios en todas las wallets
            const allUsersOfWallets = userWallets.flatMap(wallet => wallet.users.map(user => user._id));
            console.log('allUsersOfWallets: ', allUsersOfWallets);

            // 2 => creo un array con todos los movimientos de todos los usuarios involucrados en las mismas wallets
            const movements = await movementsModel.find({
                user: { $in: allUsersOfWallets }
            }).populate({ path: 'user', model: 'users' })
                .populate({ path: 'category', model: 'categories' })
                .populate({ path: 'vendor', model: 'vendors' })
                .populate({ path: 'fromPocket', model: 'pockets' })
                .populate({ path: 'toPocket', model: 'pockets' })
                .populate({ path: 'pocket', model: 'pockets' })
                .populate({ path: 'wallet', model: 'wallets' });

            const filterValues = req.body;
            console.log('filterValues: ', filterValues);

            // Filtrar los movimientos según las condiciones recibidas
            const filterMovements = (movements, filterValues) => {
                const filterConditions = {};

                if (filterValues.type) filterConditions.type = filterValues.type;
                if (filterValues.user) filterConditions['user.name'] = filterValues.user;
                if (filterValues.category) filterConditions['category.name'] = filterValues.category;
                if (filterValues.vendor) filterConditions['vendor.name'] = filterValues.vendor;
                if (filterValues.wallet) filterConditions['wallet.name'] = filterValues.wallet;
                if (filterValues.year || filterValues.month) {
                    const startDate = new Date(filterValues.year, filterValues.month ? filterValues.month - 1 : 0, 1);
                    const endDate = filterValues.month
                        ? new Date(filterValues.year, filterValues.month, 1)
                        : new Date(parseInt(filterValues.year) + 1, 0, 1);
                    filterConditions.date = { $gte: startDate, $lt: endDate };
                }

                return movements.filter(movement => {
                    return Object.keys(filterConditions).every(key => {
                        const filterValue = filterConditions[key];
                        const [field, subField] = key.split('.');
                        if (subField) {
                            return movement[field]?.[subField]?.toLowerCase() === filterValue.toLowerCase();
                        }
                        if (key === 'date') {
                            return movement[key] >= filterValue.$gte && movement[key] < filterValue.$lt;
                        }
                        return movement[key]?.toString() === filterValue.toString();
                    });
                });
            };

            const filteredMovements = filterMovements(movements, filterValues);
            console.log(`Total movements: ${filteredMovements.length}\n`);

            const doc = new PDFDocument({ layout: 'landscape' });

            // Configurar encabezados para la respuesta
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=generated_file.pdf');
            doc.pipe(res);

            doc.fontSize(12).text(`Reporte de Movimientos - User ID: ${req.params.userId}`, { align: 'center' });
            doc.moveDown(2);

            const startX = 50; // Posición inicial del eje x
            const headers = ['Date', 'Type', 'User', 'Category', 'Provider', 'Amount', 'fromPocket', 'toPocket', 'pocket', 'Notes'];
            const tableTop = 150;
            const itemHeight = 30;
            const columnWidth = 70; // Ancho de cada columna

            // Dibujar encabezados de la tabla con ancho específico para que el texto se envuelva si es largo
            headers.forEach((header, index) => {
                doc.fontSize(12).text(header, startX + index * columnWidth, tableTop, { width: columnWidth, align: 'left' });
            });

            // Función para dibujar una fila, donde cada columna tiene un ancho limitado para el ajuste de texto
            const drawRow = (y, movement) => {
                doc.fontSize(8);
                doc.text(new Date(movement.date).toISOString().split('T')[0], startX, y, { width: columnWidth });
                doc.text(movement.type || 'N/A', startX + columnWidth, y, { width: columnWidth });
                doc.text(movement.user?.name || 'N/A', startX + 2 * columnWidth, y, { width: columnWidth });
                doc.text(movement.category?.name || 'N/A', startX + 3 * columnWidth, y, { width: columnWidth });
                doc.text(movement.vendor?.name || 'N/A', startX + 4 * columnWidth, y, { width: columnWidth });
                doc.text(`${movement.amount || 0} ${movement.currency || ''}`, startX + 5 * columnWidth, y, { width: columnWidth });
                doc.text(movement.fromPocket?.name || 'N/A', startX + 6 * columnWidth, y, { width: columnWidth });
                doc.text(movement.toPocket?.name || 'N/A', startX + 7 * columnWidth, y, { width: columnWidth });
                doc.text(movement.pocket?.name || 'N/A', startX + 8 * columnWidth, y, { width: columnWidth });
                doc.text(movement.notes || 'N/A', startX + 9 * columnWidth, y, { width: columnWidth });
            };

            // Dibujar filas de movimientos
            filteredMovements.forEach((movement, index) => {
                const y = tableTop + itemHeight * (index + 1);
                drawRow(y, movement);
            });

            // Finalizar y enviar el PDF
            doc.end();
        } catch (e) {
            next(e);
        }
    }


}








