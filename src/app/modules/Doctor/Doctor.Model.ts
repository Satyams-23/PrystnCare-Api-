import { Schema, model } from 'mongoose';
import { DoctorModel, IDoctor } from './Doctor.Interface';

const DoctorSchema = new Schema<IDoctor>({
  Name: {
    type: String,
    required: true,
  },
  About: {
    type: String,
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  education: {
    type: String,
    required: true,
  },
  hospital: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  doctorphoto: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  fees: {
    type: Number,
    required: true,
  },
  availability: {
    type: [
      {
        day: { type: String, required: true },
        time: { type: String, required: true },
      },
    ],
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  reviews: {
    type: [
      {
        patientId: { type: String, required: true },
        review: { type: String, required: true },
      },
    ],
    required: true,
  },
  appointments: {
    type: [
      {
        date: { type: String, required: true },
        time: { type: String, required: true },
        patient: { type: String, required: true },
        status: { type: String, required: true },
      },
    ],
    required: true,
  },
});

export const Doctor: DoctorModel = model<IDoctor, DoctorModel>(
  'Doctor',
  DoctorSchema,
);
