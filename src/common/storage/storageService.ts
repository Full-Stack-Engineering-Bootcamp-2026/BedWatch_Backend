import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { Service } from "typedi";

import { s3Client } from "../../config/backblaze";

@Service()
export class StorageService {
  public async uploadFile(
    file: Express.Multer.File,
    fileName: string,
  ): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: process.env.B2_BUCKET_NAME,

      Key: fileName,

      Body: file.buffer,

      ContentType: file.mimetype,
    });

    await s3Client.send(command);
  }

  public async getSignedFileUrl(fileName: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: process.env.B2_BUCKET_NAME,

      Key: fileName,
    });

    return await getSignedUrl(s3Client, command, {
      expiresIn: 60 * 60 * 24 * 7,
    });
  }

  public async deleteFile(fileName: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: process.env.B2_BUCKET_NAME,

      Key: fileName,
    });

    await s3Client.send(command);
  }
}
