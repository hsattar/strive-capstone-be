"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userValidation_1 = require("../middleware/userValidation");
const UserSchema_1 = __importDefault(require("../models/UserSchema"));
const http_errors_1 = __importDefault(require("http-errors"));
const jwt_1 = require("../utils/jwt");
const errorHandlers_1 = require("../middleware/errorHandlers");
const authentication_1 = require("../middleware/authentication");
const userRouter = (0, express_1.Router)();
const { NODE_ENV } = process.env;
userRouter.get('/me', userValidation_1.accessTokenValidation, authentication_1.authenticateUser, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user)
            return next((0, http_errors_1.default)(400, 'No User'));
        const me = yield UserSchema_1.default.findById(req.user._id);
        res.send(me);
    }
    catch (error) {
        next(error);
    }
}));
userRouter.post('/register', userValidation_1.userRegistrationValidation, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, errorHandlers_1.checkValidationErrors)(req);
        const user = new UserSchema_1.default(req.body);
        yield user.save();
        const { accessToken, refreshToken } = yield (0, jwt_1.createNewTokens)(user);
        res.cookie('accessToken', accessToken, { httpOnly: true, secure: NODE_ENV === "production" ? true : false, sameSite: NODE_ENV === "production" ? "none" : undefined });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: NODE_ENV === "production" ? true : false, sameSite: NODE_ENV === "production" ? "none" : undefined });
        res.status(201).send(user);
    }
    catch (error) {
        next(error);
    }
}));
userRouter.post('/login', userValidation_1.userLoginValidation, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, errorHandlers_1.checkValidationErrors)(req);
        const { email, password } = req.body;
        const user = yield UserSchema_1.default.authenticate(email, password);
        if (!user)
            return next((0, http_errors_1.default)(401, 'Invalid Credentials'));
        const { accessToken, refreshToken } = yield (0, jwt_1.createNewTokens)(user);
        res.cookie('accessToken', accessToken, { httpOnly: true, secure: NODE_ENV === "production" ? true : false, sameSite: NODE_ENV === "production" ? "none" : undefined });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: NODE_ENV === "production" ? true : false, sameSite: NODE_ENV === "production" ? "none" : undefined });
        res.send(user);
    }
    catch (error) {
        next(error);
    }
}));
userRouter.post('/refresh-token', userValidation_1.userRefreshTokenValidation, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, errorHandlers_1.checkValidationErrors)(req);
        const { refreshToken: oldRefreshToken } = req.cookies;
        const { accessToken, refreshToken } = yield (0, jwt_1.verifyTokenAndRegenrate)(oldRefreshToken);
        res.cookie('accessToken', accessToken, { httpOnly: true, secure: NODE_ENV === "production" ? true : false, sameSite: NODE_ENV === "production" ? "none" : undefined });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: NODE_ENV === "production" ? true : false, sameSite: NODE_ENV === "production" ? "none" : undefined });
        res.send('Tokens Sent');
    }
    catch (error) {
        next(error);
    }
}));
exports.default = userRouter;
