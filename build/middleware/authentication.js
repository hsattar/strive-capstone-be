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
exports.authenticateUser = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const jwt_1 = require("../utils/jwt");
const { JWT_ACCESS_KEY: ACCESS_KEY } = process.env;
if (!ACCESS_KEY)
    throw new Error('Provide ACCESS KEY AND REFRESH KEY');
const authenticateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { accessToken } = req.cookies;
        const _id = yield (0, jwt_1.verifyJwtToken)(accessToken, ACCESS_KEY);
        if (!_id)
            return next((0, http_errors_1.default)(401, 'Invalid Details'));
        req.user = _id;
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.authenticateUser = authenticateUser;
