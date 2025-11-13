// components/providers/branch-provider.tsx
'use client';

import { createContext, useContext, useState } from 'react';

type BranchCtxValue = {
  branchId: string;
  setBranchId: (id: string) => void;
};

const BranchCtx = createContext<BranchCtxValue | undefined>(undefined);

export function BranchProvider({
  initialBranchId,
  children,
}: {
  initialBranchId: string;
  children: React.ReactNode;
}) {
  const [branchId, setBranchId] = useState(initialBranchId);
  return (
    <BranchCtx.Provider value={{ branchId, setBranchId }}>
      {children}
    </BranchCtx.Provider>
  );
}

export const useBranch = (): BranchCtxValue => {
  const ctx = useContext(BranchCtx);
  if (!ctx) {
    throw new Error(
      'useBranch must be used inside a <BranchProvider> tree.'
    );
  }
  return ctx;
};