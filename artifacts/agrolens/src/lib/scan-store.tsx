import { createContext, useContext, useState, ReactNode } from "react";

export interface ScanData {
  imageUrl: string;
  imageName: string;
  cropType: string;
  soilType: string;
}

interface ScanStoreType {
  scanData: ScanData | null;
  setScanData: (data: ScanData) => void;
  clearScan: () => void;
}

const ScanStore = createContext<ScanStoreType | null>(null);

export function ScanProvider({ children }: { children: ReactNode }) {
  const [scanData, setScanDataState] = useState<ScanData | null>(null);

  const setScanData = (data: ScanData) => setScanDataState(data);
  const clearScan = () => setScanDataState(null);

  return (
    <ScanStore.Provider value={{ scanData, setScanData, clearScan }}>
      {children}
    </ScanStore.Provider>
  );
}

export function useScan() {
  const ctx = useContext(ScanStore);
  if (!ctx) throw new Error("useScan must be within ScanProvider");
  return ctx;
}
