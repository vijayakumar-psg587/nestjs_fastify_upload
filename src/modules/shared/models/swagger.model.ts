import { PartialType } from '@nestjs/swagger';
import { CommonModel } from './common.model';

export interface SwaggerModel {
  name: string;
  url: string;
  email: string;
  description: string;
  title: string;
  tos: string;
  server: string;
  version: string;
  context_path: string;
}
