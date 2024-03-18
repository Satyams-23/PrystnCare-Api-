import mongoose, { Schema, model } from 'mongoose';
import { DoctorModel, IDoctor } from './Doctor.Interface';
// import { Schema } from 'zod';

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
    type: Array, //
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  reviews: {
    type: Array,
    required: true,
  },
  appointments: {
    type: Array,
    required: true,
  },
});

export const Doctor: DoctorModel = model<IDoctor, DoctorModel>(
  'Doctor',
  DoctorSchema,
);
