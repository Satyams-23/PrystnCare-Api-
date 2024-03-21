import express from 'express';
import { doctorController } from './Doctor.Controller';

const router = express.Router();

router.post('/create', doctorController.createDoctor); // Use multer().single() method
router.get('/getAll', doctorController.getAllDoctor);
router.put('/edit', doctorController.editDoctorDetails);
router.delete('/delete', doctorController.deleteDoctor);
router.get('/getById', doctorController.getDoctorById);

export const DoctorRoutes = router;
