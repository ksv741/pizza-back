const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const path = require('path')

const app = express()

const AuthRoute = require('./routes/auth.routes')
const OrderRoute = require('./routes/order.routes')
const HistoryRoute = require('./routes/history.routes')

app.use(express.json({extended: true}))
app.use('/api/auth', AuthRoute)
app.use('/api/order', OrderRoute)
app.use('/api/history', HistoryRoute)

if(process.env.NODE_ENV === 'production'){
    app.use('/', express.static(path.join(__dirname, 'client', 'dist')))

    app.get('*', (req, res)=>{
        res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'))
    })
}

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

