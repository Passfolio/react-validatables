import { waitFor } from '@testing-library/react';
import { useBinding, useConstBinding } from 'react-bindings';

import { runInDom } from '../../__test_dependency__';
import { changeStringTrim } from '../../transformers/string/change-string-trim';
import { checkStringNotEmpty } from '../../validators/string/string-length';
import { useValidator } from '../use-validator';

describe('useValidator', () => {
  it('if disabled should always return valid', () =>
    runInDom(() => {
      const myBinding = useBinding(() => '', { id: 'myBinding' });
      const disabled = useConstBinding(true, { id: 'disabled' });
      const isBindingValid = useValidator(myBinding, () => changeStringTrim(checkStringNotEmpty()), {
        id: 'myBindingValidator',
        disabledWhile: disabled
      });

      expect(isBindingValid.value.get()?.isValid).toBeTruthy();
      expect(isBindingValid.isDisabled()).toBeTruthy();
    }));

  it('dynamically changing disabled states using disabledWhile should work', () =>
    runInDom(({ onMount }) => {
      const myBinding = useBinding(() => '', { id: 'myBinding' });
      const disabled = useBinding(() => false, { id: 'disabled' });
      const isBindingValid = useValidator(myBinding, () => changeStringTrim(checkStringNotEmpty()), {
        id: 'myBindingValidator',
        disabledWhile: disabled
      });

      expect(isBindingValid.value.get()?.isValid).toBeUndefined();
      expect(isBindingValid.isDisabled()).toBeFalsy();

      onMount(async () => {
        await waitFor(() => expect(isBindingValid.value.get()?.isValid).toBe(false));

        disabled.set(true);

        expect(isBindingValid.value.get()?.isValid).toBe(true);
        expect(isBindingValid.isDisabled()).toBeTruthy();

        disabled.set(false);

        expect(isBindingValid.value.get()?.isValid).toBeUndefined();
        expect(isBindingValid.isDisabled()).toBeFalsy();
      });
    }));

  it('dynamically changing disabled states using disabledUntil should work', () =>
    runInDom(({ onMount }) => {
      const myBinding = useBinding(() => '', { id: 'myBinding' });
      const enabled = useBinding(() => true, { id: 'disabled' });
      const isBindingValid = useValidator(myBinding, () => changeStringTrim(checkStringNotEmpty()), {
        id: 'myBindingValidator',
        disabledUntil: enabled
      });

      expect(isBindingValid.value.get()?.isValid).toBeUndefined();
      expect(isBindingValid.isDisabled()).toBeFalsy();

      onMount(async () => {
        await waitFor(() => expect(isBindingValid.value.get()?.isValid).toBe(false));

        enabled.set(false);

        expect(isBindingValid.value.get()?.isValid).toBe(true);
        expect(isBindingValid.isDisabled()).toBeTruthy();

        enabled.set(true);

        expect(isBindingValid.value.get()?.isValid).toBeUndefined();
        expect(isBindingValid.isDisabled()).toBeFalsy();
      });
    }));

  it('should be disabled while disabledWhileUnmodified bindings are unmodified', () =>
    runInDom(({ onMount }) => {
      const myBinding = useBinding(() => '', { id: 'myBinding' });
      const isBindingValid = useValidator(myBinding, () => checkStringNotEmpty(), {
        id: 'myBindingValidator',
        disabledWhileUnmodified: myBinding
      });

      expect(isBindingValid.value.get()?.isValid).toBe(true);
      expect(isBindingValid.isDisabled()).toBeTruthy();

      onMount(async () => {
        myBinding.set('hello');

        expect(isBindingValid.value.get()?.isDisabled).toBeFalsy();

        await waitFor(() => expect(isBindingValid.value.get()?.isValid).toBe(true));
      });
    }));
});
