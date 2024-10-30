import dayjs from 'dayjs';
import * as bcrypt from 'bcrypt';

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

export function formatDate(
  date: dayjs.Dayjs | string | Date,
  formatString: string = 'YYYY-MM-DD HH:mm:ss',
) {
  return dayjs(date).format(formatString);
}
