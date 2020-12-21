const {Router} = require('express')
const User = require('../models/User')
const Order = require('../models/Order')
const auth = require('../middleware/auth.middleware')


const router = Router()

router.get(
    '/',
    auth,
    async (req, res) => {
        try {
            const user = await User.findOne({_id: req.user.userId})

            if (!user) return res.status(400).json({message: '[ERROR] Authorization error'})

            if (!user.history.length) return res.status(200).json({message: 'No history orders'})

            const orders = []
            async function getOrder(array) {
                for (const order of array) {
                    const result = await Order.findById(order._id)

                    orders.push({
                        order: result.order.map(item => ({alias: item.alias, count: item.count})),
                        time: result.time,
                        paymentMethod: result.paymentMethod,
                        address: result.address
                    });
                }
            }
            await getOrder(user.history)

            res.status(200).json({orders})
        } catch(e) {
            res.status(400).json({message: `[ERROR] ${e.message}`})
        }
    }
)

module.exports = router
