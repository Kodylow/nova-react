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
  Button,
  ProgressCircular,
  ScreenReader,
  Table,
  TableWrapper,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Utility,
  UtilityFragment,
} from '@visa/nova-react';
import { SortType, type ColData, type RowData, type SortKeyType } from './shared/dynamic-table.constants';
import { revisedSortTableData } from './shared/dynamic-table.utils';
import './shared/dynamic-table.scss';
import ActionsButton from './shared/actions-button';
import { generateBasicData, getDefaultColumnData } from './shared/generate-demo-data.utils';

/**
 * Sortable data table with circular progress indicator during data fetching.
 */
const IndeterminateCircularProgressDynamicTable = () => {
  // State for loading and reset
  const [loading, setLoading] = useState(false);
  const [reset, setReset] = useState(false);

  // Generate demo data
  const columnData: ColData[] = getDefaultColumnData();
  const [data, setData] = useState<RowData[]>([]);

  // Determine identifying column, default to first column if none marked as identifier
  const identifyingColumn = columnData.find(col => col.identifier)?.name || columnData[0].name;

  // State for sorting, default to ascending on identifying column
  const [sortKey, setSortKey] = useState<SortKeyType>({ column: identifyingColumn, direction: SortType.ASC });

  // Store sorted data and update based on sort key and data changes
  const sortedData = useMemo(() => {
    return revisedSortTableData(sortKey, columnData, data);
  }, [sortKey, data]);

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
   * Simulates data loading upon button click.
   */
  const loadTableData = () => {
    setLoading(true);
    setReset(false);
    setTimeout(() => {
      setLoading(false);
      setData(generateBasicData(4, columnData));
    }, 3000); // simulate data loading delay for 3 seconds
  };

  /**
   * Resets table data to empty state.
   */
  const resetData = () => {
    setLoading(false);
    setData([]);
    setReset(true);
  };

  return (
    <Utility vFlexCol vGap="8">
      <Utility vFlex vGap="16" vAlignItems="start">
        <Button aria-pressed={loading || sortedData.length > 0} onClick={loadTableData}>
          Load data
        </Button>
        <Button colorScheme="secondary" aria-pressed={reset} onClick={resetData}>
          Reset
        </Button>
      </Utility>
      <TableWrapper>
        <Table
          style={
            {
              // Use compact spacing
              '--v-table-data-padding-block-default': 'var(--v-table-data-padding-block-small)',
              '--v-table-data-block-default': 'var(--v-table-data-block-small)',
            } as CSSProperties
          }
          alternate
          aria-busy={loading}
        >
          <ScreenReader tag="caption">Default dynamic table with indeterminate circular progress.</ScreenReader>
          <Thead>
            <Tr>
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
          <Tbody>
            {loading ? (
              <Tr>
                {/* vertical padding gives space for progress indicator without a scrollbar popping up */}
                <Td colSpan={columnData.length} style={{ textAlign: 'center', paddingBlock: '20px' }}>
                  <UtilityFragment vFlex vJustifyContent="center">
                    <ProgressCircular indeterminate>
                      <span className="v-sr" role="alert">
                        Loading
                      </span>
                    </ProgressCircular>
                  </UtilityFragment>
                </Td>
              </Tr>
            ) : sortedData.length > 0 ? (
              sortedData.map((row, rowIndex) => (
                <Tr key={rowIndex}>
                  {columnData.map((col, colIndex) => (
                    <Td
                      key={colIndex}
                      scope={col.identifier ? 'row' : undefined}
                      className={col.compact ? 'compact-column' : ''}
                      data-label={col.name}
                    >
                      {col.render ? col.render(row) : row[col.name]}
                    </Td>
                  ))}
                </Tr>
              ))
            ) : null}
          </Tbody>
        </Table>
      </TableWrapper>
    </Utility>
  );
};

export default IndeterminateCircularProgressDynamicTable;
