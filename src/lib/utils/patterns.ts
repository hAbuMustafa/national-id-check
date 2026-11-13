import type { governorateCodes } from './governorate-codes';

export const egyptianNationalIdPattern =
  /^(?<nationalIdNumber>(?<first13>(?<birthCentury>[23])(?<birthdate>(?<birthYear>\d{2})(?<birthMonth>(0[1-9])|(1[0-2]))(?<birthDay>(0[1-9])|([12][0-9])|(3[01])))(?<governorate>(0[1-4])|([12][1-9])|(3[1-5])|(88))\d{3}(?<gender>\d))(?<checksum>\d))$/;

export interface EgyptianNationalIDSegments {
  nationalIdNumber: string;
  first13: string;
  birthCentury: string;
  birthdate: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  governorate: keyof typeof governorateCodes;
  gender: string;
  checksum: string;
}
