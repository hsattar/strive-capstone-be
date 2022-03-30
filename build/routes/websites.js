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
const errorHandlers_1 = require("../middleware/errorHandlers");
const websiteValidation_1 = require("../middleware/websiteValidation");
const UserSchema_1 = __importDefault(require("../models/UserSchema"));
const websiteSchema_1 = __importDefault(require("../models/websiteSchema"));
const websiteRouter = (0, express_1.Router)();
websiteRouter.route('/')
    .get((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // GET ALL USERS WEBSITES TO DISPLAY ON THE HOME PAGE 
    try {
        const websites = yield websiteSchema_1.default.find({ owner: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id, page: 'home', stage: 'development' });
        res.send(websites);
    }
    catch (error) {
        next(error);
    }
}))
    .post(websiteValidation_1.createWebsiteValidation, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    // ADD NEW WEBSITE
    // TODO: IF ANY OF THESE STEPES FAIL I SHOULD REMOVE THE PREVIOUS STEPS
    try {
        (0, errorHandlers_1.checkValidationErrors)(req);
        const website = yield new websiteSchema_1.default(Object.assign(Object.assign({}, req.body), { owner: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id })).save();
        if (!website)
            return next((0, http_errors_1.default)(400, 'Website Not Created'));
        const user = yield UserSchema_1.default.findById((_c = req.user) === null || _c === void 0 ? void 0 : _c._id);
        user === null || user === void 0 ? void 0 : user.websites.push(website._id);
        yield user.save();
        res.status(201).send(website);
    }
    catch (error) {
        next(error);
    }
}));
websiteRouter.route('/:websiteName')
    .get((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    // SEND THE LIST OG WEBSITE PAGES FOR CURRENT WEBSITE USER IS EDITING TO DISPLAY IN SIDEBAR
    try {
        const { websiteName: name } = req.params;
        const websites = yield websiteSchema_1.default.find({ name, stage: 'development', owner: (_d = req.user) === null || _d === void 0 ? void 0 : _d._id }, { page: 1, _id: 0 });
        if (websites.length === 0)
            return next((0, http_errors_1.default)(404, `Couldn't find the website`));
        const websitePages = websites.map(website => website.page);
        res.send(websitePages);
    }
    catch (error) {
        next(error);
    }
}))
    .delete((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    // DELETE A WEBSITE => ALL PAGES FROM DEVELOPMENT & PRODUCTION
    try {
        const { websiteName: name } = req.params;
        const websites = yield websiteSchema_1.default.find({ name, owner: (_e = req.user) === null || _e === void 0 ? void 0 : _e._id });
        if (websites.length === 0)
            return next((0, http_errors_1.default)(404, `Couldn't find the website`));
        const deleted = websites.map((website) => __awaiter(void 0, void 0, void 0, function* () {
            var _f;
            yield websiteSchema_1.default.findByIdAndDelete(website._id);
            yield UserSchema_1.default.findByIdAndUpdate((_f = req.user) === null || _f === void 0 ? void 0 : _f._id, { $pull: { websites: website._id } });
        }));
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
}));
websiteRouter.route('/:websiteName/:websitePage')
    .put((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { websiteName: name, websitePage: page } = req.params;
        const { title, description } = req.body;
        const stages = ['development', 'production'];
        stages.map((stage) => __awaiter(void 0, void 0, void 0, function* () { var _g; return yield websiteSchema_1.default.findOneAndUpdate({ name, page, stage, owner: (_g = req.user) === null || _g === void 0 ? void 0 : _g._id }, { title, description }); }));
        res.send('Updated');
    }
    catch (error) {
        next(error);
    }
}))
    .delete((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _h;
    // DELETE A SPECIFIC WEBSITE PAGE FROM BOTH DEV & PRODUCTION
    try {
        const { websiteName: name, websitePage: page } = req.params;
        const websites = yield websiteSchema_1.default.find({ name, page, owner: (_h = req.user) === null || _h === void 0 ? void 0 : _h._id });
        if (websites.length === 0)
            return next((0, http_errors_1.default)(404, `Couldn't find the website`));
        const deleted = websites.map((website) => __awaiter(void 0, void 0, void 0, function* () {
            var _j;
            yield websiteSchema_1.default.findByIdAndDelete(website._id);
            yield UserSchema_1.default.findByIdAndUpdate((_j = req.user) === null || _j === void 0 ? void 0 : _j._id, { $pull: { websites: website._id } });
        }));
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
}));
websiteRouter.route('/:websiteName/:websitePage/details')
    .get((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _k;
    // SEND THE TITLE AND DESCRIPTION FOR THIS PAGE
    try {
        const { websiteName: name, websitePage: page } = req.params;
        const websites = yield websiteSchema_1.default.find({ name, page, stage: 'development', owner: (_k = req.user) === null || _k === void 0 ? void 0 : _k._id }, { title: 1, description: 1, _id: 0 });
        if (websites.length === 0)
            return next((0, http_errors_1.default)(404, `Couldn't find the website`));
        res.send({ title: websites[0].title, description: websites[0].description });
    }
    catch (error) {
        next(error);
    }
}));
websiteRouter.route('/:websiteName/:websitePage/update-details')
    .put((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _l, _m;
    // UPDATE THE WEBSITE TITLE AND DESCRIPTION FOR THIS PAGE
    try {
        const { websiteName: name, websitePage: page } = req.params;
        const { title, description } = req.body;
        const websiteDev = yield websiteSchema_1.default.findOneAndUpdate({ name, page, stage: 'development', owner: (_l = req.user) === null || _l === void 0 ? void 0 : _l._id }, { title, description }, { new: true });
        if (!websiteDev)
            return next((0, http_errors_1.default)(404, `Couldn't find the website`));
        const websiteProduction = yield websiteSchema_1.default.findOneAndUpdate({ name, page, stage: 'production', owner: (_m = req.user) === null || _m === void 0 ? void 0 : _m._id }, { title, description }, { new: true });
        if (!websiteProduction)
            return next((0, http_errors_1.default)(404, `Couldn't find the website`));
        res.send(websiteDev);
    }
    catch (error) {
        next(error);
    }
}));
websiteRouter.route('/:websiteName/:websitePage/:websiteStage')
    .get((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _o;
    // GET THE CODE FOR THE DEVELOPMENT STAGE
    try {
        const { websiteName: name, websitePage: page, websiteStage: stage } = req.params;
        const website = yield websiteSchema_1.default.findOne({ name, page, stage: 'development', owner: (_o = req.user) === null || _o === void 0 ? void 0 : _o._id });
        if (!website)
            return next((0, http_errors_1.default)(404, 'Website Not Found'));
        res.send(website);
    }
    catch (error) {
        next(error);
    }
}))
    .put(websiteValidation_1.saveWebsiteValidation, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _p;
    // UPDATE THE CODE FOR DEVELOPMENT STAGE
    try {
        (0, errorHandlers_1.checkValidationErrors)(req);
        const { websiteName: name, websitePage: page, websiteStage: stage } = req.params;
        const { code, codeBlocks } = req.body;
        const website = yield websiteSchema_1.default.findOneAndUpdate({ name, page, stage: 'development', owner: (_p = req.user) === null || _p === void 0 ? void 0 : _p._id }, { code, codeBlocks });
        if (!website)
            return next((0, http_errors_1.default)(404, 'Website Not Found'));
        res.send(website);
    }
    catch (error) {
        next(error);
    }
}));
websiteRouter.route('/:websiteName/:websitePage/:websiteStage/code')
    .get((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _q;
    // GET THE WEBSITE CODE FOR THE PREVIEW PAGE OR SEND A CUSTOM 404 MESSAGE
    try {
        const { websiteName: name, websitePage: page } = req.params;
        const website = yield websiteSchema_1.default.findOne({ name, page, stage: 'development', owner: (_q = req.user) === null || _q === void 0 ? void 0 : _q._id }, { code: 1, _id: 0 });
        if (!website)
            return res.send('<div class="flex justify-center"><h2 class="mt-12 text-3xl">Website Does Not Exist</h2></div>');
        res.send(website.code);
    }
    catch (error) {
        next(error);
    }
}));
websiteRouter.route('/:websiteName/:websitePage/:websiteStage/publish')
    .put(websiteValidation_1.saveWebsiteValidation, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _r, _s;
    // CREATE OR UPDATE THE PRODUCTIION WEBSITE
    try {
        (0, errorHandlers_1.checkValidationErrors)(req);
        const { websiteName: name, websitePage: page, websiteStage: stage } = req.params;
        const { code } = req.body;
        const website = yield websiteSchema_1.default.findOneAndUpdate({ name, page, stage: 'production', owner: (_r = req.user) === null || _r === void 0 ? void 0 : _r._id }, { code });
        if (!website) {
            const newWebsite = new websiteSchema_1.default({ owner: (_s = req.user) === null || _s === void 0 ? void 0 : _s._id, name, page, stage, code });
            yield newWebsite.save();
            res.status(201).send(newWebsite);
        }
        else {
            res.send(website);
        }
    }
    catch (error) {
        next(error);
    }
}));
exports.default = websiteRouter;
