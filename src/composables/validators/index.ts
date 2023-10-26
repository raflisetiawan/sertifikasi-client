import { ValidationRuleWithParams } from '@vuelidate/core';
import { email, helpers, minLength, required } from '@vuelidate/validators';

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

export { useEmail, useRequired, useMinLength };
