import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Cv } from './entities/cv.entity';
import { GetCvFilterDto } from './dto/get-cv-filter.dto';
import { GenericService } from '../common/services/generic.service';
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

  private applyPagination(query: any, paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    query.skip((page - 1) * limit).take(limit);
  }

  async deleteCv(cvId: number, userId: number, role: string): Promise<void> {
    const cv = await this.repository.findOne({ where: { id: cvId } });

    if (!cv) {
      throw new NotFoundException('CV not found.');
    }

    // Check if the user is allowed to delete the CV
    if (role !== 'admin' && cv.userId !== userId) {
      throw new ForbiddenException('You are not allowed to delete this CV.');
    }

    await this.repository.delete(cvId);
  }

  async getFilteredCvs(filterDto: GetCvFilterDto, paginationDto?: PaginationDto) {
    const { search } = filterDto;
    const query = this.repository.createQueryBuilder('cv');
  
    if (search) {
      query.andWhere(
        '(cv.name LIKE :search OR cv.firstname LIKE :search OR cv.job LIKE :search)',
        { search: `%${search}%` },
      );
    }
  
    if (paginationDto) {
      this.applyPagination(query, paginationDto);
    }
  
    const [items, total] = await query.getManyAndCount(); // Fetch results and total count
  
    return {
      items, // Paginated results
      total, // Total number of CVs
    };
  }

  async getFilteredCvsByUser(
    userId: number,
    filterDto: GetCvFilterDto,
    paginationDto: PaginationDto,
  ): Promise<{ items: Cv[]; total: number }> {
    const { search, age } = filterDto;
    const query = this.repository.createQueryBuilder('cv');
  
    query.where('cv.userId = :userId', { userId }); 

    if (search) {
      query.andWhere(
        '(cv.name LIKE :search OR cv.firstname LIKE :search OR cv.job LIKE :search)',
        { search: `%${search}%` },
      );  
    }

    if (age) {
      query.andWhere('cv.age = :age', { age });
    }
  
    if (paginationDto) {
      this.applyPagination(query, paginationDto);
    }
  
    const [items, total] = await query.getManyAndCount(); // Fetch results and total count
    console.log('items', items);
    return {
      items, // Paginated results
      total, // Total number of CVs
    };
  }

  async updateCvImage(id: number, imageBuffer: Buffer, filename: string): Promise<Cv> {
    const cv = await this.repository.findOne({ where: { id } });
    if (!cv) {
      throw new NotFoundException(`Cv with ID ${id} not found`);
    }
  
    if (!this.containerName) {
      throw new Error('Azure Storage container name is not defined');
    }
  
    const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(filename);
  
    await blockBlobClient.uploadData(imageBuffer, {
      blobHTTPHeaders: { blobContentType: 'image/jpeg' }, // Adjust based on the image type
    });
  
    // Save only the blob name in the database
    cv.path = filename;
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
    const filePath = path.join(uploadsDir, filename); 
    fs.writeFileSync(filePath, imageBuffer);
  
    // Update the CV entity with the relative file path
    cv.path = `/uploads/${filename}`;
    return this.repository.save(cv);
  }

  async getCvImage(id: number): Promise<{ imageBuffer: Buffer; contentType: string }> {
    const cv = await this.repository.findOne({ where: { id } });
    if (!cv || !cv.path) {
      throw new NotFoundException(`CV with ID ${id} or its image not found`);
    }
  
    if (!this.containerName) {
      throw new Error('Azure Storage container name is not defined');
    }
  
    // Ensure the path is not a full URL or duplicated
    const blobPath = cv.path.startsWith('http') ? new URL(cv.path).pathname.substring(1) : cv.path;
  
    const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
    const blobClient = containerClient.getBlobClient(blobPath);
  
    const downloadBlockBlobResponse = await blobClient.download();
    if (!downloadBlockBlobResponse.readableStreamBody) {
      throw new Error('Readable stream body is undefined');
    }
  
    const imageBuffer = await this.streamToBuffer(downloadBlockBlobResponse.readableStreamBody);
    const contentType = downloadBlockBlobResponse.contentType || 'application/octet-stream';
  
    return { imageBuffer, contentType };
  }

  private async streamToBuffer(readableStream: NodeJS.ReadableStream): Promise<Buffer> {
    const chunks: Buffer[] = [];
    for await (const chunk of readableStream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)); // Ensure chunk is a Buffer
    }
    return Buffer.concat(chunks); // Combine all chunks into a single Buffer
  }
}