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

import { Button, ContentCard, Surface, Typography, Utility, UtilityFragment, type VSpacing } from '@visa/nova-react';
import { VisaEditTiny } from '@visa/nova-icons-react';
import type { JSX } from 'react';

/**
 * Step configuration object
 *
 * @property label - Step label text
 * @property title - Step title displayed in summary
 * @property inputLabel - (optional) Label for input field
 * @property inputId - (optional) ID for input element
 * @property buttonId - (optional) ID for button element
 */
interface Step {
  label: string;
  title: string;
  inputLabel?: string;
  inputId?: string;
  buttonId?: string;
}

/**
 * Props for the SummaryPage component
 *
 * Supports two rendering modes:
 * 1. Standalone page with ContentCard wrapper and action buttons
 * 2. Inline summary with Surface wrapper for single-page wizard
 *
 * @property steps - Array of step configuration objects
 * @property inputValues - Input values corresponding to each step
 * @property onStepClick - Callback when edit button clicked, receives step index
 * @property renderActionButtons - (optional) Render function for action buttons in standalone mode
 * @property vPaddingHorizontal - (optional) Horizontal padding for inline mode
 * @property maxWidth - (optional) Max width for standalone mode
 * @property surfaceProps - (optional) Additional props for Surface wrapper in inline mode
 * @property containerProps - (optional) Additional props for container Utility in inline mode
 * @property editButtonRefs - (optional) Refs array for edit buttons to manage focus
 */
interface SummaryPageProps {
  steps: Step[];
  inputValues: string[];
  onStepClick: (index: number) => void;
  renderActionButtons?: () => JSX.Element;
  vPaddingHorizontal?: VSpacing;
  maxWidth?: string;
  surfaceProps?: React.ComponentProps<typeof Surface>;
  containerProps?: React.ComponentProps<typeof Utility>;
  editButtonRefs?: (HTMLButtonElement | null)[];
}

/**
 * Renders summary of wizard steps with edit capabilities.
 * Adapts layout based on whether it's used standalone or inline.
 */
export const SummaryPage = ({
  steps,
  inputValues,
  onStepClick,
  renderActionButtons,
  vPaddingHorizontal,
  maxWidth,
  surfaceProps = {},
  containerProps = {},
  editButtonRefs = [],
}: SummaryPageProps) => {
  // Exclude the summary step itself (last step) from the list
  const summarySteps = steps.slice(0, steps.length - 1);

  // Core summary content rendered in both modes
  const renderSummaryContent = () => (
    <>
      <Typography tag="h2" variant="headline-2">
        Summary
      </Typography>
      <ol>
        {summarySteps.map((step, i) => (
          <UtilityFragment
            key={i}
            vPaddingVertical={20}
            style={{
              borderBlockEnd: i < summarySteps.length - 1 ? '1px solid rgba(0,0,0,0.10)' : 'none',
              paddingBlockEnd: i < summarySteps.length - 1 ? '20px' : '0',
            }}
          >
            <li>
              <Utility vFlex vJustifyContent="between">
                <Typography tag="h3" variant="body-2-bold" colorScheme="subtle">
                  {`${i + 1}. ${step.title}`}
                </Typography>
                <Button
                  aria-label={`Edit step ${i + 1}`}
                  colorScheme="tertiary"
                  iconButton
                  buttonSize="small"
                  onClick={() => onStepClick(i)}
                  ref={node => {
                    editButtonRefs[i] = node;
                  }}
                >
                  <VisaEditTiny rtl />
                </Button>
              </Utility>
              <Typography>{`${step.inputLabel}: ${inputValues[i]}`}</Typography>
            </li>
          </UtilityFragment>
        ))}
      </ol>
    </>
  );

  // For inline summary (like in single-page wizard)
  if (vPaddingHorizontal) {
    return (
      <UtilityFragment vPaddingHorizontal={vPaddingHorizontal}>
        <Surface {...surfaceProps}>
          <Utility vFlexGrow {...containerProps}>
            {renderSummaryContent()}
          </Utility>
        </Surface>
      </UtilityFragment>
    );
  }

  // For standalone summary page
  return (
    <Utility vAlignSelf="center" vFlex vFlexCol vGap={10} style={{ maxWidth: maxWidth, width: '100%' }}>
      <UtilityFragment vAlignSelf="center" vFlex vJustifyContent="center" vPadding={48} vGap={32}>
        <ContentCard style={{ boxShadow: 'none', inlineSize: '100%' }}>
          <Utility style={{ inlineSize: '100%' }}>{renderSummaryContent()}</Utility>
        </ContentCard>
      </UtilityFragment>
      <Typography variant="body-3">Changes have been automatically saved.</Typography>
      {renderActionButtons && renderActionButtons()}
    </Utility>
  );
};
