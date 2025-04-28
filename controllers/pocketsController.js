const { default: Decimal } = require("decimal.js");
const pocketsModel = require("../models/pocketsModel");

const pocketsController = {
    create: async function (req, res, next) {
        try {
            //searching for duplicates inside the not eliminated pockets of the wallet
            const existingPocket = await pocketsModel.findOne(
                {
                    name: req.body.name,
                    wallet: req.body.wallet,
                    is_deleted: false
                }
            )
            // if duplication exists return error
            if (existingPocket) {
                // Si ya existe una wallet con el mismo nombre y usuario, devolvemos un error
                return res.status(400).json({ message: 'The pockets name already exists for the specified users wallet' });
            }
            //if duplication not exists proceed to create and save the new pocket                      
            const pocket = new pocketsModel(
                {
                    name: req.body.name,
                    amount: req.body.amount, //del body vamos a recibir un string
                    currency: req.body.currency,
                    wallet: req.body.wallet

                }
            )
            const document = await pocket.save() // se va a guardar un amount como Decimal128
            res.json(document) // pero se va a devolver al front un amount.toString() -- ver pocketSchemma.set.transform          

        } catch (e) {
            next(e)
            console.log('backend error creating a pocket: ', e.message)
        }
    },
    // get all wallets pockets, including those that were logicly eliminated
    getAll: async function (req, res, next) {
        try {
            const pockets = await pocketsModel.find({
                wallet: { $in: req.params.walletId },
            })
                .sort({creationDate: -1})
                .populate({
                    path: "wallet",
                    model: "wallets"
                })
            res.json(pockets)

        } catch (e) {
            next(e)
        }
    },
    // get all wallets pockets but just those that were not eliminated
    getAllNotDeleted: async function (req, res, next) {
        try {
            const pockets = await pocketsModel.find({
                wallet: { $in: req.params.walletId },
                is_deleted: false
            })
                .sort({creationDate: -1})
                .populate({
                    path: "wallet",
                    model: "wallets"
                })
            res.json(pockets)

        } catch (e) {
            next(e)
        }
    },
    getById: async function (req, res, next) {
        try {
            async function findById(id) {
                try {
                    const pocket = await pocketsModel.findById(id).populate({
                        path: "wallet",
                        model: "wallets"
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
    logicDelete: async function (req, res, next) {
        try {
            // Cambiar el campo `is_deleted` a `true` directamente
            const pocket = await pocketsModel.updateOne(
                { _id: req.params.id }, // Filtro para encontrar el registro
                { $set: { is_deleted: true } } // Actualización que establece `is_deleted` a true
            );

            // Verificamos si realmente se actualizó un registro
            if (pocket.nModified === 0) {
                return res.status(404).json({ message: 'Pocket not found or already deleted.' });
            }

            // Responder con éxito
            res.json({ message: 'Pocket marked as deleted logically.' });
        } catch (e) {
            next(e); // Manejo de errores
        }
    },
    fisicDelete: async function (req, res, next) {
        try {
            const pocket = await pocketsModel.deleteOne({ _id: req.params.id })
            res.json(pocket)

        } catch (e) {
            next(e)
        }
    },
    fisicDeleteAll: async function (req, res, next) {
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
    },
    refreshPocketAmounts: async function (req, res, next) {
        try {
            const movement = req.body;
            switch (movement.type) {
                case 'transfer':
                    await pocketsController.refreshPocketsOfTransfer(movement, res, next);
                    break;
                case 'in':
                    await pocketsController.refreshPocketOfIncome(movement, res, next);
                    break;
                case 'out':
                    await pocketsController.refreshPocketOfExpense(movement, res, next);
                    break;
                default:
                    console.log('Tipo de movimiento desconocido:', movement.type);
                    return res.status(400).json({ message: `Tipo de movimiento inválido: ${movement.type}` });
            }
        } catch (e) {
            next(e)
        }
    },
    //all methods for refresh amounts of pockets:
    refreshPocketsOfTransfer: async function (movement, res, next) {
        try {
            const transfer = movement
            if (!transfer) {
                res.json({ 'message': 'for some reason we do not have received any transfer movement' })
            }
            await pocketsController.refreshFromPocket(transfer.fromPocket, transfer.amount)
            await pocketsController.refreshToPocket(transfer.toPocket, transfer.amount)
            res.json({ 'message': 'the transfer pocket amounts were updated' })
        } catch (e) {
            next(e)
        }
    },
    refreshFromPocket: async function (pocketId, transferAmount) {
        //buscar el pocket
        const fromPocket = await pocketsModel.findById(pocketId)
            .populate({
                path: "wallet",
                model: "wallets"
            })
        if (!fromPocket) {
            throw new Error(`pocket not found: ${pocketId}`);
        }
        // calcular el nuevo monto del pocket luego de la transferencia
        let fromPocketAmount = new Decimal(fromPocket.amount.toString());
        let amountOfTransfer = new Decimal(transferAmount.toString());
        let newFromPocketAmount = new Decimal(0);
        newFromPocketAmount = fromPocketAmount.minus(amountOfTransfer);
        console.log('new from pocket amount:', newFromPocketAmount.toString())

        //actualizar el pocket con el nuevo monto
        const newFromPocket = await pocketsModel.updateOne({ _id: pocketId }, {            
            "amount": newFromPocketAmount.toString(),
            "lastModified": Date.now()
        })
        if (!newFromPocket || newFromPocket == undefined) {
            throw new Error('we have problems refreshing the from pocket amount')
        } else {
            console.log('new from pocket: ', newFromPocket)
        }

    },
    refreshToPocket: async function (pocketId, transferAmount) {
        //buscar el pocket
        const toPocket = await pocketsModel.findById(pocketId)
            .populate({
                path: "wallet",
                model: "wallets"
            })
        if (!toPocket) {
            throw new Error(`pocket not found: ${pocketId}`);
        }
        // calcular el nuevo monto del pocket luego de la transferencia
        let toPocketAmount = new Decimal(toPocket.amount.toString());
        let amountOfTransfer = new Decimal(transferAmount.toString());
        let newToPocketAmount = new Decimal(0);
        newToPocketAmount = toPocketAmount.plus(amountOfTransfer);
        console.log('new to pocket amount:', newToPocketAmount.toString())

        //actualizar el pocket con el nuevo monto
        const newToPocket = await pocketsModel.updateOne({ _id: pocketId }, {            
            "amount": newToPocketAmount.toString(),
            "lastModified": Date.now()
        })
        if (!newToPocket || newToPocket == undefined) {
            throw new Error('we have problems refreshing the to pocket amount')
        } else {
            console.log('new to pocket: ', newToPocket)
        }

    },
    refreshPocketOfIncome: async function (movement, res, next) {
        try {
            const pocket = await pocketsModel.findById(movement.pocket)
                .populate({
                    path: 'wallet',
                    model: 'wallets'
                })
            if (pocket) {
                let oldPocketAmount = new Decimal(pocket.amount.toString());
                let movementAmount = new Decimal(movement.amount.toString());
                let newPocketAmount = new Decimal(0);
                newPocketAmount = oldPocketAmount.plus(movementAmount);
                let pocketUpdated = await pocketsModel.updateOne({ _id: pocket._id }, {                    
                    'amount': newPocketAmount,
                    'lastModified': Date.now()
                })
                res.json(pocketUpdated)
            }
        } catch (e) {
            next(e)
        }
    },
    refreshPocketOfExpense: async function (movement, res, next) {
        try {
            const pocket = await pocketsModel.findById(movement.pocket)
                .populate({
                    path: 'wallet',
                    model: 'wallets'
                })
            if (pocket) {
                let oldPocketAmount = new Decimal(pocket.amount.toString());
                let movementAmount = new Decimal(movement.amount.toString());
                let newPocketAmount = new Decimal(0);
                newPocketAmount = oldPocketAmount.minus(movementAmount);
                let pocketUpdated = await pocketsModel.updateOne({ _id: pocket._id }, {                    
                    'amount': newPocketAmount,
                    'lastModified': Date.now()
                })
                res.json(pocketUpdated)
            }
        } catch (e) {
            next(e)
        }
    }
}

module.exports = pocketsController;


