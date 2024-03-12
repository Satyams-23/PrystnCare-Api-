/* eslint-disable no-global-assign */
import { CountryCode, parsePhoneNumberFromString } from 'libphonenumber-js';

const extractPhoneNumberAndCode = (
  phoneNumberWithCode: string,
  region: CountryCode | 'ZZ' = 'ZZ',
) => {
  const parsedPhoneNumber = parsePhoneNumberFromString(
    phoneNumberWithCode,
    region as CountryCode,
  );

  if (!parsedPhoneNumber || !parsedPhoneNumber.isValid()) {
    return { phoneNumber: null, countryCode: null };
  }

  const formattedCountryCode = `+${parsedPhoneNumber.countryCallingCode}`;

  return {
    phoneNumber: parsedPhoneNumber.nationalNumber,
    countryCode: formattedCountryCode,
  };
};

export default extractPhoneNumberAndCode;
