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
const http_errors_1 = __importDefault(require("http-errors"));
const cloudinary_1 = require("../utils/cloudinary");
const axios_1 = __importDefault(require("axios"));
const websiteSchema_1 = __importDefault(require("../models/websiteSchema"));
const imageRouter = (0, express_1.Router)();
const { UNSPLASH_BASE_URL: URL, UNSPLASH_API_KEY: client_id } = process.env;
if (!URL || !client_id)
    throw new Error('ADD ENV VARIABLES');
imageRouter.post('/:websiteName/upload-image', cloudinary_1.parser.single('image'), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // IMAGE UPLOAD TO CLOUDINARY
    try {
        const { websiteName: name } = req.params;
        if (!((_a = req.file) === null || _a === void 0 ? void 0 : _a.path))
            return next((0, http_errors_1.default)(400, 'File Not Uploaded'));
        const website = yield websiteSchema_1.default.findOneAndUpdate({ name, page: 'home', stage: 'development' }, { $push: { images: req.file.path } });
        console.log(website);
        if (!website)
            return next((0, http_errors_1.default)(404, 'Website Not Found'));
        res.status(201).send(req.file.path);
    }
    catch (error) {
        next(error);
    }
}));
imageRouter.get('/:websiteName/images', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // SEND THE IMAGES UPLOADED FOR THE WEBSITE
        const { websiteName: name } = req.params;
        const websiteImages = yield websiteSchema_1.default.findOne({ name, page: 'home', stage: 'development' }, { images: 1, _id: 0 });
        if (!websiteImages)
            return next((0, http_errors_1.default)(404, 'No Website Images Found'));
        res.send(websiteImages.images);
    }
    catch (error) {
        next(error);
    }
}));
imageRouter.post('/unsplash/downloadImage', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // PROXY ROUTE TO HIDE API KEY WHEN SEARCHING FOR IMAGES
    try {
        const { downloadUrl: url } = req.body;
        const { data } = yield axios_1.default.get(url, { params: { client_id } });
        res.send(data);
    }
    catch (error) {
        next(error);
    }
}));
imageRouter.get('/unsplash/:query/:page/:per_page', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // PROXY ROUTE TO HIDE API KEY WHEN DOWNLOADING AN IMAGE
    try {
        const { query, page, per_page } = req.params;
        const { data } = yield axios_1.default.get(URL, { params: { query, page, per_page, client_id } });
        res.send(data);
    }
    catch (error) {
        next(error);
    }
}));
exports.default = imageRouter;
