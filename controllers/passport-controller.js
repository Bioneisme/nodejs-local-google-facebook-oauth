const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const User = require('../models/user-model')
const userService = require('../services/user-service')

module.exports = function (passport) {
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    passport.deserializeUser((id, done) => {
        User.findById(id, function (err, user) {
            done(err, user)
        })
    })

    passport.use('local', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        async (req, username, password, done) => {
            try {
                await userService.login(req, username, password, done)
            } catch (e) {
                console.log(e)
            }
        }
    ))

    passport.use(new GoogleStrategy({
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.URL + "/api/google/callback"
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const email = (profile.email == null) ? profile.emails[0].value : profile.email
                    const nickname = email.split('@')[0]
                    await userService.googleAuth(profile.id, profile.name.givenName,
                        profile.name.familyName, email, nickname, profile.photos[0].value, done)
                } catch (e) {
                    console.log(e)
                }
            })
    )

    passport.use(new FacebookStrategy({
                clientID: process.env.FACEBOOK_CLIENT_ID,
                clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
                callbackURL: process.env.URL + "/api/facebook/callback",
                profileFields: ['id', 'email', 'name', 'gender', 'picture']
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const prof = profile._json
                    const nickname = prof.email.split('@')[0]
                    await userService.facebookAuth(prof.id, prof.first_name,
                        prof.last_name, prof.email, nickname, prof.picture.data.url, done)
                } catch (e) {
                    console.log(e)
                }
            })
    )
}