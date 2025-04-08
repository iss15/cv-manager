import { IsOptional, IsInt, IsString } from 'class-validator';
import { NestMiddleware, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

export class GetCvFilterDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsInt()
  age?: number; 
}