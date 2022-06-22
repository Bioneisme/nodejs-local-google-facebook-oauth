const bcrypt = require('bcrypt')
const User = require('../models/user-model')
const UserDto = require('../dtos/user-dto')

class UserService{
    async login(req, email, password, done){
        const user = await User.findOne({email: email})
            if (!user) {
            return done("User with this email doesnt exist", false)
        }
        const isPassEquals = await bcrypt.compare(password, user.password)
        if (!isPassEquals) {
            return done("Incorrect email or password", false)
        }
        const userDto = new UserDto(user)

        done(null, user)
        return {user: userDto}
    }
    async registration(email, nickname, first_name, last_name, password) {
        const hashPassword = await bcrypt.hash(password, 4)
        const user = await User.create({
            email,
            nickname,
            first_name,
            last_name,
            password: hashPassword,
            roles: ["USER"]
        })
        const userDto = new UserDto(user)

        return {user: userDto}
    }
    async googleAuth(googleId, first_name, last_name, email, nickname, image = null, done) {
        let user = await User.findOne({email: email});
        if (user) {
            done(null, user)
        } else {
            user = await User.create({
                googleId,
                image,
                first_name,
                last_name,
                email,
                nickname,
                roles: ["USER"],
                isActivated: true
            })
            done(null, user)
        }
        const userDto = new UserDto(user)

        return {user: userDto}
    }
    async facebookAuth(facebookId, first_name, last_name, email, nickname, image = null, done) {
        let user = await User.findOne({email: email});
        if (user) {
            done(null, user)
        } else {
            user = await User.create({
                facebookId,
                image,
                first_name,
                last_name,
                email,
                nickname,
                roles: ["USER"],
                isActivated: true
            })
            done(null, user)
        }
        const userDto = new UserDto(user)

        return {user: userDto}
    }

}

module.exports = new UserService()