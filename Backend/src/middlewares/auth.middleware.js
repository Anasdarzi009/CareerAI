const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")



const mongoose = require("mongoose");

async function authUser(req, res, next) {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Token not provided."
        });
    }

    try {
        if (mongoose.connection.readyState === 1) {
            const isTokenBlacklisted = await tokenBlacklistModel.findOne({ token }).maxTimeMS(2000).catch(() => null);
            if (isTokenBlacklisted) {
                return res.status(401).json({
                    message: "token is invalid"
                });
            }
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            message: "Invalid token."
        });
    }
}


module.exports = { authUser }