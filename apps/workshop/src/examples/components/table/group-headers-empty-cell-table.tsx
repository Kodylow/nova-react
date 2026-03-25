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
import { ScreenReader, Table, Tbody, Td, Th, Thead, Tr } from '@visa/nova-react';

export const GroupHeadersEmptyCellTable = () => {
  return (
    <Table border>
      <ScreenReader tag="caption">Table with group headers and an empty cell.</ScreenReader>
      <Thead>
        <Tr className="v-typography-overline">
          <Th alternate tag="td" />
          <Th alternate colSpan={1} id="e-group-header-1">
            Group header 1
          </Th>
          <Th alternate colSpan={1} id="e-group-header-2">
            Group header 2
          </Th>
        </Tr>
        <Tr>
          <Th scope="col" id="e-column-a">Column A</Th>
          <Th scope="col" id="e-column-b">Column B</Th>
          <Th scope="col" id="e-column-c">Column C</Th>
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Th scope="row" id="e-row-1" headers="e-column-a">A1</Th>
          <Td headers="e-group-header-1 e-column-b e-row-1">B1</Td>
          <Td headers="e-group-header-2 e-column-c e-row-1">C1</Td>
        </Tr>
        <Tr>
          <Th scope="row" id="e-row-2" headers="e-column-a">A2</Th>
          <Td headers="e-group-header-1 e-column-b e-row-2">B2</Td>
          <Td headers="e-group-header-2 e-column-c e-row-2">C2</Td>
        </Tr>
        <Tr>
          <Th scope="row" id="e-row-3" headers="e-column-a">A3</Th>
          <Td headers="e-group-header-1 e-column-b e-row-3">B3</Td>
          <Td headers="e-group-header-2 e-column-c e-row-3">C3</Td>
        </Tr>
      </Tbody>
    </Table>
  );
};
