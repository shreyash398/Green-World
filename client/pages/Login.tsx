import { Navbar } from "@/components/layout/Navbar";
import { ParticleBackground } from "@/components/effects/ParticleBackground";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  Building2,
  Leaf,
  Users,
  Shield,
  ArrowRight,
  Sparkles,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export default function Login() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roles = [
    {
      id: "corporate",
      label: "Corporate",
      icon: Building2,
      description: "CSR teams tracking impact",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      id: "ngo",
      label: "NGO",
      icon: Leaf,
      description: "Partner organizations",
      gradient: "from-teal-500 to-cyan-500",
    },
    {
      id: "volunteer",
      label: "Volunteer",
      icon: Users,
      description: "Individual contributors",
      gradient: "from-cyan-500 to-emerald-500",
    },
    {
      id: "admin",
      label: "Admin",
      icon: Shield,
      description: "Platform administrators",
      gradient: "from-lime-500 to-emerald-500",
    },
  ];

  const dashboardMap: Record<string, string> = {
    corporate: "/corporate-dashboard",
    ngo: "/ngo-dashboard",
    volunteer: "/volunteer-dashboard",
    admin: "/admin-dashboard",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      toast.error("Please select a role");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isLogin) {
        const user = await login(email, password);
        toast.success(`Welcome back, ${user.name}!`);
        navigate(dashboardMap[user.role] || "/");
      } else {
        if (!name.trim()) {
          toast.error("Please enter your name");
          setIsSubmitting(false);
          return;
        }
        const user = await register({
          email,
          password,
          name,
          role: selectedRole,
        });
        toast.success(`Account created! Welcome, ${user.name}!`);
        navigate(dashboardMap[user.role] || "/");
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const handleGoogleLogin = async () => {
    if (!selectedRole) {
      toast.error("Please select a role first to continue with Google");
      return;
    }
    setIsGoogleLoading(true);
    // Simulate Google OAuth - in production, this would use real OAuth
    try {
      const user = await register({
        email: `google-${Date.now()}@gmail.com`,
        password: "google-oauth-token",
        name: "Google User",
        role: selectedRole,
      });
      toast.success(`Welcome, ${user.name}!`);
      navigate(dashboardMap[user.role]);
    } catch (error: any) {
      toast.error(error.message || "Google login failed");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Navbar />

      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <ParticleBackground count={30} />
        <div className="absolute inset-0 gradient-bg-radial" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid md:grid-cols-2 gap-12 items-center min-h-[700px]"
        >
          {/* Left side - Info */}
          <motion.div variants={fadeUp} className="space-y-8">
            <div className="space-y-4">
              <motion.div variants={fadeUp} className="badge-premium">
                <Sparkles className="w-4 h-4" />
                <span>{isLogin ? "Welcome Back" : "Join the Movement"}</span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="text-5xl md:text-6xl font-bold leading-[1.1]"
              >
                <span className="gradient-text-animated">
                  {isLogin ? "Sign In" : "Get Started"}
                </span>
                <br />
                <span className="text-foreground">
                  {isLogin ? "to Greenworld" : "Today"}
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-xl text-muted-foreground max-w-md"
              >
                {isLogin
                  ? "Track environmental impact and connect with stakeholders"
                  : "Join thousands making a measurable difference"}
              </motion.p>
            </div>

            <motion.div variants={fadeUp} className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <span className="w-8 h-1 gradient-bg rounded-full" />
                Choose Your Role
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {roles.map((role, idx) => {
                  const Icon = role.icon;
                  return (
                    <motion.button
                      key={role.id}
                      variants={scaleIn}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedRole(role.id)}
                      className={`group relative p-5 rounded-2xl border-2 transition-all text-left overflow-hidden ${selectedRole === role.id
                        ? "border-primary bg-primary/10 shadow-lg"
                        : "border-border bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:bg-card/80"
                        }`}
                    >
                      {/* Gradient overlay on selection */}
                      {selectedRole === role.id && (
                        <motion.div
                          layoutId="role-indicator"
                          className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-10`}
                          transition={{
                            type: "spring",
                            bounce: 0.2,
                            duration: 0.6,
                          }}
                        />
                      )}

                      <div className="relative z-10">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors ${selectedRole === role.id
                            ? "bg-primary text-white"
                            : "bg-primary/10 text-primary group-hover:bg-primary/20"
                            }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="font-semibold text-foreground">
                          {role.label}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {role.description}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="text-sm text-muted-foreground">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary font-semibold hover:underline"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </motion.div>
          </motion.div>

          {/* Right side - Form */}
          <motion.div variants={scaleIn} className="relative">
            {/* Glow behind card */}
            <div className="absolute inset-0 gradient-bg rounded-3xl blur-3xl opacity-20 animate-pulse-glow" />

            <div className="relative card-glass p-8 rounded-3xl shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.form
                  key={isLogin ? "login" : "signup"}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-foreground">
                      {isLogin ? "Welcome back!" : "Create account"}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {isLogin
                        ? "Enter your credentials to continue"
                        : "Fill in your details to get started"}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {!isLogin && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Full Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Users className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground"
                            required={!isLogin}
                          />
                        </div>
                      </motion.div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Lock className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {isLogin && (
                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                        />
                        <span className="text-muted-foreground">Remember me</span>
                      </label>
                      <a
                        href="#"
                        className="text-primary font-medium hover:underline"
                      >
                        Forgot password?
                      </a>
                    </div>
                  )}

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                    className="group w-full py-4 rounded-xl gradient-bg text-white font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Sparkles className="w-5 h-5" />
                    )}
                    {isSubmitting ? "Processing..." : (isLogin ? "Sign In" : "Create Account")}
                    {!isSubmitting && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                  </motion.button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-3 bg-card text-muted-foreground">
                        or continue with
                      </span>
                    </div>
                  </div>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGoogleLogin}
                    disabled={isGoogleLoading}
                    className="w-full py-3.5 rounded-xl border border-border bg-background/50 font-medium hover:bg-background transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isGoogleLoading ? (
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                    )}
                    {isGoogleLoading ? "Connecting..." : "Continue with Google"}
                  </motion.button>
                </motion.form>
              </AnimatePresence>

              <p className="text-xs text-muted-foreground text-center mt-6">
                By signing in, you agree to our{" "}
                <a href="#" className="text-primary hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
