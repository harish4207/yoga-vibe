"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const User_1 = require("../models/User");
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await User_1.User.findById(id);
        done(null, user);
    }
    catch (err) {
        done(err, undefined);
    }
});
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URI,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User_1.User.findOne({ email: profile.emails?.[0].value });
        if (!user) {
            user = await User_1.User.create({
                name: profile.displayName,
                email: profile.emails?.[0].value,
                password: Math.random().toString(36).slice(-8), // random password
                profilePicture: profile.photos?.[0].value,
                role: 'user',
            });
        }
        return done(null, user);
    }
    catch (err) {
        return done(err, undefined);
    }
}));
exports.default = passport_1.default;
