import { createContext, useContext, useState, ReactNode } from "react";

export interface ScanPhoto {
  url: string;
  name: string;
  type: "whole" | "leaf" | "soil";
  isDemo?: boolean;
}

export interface ScanData {
  photos: ScanPhoto[];
  cropType: string;
  soilType: string;
  growthStage: string;
  fieldName: string;
  isDemo?: boolean;
}

interface ScanStoreType {
  scanData: ScanData | null;
  setScanData: (data: ScanData) => void;
  clearScan: () => void;
}

const ScanStore = createContext<ScanStoreType | null>(null);

export const DEMO_SCAN_PHOTOS: ScanPhoto[] = [
  {
    url: "/demo/whole-plant.jpg",
    name: "demo-whole-plant.jpg",
    type: "whole",
    isDemo: true,
  },
  {
    url: "/demo/leaf-closeup.jpg",
    name: "demo-leaf-closeup.jpg",
    type: "leaf",
    isDemo: true,
  },
  {
    url: "/demo/soil-root.jpg",
    name: "demo-soil-root.jpg",
    type: "soil",
    isDemo: true,
  },
];

export const DEMO_SCAN_DATA: ScanData = {
  photos: DEMO_SCAN_PHOTOS,
  cropType: "Tomato",
  soilType: "Loamy Soil",
  growthStage: "Vegetative Stage",
  fieldName: "Demo Field",
  isDemo: true,
};

export function validateCropImage(photo: ScanPhoto | null | undefined) {
  if (!photo) return false;

  if (photo.isDemo) return true;

  const name = photo.name.toLowerCase();

  const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
  const hasValidExtension = allowedExtensions.some((ext) => name.endsWith(ext));

  if (!hasValidExtension) return false;

  const cropKeywords = [
    "crop",
    "plant",
    "leaf",
    "leaves",
    "soil",
    "root",
    "farm",
    "field",
    "tomato",
    "wheat",
    "rice",
    "cotton",
    "maize",
    "corn",
    "sugarcane",
    "potato",
    "onion",
    "chilli",
    "soybean",
  ];

  return cropKeywords.some((keyword) => name.includes(keyword));
}

export function validateScanPhotos(photos: ScanPhoto[]) {
  if (!photos || photos.length !== 3) return false;

  const hasWhole = photos.some((p) => p.type === "whole");
  const hasLeaf = photos.some((p) => p.type === "leaf");
  const hasSoil = photos.some((p) => p.type === "soil");

  if (!hasWhole || !hasLeaf || !hasSoil) return false;

  return photos.every((photo) => validateCropImage(photo));
}

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