import type { ValidationChecker, ValidationCheckerArgs, ValidationCheckerFunction } from '../../validator/types/validation-checker';
import { checkValidity } from '../../validators/generic/logical/check-all-of';

/** Selects a different value to continue validation with */
export const selectValue =
  <T>(selectedValue: T, checker: ValidationChecker<T>): ValidationCheckerFunction<any> =>
  (_value: any, args: ValidationCheckerArgs) =>
    checkValidity(checker, selectedValue, args);
