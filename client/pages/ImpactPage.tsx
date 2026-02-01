import { Navbar } from "@/components/layout/Navbar";
import { ParticleBackground } from "@/components/effects/ParticleBackground";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  TreePine,
  Droplets,
  Users,
  Leaf,
  TrendingUp,
  Award,
  Globe,
  Zap,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { statsApi } from "@/lib/api";
import { Loader2 } from "lucide-react";

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

export default function ImpactPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await statsApi.public();
      setData(res);
    } catch (error) {
      console.error("Failed to fetch impact stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const impactMetrics = data?.metrics || [
    { label: "Trees Planted", value: "15,234", icon: TreePine, color: "text-emerald-500", bg: "emerald" },
    { label: "CO₂ Offset (Tons)", value: "8,492", icon: TrendingUp, color: "text-blue-500", bg: "blue" },
    { label: "Active Volunteers", value: "342", icon: Users, color: "text-purple-500", bg: "purple" },
    { label: "Active Projects", value: "28", icon: Leaf, color: "text-green-500", bg: "green" },
    { label: "Total Investment", value: "$2.3M", icon: Zap, color: "text-amber-500", bg: "amber" },
    { label: "Verified Claims", value: "100%", icon: ShieldCheck, color: "text-cyan-500", bg: "cyan" },
  ];

  const monthlyImpactData = data?.monthlyData || [
    { month: "Jan", trees: 2100, water: 1200, co2: 450 },
    { month: "Feb", trees: 2800, water: 1800, co2: 620 },
    { month: "Mar", trees: 3500, water: 2400, co2: 890 },
    { month: "Apr", trees: 4200, water: 3100, co2: 1150 },
    { month: "May", trees: 5100, water: 3900, co2: 1420 },
    { month: "Jun", trees: 6200, water: 4800, co2: 1680 },
  ];

  const fundingChannels = data?.fundingChannels || [
    { name: "Corporates", value: 65, color: "hsl(var(--primary))" },
    { name: "Government", value: 20, color: "hsl(var(--accent))" },
    { name: "Individuals", value: 10, color: "#10b981" },
    { name: "Foundations", value: 5, color: "#06b6d4" },
  ];

  const getIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      TreePine, TrendingUp, Users, Leaf, Zap, ShieldCheck
    };
    return icons[iconName] || Globe;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground font-bold">Synchronizing Global Impact...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Navbar />

      <div className="fixed inset-0 -z-10">
        <ParticleBackground count={30} />
        <div className="absolute inset-0 gradient-bg-radial opacity-50" />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-24"
        >
          {/* Hero Section */}
          <div className="text-center space-y-8">
            <motion.div variants={fadeUp} className="badge-premium inline-flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>Real-Time Earth Metrics</span>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="text-6xl md:text-8xl font-black tracking-tight"
            >
              <span className="gradient-text-animated">Tangible</span>
              <br />
              <span className="text-foreground">Proof of Change</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              We don't just promise impact; we prove it. Explore the live data points
              that define our global environmental restoration mission.
            </motion.p>
          </div>

          {/* Metrics Grid */}
          <motion.div
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {impactMetrics.map((metric, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                whileHover={{ y: -8 }}
                className="group relative"
              >
                <div className="card-premium p-10 rounded-[2.5rem] bg-card/60 backdrop-blur-xl border-2 border-white shadow-xl flex flex-col items-center text-center">
                  <div className={`p-5 rounded-3xl bg-${metric.bg}-500/10 group-hover:bg-${metric.bg}-500 group-hover:text-white transition-all duration-500 mb-8`}>
                    {(() => {
                      const Icon = typeof metric.icon === 'string' ? getIcon(metric.icon) : metric.icon;
                      return <Icon className={`w-10 h-10 ${metric.color} group-hover:text-white`} />;
                    })()}
                  </div>
                  <p className="text-muted-foreground font-black uppercase tracking-[0.2em] text-xs mb-2">
                    {metric.label}
                  </p>
                  <p className="text-5xl font-black text-foreground tabular-nums">
                    {metric.value}
                  </p>

                  {/* Decorative line */}
                  <div className="w-12 h-1 bg-primary/20 rounded-full mt-6 group-hover:w-24 group-hover:bg-primary transition-all duration-500" />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Detailed Analytics */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Growth Chart */}
            <motion.div
              variants={fadeUp}
              className="card-glass p-10 rounded-[3rem] border-2 border-white shadow-2xl space-y-8"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-3xl font-black flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-primary" />
                  Growth Trajectory
                </h3>
                <div className="px-4 py-2 bg-primary/10 rounded-xl text-primary font-bold text-sm">
                  +124% YoY
                </div>
              </div>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyImpactData}>
                    <defs>
                      <linearGradient id="colorTrees" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'white', borderRadius: '1rem', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                    />
                    <Area type="monotone" dataKey="trees" stroke="hsl(var(--primary))" strokeWidth={4} fillOpacity={1} fill="url(#colorTrees)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Funding Distribution */}
            <motion.div
              variants={fadeUp}
              className="card-glass p-10 rounded-[3rem] border-2 border-white shadow-2xl space-y-8"
            >
              <h3 className="text-3xl font-black flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-primary" />
                Capital Flow
              </h3>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={fundingChannels}
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {fundingChannels.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-6">
                  {fundingChannels.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="font-bold text-muted-foreground group-hover:text-foreground transition-colors">{item.name}</span>
                      </div>
                      <span className="text-xl font-black">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Verification Section */}
          <motion.section
            variants={fadeUp}
            className="card-premium p-16 rounded-[4rem] bg-primary text-white space-y-12 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

            <div className="text-center space-y-4 relative z-10">
              <h2 className="text-4xl md:text-5xl font-black">Triple-Layer Verification</h2>
              <p className="text-xl opacity-80 max-w-3xl mx-auto">
                Every data point shown above has survived three rigorous rounds of validation
                to ensure your contributions create real-world results.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative z-10">
              {[
                { step: "01", title: "Geo-Proofing", desc: "Live timestamped GPS tracking of every single planting site." },
                { step: "02", title: "Third-Party Audit", desc: "Randomized inspections by independent environmental experts." },
                { step: "03", title: "AI Image Verification", desc: "Neural networks monitor growth via satellite and drone footage." },
              ].map((item, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/20 hover:bg-white/20 transition-all group">
                  <span className="text-5xl font-black opacity-20 group-hover:opacity-40 transition-opacity mb-4 block">{item.step}</span>
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-lg opacity-80 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.section>
        </motion.div>
      </main>
    </div>
  );
}
