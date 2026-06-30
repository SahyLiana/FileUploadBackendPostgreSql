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
    cloudinary.config(); // Or your manual config
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: 'avatars' },
          (
            error: UploadApiErrorResponse | undefined,
            result: UploadApiResponse | undefined,
          ) => {
            // 1. Handle the error first
            if (error) return reject(error);

            // 2. Explicitly check if result is missing (satisfies TypeScript)
            if (!result)
              return reject(
                new Error('Cloudinary upload failed with no response.'),
              );

            // 3. Safe to resolve now! TS knows 'result' is defined here
            resolve(result.secure_url);
          },
        )
        .end(file.buffer);
    });
  }
}
