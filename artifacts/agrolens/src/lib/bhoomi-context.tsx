import { createContext, useContext, useState, ReactNode } from "react";

interface BhoomiCtx {
  open: boolean;
  setOpen: (v: boolean) => void;
}

const Ctx = createContext<BhoomiCtx>({ open: false, setOpen: () => {} });

export function BhoomiProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <Ctx.Provider value={{ open, setOpen }}>{children}</Ctx.Provider>;
}

export function useBhoomi() {
  return useContext(Ctx);
}
