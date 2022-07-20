import type { ValidationChecker, ValidationCheckerFunction } from '../../validator/types/validation-checker';
import { alwaysValid } from '../always';
import { checkValidity } from './logical/check-all-of';

/**
 * Select a checker based on a specified switching value.
 *
 * If none of the cases match the keys in `checkersByCase`, the `defaultChecker` is used, which is `alwaysValid` by default.
 */
export const checkSwitch =
  <S extends string | number | symbol, T>(
    switchingValue: S,
    checkersByCase: Partial<Record<S, ValidationChecker<T> | undefined>>,
    defaultChecker: ValidationChecker<T> = alwaysValid
  ): ValidationCheckerFunction<T> =>
  (value, args) =>
    checkValidity(checkersByCase[switchingValue] ?? defaultChecker, value, args);
