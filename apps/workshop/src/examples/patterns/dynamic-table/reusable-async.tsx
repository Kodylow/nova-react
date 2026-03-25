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
import { useQuery } from '@tanstack/react-query';
import { MessageIcon } from '@visa/nova-icons-react';
import { SectionMessage, SectionMessageContent, Typography } from '@visa/nova-react';
import { useEffect, useMemo, useState } from 'react';
import type { NovaTableBaseRow, NovaTableSort } from '../../components/table/reusable';
import NovaDynamicTable, { type NovaDynamicTableProperties } from './reusable';

export interface NovaDynamicTableAsyncFetchFnParams<
  RowData extends NovaTableBaseRow = NovaTableBaseRow,
  Filters = unknown,
> {
  filters?: Filters;
  page: number;
  pageSize: number;
  search?: string;
  sort?: NovaTableSort<RowData>;
}

export interface NovaDynamicTableAsyncProps<
  RowData extends NovaTableBaseRow = NovaTableBaseRow,
  PromiseReturn = unknown,
  Filters = unknown,
> extends NovaDynamicTableProperties<RowData> {
  filters?: Filters;
  fetchFn: (params?: NovaDynamicTableAsyncFetchFnParams<RowData, Filters>) => Promise<PromiseReturn>;
  renderError?: (error: Error | string) => React.ReactNode;
  renderLoading?: () => React.ReactNode;
  rowsKey?: string;
  totalKey?: string;
  transformer?: (data: RowData[]) => RowData[];
}

export const NovaDynamicTableAsync = <
  RowData extends NovaTableBaseRow = NovaTableBaseRow,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  PromiseReturn extends Record<string, any> | unknown[] = Record<string, unknown>,
  FilterType extends Record<string, unknown> = Record<string, unknown>,
>({
  autoPaginate = false,
  autoSearch = false,
  autoSort = false,
  defaultPageSize = 10,
  defaultSort,
  id,
  filters,
  fetchFn,
  renderError,
  renderLoading,
  rowsKey,
  search,
  transformer,
  totalKey,
  ...remainingProps
}: NovaDynamicTableAsyncProps<RowData, PromiseReturn, FilterType>) => {
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [selectedPage, setSelectedPage] = useState(1);
  const [sort, setSort] = useState<NovaTableSort<RowData> | undefined>(defaultSort);

  // Reset to first page when filters change
  useEffect(() => {
    if (filters) setSelectedPage(1);
  }, [filters]);

  const queryKeys: unknown[] = [id + '-data', filters, fetchFn];

  if (!autoPaginate) queryKeys.push(pageSize, selectedPage); // Remove pageSize and selectedPage from query key if autoPaginate is true
  if (!autoSort) queryKeys.push(sort); // Remove sort from query key if autoSort is true{
  if (!autoSearch) queryKeys.push(search); // Remove sort from query key if autoSort is true{

  const { isPending, error, data } = useQuery<PromiseReturn>({
    queryKey: queryKeys,
    queryFn: () =>
      fetchFn({
        filters,
        page: selectedPage,
        pageSize,
        search,
        sort,
      }),
  });

  const rows = (rowsKey && !Array.isArray(data) ? data?.[rowsKey] : data) as RowData[] | undefined;

  const rowsTransformed = useMemo(() => (transformer && rows ? transformer(rows) : rows), [transformer, rows]);

  useEffect(() => {
    if (!isPending && rowsTransformed?.length === 0 && selectedPage > 1) {
      setSelectedPage(prev => prev - 1);
    }
  }, [rowsTransformed, selectedPage, isPending]);

  if (isPending) {
    if (renderLoading) return <>{renderLoading()}</>;
    return <NovaDynamicTable<RowData> loading {...remainingProps} />;
  }

  const rowArrayNotFound = !Array.isArray(rowsTransformed) || rowsTransformed === undefined;

  const errorMessage = error?.message ?? (rowArrayNotFound ? 'Something went wrong' : undefined);

  if (rowArrayNotFound && import.meta.env.DEV) {
    console.groupCollapsed(`DynamicTableAsync(${id}): No rows found`);
    console.error('rowsKey:', rowsKey);
    console.error('Raw data:', JSON.stringify(data, null, 2));
    console.error('Transformed Rows:', JSON.stringify(rowsTransformed, null, 2));
    console.groupEnd();
  }

  if (error || errorMessage) {
    if (renderError) return <>{renderError((error ?? errorMessage) as Error)}</>;
    return (
      <SectionMessage messageType="error">
        <MessageIcon messageType="error" />
        <SectionMessageContent>
          <Typography>{errorMessage}</Typography>
        </SectionMessageContent>
      </SectionMessage>
    );
  }

  const total = autoPaginate
    ? undefined
    : ((totalKey && !Array.isArray(data) ? data?.[totalKey] : data?.length) as number);

  return (
    <>
      <NovaDynamicTable<RowData>
        autoPaginate={autoPaginate}
        autoSearch={autoSearch}
        autoSort={autoSort}
        defaultPageSize={pageSize}
        id={id}
        onPageChange={setSelectedPage}
        onPageSizeChange={setPageSize}
        onSortChange={setSort}
        page={selectedPage}
        pageSize={pageSize}
        rows={rowsTransformed}
        search={search}
        sort={sort}
        totalRecords={total}
        {...remainingProps}
      />
    </>
  );
};

export default NovaDynamicTableAsync;
