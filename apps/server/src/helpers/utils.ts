import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestException } from '@nestjs/common';
import dayjs from 'dayjs';

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

export const getIntervalDate = (interval: number, date?: number) => {
  return dayjs(date ?? Date.now())
    .add(interval, 'day')
    .valueOf();
};

export const reviewFlashcard = (
  flashcard: any,
  rating: number,
  reviewDate?: number,
) => {
  let interval: number;
  if (rating >= 3) {
    if (flashcard.repetitions === 0) {
      interval = 1;
    } else if (flashcard.repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(flashcard.interval * flashcard.easiness);
    }
    flashcard.repetitions++;
    let easiness =
      flashcard.easiness + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02));
    if (easiness < 1.3) {
      easiness = 1.3;
    }
    flashcard.easiness = easiness;
  } else {
    flashcard.repetitions = 0;
    interval = 1;
  }
  flashcard.interval = interval;
  flashcard.nextReview = getIntervalDate(interval, reviewDate);
  return rating < 4;
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

export const handleDuplicateName = (name: string, existingNames: string[]) => {
  const namesSet = new Set(existingNames);
  if (!namesSet.has(name)) {
    return name;
  }
  let count = 1;
  let newName = `${name} (${count})`;
  while (namesSet.has(newName)) {
    count++;
    newName = `${name} (${count})`;
  }
  return newName;
};
