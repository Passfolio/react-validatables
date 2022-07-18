import type { SingleOrArray, TypeOrDeferredType } from 'react-bindings';

import { defaultValidationError } from '../../consts/default-validation-error';
import type { ValidatorFunction } from '../../validator/types/validator';
import { checkIf } from '../generic/check-if';
import { checkAllOf } from '../generic/logical/check-all-of';
import { checkAnyOf } from '../generic/logical/check-any-of';

/** Results in "validity" for any string that matches any of the specified regular expressions */
export const checkStringMatchesRegex = (
  regexes: SingleOrArray<RegExp>,
  validationError: TypeOrDeferredType<string> = defaultValidationError
): ValidatorFunction<string> =>
  Array.isArray(regexes)
    ? checkAnyOf(regexes.map((regex) => checkStringMatchesRegex(regex, validationError)))
    : checkIf((value) => regexes.exec(value) !== null, validationError);

/** Results in "validity" for any string that matches all of the specified regular expressions */
export const checkStringMatchesRegexAllOf = (
  regexes: RegExp[],
  validationError: TypeOrDeferredType<string> = defaultValidationError
): ValidatorFunction<string> => checkAllOf(regexes.map((regex) => checkStringMatchesRegex(regex, validationError)));

/** Results in "validity" for any string that does not match any the specified regular expression */
export const checkStringNotMatchesRegex = (
  regex: RegExp,
  validationError: TypeOrDeferredType<string> = defaultValidationError
): ValidatorFunction<string> => checkIf((value) => regex.exec(value) === null, validationError);
