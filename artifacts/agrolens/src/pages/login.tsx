import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Leaf, Mail, Lock, Eye, EyeOff, Zap, ArrowRight, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [, navigate] = useLocation();
  const { login, loginDemo } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = () => {
    setDemoLoading(true);
    setTimeout(() => {
      loginDemo();
      navigate("/dashboard");
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Hero Left Panel */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-primary to-emerald-800 relative overflow-hidden flex-col items-center justify-center p-12 text-white"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/5" />
          <div className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full bg-white/5" />
          <div className="absolute top-1/3 right-10 w-32 h-32 rounded-full bg-white/5" />
          {/* Decorative grid pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-md text-center">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <Leaf className="h-7 w-7 text-white" />
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold tracking-wide">AgroLens</div>
              <div className="text-xs text-white/70 font-medium">AI Crop Intelligence</div>
            </div>
          </motion.div>

          {/* Farmer illustration placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="w-48 h-48 mx-auto mb-8 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/20 flex items-center justify-center"
          >
            <Sprout className="h-24 w-24 text-white/80" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-3xl font-bold leading-tight mb-4"
          >
            AI-Powered Crop Intelligence for Smarter Farming Decisions.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-white/75 text-base leading-relaxed"
          >
            Detect crop diseases instantly, get intelligent recommendations, and optimize your harvest with the power of AI — right from your phone.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex items-center justify-center gap-6 text-white/60 text-sm"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-white">50K+</div>
              <div>Farmers</div>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <div className="text-2xl font-bold text-white">200+</div>
              <div>Diseases</div>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <div className="text-2xl font-bold text-white">15</div>
              <div>Languages</div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Form Panel */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-background"
      >
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-foreground">AgroLens</div>
              <div className="text-xs text-muted-foreground">AI Crop Intelligence</div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-1">Welcome back</h2>
            <p className="text-muted-foreground text-sm">Sign in to your AgroLens account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
              {errors.email && (
                <p className="text-destructive text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <button
                  type="button"
                  className="text-xs text-primary hover:underline font-medium"
                  onClick={() => {}}
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-12 rounded-xl"
                  {...register("password")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-destructive text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-xl text-sm font-semibold gap-2"
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
                  Sign In <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>

            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full h-12 rounded-xl text-sm font-semibold gap-2 border-primary/30 text-primary hover:bg-primary/5"
              onClick={handleDemo}
              disabled={demoLoading}
            >
              {demoLoading ? (
                <motion.div
                  className="w-4 h-4 border-2 border-primary/40 border-t-primary rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  Try Demo Access
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            New to AgroLens?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-primary font-semibold hover:underline"
            >
              Create account
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
