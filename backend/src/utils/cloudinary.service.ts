import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse, UploadApiOptions } from 'cloudinary';

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  original_filename: string;
  bytes: number;
  format: string;
  resource_type: string;
  created_at: string;
  width?: number;
  height?: number;
  folder: string;
}

export enum UploadType {
  USER_PROFILE = 'user_profile',
  VEHICLE_IMAGE = 'vehicle_image',
  DOCUMENT = 'document',
}

interface UploadConfig {
  folder: string;
  maxSizeBytes: number;
  allowedFormats: string[];
  transformations?: UploadApiOptions['transformation'];
}

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
      secure: true,
    });
    this.logger.log('Cloudinary service initialized');
  }

  private getUploadConfig(uploadType: UploadType): UploadConfig {
    const configs: Record<UploadType, UploadConfig> = {
      [UploadType.USER_PROFILE]: {
        folder: 'car-rental/users/profiles',
        maxSizeBytes: 2 * 1024 * 1024,
        allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
        transformations: {
          width: 400,
          height: 400,
          crop: 'fill',
          gravity: 'face',
          quality: 'auto',
          fetch_format: 'auto',
        },
      },
      [UploadType.VEHICLE_IMAGE]: {
        folder: 'car-rental/vehicles/images',
        maxSizeBytes: 8 * 1024 * 1024,
        allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
        transformations: {
          width: 1200,
          height: 800,
          crop: 'fill',
          quality: 'auto',
          fetch_format: 'auto',
        },
      },
      [UploadType.DOCUMENT]: {
        folder: 'car-rental/documents',
        maxSizeBytes: 10 * 1024 * 1024,
        allowedFormats: ['pdf', 'jpg', 'jpeg', 'png'],
      },
    };
    return configs[uploadType];
  }

  private validateFile(file: Express.Multer.File, config: UploadConfig): void {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (file.size > config.maxSizeBytes) {
      const maxMB = (config.maxSizeBytes / (1024 * 1024)).toFixed(1);
      throw new BadRequestException(`File size exceeds ${maxMB}MB`);
    }

    const ext = file.originalname.split('.').pop()?.toLowerCase();
    if (!ext || !config.allowedFormats.includes(ext)) {
      throw new BadRequestException(
        `Invalid file format. Allowed: ${config.allowedFormats.join(', ')}`,
      );
    }
  }

  private generatePublicId(
    folder: string,
    entityType: string,
    entityId: string | number,
    uploadType: UploadType,
  ): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${folder}/${entityType}/${entityId}/${uploadType}_${timestamp}_${random}`;
  }

  async uploadFile(
    file: Express.Multer.File,
    uploadType: UploadType,
    options: { entityId?: string | number; entityType?: string } = {},
  ): Promise<CloudinaryUploadResult> {
    const config = this.getUploadConfig(uploadType);
    this.validateFile(file, config);

    const publicId = options.entityId && options.entityType
      ? this.generatePublicId(config.folder, options.entityType, options.entityId, uploadType)
      : `${config.folder}/${uploadType}_${Date.now()}`;

    this.logger.log(`Uploading ${uploadType}: ${file.originalname}`);

    const uploadOptions: UploadApiOptions = {
      public_id: publicId,
      resource_type: 'auto',
      folder: config.folder,
    };

    if (config.transformations) {
      uploadOptions.transformation = config.transformations;
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error: any, result: UploadApiResponse) => {
          if (error) {
            this.logger.error(`Upload failed: ${error.message}`);
            return reject(new BadRequestException(`Upload failed: ${error.message}`));
          }
          resolve({
            public_id: result.public_id,
            secure_url: result.secure_url,
            url: result.url,
            original_filename: result.original_filename,
            bytes: result.bytes,
            format: result.format,
            resource_type: result.resource_type,
            created_at: result.created_at,
            width: result.width,
            height: result.height,
            folder: result.folder,
          });
        },
      );
      uploadStream.end(file.buffer);
    });
  }

  async deleteFile(publicId: string): Promise<void> {
    try {
      this.logger.log(`Deleting file: ${publicId}`);
      const result = await cloudinary.uploader.destroy(publicId);
      if (result.result !== 'ok' && result.result !== 'not found') {
        throw new BadRequestException(`Delete failed: ${result.result}`);
      }
      this.logger.log(`Deleted file: ${publicId}`);
    } catch (error: any) {
      this.logger.error(`Delete error: ${error.message}`);
      throw error;
    }
  }

  extractPublicIdFromUrl(url: string): string {
    try {
      // Extract last part before extension
      const matches = url.match(/\/([^\/]+)\.[^\/]+$/);
      if (matches && matches[1]) return matches[1];

      // Fallback: parse folder and filename without extension
      const parts = url.split('/');
      const fileWithExt = parts.pop() || '';
      const fileName = fileWithExt.split('.')[0];
      const folderParts = parts.slice(parts.findIndex(p => p === 'car-rental'));
      folderParts.push(fileName);
      return folderParts.join('/');
    } catch {
      this.logger.warn(`Could not extract public_id from URL: ${url}`);
      return url;
    }
  }
}
