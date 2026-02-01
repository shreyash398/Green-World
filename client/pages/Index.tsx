import { Navbar } from "@/components/layout/Navbar";
import { ParticleBackground } from "@/components/effects/ParticleBackground";
import {
  TreePine,
  Droplets,
  Users,
  TrendingUp,
  Building2,
  Leaf,
  ArrowRight,
  Zap,
  CheckCircle2,
  Target,
  Globe,
  Shield,
  Star,
  Award,
  Lock,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";

// Global animation configuration
const pageTransition = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

// Animated counter hook
function useAnimatedCounter(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    const start = Date.now();
    const timer = setInterval(() => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress === 1) clearInterval(timer);
    }, 50);

    return () => clearInterval(timer);
  }, [isInView, end, duration]);

  return { count, ref };
}

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

const AnimatedSection = ({ children, className = "", id }: AnimatedSectionProps) => (
  <motion.section
    id={id}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    variants={pageTransition}
    className={className}
  >
    {children}
  </motion.section>
);

export default function Index() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const stats = {
    trees: useAnimatedCounter(15234),
    co2: useAnimatedCounter(8492),
    volunteers: useAnimatedCounter(342),
    projects: useAnimatedCounter(28),
  };

  const features = [
    {
      icon: Building2,
      title: "For Corporates",
      description:
        "Track CSR spending, verify impact, and generate compliant reports",
      gradient: "from-emerald-500 to-teal-500",
      href: "/about#corporate"
    },
    {
      icon: Leaf,
      title: "For NGOs",
      description:
        "Manage projects, upload progress photos, and request milestone funding",
      gradient: "from-teal-500 to-cyan-500",
      href: "/about#ngo"
    },
    {
      icon: Users,
      title: "For Volunteers",
      description:
        "Register for projects, track participation, and earn digital certificates",
      gradient: "from-cyan-500 to-emerald-500",
      href: "/about#volunteer"
    },
    {
      icon: TrendingUp,
      title: "Real-Time Analytics",
      description:
        "Live dashboards showing verified environmental impact metrics",
      gradient: "from-lime-500 to-emerald-500",
      href: "/impact"
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden selection:bg-primary/20">
      <Navbar />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden"
      >
        <ParticleBackground count={60} />
        <motion.div
          className="absolute inset-0 gradient-bg-radial"
          style={{ y: heroY, opacity: heroOpacity }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-10"
            >
              <motion.div variants={pageTransition}>
                <div className="badge-premium inline-flex items-center gap-2 py-3 px-6 text-base animate-pulse-glow">
                  <Zap className="w-5 h-5 text-accent" />
                  <span>The Future of Verified Environmental Impact</span>
                </div>
              </motion.div>

              <motion.div variants={pageTransition} className="space-y-6">
                <h1 className="text-6xl md:text-8xl font-bold leading-[1.05] tracking-tight">
                  <span className="gradient-text-animated">Transform</span>
                  <br />
                  <span className="text-foreground">Intent Into</span>
                  <br />
                  <span className="gradient-text">Visible Reality</span>
                </h1>
                <p className="text-2xl text-muted-foreground leading-relaxed max-w-xl">
                  Connect with global stakeholders to execute, verify, and celebrate
                  real-world environmental change. Transparency meets technology.
                </p>
              </motion.div>

              <motion.div
                variants={pageTransition}
                className="flex flex-col sm:flex-row gap-6"
              >
                <Link to="/login" className="group relative">
                  <div className="btn-gradient flex items-center justify-center gap-3 px-10 py-5 text-xl">
                    <Sparkles className="w-6 h-6" />
                    Join Now
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </div>
                </Link>
                <Link
                  to="/projects"
                  className="btn-glass flex items-center justify-center gap-3 px-10 py-5 text-xl border-2 border-primary/20"
                >
                  View Projects
                </Link>
              </motion.div>

              <motion.div
                variants={pageTransition}
                className="flex flex-wrap gap-8 pt-8 border-t border-border/50"
              >
                {[
                  { icon: CheckCircle2, text: "Free for Verified NGOs" },
                  { icon: Shield, text: "End-to-End Transparency" },
                  { icon: Target, text: "Impact-First Verification" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 text-lg font-medium text-muted-foreground"
                  >
                    <item.icon className="w-6 h-6 text-primary" />
                    {item.text}
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
              className="hidden lg:block relative"
            >
              <div className="relative w-full aspect-square max-w-xl mx-auto">
                <div className="absolute inset-0 gradient-bg rounded-full blur-[120px] opacity-20 animate-rotate-slow" />
                <div className="relative card-glass p-12 h-full flex flex-col items-center justify-center border-2 border-white/20 shadow-2xl overflow-hidden rounded-[3rem]">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-accent/10 pointer-events-none" />

                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="relative z-10"
                  >
                    <div className="w-48 h-48 gradient-bg rounded-full flex items-center justify-center shadow-[0_0_80px_rgba(var(--primary),0.4)]">
                      <Leaf className="w-24 h-24 text-white" />
                    </div>
                  </motion.div>

                  {/* Orbiting items */}
                  {[
                    { icon: TreePine, pos: "top-10 left-10", delay: 0 },
                    { icon: Droplets, pos: "top-20 right-10", delay: 1 },
                    { icon: Globe, pos: "bottom-20 left-20", delay: 2 },
                    { icon: Target, pos: "bottom-10 right-20", delay: 3 },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [-15, 15, -15], rotate: [0, 5, 0] }}
                      transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: item.delay }}
                      className={`absolute ${item.pos} p-5 card-glow bg-white/90 backdrop-blur-md rounded-2xl shadow-xl z-20`}
                    >
                      <item.icon className="w-8 h-8 text-primary" />
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, x: -60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="absolute -bottom-10 -left-10 card-premium p-6 shadow-2xl glass border-2 border-white/30"
                >
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Impact Delivered</p>
                  <p className="text-4xl font-black gradient-text">28,000+</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 }}
                  className="absolute -top-10 -right-10 card-premium p-6 shadow-2xl glass border-2 border-white/30"
                >
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Global Team</p>
                  <p className="text-4xl font-black gradient-text">1,400+</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <AnimatedSection className="relative py-32">
        <div className="absolute inset-0 gradient-bg-animated opacity-95" />
        <div className="absolute inset-0 noise-overlay" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            className="grid lg:grid-cols-4 md:grid-cols-2 gap-12"
          >
            {[
              { icon: TreePine, stat: stats.trees, label: "Trees Planted", color: "from-green-400 to-emerald-500" },
              { icon: Droplets, stat: stats.co2, label: "Tons CO₂ Offset", color: "from-blue-400 to-cyan-500" },
              { icon: Users, stat: stats.volunteers, label: "Active Volunteers", color: "from-amber-400 to-orange-500" },
              { icon: TrendingUp, stat: stats.projects, label: "Active Projects", color: "from-purple-400 to-pink-500" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={pageTransition}
                className="relative group p-8 rounded-[2rem] bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-500"
                ref={item.stat.ref}
              >
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${item.color} w-fit mx-auto mb-6 shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                  <item.icon className="w-10 h-10 text-white" />
                </div>
                <div className="text-5xl font-black text-white mb-2 text-glow tabular-nums">
                  {item.stat.count.toLocaleString()}
                </div>
                <p className="text-white/80 font-bold uppercase tracking-widest text-sm">{item.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Features Section */}
      <AnimatedSection className="py-32 relative section-gradient px-4">
        <ParticleBackground count={30} className="opacity-30" />

        <div className="relative max-w-7xl mx-auto">
          <motion.div variants={pageTransition} className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text-animated">Built for Impact</span>
              <br />
              <span className="text-foreground">at Every Scale</span>
            </h2>
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We provide the framework, technology, and connection to make environmental
              commitments a reality.
            </p>
          </motion.div>

          <motion.div variants={staggerContainer} className="grid lg:grid-cols-2 gap-10">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                variants={pageTransition}
                whileHover={{ y: -12 }}
                className="group relative"
              >
                <div className="card-premium p-12 h-full min-h-[400px] flex flex-col items-start rounded-[3rem] border-2 border-white transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(var(--primary),0.15)]">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 rounded-[3rem]`} />

                  <div className="flex justify-between w-full mb-10">
                    <div className="icon-container w-20 h-20 rounded-3xl group-hover:bg-primary group-hover:text-white transition-all duration-500">
                      <feature.icon className="w-10 h-10 text-primary group-hover:text-white" />
                    </div>
                    <span className="text-6xl font-black text-primary/10">0{idx + 1}</span>
                  </div>

                  <h3 className="text-3xl font-bold text-foreground mb-6 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-xl text-muted-foreground leading-relaxed mb-10">
                    {feature.description}
                  </p>

                  <Link
                    to={feature.href}
                    className="mt-auto inline-flex items-center gap-4 py-4 px-8 rounded-2xl bg-primary/10 text-primary font-bold hover:bg-primary hover:text-white transition-all duration-300 group/btn"
                  >
                    <span>Learn more</span>
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* How it Works Section */}
      <AnimatedSection className="py-32 bg-muted/20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={pageTransition} className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">How It Works</span>
            </h2>
            <p className="text-2xl text-muted-foreground max-w-2xl mx-auto">
              A high-precision path from ambition to verified results.
            </p>
          </motion.div>

          {/* Equal Dimension Cards - Using Grid and Aspect Ratio */}
          <motion.div
            variants={staggerContainer}
            className="grid lg:grid-cols-3 gap-12"
          >
            {[
              {
                number: 1,
                title: "Connect Your Team",
                description: "Onboard as a Corporate, NGO, Volunteer, or Admin. Full profile setup took less than 3 minutes.",
                icon: Users,
              },
              {
                number: 2,
                title: "Launch Project",
                description: "Define goals, funding needs, and specific environmental impact targets. Get audited and go live.",
                icon: Target,
              },
              {
                number: 3,
                title: "Track & Report",
                description: "Real-time metrics, location-tagged photos, and certified impact statements for your reports.",
                icon: TrendingUp,
              },
            ].map((step) => (
              <motion.div
                key={step.number}
                variants={pageTransition}
                className="group flex flex-col items-center"
              >
                <div className="relative mb-12 transform group-hover:scale-110 transition-transform duration-500">
                  <div className="absolute inset-x-[-20px] inset-y-[-20px] gradient-bg-animated rounded-full blur-2xl opacity-40 group-hover:opacity-70" />
                  <div className="relative w-28 h-28 rounded-full gradient-bg flex items-center justify-center text-4xl font-black text-white shadow-2xl border-4 border-white/30">
                    {step.number}
                  </div>
                </div>

                {/* Using h-full and flex column to ensure equal card heights */}
                <div className="card-premium p-10 flex flex-col items-center text-center h-full w-full rounded-[2.5rem] bg-white border-2 border-white transition-all duration-500 hover:shadow-2xl">
                  <div className="p-5 rounded-2xl bg-primary/10 mb-8 group-hover:bg-primary group-hover:text-white transition-all">
                    <step.icon className="w-10 h-10 text-primary group-hover:text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-foreground mb-4">
                    {step.title}
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection className="relative py-40 overflow-hidden">
        <div className="absolute inset-0 gradient-bg-animated" />
        <ParticleBackground count={40} className="opacity-30" />
        <div className="absolute inset-0 noise-overlay" />

        <div className="relative max-w-5xl mx-auto px-4 text-center text-white">
          <motion.h2
            variants={pageTransition}
            className="text-6xl md:text-8xl font-black mb-10 text-glow leading-tight"
          >
            Pioneer the New Green Standard.
          </motion.h2>
          <motion.p
            variants={pageTransition}
            className="text-2xl text-white/90 max-w-2xl mx-auto mb-16 leading-relaxed"
          >
            Join 1,400+ leaders already creating verified impact on our transparent, blockchain-inspired platform.
          </motion.p>

          <motion.div
            variants={pageTransition}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20"
          >
            <Link
              to="/login"
              className="group inline-flex items-center justify-center gap-4 px-12 py-6 bg-white text-primary hover:bg-accent hover:text-white rounded-[1.5rem] text-2xl font-black shadow-[0_20px_60px_-15px_rgba(255,255,255,0.3)] hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
            >
              <Sparkles className="w-8 h-8" />
              Start Free Today
              <ArrowRight className="w-8 h-8 group-hover:translate-x-3 transition-transform" />
            </Link>
            <Link
              to="/projects"
              className="inline-flex items-center justify-center px-12 py-6 border-3 border-white/40 text-white hover:bg-white hover:text-primary rounded-[1.5rem] text-2xl font-black backdrop-blur-md transition-all duration-500"
            >
              Explore Impact
            </Link>
          </motion.div>

          <div className="divider-gradient bg-white/30 h-[2px] mb-20" />

          <motion.div
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-12"
          >
            {[
              { value: "15,234", label: "Trees Planted" },
              { value: "100%", label: "Audit Match Rate" },
              { value: "24/7", label: "Live Impact Data" },
            ].map((stat, idx) => (
              <motion.div key={idx} variants={pageTransition}>
                <p className="text-5xl font-black mb-3 text-glow">{stat.value}</p>
                <p className="text-white/70 font-bold uppercase tracking-widest text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Footer */}
      <footer className="border-t border-border bg-background pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-16 mb-20">
            <div className="space-y-6">
              <Link to="/" className="flex items-center gap-3">
                <div className="gradient-bg rounded-2xl p-3 shadow-lg">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <span className="font-extrabold gradient-text text-3xl tracking-tighter">Greenworld</span>
              </Link>
              <p className="text-muted-foreground text-lg leading-relaxed">
                The global infrastructure for verified environmental impact. Connecting
                purpose with proof through advanced verification tech.
              </p>
            </div>

            <div className="lg:ml-auto">
              <h4 className="font-black text-foreground text-xl mb-8 uppercase tracking-widest">Platform</h4>
              <ul className="space-y-4 text-lg">
                <li><Link to="/projects" className="text-muted-foreground hover:text-primary transition-all">Projects</Link></li>
                <li><Link to="/impact" className="text-muted-foreground hover:text-primary transition-all">Impact Modules</Link></li>
                <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-all">Partners</Link></li>
              </ul>
            </div>

            <div className="lg:ml-auto">
              <h4 className="font-black text-foreground text-xl mb-8 uppercase tracking-widest">Information</h4>
              <ul className="space-y-4 text-lg">
                <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-all">Our Mission</Link></li>
                <li><Link to="/terms" className="text-muted-foreground hover:text-primary transition-all">Terms of Service</Link></li>
                <li><Link to="/privacy" className="text-muted-foreground hover:text-primary transition-all">Privacy Policy</Link></li>
              </ul>
            </div>

            <div className="lg:ml-auto">
              <h4 className="font-black text-foreground text-xl mb-8 uppercase tracking-widest">Connect</h4>
              <ul className="space-y-4 text-lg">
                <li><a href="mailto:hello@greenworld.eco" className="text-muted-foreground hover:text-primary transition-all underline decoration-primary/30">Email Us</a></li>
                <li className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer"><Globe className="w-5 h-5" /></div>
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer"><Users className="w-5 h-5" /></div>
                </li>
              </ul>
            </div>
          </div>

          <div className="divider-gradient mb-12 opacity-50" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-muted-foreground font-medium">
            <p>© 2024 Greenworld Platform. All impact data is verified.</p>
            <div className="flex gap-4 items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Network Status: Optimal</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
