/**
 *              © 2026 Visa
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 **/
// useState hook that prioritizes controlled props if provided;

import { useEffect, useState } from 'react';

/**
 * Hook that prioritizes controlled state over useState if controlled state provided
 * @param propValue - Value for controlled state
 * @param onChange - Setter for controlled state
 * @param defaultValue
 * @returns
 */
export function useModel<T>(
  controlledValue?: T,
  controlledSetter?: (value: T) => void,
  defaultValue?: T
): [T, (value: T) => void] {
  const [stateValue, setStateValue] = useState<T>(defaultValue ?? controlledValue!);

  const value = controlledValue ?? stateValue;

  const setter =
    value !== undefined && controlledSetter !== undefined
      ? controlledSetter
      : (value: T) => {
          setStateValue(value);
          controlledSetter?.(value);
        };

  useEffect(() => {
    if (controlledValue !== undefined && controlledSetter === undefined)
      console.warn(
        'useModel',
        'When using this hook it is required to provide both controlledValue and controlledSetter or neither. It could cause unintended side effects if one but not the other is provided.',
        `controlledSetter: ${controlledSetter}`,
        `controlledValue: ${controlledValue}`
      );
  }, []);

  return [value, setter];
}

export default useModel;
