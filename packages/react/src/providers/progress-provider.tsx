import { BProgress, css, type BProgressOptions } from '../../../core/dist';
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from 'react';
import type { ProgressProviderProps, ProgressContextValue } from '../types';

const ProgressContext = createContext<ProgressContextValue | undefined>(
  undefined,
);

export const useProgress = (): ProgressContextValue => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

export const ProgressProvider = ({
  children,
  color = '#0A2FFF',
  height = '2px',
  options,
  spinnerPosition = 'top-right',
  style,
  disableStyle = false,
  nonce,
  shallowRouting = false,
  disableSameURL = true,
  startPosition = 0,
  delay = 0,
  stopDelay = 0,
}: ProgressProviderProps) => {
  const timer = useRef<NodeJS.Timeout | null>(null);
  const isAutoStopDisabled = useRef(false);

  const disableAutoStop = useCallback(
    () => (isAutoStopDisabled.current = true),
    [],
  );
  const enableAutoStop = useCallback(
    () => (isAutoStopDisabled.current = false),
    [],
  );
  const start = useCallback(
    (startPosition = 0, delay = 0, autoStopDisabled = false) => {
      if (autoStopDisabled) disableAutoStop();
      timer.current = setTimeout(() => {
        if (startPosition > 0) BProgress.set(startPosition);
        BProgress.start();
      }, delay);
    },
    [disableAutoStop],
  );

  const stop = useCallback(
    (stopDelay = 0, forcedStopDelay = 0) => {
      setTimeout(() => {
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => {
          if (!BProgress.isStarted()) return;
          BProgress.done();
          if (isAutoStopDisabled.current) enableAutoStop();
        }, stopDelay);
      }, forcedStopDelay);
    },
    [enableAutoStop],
  );

  const inc = useCallback((amount?: number) => BProgress.inc(amount), []);

  const dec = useCallback((amount?: number) => BProgress.dec(amount), []);

  const set = useCallback((n: number) => BProgress.set(n), []);

  const pause = useCallback(() => BProgress.pause(), []);

  const resume = useCallback(() => BProgress.resume(), []);

  const getOptions = useCallback(() => BProgress.settings, []);

  const setOptions = useCallback(
    (
      newOptions:
        | Partial<BProgressOptions>
        | ((prevOptions: BProgressOptions) => Partial<BProgressOptions>),
    ) => {
      const currentOptions = getOptions();
      const updates =
        typeof newOptions === 'function'
          ? newOptions(currentOptions)
          : newOptions;
      const nextOptions = { ...currentOptions, ...updates };
      BProgress.configure(nextOptions);
    },
    [getOptions],
  );

  const styles = useMemo(
    () => (
      <style nonce={nonce}>
        {style ||
          css({
            color,
            height,
            spinnerPosition,
          })}
      </style>
    ),
    [color, height, nonce, spinnerPosition, style],
  );

  BProgress.configure(options || {});

  return (
    <ProgressContext.Provider
      value={{
        start,
        stop,
        inc,
        dec,
        set,
        pause,
        resume,
        setOptions,
        getOptions,
        isAutoStopDisabled,
        disableAutoStop,
        enableAutoStop,
        shallowRouting,
        disableSameURL,
        startPosition,
        delay,
        stopDelay,
      }}
    >
      {!disableStyle ? styles : null}
      {children}
    </ProgressContext.Provider>
  );
};
