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
exports.verifyTokenAndRegenrate = exports.verifyJwtToken = exports.createNewTokens = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserSchema_1 = __importDefault(require("../models/UserSchema"));
const { JWT_ACCESS_KEY: ACCESS_KEY, JWT_REFRESH_KEY: REFRESH_KEY } = process.env;
if (!ACCESS_KEY || !REFRESH_KEY)
    throw new Error('Provide ACCESS KEY AND REFRESH KEY');
const createNewTokens = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = yield generateJwtToken({ _id: user._id }, ACCESS_KEY, '15 m');
        const refreshToken = yield generateJwtToken({ _id: user._id }, REFRESH_KEY, '1 week');
        user.refreshToken = refreshToken;
        yield user.save();
        return { accessToken, refreshToken };
    }
    catch (error) {
        console.log(error);
        throw new Error('Could not create tokens');
    }
});
exports.createNewTokens = createNewTokens;
const generateJwtToken = (payload, secret, expiresIn) => new Promise((resolve, reject) => jsonwebtoken_1.default.sign(payload, secret, { expiresIn }, (err, token) => {
    if (err)
        return reject(err);
    resolve(token);
}));
const verifyJwtToken = (token, secret) => new Promise((resolve, reject) => jsonwebtoken_1.default.verify(token, secret, (err, payload) => {
    if (err)
        return reject(err);
    resolve(payload);
}));
exports.verifyJwtToken = verifyJwtToken;
const verifyTokenAndRegenrate = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = yield (0, exports.verifyJwtToken)(token, REFRESH_KEY);
        if (!_id)
            throw (0, http_errors_1.default)(401, 'Invalid Token');
        const user = yield UserSchema_1.default.findById(_id);
        if (!user)
            throw (0, http_errors_1.default)(404, 'User not found');
        const { accessToken, refreshToken } = yield (0, exports.createNewTokens)(user);
        return { accessToken, refreshToken };
    }
    catch (error) {
        console.log(error);
        throw (0, http_errors_1.default)(401, 'Invalid Token');
    }
});
exports.verifyTokenAndRegenrate = verifyTokenAndRegenrate;
