const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    name: {type: String},
    history: [{type: Types.ObjectId, ref: 'Order'}],
})

module.exports = model('User', schema)
