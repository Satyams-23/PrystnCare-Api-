import express from 'express';
// import { UserRoutes } from "../modules/User/User.Route";
import { AuthRoutes } from '../modules/Auth/Auth.Route';
// import { AdminRoutes } from "../modules/Admin/Admin.Route";
// import { PatientRoutes } from "../modules/Patient/Patient.Route";
import { DoctorRoutes } from '../modules/Doctor/Doctor.Route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/users',
    // route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/admin',
    // route: AdminRoutes,
  },

  {
    path: '/doctor',
    route: DoctorRoutes,
  },
];

moduleRoutes.forEach(route => {
  if (route.route) {
    router.use(route.path, route.route);
  }
});

// router.use('/users/', UserRoutes);
// router.use('/academic-semesters', SemesterRoutes);

export default router;
