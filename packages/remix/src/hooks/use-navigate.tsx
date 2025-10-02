import { useCallback } from 'react';
import { useNavigate as useRemixNavigate } from '@remix-run/react';
import { isSameURL } from '@lop-town/bprogress-core';
import { ProgressNavigateFunction, NavigateProgressOptions } from '../types';
import { useProgress } from '@lop-town/bprogress-react';

/**
 * Custom hook that extends Remix's useNavigate with progress bar functionality.
 *
 * @param options - Default progress options (e.g., showProgress, startPosition, disableSameURL)
 * @returns An enhanced navigate function with an extra parameter for progress options.
 */
export function useNavigate(
  options?: NavigateProgressOptions,
): ProgressNavigateFunction {
  // Destructure customNavigate (if provided) and default progress options.
  const { customNavigate, ...defaultProgressOptions } = options || {};
  const {
    start,
    stop,
    disableSameURL: providerDisableSameURL,
    startPosition: providerStartPosition,
    delay: providerDelay,
    stopDelay: providerStopDelay,
  } = useProgress();

  // Use a custom navigate function if provided, otherwise use Remix's built-in useNavigate.
  const useSelectedNavigate = useCallback(() => {
    if (customNavigate) return customNavigate();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useRemixNavigate();
  }, [customNavigate]);

  // Retrieve the navigate function.
  const navigate = useSelectedNavigate();

  // Create the enhanced navigate function that supports progress options.
  const enhancedNavigate = useCallback(
    (to, navOptions, progressOptions) => {
      // Merge default progress options with the ones provided during the call.
      const mergedOptions = { ...defaultProgressOptions, ...progressOptions };

      const localDisableSameURL =
        mergedOptions.disableSameURL !== undefined
          ? mergedOptions.disableSameURL
          : providerDisableSameURL;
      const localStartPosition =
        mergedOptions.startPosition !== undefined
          ? mergedOptions.startPosition
          : providerStartPosition;
      const localDelay =
        mergedOptions.delay !== undefined ? mergedOptions.delay : providerDelay;
      const localStopDelay =
        mergedOptions.stopDelay !== undefined
          ? mergedOptions.stopDelay
          : providerStopDelay;

      // Case 1: Navigation by delta (number)
      if (typeof to === 'number') {
        if (mergedOptions?.showProgress !== false) {
          // Set starting position if specified.
          start(localStartPosition, localDelay);
        }
        // Perform delta navigation
        const result = navigate(to as number);
        if (mergedOptions?.showProgress !== false) {
          setTimeout(() => {
            stop(localStopDelay);
          }, localDelay || 0);
        }
        return result;
      } else {
        // Case 2: Navigation using a URL (string or Partial<Path>)
        let targetUrl: URL;
        try {
          // Build the target URL based on the provided value.
          if (typeof to === 'string') {
            targetUrl = new URL(to, window.location.href);
          } else {
            const {
              pathname = window.location.pathname,
              search = '',
              hash = '',
            } = to;
            targetUrl = new URL(pathname + search + hash, window.location.href);
          }
        } catch (error) {
          console.error(error);
          // If URL creation fails, fall back to normal navigation.
          return navigate(to, navOptions);
        }

        const currentUrl = new URL(window.location.href);
        const sameURL = isSameURL(targetUrl, currentUrl);

        // If target URL is the same and disableSameURL is enabled, navigate without progress.
        if (sameURL && localDisableSameURL) {
          return navigate(to, navOptions);
        }

        // Start the progress bar if enabled.
        if (mergedOptions?.showProgress !== false) {
          start(localStartPosition, localDelay);
        }

        // Execute the navigation using Remix's navigate function.
        const result = navigate(to, navOptions);

        // If navigating to the same URL, finish the progress bar immediately.
        if (sameURL && mergedOptions?.showProgress !== false) {
          setTimeout(() => {
            stop(localStopDelay);
          }, localDelay || 0);
        }

        return result;
      }
    },
    [
      defaultProgressOptions,
      providerDisableSameURL,
      providerStartPosition,
      providerDelay,
      providerStopDelay,
      navigate,
      start,
      stop,
    ],
  ) as ProgressNavigateFunction;

  return enhancedNavigate;
}
