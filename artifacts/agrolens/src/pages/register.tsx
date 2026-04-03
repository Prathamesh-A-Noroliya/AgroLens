import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Leaf, User, Phone, Mail, Lock, Eye, EyeOff,
  MapPin, Sprout, FlaskConical, CheckCircle2, ArrowRight, ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/auth";

const STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
  "Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh",
];

const CROP_TYPES = [
  "Rice","Wheat","Cotton","Sugarcane","Maize","Soybean","Groundnut","Mustard",
  "Tomato","Potato","Onion","Chickpea","Lentil","Mango","Banana","Other",
];

const SOIL_TYPES = [
  "Alluvial","Black (Regur)","Red & Yellow","Laterite","Arid (Desert)",
  "Saline","Peaty (Marshy)","Forest / Mountain","Loamy","Sandy","Clay","Silt",
];

const registerSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  state: z.string().min(1, "Select your state"),
  cropType: z.string().min(1, "Select your primary crop"),
  soilType: z.string().min(1, "Select your soil type"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [, navigate] = useLocation();
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [farmerId, setFarmerId] = useState<string | null>(null);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      const id = await registerUser(data);
      setFarmerId(id);
    } finally {
      setLoading(false);
    }
  };

  if (farmerId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, type: "spring" }}
          className="w-full max-w-md text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </motion.div>

          <h2 className="text-2xl font-bold mb-2 text-foreground">Registration Successful!</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Welcome to AgroLens. Your Farmer ID has been generated.
          </p>

          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-6">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2">Your Farmer ID</p>
            <p className="text-3xl font-bold text-primary tracking-wider font-mono">{farmerId}</p>
            <p className="text-xs text-muted-foreground mt-2">Save this ID for future reference</p>
          </div>

          <Button
            onClick={() => navigate("/dashboard")}
            className="w-full h-12 rounded-xl font-semibold gap-2"
          >
            Go to Dashboard <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-lg mx-auto"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate("/login")}
            className="w-9 h-9 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <Leaf className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-foreground">AgroLens</div>
              <div className="text-[10px] text-muted-foreground">Create your account</div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-1">Join AgroLens</h1>
          <p className="text-muted-foreground text-sm">Start your AI-powered farming journey today</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="fullName"
                placeholder="Ramesh Patil"
                className="pl-10 h-12 rounded-xl"
                {...register("fullName")}
              />
            </div>
            {errors.fullName && <p className="text-destructive text-xs">{errors.fullName.message}</p>}
          </div>

          {/* Mobile */}
          <div className="space-y-1.5">
            <Label htmlFor="mobile" className="text-sm font-medium">Mobile Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <div className="absolute left-9 top-1/2 -translate-y-1/2 text-sm text-muted-foreground border-r border-border pr-2 leading-none pointer-events-none">
                +91
              </div>
              <Input
                id="mobile"
                type="tel"
                placeholder="9876543210"
                className="pl-20 h-12 rounded-xl"
                maxLength={10}
                {...register("mobile")}
              />
            </div>
            {errors.mobile && <p className="text-destructive text-xs">{errors.mobile.message}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="email"
                type="email"
                placeholder="farmer@example.com"
                className="pl-10 h-12 rounded-xl"
                {...register("email")}
              />
            </div>
            {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-sm font-medium">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
                className="pl-10 pr-10 h-12 rounded-xl"
                {...register("password")}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-destructive text-xs">{errors.password.message}</p>}
          </div>

          {/* State */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" /> State
            </Label>
            <Select onValueChange={(v) => setValue("state", v)}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Select your state" />
              </SelectTrigger>
              <SelectContent className="max-h-56">
                {STATES.map((s) => (
                  <SelectItem key={s} value={s.toLowerCase().replace(/\s+/g, "-")}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.state && <p className="text-destructive text-xs">{errors.state.message}</p>}
          </div>

          {/* Crop & Soil in a row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium flex items-center gap-1.5">
                <Sprout className="h-3.5 w-3.5 text-muted-foreground" /> Crop Type
              </Label>
              <Select onValueChange={(v) => setValue("cropType", v)}>
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Select crop" />
                </SelectTrigger>
                <SelectContent className="max-h-52">
                  {CROP_TYPES.map((c) => (
                    <SelectItem key={c} value={c.toLowerCase()}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.cropType && <p className="text-destructive text-xs">{errors.cropType.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium flex items-center gap-1.5">
                <FlaskConical className="h-3.5 w-3.5 text-muted-foreground" /> Soil Type
              </Label>
              <Select onValueChange={(v) => setValue("soilType", v)}>
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Select soil" />
                </SelectTrigger>
                <SelectContent className="max-h-52">
                  {SOIL_TYPES.map((s) => (
                    <SelectItem key={s} value={s.toLowerCase().replace(/[^a-z]/g, "-")}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.soilType && <p className="text-destructive text-xs">{errors.soilType.message}</p>}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 rounded-xl font-semibold gap-2 mt-2"
            disabled={loading}
          >
            {loading ? (
              <motion.div
                className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <>
                Create Account & Get Farmer ID <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6 pb-8">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-primary font-semibold hover:underline"
          >
            Sign in
          </button>
        </p>
      </motion.div>
    </div>
  );
}
