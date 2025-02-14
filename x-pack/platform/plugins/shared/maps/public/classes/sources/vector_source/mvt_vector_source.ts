/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { Map as MbMap } from '@kbn/mapbox-gl';
import { VectorSourceRequestMeta } from '../../../../common/descriptor_types';
import { IVectorSource } from '.';

export interface IMvtVectorSource extends IVectorSource {
  /*
   * IMvtVectorSource.getTileUrl returns the tile source URL.
   * Append refreshToken as a URL parameter to force tile re-fetch on refresh (not required)
   */
  getTileUrl(
    requestMeta: VectorSourceRequestMeta,
    refreshToken: string,
    hasLabels: boolean,
    buffer: number
  ): Promise<string>;

  /*
   * Tile vector sources can contain multiple layers. For example, elasticsearch _mvt tiles contain the layers "hits", "aggs", and "meta".
   * Use getTileSourceLayer to specify the displayed source layer.
   */
  getTileSourceLayer(): string;

  /**
   * Syncs source specific styling with mbMap this allows custom sources to further style the map layers/filters
   */
  syncSourceStyle?(mbMap: MbMap, getLayerIds: () => string[]): void;
}
