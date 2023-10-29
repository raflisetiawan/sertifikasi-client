import { ValidationRuleWithParams } from '@vuelidate/core';
import {
  decimal,
  email,
  helpers,
  minLength,
  numeric,
  required,
} from '@vuelidate/validators';

const useEmail = (): ValidationRuleWithParams => {
  return helpers.withMessage('Email tidak valid', email);
};

const useRequired = (): ValidationRuleWithParams => {
  return helpers.withMessage('Harus di isi', required);
};

const useMinLength = (lengthNumber: number): ValidationRuleWithParams => {
  return helpers.withMessage(
    `Password harus lebih dari ${lengthNumber} karakter`,
    minLength(lengthNumber)
  );
};

const useName = (): ValidationRuleWithParams => {
  return helpers.withMessage('Nama harus lebih dari 1 karakter', minLength(2));
};

const usePhoneNumber = (): ValidationRuleWithParams => {
  const validNumber = helpers.regex(/^(?:\+62|0)[0-9]{8,15}$/);
  return helpers.withMessage('Nomor handphone tidak valid', validNumber);
};
const useNumeric = (): ValidationRuleWithParams => {
  return helpers.withMessage('Form harus angka', numeric);
};
const useDecimal = (): ValidationRuleWithParams => {
  return helpers.withMessage('Form harus angka desimal', decimal);
};

export {
  useEmail,
  useRequired,
  useMinLength,
  useName,
  usePhoneNumber,
  useNumeric,
  useDecimal,
};
