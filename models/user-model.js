const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    first_name: {type: String},
    last_name: {type: String},
    email: {type: String, required: true, unique: true},
    nickname: {type: String, unique: true},
    password: {type: String},
    image: {type: String},
    googleId: {type: String},
    facebookId: {type: String},
    isActivated: {type: Boolean, default: false},
    activationLink: {type: String},
    roles:{type: []},
})

module.exports = model("User", userSchema)