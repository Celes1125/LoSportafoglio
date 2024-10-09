const movementsModel = require('../models/movementsModel')
const PDFDocument = require('pdfkit');
require('pdfkit-table');

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
            .populate({
                path: "category",
                model: "categories"
            })
            .populate({
                path: "vendor",
                model: "vendors"
            })
            .populate({
                path: "fromPocket",
                model: "pockets"
            }) 
            .populate({
                path: "toPocket",
                model: "pockets"
            })
            .populate({
                path: "pocket",
                model: "pockets"
            })
            .populate({
                path: "wallet",
                model: "wallets"
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
            const movement = await movementsModel.updateOne({ _id: req.params.id }, req.body);
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

    deleteMovementsByUser: async function (req, res, next) {
        try {
           const movements =  await movementsModel.deleteMany({ user: req.params.id })
           res.json({ message: "All movements has been successfully deleted"})

        } catch (e) {
            next(e)
        }
    },

    getMovementsByPocket: async function (req, res, next) {
        try {
           const movements =  await movementsModel.find({ pocket: req.params.id })
           res.json(movements)

        } catch (e) {
            next(e)
        }
    },  

    downloadPDF : async function (req, res, next) {
        try {      
            const movements = await movementsModel.find({ user: req.params.userId })
                .populate("user")
                .populate("category")
                .populate("vendor")
                .populate("fromPocket")
                .populate("toPocket")
                .populate("pocket")
                .populate("wallet");         
            
            // Verificar si no hay movimientos
            if (!movements.length) {
                return res.status(404).json({ message: "No movements found" });
            }
            // Configurar la respuesta HTTP para la descarga
            await res.setHeader('Content-Disposition', 'attachment; filename="movements.pdf"');
            await res.setHeader('Content-Type', 'application/pdf');

            // Crear un nuevo documento PDF
            const doc = new PDFDocument({ margin: 30, size: 'A4' }); 

            // Enviar el PDF directamente al cliente
            doc.pipe(res);

            // Añadir un título elegante al documento
            doc.fontSize(20).text('User Movements Report', { align: 'center', underline: true });
            doc.moveDown(2); // Añadir espacio vertical
            
            // Añadir encabezados de la tabla
            const headers = ['User', 'Type', 'Category', 'Vendor', 'Currency', 'Amount', 'Date', 'fromPocket', 'toPocket', 'Pocket', 'Wallet', 'Notes'];
            
            // Agregar estilos y encabezados al PDF
            doc.fontSize(10).font('Helvetica-Bold');
            headers.forEach((header, i) => {
                doc.text(header, 50 + i * 100, 150, { width: 90, align: 'center' });
            });

            // Cambiar fuente para las filas
            doc.fontSize(8).font('Helvetica');   
            
            // Añadir filas de datos
            movements.forEach((movement, i) => {
                const y = 170 + (i * 20); // Calcular posición vertical para cada fila
                
                // Ajustar las posiciones x para que no se solapen
                const columnWidths = {
                    user: 30, // Espacio inicial para el usuario
                    type: 60,
                    category: 90,
                    vendor: 120,
                    currency: 150,
                    amount: 170,
                    date: 200,
                    fromPocket: 230,
                    toPocket: 260,
                    pocket: 290,
                    wallet: 300,
                    notes: 330
                };
            
                // Añadir datos en las posiciones x ajustadas
                doc.text(movement.user?.name || 'N/A', columnWidths.user, y, { width: 20, align: 'center' }); // Columna 1 - Usuario
                doc.text(movement.type, columnWidths.type, y, { width: 10, align: 'center' }); // Columna 2 - Tipo
                doc.text(movement.category?.name || 'N/A', columnWidths.category, y, { width: 30, align: 'center' }); // Columna 3 - Categoría
                doc.text(movement.vendor?.name || 'N/A', columnWidths.vendor, y, { width: 30, align: 'center' }); // Columna 4 - Vendedor
                doc.text(movement.currency.toUpperCase(), columnWidths.currency, y, { width: 20, align: 'center' }); // Columna 5 - Moneda
                doc.text(movement.amount.toFixed(2), columnWidths.amount, y, { width: 20, align: 'right' }); // Columna 6 - Cantidad
                doc.text(new Date(movement.date).toLocaleDateString(), columnWidths.date, y, { width: 90, align: 'center' }); // Columna 7 - Fecha
                doc.text(movement.fromPocket?.name || 'N/A', columnWidths.fromPocket, y, { width: 20, align: 'center' }); // Columna 8 - Desde (Pocket)
                doc.text(movement.toPocket?.name || 'N/A', columnWidths.toPocket, y, { width: 20, align: 'center' }); // Columna 9 - Hacia (Pocket)
                doc.text(movement.pocket?.name || 'N/A', columnWidths.pocket, y, { width: 20, align: 'center' }); // Columna 10 - Pocket
                doc.text(movement.wallet?.name || 'N/A', columnWidths.wallet, y, { width: 20, align: 'center' }); // Columna 11 - Billetera
                doc.text(movement.notes || 'N/A', columnWidths.notes, y, { width: 90, align: 'center' }); // Columna 12 - Notas
            });
    
            // Evento que se dispara cuando se completa la creación del PDF
            doc.on('end', () => {
                console.log('PDF successfully created and sent');
            });
    
            // Evento para manejar errores en la creación del PDF
            doc.on('error', (err) => {
                console.error('Error creating PDF:', err);
                next(err);  // Delegar al middleware de manejo de errores
            });
    
            // Finalizar la creación del PDF
            doc.end();
             
    
        } catch (e) {
            next(e);  // Si hay un error, delegar al middleware de manejo de errores
        }
    }
}





