"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accessTokenValidation = exports.userRefreshTokenValidation = exports.userLoginValidation = exports.userRegistrationValidation = void 0;
const express_validator_1 = require("express-validator");
exports.userRegistrationValidation = (0, express_validator_1.checkSchema)({
    firstName: {
        in: ['body'],
        isLength: {
            options: { min: 1 },
            errorMessage: 'firstName Required'
        }
    },
    lastName: {
        in: ['body'],
        isLength: {
            options: { min: 1 },
            errorMessage: 'lastName Required'
        }
    },
    email: {
        in: ['body'],
        isLength: {
            options: { min: 1 },
            errorMessage: 'email Required'
        }
    },
    password: {
        in: ['body'],
        isLength: {
            options: { min: 1 },
            errorMessage: 'password Required'
        }
    }
});
exports.userLoginValidation = (0, express_validator_1.checkSchema)({
    email: {
        in: ['body'],
        isLength: {
            options: { min: 1 },
            errorMessage: 'email Required'
        }
    },
    password: {
        in: ['body'],
        isLength: {
            options: { min: 1 },
            errorMessage: 'password Required'
        }
    }
});
exports.userRefreshTokenValidation = (0, express_validator_1.checkSchema)({
    refreshToken: {
        in: ['cookies'],
        isLength: {
            options: { min: 1 },
            errorMessage: 'refreshToken Required'
        }
    }
});
exports.accessTokenValidation = (0, express_validator_1.checkSchema)({
    accessToken: {
        in: ['cookies'],
        isLength: {
            options: { min: 1 },
            errorMessage: 'refreshToken Required'
        }
    }
});
