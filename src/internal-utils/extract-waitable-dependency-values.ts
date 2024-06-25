import type { ReadonlyBinding } from 'react-bindings';
import { isBinding } from 'react-bindings';
import type { InferOptionalWaitableAndBindingValueTypes, NamedWaitableDependencies, Waitable, WaitableDependencies } from 'react-waitables';
import { isWaitable } from 'react-waitables';

const emptyValues = Object.freeze({});

export const extractOptionalWaitableDependencyValues = <DependenciesT extends WaitableDependencies, FailureT>({
  dependencies,
  namedDependencyKeys
}: {
  dependencies: DependenciesT | undefined;
  namedDependencyKeys: string[] | undefined;
}): {
  allWaitablesAreLoaded: boolean;
  anyWaitablesHadErrors: boolean;
  lastError?: FailureT;
  values: InferOptionalWaitableAndBindingValueTypes<DependenciesT>;
} => {
  const isArray = Array.isArray(dependencies);
  const isNonNamed = isArray || isBinding(dependencies) || isWaitable(dependencies);

  const inout: { allWaitablesAreLoaded: boolean; anyWaitablesHadErrors: boolean; lastError?: FailureT } = {
    allWaitablesAreLoaded: true,
    anyWaitablesHadErrors: false,
    lastError: undefined
  };
  const makeOutput = (values: InferOptionalWaitableAndBindingValueTypes<DependenciesT>) => ({ ...inout, values });

  if (isNonNamed) {
    if (isArray) {
      return makeOutput(
        dependencies.map((dependency) =>
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          extractValue(dependency, inout)
        ) as InferOptionalWaitableAndBindingValueTypes<DependenciesT>
      );
    } else {
      return makeOutput(extractValue(dependencies, inout) as InferOptionalWaitableAndBindingValueTypes<DependenciesT>);
    }
  } else if (namedDependencyKeys !== undefined) {
    const namedValues: Record<string, any> = {};
    for (const key of namedDependencyKeys) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      namedValues[key] = extractValue((dependencies as NamedWaitableDependencies)[key], inout);
    }

    return makeOutput(namedValues as InferOptionalWaitableAndBindingValueTypes<DependenciesT>);
  } else {
    return makeOutput(emptyValues as InferOptionalWaitableAndBindingValueTypes<DependenciesT>);
  }
};

// Helpers

const extractValue = <T, FailureT>(
  dependency: Waitable<T> | ReadonlyBinding<T> | undefined,
  inout: { allWaitablesAreLoaded: boolean; anyWaitablesHadErrors: boolean; lastError?: FailureT }
): T | undefined => {
  if (isWaitable(dependency)) {
    const value = (dependency as Waitable<T>).value.get();
    if (value === undefined) {
      inout.allWaitablesAreLoaded = false;

      const error = dependency.error.get() as FailureT | undefined;
      if (error !== undefined) {
        inout.anyWaitablesHadErrors = true;
        inout.lastError = error;
      }
    }
    return value;
  } else if (isBinding(dependency)) {
    return dependency.get();
  } else {
    return undefined;
  }
};
