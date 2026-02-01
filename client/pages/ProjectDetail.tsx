import { Navbar } from "@/components/layout/Navbar";
import { ParticleBackground } from "@/components/effects/ParticleBackground";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Leaf,
  DollarSign,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  Share2,
  Heart,
  ArrowLeft,
  Sparkles,
  Zap,
  Target,
  Globe,
  TrendingUp,
  Award,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projectsApi } from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }
  }
};

export default function ProjectDetail() {
  const { id } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) fetchProject();
  }, [id]);

  const fetchProject = async () => {
    setIsLoading(true);
    try {
      const res = await projectsApi.get(Number(id));
      setProject(res);
    } catch (error: any) {
      toast.error("Failed to load project details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: project.title,
      text: project.description,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
        <p className="text-xl text-muted-foreground font-bold font-premium">Synchronizing Satellite Data...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-6">
          <div className="text-9xl">🥀</div>
          <h1 className="text-4xl font-bold">Project not found</h1>
          <Link to="/projects" className="btn-gradient inline-flex px-8 py-3">Back to Directory</Link>
        </motion.div>
      </div>
    );
  }

  const fundingPercentage = ((project.fundingReceived || 0) / (project.fundingGoal || 1)) * 100;
  const gradient = project.impactType === "Trees" ? "from-emerald-500 to-teal-500" : project.impactType === "Water" ? "from-cyan-500 to-blue-500" : "from-amber-400 to-orange-500";
  const icon = project.impactType === "Trees" ? "🌳" : project.impactType === "Water" ? "💧" : "🌱";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-bold mb-10 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Return to Explorations
          </Link>

          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-12">
              <div className="relative overflow-hidden rounded-[3rem] aspect-video group">
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-20`} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[12rem] filter drop-shadow-2xl group-hover:scale-110 transition-transform duration-700">{project.image || icon}</span>
                </div>
                <div className="absolute top-10 left-10">
                  <div className="badge-premium bg-white/50 backdrop-blur-md">
                    <Zap className="w-4 h-4 text-accent" />
                    <span>Verified Project</span>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="space-y-4">
                    <h1 className="text-5xl md:text-6xl font-black text-foreground leading-tight">
                      {project.title}
                    </h1>
                    <div className="flex flex-wrap gap-4 items-center text-lg font-semibold text-muted-foreground">
                      <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-2xl">
                        <MapPin className="w-5 h-5 text-primary" />
                        {project.location}
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-2xl">
                        <Leaf className="w-5 h-5 text-primary" />
                        {project.ngo}
                      </div>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`p-5 rounded-3xl border-2 transition-all ${isFavorite
                      ? "bg-red-50 border-red-200 text-red-500 shadow-lg"
                      : "bg-white border-border text-muted-foreground"
                      }`}
                  >
                    <Heart className={`w-8 h-8 ${isFavorite ? "fill-current" : ""}`} />
                  </motion.button>
                </div>

                <div className="divider-gradient h-px w-full opacity-50" />

                <div className="prose prose-xl prose-invert max-w-none">
                  <h2 className="text-3xl font-bold gradient-text mb-6">Execution Strategy</h2>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    {project.longDescription}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 pt-6">
                  <div className="card-premium p-8 rounded-[2rem] border-2 border-white">
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                      <TrendingUp className="w-6 h-6 text-primary" />
                      Key Highlights
                    </h3>
                    <ul className="space-y-4">
                      {project.highlights.map((h: string, i: number) => (
                        <li key={i} className="flex items-start gap-4 text-lg text-muted-foreground leading-tight">
                          <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="card-premium p-8 rounded-[2rem] border-2 border-white">
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                      <Target className="w-6 h-6 text-primary" />
                      Active Milestones
                    </h3>
                    <div className="space-y-6">
                      {project.milestones.map((m: any, i: number) => (
                        <div key={i} className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${m.completed ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                            }`}>
                            {m.completed ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                          </div>
                          <div>
                            <p className={`font-bold ${m.completed ? "text-foreground" : "text-muted-foreground"}`}>{m.name}</p>
                            <p className="text-sm font-semibold opacity-60">{m.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-4 sticky top-28 space-y-6">
              <div className="card-glass p-10 rounded-[3rem] border-2 border-white shadow-2xl relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${gradient}`} />

                <h3 className="text-2xl font-black mb-8">Investment Status</h3>

                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-end mb-3">
                      <span className="text-4xl font-black text-primary">${project.fundingReceived.toLocaleString()}</span>
                      <span className="text-lg font-bold text-muted-foreground">of ${project.fundingGoal.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-4 bg-muted rounded-full overflow-hidden p-1 border border-border">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${fundingPercentage}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className={`h-full bg-gradient-to-r ${gradient} rounded-full`}
                      />
                    </div>
                    <p className="mt-3 text-right font-black text-primary text-xl">{Math.round(fundingPercentage)}% Funded</p>
                  </div>

                  <div className="space-y-4 pt-6">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowSupportModal(true)}
                      className="w-full btn-gradient py-6 text-xl rounded-2xl flex items-center justify-center gap-3"
                    >
                      <Sparkles className="w-6 h-6" />
                      Support This Project
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02, backgroundColor: "rgba(var(--primary), 0.1)" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleShare}
                      className="w-full py-6 text-xl font-black border-2 border-primary text-primary rounded-2xl flex items-center justify-center gap-3"
                    >
                      <Share2 className="w-6 h-6" />
                      {shareSuccess ? "Copied Link!" : "Spread the Word"}
                    </motion.button>
                  </div>

                  <div className="pt-8 space-y-4 font-bold">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Timeline</span>
                      <span className="text-foreground">{project.startDate} - {project.endDate}</span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Verification</span>
                      <span className="text-primary flex items-center gap-1"><Award className="w-4 h-4" /> Triple-Verified</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Impact Card */}
              <div className="card-premium p-8 rounded-[2.5rem] bg-primary text-white text-center space-y-4">
                <p className="text-sm font-black uppercase tracking-[0.2em] opacity-80">Guaranteed Result</p>
                <p className="text-4xl font-black flex items-center justify-center gap-2">
                  <Globe className="w-8 h-8" />
                  {project.impact}
                </p>
                <p className="text-lg font-bold opacity-90">Added to the Global Green Registry upon completion.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Support Modal */}
      <AnimatePresence>
        {showSupportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSupportModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative card-glass p-12 max-w-xl w-full rounded-[3rem] border-4 border-white text-center space-y-8"
            >
              <div className="text-7xl">🌳</div>
              <h2 className="text-4xl font-black text-foreground">Support Confirmed</h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Thank you for your interest in supporting the <strong>{project.title}</strong> initiative.
                <br /><br />
                Our system will generate a customized pledge agreement and connect you with the NGO representative shortly.
              </p>
              <button
                onClick={() => setShowSupportModal(false)}
                className="w-full btn-gradient py-5 text-xl"
              >
                Close & Continue
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
