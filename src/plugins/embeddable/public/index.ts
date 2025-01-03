/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { PluginInitializerContext } from '@kbn/core/public';
import { EmbeddablePublicPlugin } from './plugin';

export { useAddFromLibraryTypes } from './add_from_library/registry';
export { openAddFromLibraryFlyout } from './add_from_library/open_add_from_library_flyout';
export {
  cellValueTrigger,
  CELL_VALUE_TRIGGER,
  contextMenuTrigger,
  CONTEXT_MENU_TRIGGER,
  defaultEmbeddableFactoryProvider,
  Embeddable,
  EmbeddableFactoryNotFoundError,
  EmbeddableStateTransfer,
  ErrorEmbeddable,
  genericEmbeddableInputIsEqual,
  isContextMenuTriggerContext,
  isEmbeddable,
  isErrorEmbeddable,
  isExplicitInputWithAttributes,
  isFilterableEmbeddable,
  isMultiValueClickTriggerContext,
  isRangeSelectTriggerContext,
  isReferenceOrValueEmbeddable,
  isRowClickTriggerContext,
  isSavedObjectEmbeddableInput,
  isValueClickTriggerContext,
  MULTI_VALUE_CLICK_TRIGGER,
  omitGenericEmbeddableInput,
  panelBadgeTrigger,
  panelHoverTrigger,
  PanelNotFoundError,
  PanelIncompatibleError,
  panelNotificationTrigger,
  PANEL_BADGE_TRIGGER,
  PANEL_HOVER_TRIGGER,
  PANEL_NOTIFICATION_TRIGGER,
  runEmbeddableFactoryMigrations,
  SELECT_RANGE_TRIGGER,
  shouldFetch$,
  shouldRefreshFilterCompareOptions,
  VALUE_CLICK_TRIGGER,
  ViewMode,
  withEmbeddableSubscription,
} from './lib';
export type {
  Adapters,
  CellValueContext,
  ChartActionContext,
  EmbeddableContext,
  EmbeddableEditorState,
  EmbeddableFactory,
  EmbeddableFactoryDefinition,
  EmbeddableInput,
  EmbeddableInstanceConfiguration,
  EmbeddableOutput,
  EmbeddablePackageState,
  FilterableEmbeddable,
  IEmbeddable,
  MultiValueClickContext,
  OutputSpec,
  PropertySpec,
  RangeSelectContext,
  ReferenceOrValueEmbeddable,
  SavedObjectEmbeddableInput,
  SelfStyledEmbeddable,
  ValueClickContext,
} from './lib';
export type {
  EmbeddableSetup,
  EmbeddableSetupDependencies,
  EmbeddableStart,
  EmbeddableStartDependencies,
} from './plugin';
export type { EnhancementRegistryDefinition } from './types';

export {
  ReactEmbeddableRenderer,
  type DefaultEmbeddableApi,
  type ReactEmbeddableFactory,
} from './react_embeddable_system';

export function plugin(initializerContext: PluginInitializerContext) {
  return new EmbeddablePublicPlugin(initializerContext);
}

export { COMMON_EMBEDDABLE_GROUPING } from './lib/embeddables/common/constants';
