"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandlers = exports.checkValidationErrors = void 0;
const express_validator_1 = require("express-validator");
const http_errors_1 = __importDefault(require("http-errors"));
const checkValidationErrors = (request) => {
    const errors = (0, express_validator_1.validationResult)(request);
    if (!errors.isEmpty())
        throw (0, http_errors_1.default)(400, errors);
};
exports.checkValidationErrors = checkValidationErrors;
const errorHandlers = (err, req, res, next) => {
    console.log('THE ERROR', err);
    switch (err.name) {
        case 'ValidationError':
        case 'BadRequestError':
        case 'MongoServerError':
        case 'SyntaxError':
            return res.status(400).send(err);
        case 'UnauthorizedError':
        case 'JsonWebTokenError':
        case 'TokenExpiredError':
            return res.status(401).send(err.message);
        case 'ForbiddenError':
            return res.status(403).send(err.message);
        case 'NotFoundError':
            return res.status(404).send(err);
        default:
            console.log(err);
            return res.status(500).send('Server Error');
    }
};
exports.errorHandlers = errorHandlers;
