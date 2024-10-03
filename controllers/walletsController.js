
const walletsModel = require('../models/walletsModel')
const pocketsModel = require('../models/pocketsModel')

module.exports = {
    create: async function (req, res, next) {
        try {
            // searching for duplicates inside the not eliminated wallets of the users array
            const existingWallet = await walletsModel.findOne({
                name: req.body.name,
                users: { $in: req.body.users },  
                is_deleted: false  
            });
            // if duplication exists return error
            if (existingWallet) {               
                return res.status(400).json({ message: 'The wallet name already exists for the specified users.' });
            }
            //if duplication not exists proceed to create and save the new wallet
            const wallet = new walletsModel({
                name: req.body.name,
                users: req.body.users  // ObjectId users array
            });
            // saving the new wallet
            const newWallet = await wallet.save();
            // status return
            res.status(201).json(newWallet);
        } catch (e) {
            console.error('backend error creating a new wallet:', e.message);
            next(e); 
        }
    },

    // get all users wallets, including those that were eliminated
    getAll: async function (req, res, next) {
        try {
            const wallets = await walletsModel.find({users: { $in: req.params.userId }})
                .populate({
                    path: "users",
                    model: "users"

                })
            res.json(wallets)

        } catch (e) {
            next(e)
        }
    },

    // get all users wallets, but just those that were not eliminated
    getAllNotDeleted: async function (req, res, next) {
        try {
            const wallets = await walletsModel.find( {
                users: { $in: req.params.userId },    
                is_deleted: false              
            })
                .populate({
                    path: "users",
                    model: "users"

                })
            res.json(wallets)

        } catch (e) {
            next(e)
        }
    },

    getById: async function (req, res, next) {
        try {
            async function findById(id) {
                try {
                    const wallet = await walletsModel.findById(id).populate({
                        path: "users",
                        model: "users"

                    })
                    return wallet
                } catch (e) {
                    return null
                }
            }
            const wallet = await findById(req.params.id)
            if (!wallet) {
                res.json({ message: "La billetera no existe" })
                return
            }
            res.json(wallet)
        } catch (e) {
            next(e)

        }
    },

    update: async function (req, res, next) {
        try {
            const wallet = await walletsModel.updateOne({ _id: req.params.id }, req.body)
            res.json(wallet)

        } catch (e) {
            next(e)

        }
    },

    logicDelete: async function (req, res, next) {
        try {
            // turning `is_deleted` to `true` 
            const wallet = await walletsModel.updateOne(
                { _id: req.params.id }, // Filtro para encontrar el registro
                { $set: { is_deleted: true } } // Actualización que establece `is_deleted` a true
            );
            // checking modifications
            if (wallet.nModified === 0) {
                return res.status(404).json({ message: 'Wallet is not found or already deleted.' });
            }
            // return success message
            res.json(wallet);
        } catch (e) {
            next(e); // handling errors
        }
    },

    fisicDelete: async function (req, res, next) {
        try {
            const wallet = await walletsModel.deleteOne({ _id: req.params.id })
            res.json(wallet)

        } catch (e) {
            next(e)


        }
    },
    fisicDeleteAll: async function (req, res, next) {
        try {
            const walletssCount = await walletsModel.countDocuments()
            if (walletssCount === 0) {
                res.json({ message: "No existen billeteras a eliminar" })
                return
            }
            await walletsModel.deleteMany()
            res.json({ message: "Todas las billeteras han sido eliminadas" })
        } catch (e) {
            next(e)

        }
    },
    //returns all not eliminated pockets of the wallet
    getPocketsOfWallet: async function (req, res, next) {
        async function getPockets(id) {
            try {
                const pockets = await pocketsModel.find({ wallet: id, is_deleted: false })
                    .populate(
                        {
                            path: "wallet",
                            model: "wallets"
                        }
                    )
                return pockets
            } catch (e) {
                next(e)
                return null
            }
        }
        try {
            const pocketsOfWallet = await getPockets(req.params.id)
            if (!pocketsOfWallet) {
                res.json({ message: "no existen bolsillos que pertenezcan a esta cartera" })
                return
            }
            res.json(pocketsOfWallet)
        } catch (e) {
            next(e)
        }

    },


}





