/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import * as t from 'io-ts';

import { DefaultStringBooleanFalse } from '../default_string_boolean_false';

export const importQuerySchema = t.exact(
  t.partial({
    overwrite: DefaultStringBooleanFalse,
    overwrite_exceptions: DefaultStringBooleanFalse,
    overwrite_action_connectors: DefaultStringBooleanFalse,
    as_new_list: DefaultStringBooleanFalse,
  })
);

export type ImportQuerySchema = t.TypeOf<typeof importQuerySchema>;
export type ImportQuerySchemaDecoded = Omit<
  ImportQuerySchema,
  'overwrite' | 'overwrite_exceptions' | 'as_new_list' | 'overwrite_action_connectors'
> & {
  overwrite: boolean;
  overwrite_exceptions: boolean;
  overwrite_action_connectors: boolean;
  as_new_list: boolean;
};
