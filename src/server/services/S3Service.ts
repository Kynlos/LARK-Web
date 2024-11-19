import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { UserFile } from '../models/UserFile';

export class S3Service {
  private s3Client: S3Client;
  private bucket: string;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
    this.bucket = process.env.AWS_S3_BUCKET || '';
  }

  async uploadFile(file: UserFile): Promise<string> {
    const key = `${file.userId}/${file.path}/${file.name}`.replace(/^\/+/, '');
    
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: Buffer.from(file.content),
      ContentType: file.mimeType || 'application/octet-stream',
    });

    await this.s3Client.send(command);
    return key;
  }

  async generatePublicUrl(file: UserFile): Promise<string> {
    const key = `${file.userId}/${file.path}/${file.name}`.replace(/^\/+/, '');
    
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    // Generate a URL that expires in 7 days
    const url = await getSignedUrl(this.s3Client, command, { expiresIn: 7 * 24 * 60 * 60 });
    return url;
  }

  async downloadFile(key: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    const response = await this.s3Client.send(command);
    return Buffer.from(await response.Body.transformToByteArray());
  }
}
