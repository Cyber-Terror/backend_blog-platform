import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadsService {
  saveFile(file: Express.Multer.File): { url: string } {
    return { url: `/uploads/${file.filename}` };
  }
}
