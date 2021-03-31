import { Injectable } from '@nestjs/common';
import { ApplicationConfig } from '@nestjs/core';

@Injectable()
export class UserService {
  constructor(private readonly apiConfig: ApplicationConfig) {}
}
