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
import React from 'react';
import { Badge } from '@visa/nova-react';
import { badgeConfigs } from './dynamic-table.constants';

/**
 * Props for StatusBadge.
 *
 * @property label - Status value to display, mapped to corresponding badge configuration
 */
interface StatusBadgeProps {
  label: string | boolean;
}

/**
 * StatusBadge renders a badge with appropriate styling and icon based on the provided
 * label. It maps status values to predefined badge configurations, automatically selecting
 * the correct badge type (success, warning, critical, etc.) and associated icon.
 */
const StatusBadge: React.FC<StatusBadgeProps> = ({ label }) => {
  const badge = badgeConfigs.find(config => config.text === label) ?? badgeConfigs[2]; // default to 'stable' if not found
  return (
    <Badge badgeType={badge.type}>
      {badge.icon}
      {badge.text}
    </Badge>
  );
};

export default StatusBadge;
