import React from 'react';
import {
  AnchorProgressProps,
  ProgressProvider,
  ProgressProviderProps,
  RouterProgressProps,
} from '@lop-town/bprogress-react';

export interface NextProgressProviderComponentProps
  extends ProgressProviderProps {
  ProgressComponent: React.ComponentType<
    RouterProgressProps | AnchorProgressProps
  >;
}

export const NextProgressProvider = ({
  children,
  ProgressComponent,
  color,
  height,
  options,
  spinnerPosition,
  style,
  disableStyle,
  nonce,
  stopDelay,
  delay,
  startPosition,
  disableSameURL,
  shallowRouting,
  ...props
}: NextProgressProviderComponentProps) => {
  return (
    <ProgressProvider
      color={color}
      height={height}
      options={options}
      spinnerPosition={spinnerPosition}
      style={style}
      disableStyle={disableStyle}
      nonce={nonce}
      stopDelay={stopDelay}
      delay={delay}
      startPosition={startPosition}
      disableSameURL={disableSameURL}
      shallowRouting={shallowRouting}
    >
      <ProgressComponent
        stopDelay={stopDelay}
        delay={delay}
        startPosition={startPosition}
        disableSameURL={disableSameURL}
        shallowRouting={shallowRouting}
        {...props}
      />
      {children}
    </ProgressProvider>
  );
};
