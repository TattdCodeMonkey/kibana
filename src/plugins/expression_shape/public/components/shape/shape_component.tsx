/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React, { useState, useEffect, useCallback, RefCallback } from 'react';
import { useResizeObserver } from '@elastic/eui';
import {
  ShapeRef,
  ShapeAttributes,
  ShapeContentAttributes,
  SvgConfig,
  getDefaultShapeData,
} from '../reusable';
import { Dimensions, ShapeComponentProps } from './types';
import { getViewBox } from '../../../common/lib';
import { ShapeDrawerComponent } from '../..';

export function ShapeComponent({
  onLoaded,
  parentNode,
  shape: shapeType,
  fill,
  border,
  borderWidth,
  maintainAspect,
}: ShapeComponentProps) {
  const parentNodeDimensions = useResizeObserver(parentNode);
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: parentNode.offsetWidth,
    height: parentNode.offsetHeight,
  });
  const [shapeData, setShapeData] = useState<SvgConfig>(getDefaultShapeData());

  useEffect(() => {
    setDimensions({
      width: parentNode.offsetWidth,
      height: parentNode.offsetHeight,
    });
    onLoaded();
  }, [parentNode, parentNodeDimensions, onLoaded]);

  const shapeRef = useCallback<RefCallback<ShapeRef>>((node) => {
    if (node !== null) setShapeData(node.getData());
  }, []);

  const strokeWidth = Math.max(borderWidth, 0);

  const shapeContentAttributes: ShapeContentAttributes = {
    strokeWidth: String(strokeWidth),
    vectorEffect: 'non-scaling-stroke',
    strokeMiterlimit: '999',
  };
  if (fill) shapeContentAttributes.fill = fill;
  if (border) shapeContentAttributes.stroke = border;

  const { width, height } = dimensions;

  const shapeAttributes: ShapeAttributes = {
    width,
    height,
    overflow: 'visible',
    preserveAspectRatio: maintainAspect ? 'xMidYMid meet' : 'none',
    viewBox: getViewBox(shapeData.viewBox, {
      borderOffset: strokeWidth,
      width,
      height,
    }),
  };

  parentNode.style.lineHeight = '0';

  return (
    <div className="shapeAligner">
      <ShapeDrawerComponent
        shapeType={shapeType}
        shapeContentAttributes={shapeContentAttributes}
        shapeAttributes={shapeAttributes}
        ref={shapeRef}
      />
    </div>
  );
}
