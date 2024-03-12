"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-global-assign */
const libphonenumber_js_1 = require("libphonenumber-js");
const extractPhoneNumberAndCode = (phoneNumberWithCode, region = 'ZZ') => {
    const parsedPhoneNumber = (0, libphonenumber_js_1.parsePhoneNumberFromString)(phoneNumberWithCode, region);
    if (!parsedPhoneNumber || !parsedPhoneNumber.isValid()) {
        return { phoneNumber: null, countryCode: null };
    }
    const formattedCountryCode = `+${parsedPhoneNumber.countryCallingCode}`;
    return {
        phoneNumber: parsedPhoneNumber.nationalNumber,
        countryCode: formattedCountryCode,
    };
};
exports.default = extractPhoneNumberAndCode;
