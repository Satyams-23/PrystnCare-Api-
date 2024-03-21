import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
// import path from 'path';

cloudinary.config({
  cloud_name: 'dfpw2whey',
  api_key: '319733267777269',
  api_secret: 'XBZiFYMaw0EfOqKVarJwaoYnzBU',
});

const FileUploadHelpers = {
  uploadFile: async (file: string) => {
    try {
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: 'doctor',
      });
      fs.unlinkSync(file.tempFilePath);

      return result;
    } catch (error) {
      throw new Error(`${error}`);
    }
  },
};

export const FileUploadHelper = FileUploadHelpers;
