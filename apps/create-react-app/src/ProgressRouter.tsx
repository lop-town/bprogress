import { useAnchorProgress } from '@lop-town/bprogress-react';

export const ProgressRouter = () => {
  useAnchorProgress(
    {
      forcedStopDelay: 500,
    },
    [],
  );

  return null;
};
