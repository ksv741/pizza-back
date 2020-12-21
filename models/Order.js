const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    order: [{
        alias: {type: String, required: true},
        count: {type: Number, required: true, default: 1},
    }],
    paymentMethod: {type: String, default: 'cash'},
    time: {type: Date},
    owner: {type: Types.ObjectId, ref: 'User'},
    address: {type: String, required: true}
})

module.exports = model('Order', schema)
