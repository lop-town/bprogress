/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  AppRouterInstance,
  AppRouterProgressInstance,
  InferPrefetchOptions,
  InferRouterOptions,
  RouterProgressOptions,
} from '../types';
import { useRouter as useNextRouter } from 'next/navigation.js';
import { useRef } from 'react';
import { isSameURL } from '@lop-town/bprogress-core';
import { AppRouterInstance as NextAppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useProgress } from '@lop-town/bprogress-react';

/**
 * Helper function that removes the first path segment from a URL.
 * This is used to ignore the locale prefix in i18n configurations.
 */
function removeFirstPathSegment(url: URL): URL {
  const parts = url.pathname.split('/');
  if (parts.length > 1 && parts[1]) {
    parts.splice(1, 1);
    url.pathname = parts.join('/') || '/';
  }
  return url;
}

/**
 * Custom hook that extends the router (Next.js or custom) with progress bar functionality.
 *
 * With this signature, if a custom router is provided, its push method's options are automatically inferred.
 *
 * @param options Progress bar options and/or custom router.
 * @returns An extended router with push, replace, prefetch, back, refresh, and forward methods that manage the progress bar.
 */
export function useRouter<
  Custom extends AppRouterInstance = NextAppRouterInstance,
  ROpts = InferRouterOptions<Custom>,
  POpts = InferPrefetchOptions<Custom>,
>(
  options?: RouterProgressOptions & { customRouter?: () => Custom },
): AppRouterProgressInstance<ROpts, POpts> {
  const { customRouter, ...defaultProgressOptions } = options || {};
  const router: AppRouterInstance = customRouter
    ? customRouter()
    : // eslint-disable-next-line react-hooks/rules-of-hooks
      useNextRouter();
  const {
    start,
    stop,
    disableSameURL: providerDisableSameURL,
    startPosition: providerStartPosition,
    delay: providerDelay,
    stopDelay: providerStopDelay,
  } = useProgress();

  // Using a ref to keep a stable reference of the extended router.
  const extendedRouterRef = useRef<AppRouterProgressInstance<
    ROpts,
    POpts
  > | null>(null);

  /**
   * Generic function to create a handler for methods that require an href (push, replace).
   * It extracts the progress options and passes the rest as router-specific options.
   */
  function createHandler<Fn extends (href: string, opts?: any) => void>(
    fn: Fn,
  ) {
    return (href: string, options?: any): void => {
      const {
        showProgress,
        startPosition,
        disableSameURL,
        basePath,
        i18nPath,
        delay,
        stopDelay,
        ...routerOpts
      } = options || {};
      const progressOpts = {
        ...defaultProgressOptions,
        showProgress,
        startPosition,
        disableSameURL,
        basePath,
        i18nPath,
        delay,
        stopDelay,
      };

      const localDisableSameURL =
        progressOpts.disableSameURL !== undefined
          ? progressOpts.disableSameURL
          : providerDisableSameURL;
      const localStartPosition =
        progressOpts.startPosition !== undefined
          ? progressOpts.startPosition
          : providerStartPosition;
      const localDelay =
        progressOpts.delay !== undefined ? progressOpts.delay : providerDelay;
      const localStopDelay =
        progressOpts.stopDelay !== undefined
          ? progressOpts.stopDelay
          : providerStopDelay;

      if (progressOpts.showProgress === false) {
        return fn(href, routerOpts);
      }

      let currentUrl = new URL(location.href);
      const targetUrl = new URL(href, location.href);

      if (progressOpts.i18nPath) {
        currentUrl = removeFirstPathSegment(currentUrl);
      }

      if (progressOpts.basePath) {
        targetUrl.pathname =
          progressOpts.basePath +
          (targetUrl.pathname !== '/' ? targetUrl.pathname : '');
      }

      const sameURL = isSameURL(targetUrl, currentUrl);

      if (sameURL && localDisableSameURL) {
        return fn(href, routerOpts);
      }

      start(localStartPosition, localDelay);

      setTimeout(() => {
        if (sameURL) stop(localStopDelay);
      }, localDelay || 0);

      return fn(href, routerOpts);
    };
  }

  /**
   * Handler for methods that do not require an href (back, refresh, forward).
   */
  function createNoHrefHandler<Fn extends (opts?: any) => void>(fn: Fn) {
    return (options?: any): void => {
      const {
        showProgress,
        startPosition,
        disableSameURL,
        basePath,
        i18nPath,
        delay,
        stopDelay,
        ...routerOpts
      } = options || {};
      const progressOpts = {
        ...defaultProgressOptions,
        showProgress,
        startPosition,
        disableSameURL,
        basePath,
        i18nPath,
        delay,
        stopDelay,
      };

      const localStartPosition =
        progressOpts.startPosition !== undefined
          ? progressOpts.startPosition
          : providerStartPosition;
      const localDelay =
        progressOpts.delay !== undefined ? progressOpts.delay : providerDelay;
      const localStopDelay =
        progressOpts.stopDelay !== undefined
          ? progressOpts.stopDelay
          : providerStopDelay;

      if (progressOpts.showProgress === false) {
        return fn(routerOpts);
      }

      start(localStartPosition, localDelay);

      const result = fn(routerOpts);

      setTimeout(() => {
        stop(localStopDelay);
      }, localDelay || 0);

      return result;
    };
  }

  /**
   * Handler for the prefetch method.
   */
  function createPrefetchHandler<Fn extends (href: string, opts?: any) => void>(
    fn: Fn,
  ) {
    return (href: string, options?: POpts): void => {
      return fn(href, options);
    };
  }

  if (!extendedRouterRef.current) {
    extendedRouterRef.current = {
      ...router,
      push: createHandler(router.push),
      replace: createHandler(router.replace),
      prefetch: createPrefetchHandler(router.prefetch),
      back: createNoHrefHandler(router.back),
      refresh: createNoHrefHandler(router.refresh),
      forward: createNoHrefHandler(router.forward),
    } as AppRouterProgressInstance<ROpts, POpts>;
  } else {
    extendedRouterRef.current.push = createHandler(router.push);
    extendedRouterRef.current.replace = createHandler(router.replace);
    extendedRouterRef.current.prefetch = createPrefetchHandler(router.prefetch);
    extendedRouterRef.current.back = createNoHrefHandler(router.back);
    extendedRouterRef.current.refresh = createNoHrefHandler(router.refresh);
    extendedRouterRef.current.forward = createNoHrefHandler(router.forward);
  }

  return extendedRouterRef.current;
}
