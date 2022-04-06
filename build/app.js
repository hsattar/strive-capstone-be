"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const errorHandlers_1 = require("./middleware/errorHandlers");
const users_1 = __importDefault(require("./routes/users"));
const websites_1 = __importDefault(require("./routes/websites"));
const authentication_1 = require("./middleware/authentication");
const public_1 = __importDefault(require("./routes/public"));
const images_1 = __importDefault(require("./routes/images"));
const app = (0, express_1.default)();
const { DB_CONNECTION, PORT } = process.env;
if (!DB_CONNECTION || !PORT)
    throw new Error('DB CONNECTION & PORT REQUIRED');
const whitelist = ['http://localhost:3000', 'https://code-buddy.vercel.app'];
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)(corsOptions));
app.use('/users', users_1.default);
app.use('/public', public_1.default);
app.use('/images', authentication_1.authenticateUser, images_1.default);
app.use('/websites', authentication_1.authenticateUser, websites_1.default);
app.use(errorHandlers_1.errorHandlers);
mongoose_1.default.connect(DB_CONNECTION);
mongoose_1.default.connection.on('connected', () => {
    console.log('DB Connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
mongoose_1.default.connection.on('error', err => console.log(err));
