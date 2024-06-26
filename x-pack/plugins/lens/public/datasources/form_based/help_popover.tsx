/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { ReactNode } from 'react';
import {
  EuiIcon,
  EuiLink,
  EuiLinkButtonProps,
  EuiPopover,
  EuiPopoverProps,
  EuiWrappingPopover,
  EuiWrappingPopoverProps,
  EuiPopoverTitle,
  EuiText,
} from '@elastic/eui';
import { KibanaRenderContextProvider } from '@kbn/react-kibana-context-render';
import { StartServices } from '../../types';
import './help_popover.scss';

export const HelpPopoverButton = ({
  children,
  onClick,
}: {
  children: string;
  onClick: EuiLinkButtonProps['onClick'];
}) => {
  return (
    <EuiText size="xs">
      <EuiLink onClick={onClick}>
        <EuiIcon className="lnsHelpPopover__buttonIcon" size="s" type="help" />

        {children}
      </EuiLink>
    </EuiText>
  );
};

export const HelpPopover = ({
  anchorPosition,
  button,
  children,
  closePopover,
  isOpen,
  title,
}: {
  anchorPosition?: EuiPopoverProps['anchorPosition'];
  button: EuiPopoverProps['button'];
  children: ReactNode;
  closePopover: EuiPopoverProps['closePopover'];
  isOpen: EuiPopoverProps['isOpen'];
  title?: string;
}) => {
  return (
    <EuiPopover
      anchorPosition={anchorPosition}
      button={button}
      className="lnsHelpPopover"
      closePopover={closePopover}
      isOpen={isOpen}
      ownFocus
      panelClassName="lnsHelpPopover__panel"
      panelPaddingSize="none"
    >
      {title && <EuiPopoverTitle paddingSize="m">{title}</EuiPopoverTitle>}

      <EuiText className="lnsHelpPopover__content" size="s">
        {children}
      </EuiText>
    </EuiPopover>
  );
};

export const WrappingHelpPopover = ({
  anchorPosition,
  button,
  children,
  closePopover,
  isOpen,
  title,
  startServices,
}: {
  anchorPosition?: EuiWrappingPopoverProps['anchorPosition'];
  button: EuiWrappingPopoverProps['button'];
  children: ReactNode;
  closePopover: EuiWrappingPopoverProps['closePopover'];
  isOpen: EuiWrappingPopoverProps['isOpen'];
  title?: string;
  startServices: StartServices;
}) => {
  return (
    <KibanaRenderContextProvider {...startServices}>
      <EuiWrappingPopover
        anchorPosition={anchorPosition}
        button={button}
        className="lnsHelpPopover"
        closePopover={closePopover}
        isOpen={isOpen}
        ownFocus
        panelClassName="lnsHelpPopover__panel"
        panelPaddingSize="none"
      >
        {title && <EuiPopoverTitle paddingSize="m">{title}</EuiPopoverTitle>}

        <EuiText className="lnsHelpPopover__content" size="s">
          {children}
        </EuiText>
      </EuiWrappingPopover>
    </KibanaRenderContextProvider>
  );
};
