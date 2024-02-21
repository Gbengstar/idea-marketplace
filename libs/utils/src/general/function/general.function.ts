import { Logger } from '@nestjs/common';

export async function generateReferenceNumber(type: string, userId: string) {
  const timeStamp = new Date().getTime() + Math.ceil(Math.random() * 1000);
  Logger.log(timeStamp, 'reference number timestamp at presave hook');
  const getChar = userId.slice(-4).toUpperCase();
  return `${type}${timeStamp}${getChar}`;
}

/**
 * This function is used because of precision
 */
export function roundToTwoDecimalPlace(n: number, digits: number) {
  const multiplicator = Math.pow(10, digits);
  n = parseFloat((n * multiplicator).toFixed(11));
  return (Math.round(n) / multiplicator).toFixed(digits);
}

export function word(word: string) {
  return (word = word.charAt(0).toUpperCase() + word.slice(1));
}

// MONEY CONVERTER
export function roundAmount(amount: any, maxRange: number) {
  const converter = Math.pow(10, maxRange);
  return Math.round(amount * converter) / converter;
}

export function getNumericEnumValues(enumValue) {
  return Object.values(enumValue).filter((x) => typeof x === 'number');
}

/** generate random number within a range.
 *
 * NOTE: the last number is not included in the result
 */
export function randomNumberFromRange(from: number, to: number) {
  return Math.floor(Math.random() * to) + from;
}

export function randomBoolean(): boolean {
  const values = [true, false];
  return values[Math.floor(Math.random() * 2)];
}

export function randomItemFromArray<T>(input: T[]): T {
  return input[Math.floor(Math.random() * input.length)];
}

export function generateUniqueString(length: number): string {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}

// generate random 6 digits
export function randomSixDigits() {
  const min = 100000;
  const max = 999999;
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
}
