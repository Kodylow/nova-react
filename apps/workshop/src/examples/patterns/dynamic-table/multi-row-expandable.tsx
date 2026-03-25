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
import { useMemo, useState, type CSSProperties } from 'react';
import {
  AccordionToggleIcon,
  Button,
  ScreenReader,
  Table,
  TableWrapper,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Typography,
  Utility,
  UtilityFragment,
} from '@visa/nova-react';
import { VisaChevronDownTiny, VisaChevronRightTiny } from '@visa/nova-icons-react';
import { SortType, type ColData, type RowData, type SortKeyType } from './shared/dynamic-table.constants';
import { revisedSortTableData } from './shared/dynamic-table.utils';
import './shared/dynamic-table.scss';
import ActionsButton from './shared/actions-button';
import { generateBasicData, getDefaultColumnData } from './shared/generate-demo-data.utils';

/**
 * Accordion table where multiple rows can expand simultaneously to show row details.
 */
const MultiRowExpandableDynamicTable = () => {
  // Generate demo data
  const columnData: ColData[] = getDefaultColumnData();
  const data: RowData[] = generateBasicData(4, columnData);

  // Determine identifying column, default to first column if none marked as identifier
  const identifyingColumn = columnData.find(col => col.identifier)?.name || columnData[0].name;

  // State for sorting, default to ascending on identifying column
  const [sortKey, setSortKey] = useState<SortKeyType>({ column: identifyingColumn, direction: SortType.ASC });

  // State for expanded rows
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  // State for header toggle
  const [headerToggle, setHeaderToggle] = useState(false);

  // Store sorted data and update based on sort key and data changes
  const sortedData = useMemo(() => {
    return revisedSortTableData(sortKey, columnData, data);
  }, [sortKey, columnData, data]);

  /**
   * Updates the sort key to trigger table re-sorting.
   *
   * @param column - Column to sort by
   * @param direction - Sort direction (ascending or descending)
   */
  const sort = (column: ColData, direction: SortType) => {
    setSortKey({ column: column.name, direction: direction });
  };

  /**
   * Toggles individual row expansion state.
   *
   * @param name - Row name to toggle
   */
  const toggleRow = (name: string) => {
    if (expandedRows[name]) {
      const updatedExpandedRows = { ...expandedRows };
      delete updatedExpandedRows[name];
      setExpandedRows(updatedExpandedRows);
    } else {
      setExpandedRows({ ...expandedRows, [name]: true });
    }

    // Check if all rows are expanded after the toggle and update header toggle state
    const allExpanded = Object.keys(expandedRows).length === sortedData.length;
    setHeaderToggle(allExpanded);
  };

  /**
   * Toggles all rows expansion state.
   */
  const toggleAllRows = () => {
    const newToggleState = !headerToggle;
    setHeaderToggle(newToggleState);

    // Update all rows to match the header toggle state
    if (newToggleState) {
      const allExpandedRows: Record<string, boolean> = {};
      sortedData.forEach(row => {
        allExpandedRows[row[identifyingColumn] as string] = true;
      });
      console.log(allExpandedRows);
      setExpandedRows(allExpandedRows);
    } else {
      setExpandedRows({});
    }
  };

  return (
    <TableWrapper>
      <Table
        style={
          {
            // Use compact spacing
            '--v-table-data-padding-block-default': 'var(--v-table-data-padding-block-small)',
            '--v-table-data-block-default': 'var(--v-table-data-block-small)',
          } as CSSProperties
        }
        className="v-accordion accordion-style-table"
      >
        <ScreenReader tag="caption">Multi row expandable table.</ScreenReader>
        <Thead>
          <Tr>
            <Td className="v-th compact-column">
              <Button
                aria-expanded={!!headerToggle}
                buttonSize="small"
                colorScheme="tertiary"
                iconButton
                aria-label={headerToggle ? 'Collapse all rows' : 'Expand all rows'}
                onClick={() => toggleAllRows()}
              >
                <AccordionToggleIcon
                  accordionOpen={!!headerToggle}
                  elementClosed={<VisaChevronRightTiny rtl />}
                  elementOpen={<VisaChevronDownTiny />}
                />
              </Button>
            </Td>
            {columnData.map((col, index) => (
              <Th
                key={index}
                scope="col"
                className={col.compact ? 'compact-column' : ''}
                aria-sort={col.name === sortKey.column ? sortKey.direction : undefined}
              >
                <Utility vFlex vJustifyContent="between" vAlignItems="center" vGap={4}>
                  {col.compact ? <ScreenReader>{col.name}</ScreenReader> : col.name}
                  <ActionsButton
                    column={col}
                    label={col.name}
                    onSort={direction => sort(col, direction)}
                    sorted={col.name === sortKey.column ? sortKey.direction : SortType.NONE}
                  />
                </Utility>
              </Th>
            ))}
          </Tr>
        </Thead>
        {sortedData.map((row, rowIndex) => (
          <Tbody key={rowIndex}>
            <Tr className="v-accordion-heading">
              <Td className="compact-column">
                <Button
                  aria-expanded={!!expandedRows[row[identifyingColumn] as string]}
                  buttonSize="small"
                  colorScheme="tertiary"
                  iconButton
                  aria-labelledby={row[identifyingColumn] + '-id-multi-select'}
                  onClick={() => toggleRow(row[identifyingColumn] as string)}
                >
                  <AccordionToggleIcon
                    accordionOpen={!!expandedRows[row[identifyingColumn] as string]}
                    elementClosed={<VisaChevronRightTiny rtl />}
                    elementOpen={<VisaChevronDownTiny />}
                  />
                </Button>
              </Td>
              {columnData.map((col, colIndex) => (
                <Td
                  key={colIndex}
                  scope={col.identifier ? 'row' : undefined}
                  id={col.name === identifyingColumn ? row[identifyingColumn] + '-id-multi-select' : undefined}
                  className={col.compact ? 'compact-column' : ''}
                  data-label={col.name}
                >
                  {col.render ? col.render(row) : <Typography variant="body-2">{row[col.name]}</Typography>}
                </Td>
              ))}
            </Tr>
            <Tr>
              <UtilityFragment vPaddingVertical={10} vHide={!expandedRows[row[identifyingColumn] as string]}>
                <Td
                  className="v-accordion-panel"
                  colSpan={columnData.length + 1}
                  aria-hidden={!expandedRows[row[identifyingColumn] as string]}
                  style={{ paddingInline: 'var(--v-accordion-panel-padding-inline)' }}
                >
                  <Typography variant="label-large-active">Row {row[identifyingColumn]} expanded content</Typography>
                  <Typography>This is an optional description with additional data.</Typography>
                </Td>
              </UtilityFragment>
            </Tr>
          </Tbody>
        ))}
      </Table>
    </TableWrapper>
  );
};

export default MultiRowExpandableDynamicTable;
