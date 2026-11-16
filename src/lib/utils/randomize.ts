import { governorateCodes } from './governorate-codes';

const govCodeArr = Object.keys(governorateCodes);

function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomNationalID() {
  return `${random(2, 3)}${random(0, 99).toString().padStart(2, '0')}${random(1, 12).toString().padStart(2, '0')}${random(1, 28).toString().padStart(2, '0')}${govCodeArr[Math.floor(Math.random() * govCodeArr.length)]}${random(0, 99999).toString().padStart(5, '0')}`;
}
