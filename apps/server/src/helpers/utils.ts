import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestException } from '@nestjs/common';

export const getHashPassword = async (password: string) => {
  const saltRounds = 10;
  try {
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    console.log(error);
  }
};

export const comparePassword = async (
  password: string,
  hashPassword: string,
) => {
  try {
    return await bcrypt.compare(password, hashPassword);
  } catch (error) {
    console.log(error);
  }
};

export const getCodeId = () => {
  let uuidDigits = uuidv4().replace(/\D/g, '');
  while (uuidDigits.length < 6) {
    uuidDigits += Math.floor(Math.random() * 10).toString();
  }
  return uuidDigits.slice(0, 6);
};

export function validateObjectId(id: string, objectName?: string): void;
export function validateObjectId(ids: string[], objectName?: string): void;

/**
 * Validate whether the given id or array of ids is a valid ObjectId.
 * @throws {BadRequestException} If the id is not valid.
 * @param {string | string[]} id The id or array of ids to validate.
 * @param {string} [objectName] The name of the object, for error message purposes.
 */
export function validateObjectId(
  id: string | string[],
  objectName?: string,
): void {
  if (Array.isArray(id)) {
    if (!id.every((id) => Types.ObjectId.isValid(id))) {
      throw new BadRequestException(
        `Invalid ${objectName ? objectName + 'Id' : 'ObjectId'} format: ${id}`,
      );
    }
  } else {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(
        `Invalid ${objectName ? objectName + 'Id' : 'ObjectId'} format: ${id}`,
      );
    }
  }
}
