const express = require('express')
const config = require('config')
const mongoose = require('mongoose')

const app = express()

const AuthRoute = require('./routes/auth.routes')
app.use('/api/auth', AuthRoute)

const PORT = config.get('BACKEND_PORT') || 5000

async function start() {
    try {
        await mongoose.connect(config.get('MONGO_URI'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        app.listen(PORT, () => console.log(`Backend server has been started on port ${PORT}...`))
    } catch (e) {
        console.log('Backend server error: ', e.message)
        process.exit(1)
    }
}

start()

