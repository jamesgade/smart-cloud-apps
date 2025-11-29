import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  S3Client,
  GetObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class S3Service {
  private readonly s3: S3Client;
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: PinoLogger
  ) {
    const awsRegion = this.configService.get<string>('AWS_REGION') || '';
    const awsAccessKeyId =
      this.configService.get<string>('AWS_ACCESS_KEY_ID') || '';
    const awsSecretAccessKey =
      this.configService.get<string>('AWS_SECRET_ACCESS_KEY') || '';
    this.s3 = new S3Client({
      region: awsRegion,
      credentials: {
        accessKeyId: awsAccessKeyId,
        secretAccessKey: awsSecretAccessKey,
      },
    });
    this.logger.setContext(S3Service.name);
  }
  async uploadToS3Bucket(
    key: string,
    base64Data: any,
    ContentType: any,
    s3BucketName?: string
  ): Promise<string> {
    try {
      const bucketName =
        s3BucketName || this.configService.get<string>('S3_BUCKET_NAME') || '';
      const upload_params = {
        Bucket: bucketName,
        Key: key,
        ContentType: ContentType,
      };

      const buffer = Buffer.from(base64Data, 'base64');
      const { UploadId } = await this.s3.send(
        new CreateMultipartUploadCommand(upload_params)
      );

      const fileSize = buffer.length;
      const partSize = 1024 * 1024 * 5;
      const partCount = Math.ceil(fileSize / partSize);

      const uploadPromises = [];

      for (let i = 0; i < partCount; i++) {
        const start = i * partSize;
        const end = Math.min(start + partSize, fileSize);

        uploadPromises.push(
          this.s3.send(
            new UploadPartCommand({
              Bucket: bucketName,
              Key: key,
              UploadId: UploadId,
              Body: buffer.subarray(start, end),
              PartNumber: i + 1,
            })
          )
        );
      }

      const uploadResults = await Promise.all(uploadPromises);

      await this.s3.send(
        new CompleteMultipartUploadCommand({
          Bucket: bucketName,
          Key: key,
          UploadId: UploadId,
          MultipartUpload: {
            Parts: uploadResults.map(({ ETag }, i) => ({
              ETag,
              PartNumber: i + 1,
            })),
          },
        })
      );
      return key;
    } catch (error) {
      this.logger.error(
        { error: error.message, stack: error.stack },
        'Error uploading file to S3'
      );
      throw new HttpException(
        `File not Upload ${error}.`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async bulkUploadFileToS3Bucket(
    key: string,
    base64Data: any,
    ContentType: any,
    payload: any,
    s3BucketName?: string,
  ): Promise<string> {
    try {
      const bucketName =
        s3BucketName || this.configService.get<string>('S3_BUCKET_NAME') || '';
      const uploadParams = {
        Bucket: bucketName,
        Key: key,
        ContentType: ContentType,
        Metadata: {
          customerId: payload.customerId,
          fileType: payload.fileType,
          user: JSON.stringify(payload.user),
          uploadBulkHistoryId: payload.uploadBulkHistoryId
        },
      };

      const buffer = Buffer.from(base64Data, 'base64');
      const { UploadId } = await this.s3.send(
        new CreateMultipartUploadCommand(uploadParams)
      );

      const fileSize = buffer.length;
      const partSize = 1024 * 1024 * 5;
      const partCount = Math.ceil(fileSize / partSize);

      const uploadPromises = [];

      for (let i = 0; i < partCount; i++) {
        const start = i * partSize;
        const end = Math.min(start + partSize, fileSize);

        uploadPromises.push(
          this.s3.send(
            new UploadPartCommand({
              Bucket: bucketName,
              Key: key,
              UploadId: UploadId,
              Body: buffer.subarray(start, end),
              PartNumber: i + 1,
            })
          )
        );
      }

      const uploadResults = await Promise.all(uploadPromises);

      await this.s3.send(
        new CompleteMultipartUploadCommand({
          Bucket: bucketName,
          Key: key,
          UploadId: UploadId,
          MultipartUpload: {
            Parts: uploadResults.map(({ ETag }, i) => ({
              ETag,
              PartNumber: i + 1,
            })),
          },
        })
      );
      return key;
    } catch (error) {
      this.logger.error(
        { error: error.message, stack: error.stack },
        'Error uploading file to S3'
      );
      throw new HttpException(
        `File not Upload ${error}.`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async generatePresignedUrl(
    fileName: string,
    urlExpires = 3600,
    s3BucketName?: string
  ): Promise<string> {
    const bucketName =
      s3BucketName || this.configService.get<string>('S3_BUCKET_NAME') || '';
    const url = new GetObjectCommand({ Bucket: bucketName, Key: fileName });
    return await getSignedUrl(this.s3, url, { expiresIn: urlExpires });
  }

  async checkFileExists(fileName: string, s3BucketName?: string): Promise<any> {
    const bucketName =
      s3BucketName || this.configService.get<string>('S3_BUCKET_NAME') || '';
    const command = new HeadObjectCommand({
      Bucket: bucketName,
      Key: fileName,
    });

    try {
      const fileInfo = await this.s3.send(command);
      return true;
    } catch (error) {
      this.logger.error(
        { error: error.message, stack: error.stack },
        'Error checking file existence'
      );
      return false;
    }
  }
}
