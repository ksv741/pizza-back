const {Router} = require('express')
const User = require('../models/User')
const Order = require('../models/Order')

const router = Router()

router.post(
    '/make',
    async (req, res) => {
        try {
            const {order, name, email, address, payMethod} = req.body

            if (!name || !email || !address || !Object.keys(order)){
                return res.status(400).json({message: '[ERROR] Incorrect order'})
            }

            const user = await User.findOne({email})
            if (!user) {
                return res.status(200).json({message: 'Success order'})
            }

            const pizzas = order.map(pizza => ({
                    alias: pizza.alias,
                    count: pizza.count,
                })
            )
            const newOrder = new Order({
                order: pizzas,
                payMethod,
                time: new Date(),
                owner: user._id,
                address
            })

            user.history.push(newOrder)
            await user.save()
            await newOrder.save()

            res.status(200).json({message: 'Success order'})
        } catch(e) {
            res.status(400).json({message: `[ERROR] Something goes wrong`})
        }
    }
)

module.exports = router
