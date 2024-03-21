import httpStatus from 'http-status';
import ApiError from '../../../utils/ApiError';
import { Doctor } from './Doctor.Model';
import { IDoctor } from './Doctor.Interface';
import { IPaginationOPtions } from '../../../Interface/pagination';
import { paginationHelpers } from '../../../helpers/paginationHllper';
import { IGenericResponse } from '../../../Interface/common';
import { FileUploadHelper } from '../../../helpers/FileUploadHelpers';

const createDoctor = async (doctorBody: IDoctor): Promise<IDoctor | null> => {
  const { Name, specialization, experience, About, doctorphoto } = doctorBody;
  if (!doctorphoto) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Image Not Found');
  }

  const uploadedImage = await FileUploadHelper.uploadFile(doctorphoto);
  console.log(uploadedImage);
  if (!uploadedImage) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'internal server error',
    );
  }
  try {
    const doctor = new Doctor({
      Name,
      specialization,
      experience,
      About,
      photodoctor: uploadedImage.secure_url,
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
  const { Name, specialization, photodoctor, experience, About, doctorId } =
    doctorBody;

  try {
    const doctor = await Doctor.findOneAndUpdate(
      { _id: doctorId }, // Query to find the doctor by ID
      {
        Name,
        specialization,
        experience,
        About,
        photodoctor,
      },
      { new: true }, // Option to return the updated document
    );

    // Object.assign(doctor, doctorBody); // Assign the updated doctor details to the doctor object
    return doctor; // Return the updated doctor
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Doctor not found');
  }
};

//get all doctor
const getAllDoctor = async (
  filters: Partial<IDoctor>,
  paginationOptions: Partial<IPaginationOPtions>,
): Promise<IGenericResponse<IDoctor[]>> => {
  try {
    const { page, limit, skip, sortBy, sortOrder } =
      paginationHelpers.caculatePagination(paginationOptions);

    const result = await Doctor.find(filters)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    const total = await Doctor.countDocuments(); //means total number of records in the collection

    return {
      meta: {
        page,
        limit,
        total,
      },
      data: result,
    };
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Doctor not found');
  }
};

const getDoctorById = async (id: string): Promise<IDoctor | null> => {
  try {
    const doctor = await Doctor.findById(id);
    return doctor;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Doctor not found');
  }
};

const deleteDoctor = async (id: string): Promise<IDoctor | null> => {
  try {
    const doctor = await Doctor.findByIdAndDelete(id);
    return doctor;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Doctor not found');
  }
};

export const doctorService = {
  createDoctor,
  editDoctorDetails,
  getAllDoctor,
  getDoctorById,
  deleteDoctor,
};
