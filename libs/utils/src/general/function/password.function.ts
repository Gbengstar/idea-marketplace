import { BadRequestException } from '@nestjs/common';
import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const asyncScript = promisify(scrypt);

/**
 *
 * @param value the string to be hashed
 * @returns returns string
 */

export const hash = async (value: string): Promise<string> => {
  const salt = randomBytes(8).toString('hex');
  const hashedPass = (await asyncScript(value, salt, 64)) as Buffer;
  return `${hashedPass.toString('hex')}.${salt}`;
};

/**
 *
 * @param hash hash coming from database
 * @param value value that the user supply
 * @returns returns a boolean
 */
export const verifyHash = async (hash: string, value: string) => {
  if (!(hash && value))
    throw new BadRequestException('No password supplied for authentication');
  const [storedHashPass, salt] = hash.split('.');
  const hashedPass = (await asyncScript(value, salt, 64)) as Buffer;

  return hashedPass.toString('hex') === storedHashPass;
};
