"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import { UserRoutes } from "../modules/User/User.Route";
const Auth_Route_1 = require("../modules/Auth/Auth.Route");
// import { AdminRoutes } from "../modules/Admin/Admin.Route";
// import { PatientRoutes } from "../modules/Patient/Patient.Route";
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/users',
        // route: UserRoutes,
    },
    {
        path: '/auth',
        route: Auth_Route_1.AuthRoutes,
    },
    {
        path: '/admin',
        // route: AdminRoutes,
    },
    {
        path: '/patient',
        // route: PatientRoutes,
    },
];
moduleRoutes
    .filter(route => route.route !== undefined)
    .forEach(route => {
    if (route.route) {
        router.use(route.path, route.route);
    }
});
// router.use('/users/', UserRoutes);
// router.use('/academic-semesters', SemesterRoutes);
exports.default = router;
