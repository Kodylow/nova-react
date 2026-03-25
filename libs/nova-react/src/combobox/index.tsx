/**
 *              © 2025-2026 Visa
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
import cn from 'clsx';
import type { ComponentPropsWithRef, ElementType } from 'react';

const CSS_PREFIX = 'v-combobox';

export type ComboboxProperties<ET extends ElementType = 'div'> = {
  /** Tag of the component */
  tag?: ElementType;
} & ComponentPropsWithRef<ET>;

/**
 * Dropdown menu enabling users to enter text or select items from a list.
 * @docs {@link https://design.visa.com/components/combobox/?code_library=react | See Docs}
 * @related dropdown-menu
 * @vgar TODO
 * @wcag TODO
 */
const Combobox = <ET extends ElementType = 'div'>({
  className,
  tag: Tag = 'div',
  ...remainingProps
}: ComboboxProperties<ET>) => <Tag className={cn(CSS_PREFIX, className)} {...remainingProps} />;

export default Combobox;

Combobox.displayName = 'Combobox';
