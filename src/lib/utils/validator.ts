/**
 * @fileoverview contains utility function to handle Egyptian national ID number processing.
 * @author Hosam Hamdy
 * @version 1.0
 */

/**
 * Checks an Egyptian national id number validity by verifying its checksum
 * @param num - The 14 digit Egyptian national ID number you want to check.
 * @returns `{checksum: number; calculatedChecksum: number; result: true | false}`
 * */
export function verifyEgyptianNationalId(num: string) {
  const numList = num.split('').map((n) => Number(n));

  const checksum = numList.pop()!;

  let sum = 0;

  numList.reverse();

  const weights = [2, 3, 4, 5, 6, 7];

  for (let i = 0; i < numList.length; i++) {
    sum += numList.at(i)! * weights[i % weights.length];
  }

  const modulus = (11 - (sum % 11)) % 11;

  const calculatedChecksum = modulus === 0 ? 1 : modulus;

  return { checksum, calculatedChecksum, result: calculatedChecksum === checksum };
}
