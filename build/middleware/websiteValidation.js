"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveWebsiteValidation = exports.createWebsiteValidation = void 0;
const express_validator_1 = require("express-validator");
exports.createWebsiteValidation = (0, express_validator_1.checkSchema)({
    name: {
        in: ['body'],
        isLength: {
            options: { min: 1 },
            errorMessage: 'name required'
        }
    },
    page: {
        in: ['body'],
        isLength: {
            options: { min: 1 },
            errorMessage: 'page required'
        }
    },
    stage: {
        in: ['body'],
        isLength: {
            options: { min: 1 },
            errorMessage: 'stage required'
        },
    }
});
exports.saveWebsiteValidation = (0, express_validator_1.checkSchema)({
    code: {
        in: ['body'],
        isLength: {
            options: { min: 1 },
            errorMessage: 'code required'
        }
    }
});
