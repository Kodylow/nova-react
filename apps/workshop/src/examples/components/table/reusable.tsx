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
import { VisaArrowDownTiny, VisaArrowUpTiny, VisaSortableTiny } from '@visa/nova-icons-react';
import {
  Button,
  ScreenReader,
  Table,
  type TableProperties,
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
import { type ReactNode, useId, useState } from 'react';
import { NovaAccordion } from '../accordion/reusable';
import { NovaCheckbox } from '../checkbox/reusable';
import { NovaInput } from '../input/reusable';
import { NovaSelect } from '../select/reusable';

// Types
export type NovaTableBaseRow = object;

export interface NovaTableSort<RowData extends NovaTableBaseRow = NovaTableBaseRow> {
  ascending?: boolean;
  key?: keyof RowData | string;
}

export interface NovaTableColumn<RowData extends NovaTableBaseRow = NovaTableBaseRow> {
  activeTypographyStyle?: boolean;
  colspan?: number;
  groupHeader?: boolean;
  iconString?: string;
  inputs?: Record<string, unknown>;
  key: keyof RowData | string;
  rowRender?: (rowData: RowData, index: number) => ReactNode;
  sortable?: boolean;
  title?: string;
  titleRender?: (index: number) => ReactNode;
  /**
   * Transform displayed column data
   * NOTE: it is preferable to do this only once when the data gets loaded in, not every render
   */
  transform?: (data: RowData) => string;
}

// Nova Table Component Props
export interface NovaTableProperties<RowData extends NovaTableBaseRow = NovaTableBaseRow> extends TableProperties {
  caption: string;
  columns?: NovaTableColumn<RowData>[];
  emptyRowsMessage?: string;
  headerColumns?: NovaTableColumn<RowData>[];
  loading?: boolean;
  onSortChange?: (sort: NovaTableSort<RowData>) => void;
  rows?: RowData[];
  rowIdKey?: keyof RowData;
  sort?: NovaTableSort<RowData>;
}

// Main Nova Table Component
export const NovaTable = <RowData extends NovaTableBaseRow = { id: string }>({
  caption,
  children,
  columns = [],
  emptyRowsMessage = 'No results found',
  headerColumns = [],
  id: idProp,
  keyValue = false,
  loading = false,
  onSortChange,
  rows = [],
  rowIdKey = 'id' as keyof RowData,
  sort,
  ...remainingProps
}: NovaTableProperties<RowData>) => {
  const generatedId = useId();
  const id = idProp ?? generatedId;

  const handleSort = (column: NovaTableColumn<RowData>) => {
    if (column.key === undefined || !column.sortable) return;
    const newSort: NovaTableSort<RowData> = {
      ascending: column.key === sort?.key ? !sort?.ascending : true,
      key: column.key,
    };
    onSortChange?.(newSort);
  };

  return (
    <TableWrapper>
      <Table id={`${id}-table`} keyValue={keyValue} {...remainingProps}>
        <ScreenReader tag="caption">{caption}</ScreenReader>

        {!keyValue && (
          <Thead>
            {headerColumns.length > 0 && (
              <Tr>
                {headerColumns.map((column, idx) => (
                  <Th
                    alternate={column.groupHeader}
                    key={`header-column-${column.key?.toString() || ''}-${idx}`}
                    colSpan={column.colspan}
                    scope="col"
                  >
                    {column.titleRender ? column.titleRender(idx) : null}
                    {column.title}
                  </Th>
                ))}
              </Tr>
            )}
            <Tr>
              {columns.map((column, idx) => (
                <Th
                  alternate={column.groupHeader}
                  aria-sort={column.key === sort?.key ? (sort?.ascending ? 'ascending' : 'descending') : undefined}
                  key={`header-column-${column.key?.toString() || ''}-${idx}`}
                  colSpan={column.colspan}
                  scope="col"
                >
                  {column.title}
                  {column.sortable && (
                    <Button
                      aria-label={column.key === sort?.key || !sort?.ascending ? 'sort ascending' : 'sort descending'}
                      buttonSize="small"
                      colorScheme="tertiary"
                      iconButton
                      onClick={() => handleSort(column)}
                    >
                      {column.key !== sort?.key || sort?.ascending === undefined ? (
                        <VisaSortableTiny />
                      ) : sort?.ascending ? (
                        <VisaArrowUpTiny />
                      ) : (
                        <VisaArrowDownTiny />
                      )}
                    </Button>
                  )}
                </Th>
              ))}
            </Tr>
          </Thead>
        )}

        <Tbody>
          {loading ? (
            <Tr>
              <Td colSpan={columns.length}>Loading...</Td>
            </Tr>
          ) : rows.length ? (
            rows.map((row, index) => (
              <Tr key={`${id}-row-${row[rowIdKey]}-${index}`}>
                {columns.map((column, colIdx) => {
                  return (
                    <UtilityFragment key={`${id}-cell-${row[rowIdKey]}-${column.key.toString()}-${colIdx}`}>
                      {colIdx === 0 ? (
                        <Th scope="row" >
                          {column.rowRender ? column.rowRender(row, index) : (row[column.key as keyof RowData] as string)}
                        </Th>
                      ) : (
                        <Td>
                          {column.rowRender ? column.rowRender(row, index) : (row[column.key as keyof RowData] as string)}
                        </Td>
                      )}
                    </UtilityFragment>
                  );
                })}
              </Tr>
            ))
          ) : emptyRowsMessage ? (
            <Tr>
              <Td colSpan={columns.length}>
                <UtilityFragment vFlex vJustifyContent="center" style={{ padding: '20px', textAlign: 'center' }}>
                  <Typography variant="body-2-bold">{emptyRowsMessage}</Typography>
                </UtilityFragment>
              </Td>
            </Tr>
          ) : (
            <></>
          )}
        </Tbody>
      </Table>
      {children}
    </TableWrapper>
  );
};

// export default NovaTable;

/** !!! DELETE ME START !!! */

// Demo Types
export type DemoRow = {
  'column-a': number | string;
  'column-b': number | string;
  'column-c': number | string;
  'column-d': number | string;
} & NovaTableBaseRow;

export const demoColumns: NovaTableColumn<DemoRow>[] = [
  { key: 'column-a', title: 'Column A', sortable: false },
  { key: 'column-b', title: 'Column B', sortable: false },
  { key: 'column-c', title: 'Column C', sortable: false },
  { key: 'column-d', title: 'Column D', sortable: false },
];

export const demoHeaderColumns: NovaTableColumn<DemoRow>[] = [
  { colspan: 2, key: 'group-header-1', title: 'Group header 1' },
  { colspan: 2, key: 'group-header-2', title: 'Group header 2' },
];

export const demoRows: DemoRow[] = Array.from({ length: 3 }, (_, i) => ({
  id: i + 1,
  'column-a': `A${i + 1}`,
  'column-b': `B${i + 1}`,
  'column-c': `C${i + 1}`,
  'column-d': `D${i + 1}`,
}));

// Demo Component Types
interface DemoCustomizations {
  alternate: boolean;
  border: boolean;
  borderBlock: boolean;
  caption: string;
  columns: string;
  headerColumns: string;
  keyValue: boolean;
  loading: boolean;
  rows: string;
  showHeaderColumns: boolean;
  subtle: boolean;
  tableSize: 'large' | 'medium' | 'small';
}

// Demo Component
export const NovaTableDemo = () => {
  const tableSizes: { label: string; value: DemoCustomizations['tableSize'] }[] = [
    { label: 'Small', value: 'small' },
    { label: 'Medium', value: 'medium' },
    { label: 'Large', value: 'large' },
  ];

  const defaultCustomizations: DemoCustomizations = {
    alternate: true,
    border: false,
    borderBlock: false,
    caption: 'This is required text that describes the table in more detail.',
    columns: JSON.stringify(demoColumns, null, 4),
    headerColumns: JSON.stringify(demoHeaderColumns, null, 4),
    keyValue: false,
    loading: false,
    rows: JSON.stringify(demoRows, null, 4),
    showHeaderColumns: false,
    subtle: false,
    tableSize: 'medium',
  };

  const [customizations, setCustomizations] = useState<
    Omit<DemoCustomizations, 'columns' | 'headerColumns' | 'rows'> & {
      columns: NovaTableColumn<DemoRow>[];
      headerColumns: NovaTableColumn<DemoRow>[];
      rows: DemoRow[];
    }
  >({
    ...defaultCustomizations,
    columns: demoColumns,
    headerColumns: demoHeaderColumns,
    rows: demoRows,
  });

  const [formValues, setFormValues] = useState<DemoCustomizations>(defaultCustomizations);

  const handleInputChange = (field: keyof DemoCustomizations, value: string | boolean) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsedColumns = JSON.parse(formValues.columns || '[]') as NovaTableColumn<DemoRow>[];
      const parsedHeaderColumns = JSON.parse(formValues.headerColumns || '[]') as NovaTableColumn<DemoRow>[];
      const parsedRows = JSON.parse(formValues.rows || '[]') as DemoRow[];
      setCustomizations({
        ...formValues,
        columns: parsedColumns,
        headerColumns: parsedHeaderColumns,
        rows: parsedRows,
      });
    } catch (error) {
      console.error('Invalid JSON:', error);
    }
  };

  const handleReset = () => {
    setFormValues(defaultCustomizations);
    setCustomizations({
      ...defaultCustomizations,
      columns: demoColumns,
      headerColumns: demoHeaderColumns,
      rows: demoRows,
    });
  };

  const handleSortChange = (sort: NovaTableSort<DemoRow>) => {
    console.log('Sort changed:', JSON.stringify(sort));
  };

  const { headerColumns, showHeaderColumns, ...customizationProps } = customizations;

  return (
    <div>
      <NovaTable
        {...customizationProps}
        onSortChange={handleSortChange}
        id="demo-reusable-table"
        headerColumns={showHeaderColumns ? headerColumns : []}
      />

      <div style={{ marginTop: '24px' }}>
        <NovaAccordion title="Customize demo">
          <form onSubmit={handleApply}>
            <Utility vFlex vFlexCol vGap={16} style={{ marginBottom: '32px' }}>
              <NovaInput
                clearable
                label="Caption"
                onChange={e => handleInputChange('caption', e.target.value)}
                value={formValues.caption}
              />

              <NovaInput<'textarea'>
                fixed={false}
                label="Columns"
                onChange={e => handleInputChange('columns', e.target.value)}
                style={{ blockSize: '100px' }}
                textarea
                value={formValues.columns}
              />

              {customizations.showHeaderColumns && (
                <NovaInput<'textarea'>
                  fixed={false}
                  label="Header columns"
                  onChange={e => handleInputChange('headerColumns', e.target.value)}
                  style={{ blockSize: '100px' }}
                  textarea
                  value={formValues.headerColumns}
                />
              )}

              <NovaInput<'textarea'>
                fixed={false}
                label="Rows"
                onChange={e => handleInputChange('rows', e.target.value)}
                style={{ blockSize: '100px' }}
                textarea
                value={formValues.rows}
              />

              <NovaSelect
                label="Table size"
                onChange={e => handleInputChange('tableSize', e.target.value)}
                options={tableSizes}
                value={formValues.tableSize}
              />

              <NovaCheckbox
                label="Alternate"
                checked={formValues.alternate}
                onChange={e => handleInputChange('alternate', e.target.checked)}
              />

              <NovaCheckbox
                label="Border"
                checked={formValues.border}
                onChange={e => handleInputChange('border', e.target.checked)}
              />

              <NovaCheckbox
                label="Border block"
                checked={formValues.borderBlock}
                onChange={e => handleInputChange('borderBlock', e.target.checked)}
              />

              <NovaCheckbox
                label="Key value"
                checked={formValues.keyValue}
                onChange={e => handleInputChange('keyValue', e.target.checked)}
              />

              <NovaCheckbox
                label="Loading"
                checked={formValues.loading}
                onChange={e => handleInputChange('loading', e.target.checked)}
              />

              <NovaCheckbox
                label="Show header columns"
                checked={formValues.showHeaderColumns}
                onChange={e => handleInputChange('showHeaderColumns', e.target.checked)}
              />

              <NovaCheckbox
                label="Subtle"
                checked={formValues.subtle}
                onChange={e => handleInputChange('subtle', e.target.checked)}
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
export default NovaTableDemo;
/** !!! DELETE ME END !!! */
