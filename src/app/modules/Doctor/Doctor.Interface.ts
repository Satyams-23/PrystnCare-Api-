import mongoose, { Model } from 'mongoose';

export type IDoctor = {
  doctorId: mongoose.Types.ObjectId;
  Name: string;
  About: string;
  photodoctor: string;

  specialization: string;
  experience: string;
  education: string;
  hospital: string;
  address: string;
  doctorphoto: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  fees: number;
  availability: Availability[];
  rating: number;
  reviews: review[];
  appointments: Appointment[];
};

export type Availability = {
  day: string;
  time: string;
};
export type review = {
  patientId: mongoose.Types.ObjectId;
  review: string;
  reviews: string[];
};

export type Appointment = {
  date: string;
  time: string;
  patient: string;
  status: string;
};

export type DoctorModel = Model<IDoctor & mongoose.Document>;
