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
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const UserSchema = new mongoose_1.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    avatar: { type: String, default: function () { return `https://ui-avatars.com/api/?name=${this.firstName}+${this.lastName}`; } },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    websites: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Website' }],
    refreshToken: String
});
UserSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified('password')) {
            const hashedPassword = yield bcrypt_1.default.hash(this.password, 11);
            this.password = hashedPassword;
        }
        next();
    });
});
UserSchema.methods.toJSON = function () {
    const userObject = this.toObject();
    delete userObject.__v;
    delete userObject.password;
    delete userObject.refreshToken;
    return userObject;
};
UserSchema.statics.authenticate = function (email, plainPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield this.findOne({ email });
        if (!user)
            return null;
        const passwordsMatch = yield bcrypt_1.default.compare(plainPassword, user.password);
        if (!passwordsMatch)
            return null;
        return user;
    });
};
const UserModel = (0, mongoose_1.model)('User', UserSchema);
exports.default = UserModel;
