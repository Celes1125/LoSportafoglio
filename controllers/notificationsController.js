const notificationsModel = require("../models/notificationsModel");
const usersModel = require("../models/usersModel")


module.exports = {
    create: async function (req, res, next) {
        try {
            const receiverUser = await usersModel.findOne({ email: req.body.receiverEmail })

            if (!receiverUser) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }

            const notification = new notificationsModel({
                senderUser: req.body.senderUser,
                wallet: req.body.wallet,
                receiverEmail: req.body.receiverEmail,
                type: req.body.type,
                status: req.body.status,
                receiverUser: receiverUser._id

            });
            // saving the new notification
            const newNotification = await notification.save();

            // status return
            res.status(201).json(newNotification);
        } catch (e) {
            console.error('Error creating notification:', e.message);
            next(e);
        }
    },

    getAllNotDeleted: async function (req, res, next) {
        try {
            const userId = req.params.userId; // El userId que quieres buscar

            // Buscar notificaciones donde el userId coincida con receiverUserId o senderUserId, y que no estén eliminadas
            const notifications = await notificationsModel.find({
                $or: [
                    { senderUser: userId },  // Condición 1: el userId es el sender
                    { receiverUser: userId } // Condición 2: el userId es el receiver
                ],
                is_deleted: false // Notificaciones no eliminadas
            }).populate({ path: "senderUser", model: "users" })
                .populate({ path: "receiverUser", model: "users" })
                .populate({ path: "wallet", model: "wallets" });;


            res.json(notifications);

        } catch (e) {
            console.error('Error getting notifications:', e.message);
            next(e);
        }
    },
    //fisic delete all notifications
    fisicDeleteAll: async function (req, res, next) {
        try {
            await notificationsModel.deleteMany({});
            res.status(200).send('All notifications have been deleted');
        } catch (e) {
            res.status(500).send('Failed to delete notifications');
            next(e);  // Passes the error to error-handling middleware
        }
    },






}


