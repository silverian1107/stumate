import { BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

export function validateObjectId(id: string, objectName?: string) {
  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestException(
      `Invalid ${objectName ? objectName + 'Id' : 'ObjectId'} format: ${id}`,
    );
  }
}
