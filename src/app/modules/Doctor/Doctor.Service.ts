import httpStatus from 'http-status';
import config from '../../../config';
import ApiError from '../../../utils/ApiError';
import { Doctor } from './Doctor.Model';
import { IDoctor } from './Doctor.Interface';

const createDoctor = async (doctorBody: IDoctor): Promise<IDoctor | null> => {
  const { Name, specialization, photodoctor, experience, About } = doctorBody;

  try {
    const doctor = new Doctor({
      Name,
      specialization,
      experience,
      About,
      photodoctor,
    });

    await doctor.save();
    return doctor;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Doctor already exists');
  }
};

//edit doctor details
const editDoctorDetails = async (
  doctorBody: IDoctor,
): Promise<IDoctor | null> => {
  const { Name, specialization, photodoctor, experience, About } = doctorBody;

  try {
    const doctor = await Doctor.findOneAndUpdate(
      { Name },
      {
        Name,
        specialization,
        experience,
        About,
        photodoctor,
      },
      { new: true }, //
    );
    return doctor;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Doctor not found');
  }
};

//get all doctor
const getAllDoctor = async (filters: Partial<IDoctor>): Promise<IDoctor[]> => {
    const { Name } = filters;


  try
};
