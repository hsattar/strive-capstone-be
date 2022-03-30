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
const websiteSchema_1 = __importDefault(require("../models/websiteSchema"));
const publicRouter = (0, express_1.Router)();
publicRouter.route('/:websiteName/:websitePage/:websiteStage/code')
    .get((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { websiteName: name, websitePage: page } = req.params;
        const website = yield websiteSchema_1.default.findOne({ name, page, stage: 'production' }, { code: 1, _id: 0 });
        if (!website)
            return res.send('<div class="flex justify-center"><h2 class="mt-12 text-3xl">Website Does Not Exist</h2></div>');
        res.send(website.code);
    }
    catch (error) {
        next(error);
    }
}));
exports.default = publicRouter;
