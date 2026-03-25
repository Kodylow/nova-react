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
import { Utility, useModel } from '@visa/nova-react';
import { useEffect, useId, useMemo } from 'react';
import { NovaCheckbox } from '../../components/checkbox/reusable';
import { NovaPagination } from '../../components/pagination/reusable';
import {
  type NovaTableBaseRow,
  type NovaTableColumn,
  type NovaTableProperties,
  type NovaTableSort,
  NovaTable,
} from '../../components/table/reusable';

export const defaultSortFunction = <T extends NovaTableBaseRow>(data: T[], sort: NovaTableSort<T>) => {
  if (data.length === 0 || !sort.key || sort.ascending === undefined) return data;
  return data.sort((a, b) => {
    const valueA = `${a[sort.key as keyof T] ?? ''}`;

    const valueB = `${b[sort.key as keyof T] ?? ''}`;
    if (sort.ascending) return valueB.localeCompare(valueA);
    return valueA.localeCompare(valueB);
  });
};

export type NovaDynamicTableProperties<RowData extends NovaTableBaseRow = NovaTableBaseRow> =
  NovaTableProperties<RowData> & {
    autoPaginate?: boolean;
    autoSearch?: boolean;
    autoSort?: boolean;
    customTableRender?: (rows: RowData[]) => React.ReactNode;
    defaultPageSize?: number;
    defaultSort?: NovaTableSort<RowData>;
    onPageSizeChange?: (pageSize: number) => void;
    onPageChange?: (pageNumber: number) => void;
    onSelectedRowsChange?: (selectedRows: RowData[]) => void;
    onSortChange?: (sort: NovaTableSort<RowData>) => void;
    page?: number;
    pageSize?: number;
    search?: string;
    searchKey?: keyof RowData;
    selectable?: boolean;
    selectedRows?: RowData[];
    showItemsPerPage?: boolean;
    showPagination?: boolean;
    sort?: NovaTableSort<RowData>;
    sortFunction?: <T extends RowData>(data: T[], sort: NovaTableSort<T>) => T[];
    /**
     * Total number of records in the table
     */
    totalRecords?: number;
  };

export const NovaDynamicTable = <RowData extends NovaTableBaseRow = NovaTableBaseRow>({
  autoPaginate = true,
  autoSearch = true,
  autoSort = true,
  columns,
  customTableRender = undefined,
  defaultPageSize = 10,
  defaultSort = {},
  id: customId,
  loading,
  onPageChange: onPageChangeProp,
  onPageSizeChange,
  onSelectedRowsChange,
  onSortChange: onSortChangeProp,
  page: pageProp,
  pageSize: pageSizeProp,
  rows,
  search,
  searchKey,
  selectedRows: selectedRowsProp,
  selectable = false,
  sort: sortProp,
  showItemsPerPage = true,
  showPagination = true,
  sortFunction = defaultSortFunction,
  totalRecords: totalRecordsProp,
  ...remainingTableProps
}: NovaDynamicTableProperties<RowData>) => {
  const generatedId = useId();
  const id = customId ?? generatedId;

  // State
  const [page, setPage] = useModel(pageProp, onPageChangeProp, 1);
  const [pageSize, setPageSize] = useModel(pageSizeProp, onPageSizeChange, defaultPageSize);
  const [selectedRows, setSelectedRows] = useModel<RowData[]>(selectedRowsProp, onSelectedRowsChange, []);
  const [sort, setSort] = useModel<NovaTableSort<RowData>>(sortProp, onSortChangeProp, defaultSort);

  // Derived state:
  const { ascending, key: sortByKey } = sort;
  const data = rows ?? [];

  // Events
  const handleSelectRowChange = (row: RowData, checked: boolean) => {
    const prevSelected = selectedRows;
    if (checked) return setSelectedRows([...prevSelected, row]);
    setSelectedRows(prevSelected.filter(r => r !== row));
  };
  const handleSelectAllChange = (checked: boolean) => {
    if (!checked) return setSelectedRows([]);
    setSelectedRows(data);
  };

  // Large derived state:
  const renderedColumns = useMemo(
    () =>
      selectable
        ? [
            {
              rowRender: row => (
                <NovaCheckbox
                  checked={selectedRows.includes(row)}
                  onChange={event => handleSelectRowChange(row, event.target.checked)}
                />
              ),
              titleRender: () => (
                <NovaCheckbox
                  checked={allChecked}
                  indeterminate={selectedRows.length > 0 && selectedRows.length < (rows?.length ?? 0)}
                  onChange={event => handleSelectAllChange(event.target.checked)}
                />
              ),
              key: '__select_all__',
            } satisfies NovaTableColumn<RowData>,
            ...(columns ?? []),
          ]
        : columns,
    [columns, selectable]
  );
  const allChecked = useMemo(
    () => (selectable && rows?.length ? selectedRows.length === rows.length : false),
    [rows, selectable, selectedRows]
  );
  const lowerCaseSearch = search?.toLowerCase() ?? '';
  const searchedData: RowData[] = useMemo(
    () =>
      autoSearch && data?.length && lowerCaseSearch && searchKey
        ? data.filter(data => {
            return data?.[searchKey]?.toString().toLowerCase()?.includes(lowerCaseSearch);
          })
        : data,
    [autoSearch, data, lowerCaseSearch, searchKey]
  );
  const sortedData: RowData[] = useMemo(
    () =>
      searchedData?.length && sortByKey && autoSort ? sortFunction<RowData>(searchedData, sort) : searchedData || [],
    [ascending, searchedData, sortByKey, autoSort, sortFunction]
  );
  const totalRecords = totalRecordsProp ?? sortedData?.length ?? 0;
  const renderedData = autoPaginate ? sortedData?.slice((page - 1) * pageSize, page * pageSize) : sortedData || [];

  // Side effects
  useEffect(() => {
    if (search && autoSearch) {
      setPage(1);
    }
  }, [autoSearch, search, sort]);

  return (
    <>
      {customTableRender ? (
        customTableRender(renderedData)
      ) : (
        <NovaTable<RowData>
          columns={renderedColumns}
          id={id}
          loading={loading}
          onSortChange={setSort}
          rows={renderedData}
          sort={sort}
          {...remainingTableProps}
        />
      )}
      {showPagination && (
        <Utility vMarginTop={20}>
          <NovaPagination
            disabled={loading}
            inline
            itemsPerPage={pageSize}
            onItemsPerPageChange={setPageSize}
            onPageChange={setPage}
            page={page}
            showItemsPerPage={showItemsPerPage}
            totalItems={totalRecords}
          />
        </Utility>
      )}
    </>
  );
};

export default NovaDynamicTable;
