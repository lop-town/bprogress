import {
  useAnchorProgress,
  withMemo,
  type AnchorProgressProps,
} from '@lop-town/bprogress-react';
import { usePathname, useSearchParams } from 'next/navigation.js';

const AppProgressComponent = (props: AnchorProgressProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useAnchorProgress(props, [pathname, searchParams]);

  return null;
};

export const AppProgress = withMemo(AppProgressComponent);

AppProgress.displayName = 'AppProgress';
