import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../../../Shared/catchAsync';
import pick from '../../../Shared/pick';
import { paginationFields } from '../../../Constant/pagination';
import sendResponse from '../../../Shared/sendResponse';
// import ApiError from '../../../utils/ApiError';
import { doctorService } from './Doctor.Service';

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  try {
    const data = req.body;

    const doctor = await doctorService.createDoctor(data);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Doctor created successfully',
      data: doctor,
    });
  } catch (error) {
    sendResponse(res, {
      success: false,
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: `${error}`,
      data: null,
    });
  }
});

const getAllDoctor = catchAsync(async (req: Request, res: Response) => {
  try {
    const filters = pick(req.query, paginationFields);
    const paginationOptions = pick(req.query, paginationFields);
    const data = await doctorService.getAllDoctor(filters, paginationOptions);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Doctor fetched successfully',
      data: data,
    });
  } catch (error) {
    sendResponse(res, {
      success: false,
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: `${error}`,
      data: null,
    });
  }
});

const editDoctorDetails = catchAsync(async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const doctor = await doctorService.editDoctorDetails(data);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Doctor updated successfully',
      data: doctor,
    });
  } catch (error) {
    sendResponse(res, {
      success: false,
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: `${error}`,
      data: null,
    });
  }
});

const getDoctorById = catchAsync(async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const doctor = await doctorService.getDoctorById(id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Doctor fetched successfully',
      data: doctor,
    });
  } catch (error) {
    sendResponse(res, {
      success: false,
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: `${error}`,
      data: null,
    });
  }
});

const deleteDoctor = catchAsync(async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const doctor = await doctorService.deleteDoctor(id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Doctor deleted successfully',
      data: doctor,
    });
  } catch (error) {
    sendResponse(res, {
      success: false,
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: `${error}`,
      data: null,
    });
  }
});

export const doctorController = {
  createDoctor,
  getAllDoctor,
  editDoctorDetails,
  getDoctorById,
  deleteDoctor,
};
