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
import { VisaDeleteTiny, VisaExportTiny, VisaFileDownloadTiny, VisaFileUploadTiny } from '@visa/nova-icons-react';
import {
  Badge,
  Button,
  Surface,
  Tab,
  Tabs,
  useTabs,
  Utility,
  type ButtonProperties,
  type TabsProperties,
} from '@visa/nova-react';
import { useId, useState, type FormEvent, type ReactNode } from 'react';
import { NovaAccordion } from '../accordion/reusable';
import { NovaCheckbox } from '../checkbox/reusable';
import { NovaInput } from '../input/reusable';
import { NovaSelect } from '../select/reusable';

export type NovaTabsOption = Omit<ButtonProperties<'button'>, 'children'> & {
  content?: ReactNode;
  label?: ReactNode;
  notifications?: number;
  prefix?: ReactNode;
  selected?: boolean;
  suffix?: ReactNode;
};

// Nova Tabs Component Props
export type NovaTabsProps = TabsProperties<'ul'> & {
  alternate?: boolean;
  autoSelect?: boolean;
  childSurface?: boolean;
  defaultSelectedIndex?: number;
  onSelectedIndexChange?: (index: number) => void;
  selectedIndex?: number;
  stacked?: boolean;
  tabs?: NovaTabsOption[];
};

// Main Nova Tabs Component
export const NovaTabs = ({
  alternate = false,
  autoSelect = true,
  children,
  childSurface = true,
  defaultSelectedIndex = 0,
  id: idProp,
  onSelectedIndexChange,
  orientation = 'vertical',
  selectedIndex: selectedIndexProp,
  stacked = false,
  tabs = [],
  ...remainingProps
}: NovaTabsProps) => {
  const generatedId = useId();
  const id = idProp ?? generatedId;

  const {
    getTabIndex,
    onIndexChange,
    onKeyNavigation,
    ref: tabsRef,
    selectedIndex,
  } = useTabs({
    arrowKeyNavigation: orientation,
    autoSelect,
    defaultSelected: defaultSelectedIndex,
    selectedIndex: selectedIndexProp,
    onSelectedIndexChange,
  });

  const vertical = orientation === 'vertical';

  const tabContent = childSurface ? (
    <Utility vMarginVertical={vertical ? undefined : 8} vFlex vFlexGrow vElevation="inset">
      {/*
          We have a nested surface that has been styled in our app's stylesheet.
          This has been done to leverage darker palette variables and bring contrast to this custom tabpanel.
 
          The CSS rule is something like this:
 
          .v-surface.v-alternate .v-surface {
            // The background color is set to surface-3 of the default palette.
            background: var(--palette-default-surface-3);
          }
        */}
      <Surface id={`${id}-tab-${selectedIndex}`} role="tabpanel">
        {tabs[selectedIndex]?.content}
        {children}
      </Surface>
    </Utility>
  ) : (
    <div id={`${id}-tab-${selectedIndex}`} role="tabpanel">
      {tabs[selectedIndex]?.content}
      {children}
    </div>
  );

  const content = (
    <Utility vFlex={vertical} vFlexRow={vertical} vFlexWrap vGap={8}>
      <Tabs
        onKeyDown={onKeyNavigation}
        orientation={orientation}
        role="tablist"
        style={{ inlineSize: 'max-content' }}
        {...remainingProps}
      >
        {tabs.map(({ label, notifications, prefix, suffix, ...remainingButtonProps }, index) => (
          <Tab key={`${id}-tab-${index}`} role="none">
            <Button
              aria-controls={`${id}-tab-${index}`}
              aria-selected={index === selectedIndex}
              colorScheme="tertiary"
              onClick={() => onIndexChange(index)}
              ref={el => {
                tabsRef.current[index] = el;
              }}
              role="tab"
              stacked={stacked}
              tabIndex={getTabIndex(index)}
              {...(remainingButtonProps as ButtonProperties)}
            >
              {prefix}
              {label}
              {suffix}
              {notifications !== undefined && notifications > 0 && (
                <Badge
                  aria-label={`${notifications} unread notification${notifications > 1 ? 's' : ''}`}
                  badgeVariant="number"
                  tag="sup"
                >
                  {notifications}
                </Badge>
              )}
            </Button>
          </Tab>
        ))}
      </Tabs>
      {tabContent}
    </Utility>
  );

  return alternate ? <Surface surfaceType="alternate">{content}</Surface> : content;
};

// export default NovaTabs;

/** !!! DELETE ME START !!! */

const demoTabs: NovaTabsOption[] = [
  { content: 'This is the content area for label 1', label: 'Label 1' },
  { content: 'This is the content area for label 2', label: 'Label 2', disabled: true },
  { content: 'This is the content area for label 3', label: 'Label 3', notifications: 0 },
  { content: 'This is the content area for label 4', label: 'Label 4' },
];

// These are separate from the main tabs because these can't be customized inside of a textarea input.
const demoTabsIcons: ReactNode[] = [
  // eslint-disable-next-line react/jsx-key
  <VisaExportTiny />,
  // eslint-disable-next-line react/jsx-key
  <VisaFileDownloadTiny />,
  // eslint-disable-next-line react/jsx-key
  <VisaFileUploadTiny />,
  // eslint-disable-next-line react/jsx-key
  <VisaDeleteTiny />,
];

const orientations: { label: string; value: TabsProperties['orientation'] }[] = [
  { label: 'Horizontal', value: 'horizontal' },
  { label: 'Vertical', value: 'vertical' },
];

// Demo Component Types
interface DemoCustomizations {
  alternate: boolean;
  autoSelect: boolean;
  childSurface: boolean;
  orientation: TabsProperties['orientation'];
  selectedIndex: number;
  showPrefixIcons: boolean;
  showSuffixIcons: boolean;
  stacked: boolean;
  tabs: string;
}

const defaultCustomizations: DemoCustomizations = {
  alternate: false,
  autoSelect: true,
  childSurface: true,
  orientation: 'horizontal',
  selectedIndex: 0,
  showPrefixIcons: true,
  showSuffixIcons: false,
  stacked: false,
  tabs: JSON.stringify(demoTabs, null, 4),
};

// Demo Component
export const NovaTabsDemo = () => {
  const [customizations, setCustomizations] = useState<Omit<DemoCustomizations, 'tabs'> & { tabs: NovaTabsOption[] }>({
    ...defaultCustomizations,
    tabs: demoTabs,
  });
  const [formValues, setFormValues] = useState<DemoCustomizations>(defaultCustomizations);

  const handleInputChange = <T = string | boolean,>(field: keyof DemoCustomizations, value: T) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApply = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const parsedOptions = JSON.parse(formValues.tabs || '[]') as NovaTabsOption[];
      setCustomizations({
        ...formValues,
        tabs: parsedOptions,
      });
    } catch (error) {
      console.error('Invalid JSON for tabs:', error);
    }
  };

  const handleReset = () => {
    setFormValues(defaultCustomizations);
    setCustomizations({
      ...defaultCustomizations,
      tabs: demoTabs,
    });
  };

  const tabsWithCustomizations = customizations.tabs.map((option, index) => {
    const prefix = customizations.showPrefixIcons ? demoTabsIcons[index % demoTabsIcons.length] : undefined;
    const suffix = customizations.showSuffixIcons ? demoTabsIcons[index % demoTabsIcons.length] : undefined;
    return { ...option, prefix, suffix } as NovaTabsOption;
  });

  return (
    <div>
      <NovaTabs
        alternate={customizations.alternate}
        autoSelect={customizations.autoSelect}
        childSurface={customizations.childSurface}
        onSelectedIndexChange={index => setCustomizations(prev => ({ ...prev, selectedIndex: index }))}
        orientation={customizations.orientation}
        selectedIndex={customizations.selectedIndex}
        stacked={customizations.stacked}
        tabs={tabsWithCustomizations || []}
      />

      <div style={{ marginTop: '24px' }}>
        <NovaAccordion title="Customize demo">
          <form onSubmit={handleApply}>
            <Utility vFlex vFlexCol vGap={16} style={{ marginBottom: '32px' }}>
              <NovaInput
                clearable
                blockSize="100px"
                label="Tabs (JSON)"
                onChange={e => handleInputChange('tabs', e.target.value)}
                resizable
                textarea
                value={formValues.tabs}
              />

              <NovaSelect
                label="Orientation"
                onChange={e =>
                  handleInputChange('orientation', e.target.value as NonNullable<DemoCustomizations['orientation']>)
                }
                options={orientations}
                value={formValues.orientation}
              />

              <NovaInput
                clearable
                label="Selected index"
                onChange={e => handleInputChange('selectedIndex', +e.target.value)}
                placeholder="0"
                type="number"
                value={formValues.selectedIndex}
              />

              <NovaCheckbox
                checked={formValues.alternate}
                label="Alternate"
                onChange={e => handleInputChange('alternate', e.target.checked)}
              />

              <NovaCheckbox
                checked={formValues.autoSelect}
                label="Auto select tab with keyboard focus"
                onChange={e => handleInputChange('autoSelect', e.target.checked)}
              />

              <NovaCheckbox
                checked={formValues.childSurface}
                label="Child surface"
                onChange={e => handleInputChange('childSurface', e.target.checked)}
              />

              <NovaCheckbox
                checked={formValues.showPrefixIcons}
                label="Show prefix icons"
                onChange={e => handleInputChange('showPrefixIcons', e.target.checked)}
              />

              <NovaCheckbox
                checked={formValues.showSuffixIcons}
                label="Show suffix icons"
                onChange={e => handleInputChange('showSuffixIcons', e.target.checked)}
              />

              <NovaCheckbox
                checked={formValues.stacked}
                label="Stacked"
                onChange={e => handleInputChange('stacked', e.target.checked)}
              />
            </Utility>

            <Utility vFlex vGap={16} style={{ marginBottom: '16px' }}>
              <Button type="submit">Apply</Button>
              <Button colorScheme="secondary" type="button" onClick={handleReset}>
                Reset
              </Button>
            </Utility>
          </form>
        </NovaAccordion>
      </div>
    </div>
  );
};
export default NovaTabsDemo;
/** !!! DELETE ME END !!! */
