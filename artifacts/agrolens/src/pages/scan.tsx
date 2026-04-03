import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  Camera, CloudUpload, Leaf, Microscope, TreeDeciduous,
  ChevronDown, X, CheckCircle2, Loader2, ImageIcon,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useScan } from "@/lib/scan-store";

const CROP_TYPES = [
  "Rice", "Wheat", "Cotton", "Sugarcane", "Maize", "Soybean",
  "Groundnut", "Mustard", "Tomato", "Potato", "Onion", "Chickpea",
  "Lentil", "Mango", "Banana", "Other",
];

const SOIL_TYPES = [
  "Alluvial", "Black (Regur)", "Red & Yellow", "Laterite",
  "Arid (Desert)", "Loamy", "Sandy", "Clay", "Silt",
];

const CAPTURE_GUIDES = [
  {
    icon: TreeDeciduous,
    title: "Whole Plant",
    desc: "Step back 1–2 metres and capture the full plant",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
  {
    icon: Leaf,
    title: "Leaf Close-up",
    desc: "Get 15–20 cm close to show any spots or discolouration",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    icon: Microscope,
    title: "Soil / Root",
    desc: "Show the base of the plant and surrounding soil",
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
];

const STAGES = [
  "Uploading image...",
  "Pre-processing pixels...",
  "Running disease model...",
  "Comparing symptom database...",
  "Generating diagnosis...",
];

export default function ScanPage() {
  const [, navigate] = useLocation();
  const { setScanData } = useScan();

  const [cropType, setCropType] = useState("");
  const [soilType, setSoilType] = useState("");
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (!f.type.startsWith("image/")) {
      setError("Please upload a valid image file (JPG, PNG, WEBP).");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError("File is too large. Please use an image under 10 MB.");
      return;
    }
    setError("");
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  }, []);

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setProgress(0);
    setStage(0);
    if (fileRef.current) fileRef.current.value = "";
  };

  const canAnalyze = file && cropType && soilType;

  const runAnalysis = async () => {
    if (!canAnalyze || !preview) return;
    setAnalyzing(true);
    setProgress(0);
    setStage(0);

    const totalDuration = 3200;
    const steps = STAGES.length;
    for (let i = 0; i <= 100; i++) {
      await new Promise((r) => setTimeout(r, totalDuration / 100));
      setProgress(i);
      setStage(Math.min(Math.floor((i / 100) * steps), steps - 1));
    }

    setScanData({
      imageUrl: preview,
      imageName: file!.name,
      cropType,
      soilType,
    });

    navigate("/scan/result");
  };

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="max-w-2xl mx-auto space-y-5"
      >
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Crop Scan</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Upload a clear photo and let BHOOMI's AI detect diseases instantly.
          </p>
        </div>

        {/* Crop & Soil selectors */}
        <Card className="rounded-2xl border-border/60 shadow-sm">
          <CardContent className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium flex items-center gap-1.5">
                <Leaf className="h-3.5 w-3.5 text-primary" /> Crop Type
              </Label>
              <Select onValueChange={setCropType} value={cropType}>
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue placeholder="Select your crop" />
                </SelectTrigger>
                <SelectContent>
                  {CROP_TYPES.map((c) => (
                    <SelectItem key={c} value={c.toLowerCase()}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium flex items-center gap-1.5">
                <ImageIcon className="h-3.5 w-3.5 text-amber-500" /> Soil Type
              </Label>
              <Select onValueChange={setSoilType} value={soilType}>
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue placeholder="Select soil type" />
                </SelectTrigger>
                <SelectContent>
                  {SOIL_TYPES.map((s) => (
                    <SelectItem key={s} value={s.toLowerCase().replace(/[\s/()&]/g, "-")}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Capture Guide */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
            How to take a good photo
          </p>
          <div className="grid grid-cols-3 gap-3">
            {CAPTURE_GUIDES.map(({ icon: Icon, title, desc, color, bg }) => (
              <Card key={title} className="rounded-2xl border-border/60 shadow-sm">
                <CardContent className="p-3 sm:p-4 text-center space-y-2">
                  <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mx-auto`}>
                    <Icon className={`h-5 w-5 ${color}`} />
                  </div>
                  <p className="text-xs font-semibold text-foreground">{title}</p>
                  <p className="text-[11px] text-muted-foreground leading-snug hidden sm:block">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Upload Zone */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
            Upload Image
          </p>
          <AnimatePresence mode="wait">
            {!preview ? (
              <motion.div
                key="dropzone"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onClick={() => fileRef.current?.click()}
                  className={cn(
                    "relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 group",
                    dragging
                      ? "border-primary bg-primary/5 scale-[1.01]"
                      : "border-border hover:border-primary/50 hover:bg-primary/3"
                  )}
                >
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={onInputChange}
                  />
                  <div className="flex flex-col items-center gap-3">
                    <motion.div
                      animate={dragging ? { scale: 1.15, y: -4 } : { scale: 1, y: 0 }}
                      className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center transition-colors duration-200",
                        dragging ? "bg-primary text-primary-foreground" : "bg-muted group-hover:bg-primary/10"
                      )}
                    >
                      <CloudUpload className={cn("h-7 w-7 transition-colors", dragging ? "text-white" : "text-muted-foreground group-hover:text-primary")} />
                    </motion.div>

                    <div>
                      <p className="font-semibold text-foreground text-sm">
                        {dragging ? "Release to upload" : "Drag & drop your photo here"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        or tap to browse / use camera
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-full px-3 py-1.5 text-xs font-medium cursor-pointer">
                        <Camera className="h-3.5 w-3.5" />
                        Take Photo
                      </div>
                      <div className="flex items-center gap-1.5 bg-muted text-muted-foreground rounded-full px-3 py-1.5 text-xs font-medium">
                        <CloudUpload className="h-3.5 w-3.5" />
                        Choose File
                      </div>
                    </div>

                    <p className="text-[11px] text-muted-foreground">
                      JPG, PNG, WEBP · Max 10 MB
                    </p>
                  </div>
                </div>
                {error && (
                  <p className="text-destructive text-xs mt-2 flex items-center gap-1.5">
                    <X className="h-3.5 w-3.5" /> {error}
                  </p>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <Card className="rounded-2xl border-border/60 shadow-sm overflow-hidden">
                  <div className="relative">
                    <img
                      src={preview}
                      alt="Uploaded crop"
                      className="w-full h-52 object-cover"
                    />
                    {!analyzing && (
                      <button
                        onClick={clearFile}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                        aria-label="Remove image"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                      <p className="text-white text-xs font-medium truncate">{file?.name}</p>
                    </div>
                  </div>
                  <CardContent className="p-4 flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">Image ready for analysis</p>
                      <p className="text-xs text-muted-foreground">
                        {cropType ? `${cropType.charAt(0).toUpperCase() + cropType.slice(1)} · ` : ""}
                        {file ? `${(file.size / 1024).toFixed(0)} KB` : ""}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Validation hints */}
        {file && (!cropType || !soilType) && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-amber-600 text-xs flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2"
          >
            <ChevronDown className="h-3.5 w-3.5 shrink-0" />
            Please select your crop type and soil type before analysing.
          </motion.p>
        )}

        {/* Analyse Button */}
        <AnimatePresence mode="wait">
          {analyzing ? (
            <motion.div
              key="progress"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <Card className="rounded-2xl border-border/60 shadow-sm overflow-hidden">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 className="h-5 w-5 text-primary" />
                    </motion.div>
                    <div className="flex-1">
                      <motion.p
                        key={stage}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm font-semibold text-foreground"
                      >
                        {STAGES[stage]}
                      </motion.p>
                      <p className="text-xs text-muted-foreground">BHOOMI AI is working…</p>
                    </div>
                    <span className="text-sm font-bold text-primary tabular-nums">{progress}%</span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-primary"
                      style={{ width: `${progress}%` }}
                      transition={{ ease: "linear" }}
                    />
                  </div>

                  {/* Stage dots */}
                  <div className="flex items-center justify-between">
                    {STAGES.map((s, i) => (
                      <div key={s} className="flex flex-col items-center gap-1">
                        <motion.div
                          className={cn(
                            "w-2 h-2 rounded-full transition-colors duration-300",
                            i <= stage ? "bg-primary" : "bg-muted"
                          )}
                          animate={i === stage ? { scale: [1, 1.4, 1] } : {}}
                          transition={{ repeat: Infinity, duration: 0.8 }}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div key="btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Button
                onClick={runAnalysis}
                disabled={!canAnalyze}
                className="w-full h-13 rounded-xl text-base font-semibold gap-2 shadow-sm"
                size="lg"
              >
                <Microscope className="h-5 w-5" />
                Analyse with BHOOMI AI
              </Button>
              {!canAnalyze && (
                <p className="text-center text-xs text-muted-foreground mt-2">
                  {!file ? "Upload an image to continue" : "Select crop and soil type"}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AppLayout>
  );
}
