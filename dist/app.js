"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const Routes_1 = __importDefault(require("./app/Routes"));
const config_1 = __importDefault(require("./config"));
const http_status_1 = __importDefault(require("http-status"));
const globalErrorHandler_1 = __importDefault(require("./middleware/globalErrorHandler"));
const app = (0, express_1.default)();
app.set('view engine', 'ejs'); // set the view engine to ejs
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true })); //
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use((0, express_session_1.default)({
    secret: config_1.default.session_secret,
    resave: false, //
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true },
}));
app.use('/api/v1/', Routes_1.default);
// Handle Error Handler
app.use(globalErrorHandler_1.default);
// handle not found
app.use((req, res, next) => {
    res.status(http_status_1.default.NOT_FOUND).json({
        success: false,
        message: 'Not Found',
        errorMessage: [
            {
                path: req.originalUrl,
                message: 'API NotFound',
            },
        ],
    });
    next();
});
exports.default = app;
