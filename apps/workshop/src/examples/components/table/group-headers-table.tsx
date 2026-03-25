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

export const GroupHeadersTable = () => {
  return (
    <Table border>
      <ScreenReader tag="caption">Table with group headers.</ScreenReader>
      <Thead>
        <Tr className="v-typography-overline">
          <Th alternate colSpan={2} id="group-header-1">
            Group header 1
          </Th>
          <Th alternate colSpan={2} id="group-header-2">
            Group header 2
          </Th>
        </Tr>
        <Tr>
          <Th scope="col" id="column-a">Column A</Th>
          <Th scope="col" id="column-b">Column B</Th>
          <Th scope="col" id="column-c">Column C</Th>
          <Th scope="col" id="column-d">Column D</Th>
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Th scope="row" id="row-1" headers="group-header-1 column-a">A1</Th>
          <Td headers="group-header-1 column-b row-1">B1</Td>
          <Td headers="group-header-2 column-c row-1">C1</Td>
          <Td headers="group-header-2 column-d row-1">D1</Td>
        </Tr>
        <Tr>
          <Th scope="row" id="row-2" headers="group-header-1 column-a">A2</Th>
          <Td headers="group-header-1 column-b row-2">B2</Td>
          <Td headers="group-header-2 column-c row-2">C2</Td>
          <Td headers="group-header-2 column-d row-2">D2</Td>
        </Tr>
        <Tr>
          <Th scope="row" id="row-3" headers="group-header-1 column-a">A3</Th>
          <Td headers="group-header-1 column-b row-3">B3</Td>
          <Td headers="group-header-2 column-c row-3">C3</Td>
          <Td headers="group-header-2 column-d row-3">D3</Td>
        </Tr>
      </Tbody>
    </Table>
  );
};
