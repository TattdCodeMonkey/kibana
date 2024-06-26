/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { EuiPanel } from '@elastic/eui';
import type { EuiFlexItemProps } from '@elastic/eui/src/components/flex/flex_item';

interface Props {
  dataTestSubj?: string;
  grow?: EuiFlexItemProps['grow'];
  className?: string;
}
export const ExpandedRowPanel: FC<PropsWithChildren<Props>> = ({
  children,
  dataTestSubj,
  grow,
  className,
}) => {
  return (
    <EuiPanel
      data-test-subj={dataTestSubj}
      hasShadow={false}
      hasBorder={false}
      grow={!!grow}
      className={className ?? ''}
      paddingSize={'s'}
    >
      {children}
    </EuiPanel>
  );
};
