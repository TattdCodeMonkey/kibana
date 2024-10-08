/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import * as React from 'react';

export const useAsyncMemo = <T>(
  fn: () => Promise<T>,
  deps: React.DependencyList
): T | undefined => {
  const [value, setValue] = React.useState<T | undefined>(undefined);

  React.useLayoutEffect(() => {
    let isMounted = true;

    fn().then((result) => {
      if (isMounted) {
        setValue(result);
      }
    });

    return () => {
      isMounted = false;
    };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  return value;
};
