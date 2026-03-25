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
import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import {
  AccordionToggleIcon,
  Button,
  ProgressLinear,
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
import { columnDataFilterDefaults } from './shared/generate-demo-data.utils';
import { getTablePage, getAccordionData } from './shared/mock-table-api.utils';

/**
 * Represents the state of accordion row data for lazy loading.
 *
 * @property data - The fetched row data, null if not yet loaded or loading
 * @property loading - Whether the data is currently being fetched
 */
interface AccordionRowData {
  data: RowData | null;
  loading: boolean;
}

/**
 * Accordion table with lazy loading of row details on expansion.
 */
const DataFetchOnAccordionToggleDynamicTable = () => {
  // Generate demo data
  const columnData: ColData[] = [...columnDataFilterDefaults];

  // Determine identifying column, default to first column if none marked as identifier
  const identifyingColumn = columnData.find(col => col.identifier)?.name || columnData[0].name;

  // State for sorting, default to ascending on identifying column
  const [sortKey, setSortKey] = useState<SortKeyType>({ column: identifyingColumn, direction: SortType.ASC });
  const [data, setData] = useState<RowData[]>([]);

  // State for expanded rows
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  // State for header toggle
  const [headerToggle, setHeaderToggle] = useState(false);
  // state for accordion panel data
  const [accordionData, setAccordionData] = useState<Record<string, AccordionRowData>>({});

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
   * Fetches initial table data from mock API.
   */
  useEffect(() => {
    const getData = async () => {
      // Fetch just the first 4 rows for this example
      const response = await getTablePage(1, 4, sortKey, columnData, 0);
      setData(response.data);
    };
    getData();
  }, []);

  /**
   * Loads accordion panel data for a specific row using the mock API service.
   *
   * @param rowId - The identifier of the row to load data for
   */
  const loadAccordionData = (rowId: string) => {
    // Set loading state using functional update to avoid race conditions
    setAccordionData(prevData => ({
      ...prevData,
      [rowId]: { data: null, loading: true },
    }));

    // Call the mock API service to fetch accordion data
    getAccordionData(rowId).then(rowData => {
      // Update state with fetched data
      setAccordionData(prevData => ({
        ...prevData,
        [rowId]: { data: rowData, loading: false },
      }));
    });
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
      // If accordion data for this row is not already fetched, fetch it
      if (!accordionData[name]) {
        // Set loading state
        loadAccordionData(name);
      }
    }

    // Check if all rows are expanded after the toggle and update header toggle state
    const allExpanded = Object.keys(expandedRows).length === sortedData.length;
    setHeaderToggle(allExpanded);
  };

  /**
   * Toggles all rows expansion state.
   */
  const toggleAllRows = () => {
    const isExpanded = !headerToggle;
    setHeaderToggle(isExpanded);

    // Update all rows to match the header toggle state
    if (isExpanded) {
      const allExpandedRows: Record<string, boolean> = {};
      sortedData.forEach(row => {
        const rowId = row[identifyingColumn];
        allExpandedRows[rowId] = true;

        // If accordion data for this row is not already fetched, fetch it
        if (!accordionData[rowId]) {
          loadAccordionData(rowId);
        }
      });
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
                  aria-expanded={!!expandedRows[row[identifyingColumn]]}
                  buttonSize="small"
                  colorScheme="tertiary"
                  iconButton
                  aria-labelledby={row[identifyingColumn] + '-id-multi-select'}
                  onClick={() => toggleRow(row[identifyingColumn])}
                >
                  <AccordionToggleIcon
                    accordionOpen={!!expandedRows[row[identifyingColumn]]}
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
              <UtilityFragment vPaddingVertical={10} vHide={!expandedRows[row[identifyingColumn]]}>
                <Td
                  className="v-accordion-panel"
                  colSpan={columnData.length + 1}
                  aria-hidden={!expandedRows[row[identifyingColumn]]}
                  style={{ paddingInline: 'var(--v-accordion-panel-padding-inline)' }}
                >
                  {accordionData[row[identifyingColumn]]?.loading ? (
                    <Utility vFlexGrow>
                      <UtilityFragment vMarginVertical={8}>
                        <ProgressLinear aria-label="Please wait" id="data-fetch-accordion-progress" />
                      </UtilityFragment>
                      <label className="v-progress-label v-sr" htmlFor="data-fetch-accordion-progress">
                        <Utility tag="span" role="alert">
                          Loading...
                        </Utility>
                      </label>
                    </Utility>
                  ) : accordionData[row[identifyingColumn]]?.data ? (
                    <Utility>
                      <UtilityFragment vMarginBottom={12}>
                        <Typography variant="label-large-active">Details for {row[identifyingColumn]}</Typography>
                      </UtilityFragment>
                      {accordionData[row[identifyingColumn]]?.data?.['Data'] && (
                        <UtilityFragment vMarginBottom={12}>
                          <Typography variant="body-2">
                            {accordionData[row[identifyingColumn]]?.data?.['Data']}
                          </Typography>
                        </UtilityFragment>
                      )}
                    </Utility>
                  ) : (
                    <>
                      <Typography variant="label-large-active">Row {row[identifyingColumn]}</Typography>
                      <Typography variant="body-2">Error loading expanded content.</Typography>
                    </>
                  )}
                </Td>
              </UtilityFragment>
            </Tr>
          </Tbody>
        ))}
      </Table>
    </TableWrapper>
  );
};

export default DataFetchOnAccordionToggleDynamicTable;
