/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
import { Injectable } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_KEY,
      api_secret: process.env.CLOUDINARY_SECRET,
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'avatars' },
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined,
        ) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            return reject(
              new Error(`Cloudinary upload failed: ${error.message}`),
            );
          }
          if (!result) {
            return reject(
              new Error('Cloudinary upload failed with no response.'),
            );
          }
          resolve(result.secure_url);
        },
      );
      uploadStream.end(file.buffer);
    });
  }
}
