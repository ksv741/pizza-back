const {Router} = require('express')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const {check, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('config')
const auth = require('../middleware/auth.middleware')

const router = Router()

router.post(
    '/signup',
    [
        check('email', 'Wrong email').isEmail(),
        check('password', 'Minimum password length 6').isLength({min: 6}),
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req)
        const {email, password, name} = req.body

        // Email must be unique
        const candidate = await User.findOne({email})
        if (candidate) {
            return res.status(400).json({message: `[Error] User with email ${email.toLowerCase()} is already exist`})
        }

        // Validate email and password
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: `[Error] Incorrect sign up data. ${errors.array()[0].msg}`
            })
        }

        // Create new user
        const hashedPassword = await bcrypt.hash(password, 12)
        const user = new User({email, password: hashedPassword, name})
        await user.save()
        res.status(201).json({message: '[Success] User create'})

    } catch (e) {
        // Simplification: All errors would be return 500 status
        res.status(500).json({message: '[Error] Something goes wrong', error: e})
    }
})

router.post(
    '/signin',
    [
        check('email', 'Wrong email').normalizeEmail().isEmail(),
        check('password', 'Minimum password length 6').isLength({min: 6}),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            const {email, password} = req.body

            // Validate email and password
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: '[Error] Incorrect sign in data'
                })
            }

            // Check credentials
            const user = await User.findOne({email})
            const isPasswordRight = await bcrypt.compare(password, user.password)
            if (!user || !isPasswordRight) {
                return res.status(400).json({message: '[Error] Wrong email/password'})
            }

            // Create JWT
            const token = jwt.sign(
                {userId: user.id},
                config.get('JWT_SECRET'),
                {expiresIn: '1h'}
            )
            res.json({token, userId: user.id, name: user.name})

        } catch (e) {
            // Simplification: All errors would be return 500 status
            res.status(500).json({message: '[Error] Something goes wrong'})
        }
})

router.post(
    '/login',
    auth,
    async (req, res) => {
        try {
            const user = await User.findOne({_id: req.user.userId})

            if (!user) return res.status(400).json({message: '[ERROR] Authorization error'})

            return res.status(200).json({
                user: {
                    name: user.name,
                    email: user.email,
                }
            })
        } catch(e) {
            res.status(400).json({message: `[ERROR] Something goes wrong`})
        }
    }
)

module.exports = router
