import type { Waitable } from 'react-waitables';

import type { ValidationResult } from './validation-result';

/** A validator is a waitable that produces a `ValidationResult`, indicating either validity or a problem, if all of its dependencies are
 * loaded (or if the validator is disabled). */
export interface Validator extends Waitable<ValidationResult> {
  /** Returns `true` if the validator is disabled, in which case it will always result in "validity" */
  isDisabled: () => boolean;
}
