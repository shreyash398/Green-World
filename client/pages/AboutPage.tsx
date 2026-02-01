import { Navbar } from "@/components/layout/Navbar";
import { ParticleBackground } from "@/components/effects/ParticleBackground";
import {
  Leaf,
  Target,
  Users,
  TrendingUp,
  Globe,
  Shield,
  ArrowRight,
  Sparkles,
  Zap,
  Award,
  LogIn,
  TreePine,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function AboutPage() {
  const values = [
    { icon: Target, title: "Impact First", desc: "Real outcomes, not just funding. Every metric is audited." },
    { icon: Shield, title: "Transparency", desc: "Complete visibility into fund flow and project execution." },
    { icon: Users, title: "Collective Action", desc: "Uniting corporates and NGOs for a common goal." },
  ];

  const team = [
    { name: "Priya Sharma", role: "CEO & Visionary", bio: "15+ years in CSR & Sustainability architecture.", icon: "🌱" },
    { name: "Arun Patel", role: "CTO", bio: "Former Climate Tech lead at Global Earth Network.", icon: "💻" },
    { name: "Meera Gupta", role: "VP Partnerships", bio: "Expert in NGO bridge-building and impact scaling.", icon: "🤝" },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden selection:bg-primary/20">
      <Navbar />

      <div className="fixed inset-0 -z-10">
        <ParticleBackground count={15} />
        <div className="absolute inset-0 gradient-bg-radial opacity-40" />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-32"
        >
          {/* Hero & Login Module Grid */}
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <motion.div variants={fadeUp} className="lg:col-span-8 space-y-8">
              <div className="badge-premium inline-flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Our Heritage & Vision</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
                <span className="gradient-text-animated">Architecting</span>
                <br />
                <span className="text-foreground">Earth's Recovery</span>
              </h1>
              <p className="text-2xl text-muted-foreground max-w-2xl leading-relaxed">
                Greenworld is a technology-first infrastructure built to bridge the gap
                between corporate sustainability goals and verified environmental execution.
              </p>
            </motion.div>

            {/* Login Callout Module on the Right */}
            <motion.div variants={fadeUp} className="lg:col-span-4 relative group">
              <div className="absolute inset-0 gradient-bg blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative card-glass p-10 rounded-[3rem] border-2 border-white shadow-2xl flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white shadow-lg">
                  <LogIn className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black font-heading">Ready to Lead?</h3>
                  <p className="text-muted-foreground font-medium">Access your personalized impact dashboard now.</p>
                </div>
                <Link to="/login" className="w-full btn-gradient py-5 text-xl rounded-2xl flex items-center justify-center gap-3">
                  Account Login
                  <ArrowRight className="w-6 h-6" />
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Mission & Values Grid */}
          <div className="grid lg:grid-cols-2 gap-20">
            <motion.div variants={fadeUp} className="space-y-10">
              <h2 className="text-4xl font-black flex items-center gap-4">
                <div className="w-12 h-1 gradient-bg rounded-full" />
                The Protocol
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                We believe that environmental change requires more than good intentions—it requires
                <strong> auditable protocols</strong>. By digitizing every milestone of a restoration
                project, we provide the trust layer needed for global scale.
              </p>
              <div className="space-y-6">
                {values.map((v, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                      <v.icon className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-1">{v.title}</h4>
                      <p className="text-muted-foreground font-medium">{v.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="relative">
              <div className="card-premium p-12 rounded-[4rem] bg-muted/50 border-2 border-white space-y-8 relative overflow-hidden">
                <div className="absolute bottom-0 right-0 opacity-5 -translate-x-1/2 translate-y-1/2">
                  <Leaf className="w-96 h-96" />
                </div>
                <h2 className="text-4xl font-black">2030 Roadmap</h2>
                <div className="space-y-8">
                  {[
                    { label: "Trees Planted", val: "100 Million", icon: TreePine },
                    { label: "Capital Mobilized", val: "$1 Billion", icon: Zap },
                    { label: "Active Volunteers", val: "500,000", icon: Users },
                  ].map((stat, i) => (
                    <div key={i} className="flex items-center justify-between border-b border-border/50 pb-4">
                      <div className="flex items-center gap-3">
                        <stat.icon className="w-6 h-6 text-primary" />
                        <span className="font-bold text-muted-foreground">{stat.label}</span>
                      </div>
                      <span className="text-2xl font-black gradient-text">{stat.val}</span>
                    </div>
                  ))}
                </div>
                <div className="p-6 bg-white/50 backdrop-blur-md rounded-3xl border border-white">
                  <p className="text-sm font-bold text-center italic text-primary/80">"Scaling impact through rigorous verification and global collaboration."</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Team Section */}
          <section className="space-y-16">
            <motion.div variants={fadeUp} className="text-center space-y-4">
              <h2 className="text-5xl font-black">Climate Catalysts</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">The multi-disciplinary team driving the Greenworld infrastructure forward.</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {team.map((m, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  whileHover={{ y: -10 }}
                  className="card-glass p-10 rounded-[3rem] border-2 border-white text-center group"
                >
                  <div className="text-7xl mb-6 group-hover:scale-110 transition-transform duration-500">{m.icon}</div>
                  <h3 className="text-2xl font-black mb-1">{m.name}</h3>
                  <p className="text-primary font-bold mb-4 uppercase tracking-widest text-xs">{m.role}</p>
                  <p className="text-muted-foreground font-medium">{m.bio}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Final CTA */}
          <motion.section
            variants={fadeUp}
            className="card-premium p-16 rounded-[4rem] bg-primary text-white text-center space-y-10 relative overflow-hidden"
          >
            <div className="absolute inset-0 gradient-bg-animated opacity-40 mix-blend-overlay" />
            <h2 className="text-5xl md:text-7xl font-black relative z-10">Start Your Legacy.</h2>
            <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
              <Link to="/login" className="btn-glass bg-white text-primary text-xl px-12 py-5 font-black flex items-center gap-3">
                Join Network <ArrowRight className="w-6 h-6" />
              </Link>
              <button className="px-12 py-5 border-2 border-white/50 rounded-2xl text-xl font-black hover:bg-white/10 transition-all">
                Contact Strategy
              </button>
            </div>
          </motion.section>
        </motion.div>
      </main>
    </div>
  );
}
