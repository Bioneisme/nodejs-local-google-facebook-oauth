const express = require('express')
const router = express.Router()
const passport = require('passport')
const authController = require('../controllers/auth-controller')

router.post('/login', passport.authenticate('local', {
    successRedirect: "/profile",
    failureRedirect: "/login"
}))

router.post('/register', authController.registration, passport.authenticate('local', {
    successRedirect: "/profile",
    failureRedirect: "/register"
}))

router.get('/google', passport.authenticate('google', {
    scope: ['email', 'profile'],
}))

router.get('/google/callback', passport.authenticate('google', {
    successRedirect: "/profile",
    failureRedirect: "/login"
}))

router.get('/facebook', passport.authenticate('facebook'))

router.get('/facebook/callback', passport.authenticate('facebook', {
    successRedirect: "/profile",
    failureRedirect: "/login"
}))

router.get('/logout', authController.logout)

module.exports = router