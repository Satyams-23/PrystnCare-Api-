"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_Route_1 = require("../modules/User/User.Route");
const Auth_Route_1 = require("../modules/Auth/Auth.Route");
const Admin_Route_1 = require("../modules/Admin/Admin.Route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/users",
        route: User_Route_1.UserRoutes,
    },
    {
        path: "/auth",
        route: Auth_Route_1.AuthRoutes,
    },
    {
        path: "/admin",
        route: Admin_Route_1.AdminRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
// router.use('/users/', UserRoutes);
// router.use('/academic-semesters', SemesterRoutes);
exports.default = router;
