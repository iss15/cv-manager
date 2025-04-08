import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Cv } from './entities/cv.entity';
import { GetCvFilterDto } from './dto/get-cv-filter.dto';
import { GenericService } from '../common/generic.service';
import * as path from 'path';
import * as fs from 'fs';
import { BlobServiceClient } from '@azure/storage-blob';

@Injectable()
export class CvService extends GenericService<Cv> {
  private blobServiceClient: BlobServiceClient;
  private containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

  constructor(@InjectRepository(Cv) repository: Repository<Cv>) {
    super(repository);
    const account = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;

    const connectionString = `DefaultEndpointsProtocol=https;AccountName=${account};AccountKey=${accountKey};EndpointSuffix=core.windows.net`;
    this.blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  }

  async getFilteredCvs(filterDto: GetCvFilterDto, paginationDto?: PaginationDto) {
    const { search } = filterDto;
    const query = this.repository.createQueryBuilder('cv');

    // Apply search filter if provided
    if (search) {
      query.andWhere(
        '(cv.name LIKE :search OR cv.firstname LIKE :search OR cv.job LIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Apply pagination if paginationDto is provided
    if (paginationDto) {
      const { page = 1, limit = 10 } = paginationDto;
      query.skip((page - 1) * limit).take(limit);
    }

    return await query.getMany();
  }

  async updateCvImage(id: number, imageBuffer: Buffer, filename: string): Promise<Cv> {
    const cv = await this.repository.findOne({ where: { id } }); 
    if (!cv) {
      throw new NotFoundException(`Cv with ID ${id} not found`);
    }

    // Get a reference to the container
    if (!this.containerName) {
      throw new Error('Azure Storage container name is not defined');
    }
    const containerClient = this.blobServiceClient.getContainerClient(this.containerName);

    // Upload the image to Azure Blob Storage
    const blockBlobClient = containerClient.getBlockBlobClient(filename);
    await blockBlobClient.uploadData(imageBuffer, {
      blobHTTPHeaders: { blobContentType: 'image/jpeg' }, // Adjust based on the image type
    });

    // Get the URL of the uploaded image
    const publicUrl = blockBlobClient.url;

    // Update the CV entity with the public URL
    cv.path = publicUrl;
    return this.repository.save(cv);
  }

  async updateCvImageToPublicFolder(id: number, imageBuffer: Buffer, filename: string): Promise<Cv> {
    const cv = await this.repository.findOne({ where: { id } });
    if (!cv) {
      throw new NotFoundException(`Cv with ID ${id} not found`);
    } 
  
    // Define the uploads directory
    const uploadsDir = path.join(__dirname, '../../public/uploads'); 
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true }); // Create the directory if it doesn't exist
    }
  
    // Save the file to the uploads directory
    const filePath = path.join(uploadsDir, filename);console.log(filePath);
    fs.writeFileSync(filePath, imageBuffer);
  
    // Update the CV entity with the relative file path
    cv.path = `/uploads/${filename}`;
    return this.repository.save(cv);
  }
}