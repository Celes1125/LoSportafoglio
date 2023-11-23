
const walletsModel = require('../models/walletsModel')


module.exports = {

    create: async function (req, res, next) {
        try {
            const wallet = new walletsModel({
                name: req.body.name,
                creator: req.body.creator //the objectId from the usersModel 
            })
            const document = await wallet.save()
            res.json(document)

        } catch (e) {
            next(e)
        }
    },


    getAll: async function (req, res, next) {
        try {
            const wallets = await walletsModel.find()
                .populate({
                    path: "pockets",
                    model: "pockets"
                })
                .populate({
                    path: "creator",
                    model: "users"
                })
            res.json(wallets)

        } catch (e){
            next(e)
        }
    },

    getById: async function (req, res, next) {
        try {
            async function findById(id) {
                try {
                    const wallet = await walletsModel.findById(id)
                    return wallet
                } catch (e) {
                    return null
                }
            }
            const wallet = await findById(req.params.id)
            if (!wallet) {
                res.json({message : "La billetera no existe"})
                return
            }
            res.json(wallet)
        } catch (e) {
            next(e)
        }
    },

    update: async function (req, res, next) {
        try{
            const wallet = await walletsModel.updateOne({_id: req.params.id}, req.body)
            res.json(wallet)

        }catch(e){
            next(e)
        }
    }, 
    delete: async function (req, res, next){
        try{
            const wallet = await walletsModel.deleteOne({_id: req.params.id})
            res.json(wallet)

        }catch(e){
            next(e)

        }
    },
    deleteAll: async function (req, res, next) {
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
    }
    




}