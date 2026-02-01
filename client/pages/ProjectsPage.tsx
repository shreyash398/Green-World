import { Navbar } from "@/components/layout/Navbar";
import { ParticleBackground } from "@/components/effects/ParticleBackground";
import { useState } from "react";
import {
  MapPin,
  Leaf,
  DollarSign,
  Users,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Globe,
  Droplets,
  TreePine,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
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

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedImpact, setSelectedImpact] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const res = await projectsApi.list();
      setProjects(res.projects);
    } catch (error: any) {
      toast.error("Failed to load projects");
    } finally {
      setIsLoading(false);
    }
  };

  const locations = ["all", ...new Set(projects.map((p) => p.location))];
  const impactTypes = ["all", ...new Set(projects.map((p) => p.impactType))];
  const statuses = ["all", ...new Set(projects.map((p) => p.status))];

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation =
      selectedLocation === "all" || project.location === selectedLocation;
    const matchesImpact =
      selectedImpact === "all" || project.impactType === selectedImpact;
    const matchesStatus =
      selectedStatus === "all" || project.status === selectedStatus;

    return matchesSearch && matchesLocation && matchesImpact && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Navbar />

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10">
        <ParticleBackground count={20} />
        <div className="absolute inset-0 gradient-bg-radial opacity-50" />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-16"
        >
          {/* Header section */}
          <div className="text-center space-y-6">
            <motion.div variants={fadeUp} className="badge-premium inline-flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Real-Time Environmental Tracker</span>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="text-5xl md:text-7xl font-bold tracking-tight"
            >
              <span className="gradient-text-animated">Global Impact</span>
              <br />
              <span className="text-foreground">Projects</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Discover and support verified ecological restoration and sustainable energy initiatives across the globe.
            </motion.p>
          </div>

          {/* Search and Filters */}
          <motion.div variants={fadeUp} className="relative z-20">
            <div className="card-glass p-2 rounded-3xl shadow-2xl flex flex-col md:flex-row gap-2 max-w-4xl mx-auto border-2 border-white/30 backdrop-blur-xl">
              <div className="flex-1 relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search projects by initiative, location, or NGO..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-16 pr-6 py-5 rounded-2xl bg-white/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all text-lg"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedLocation(selectedLocation === 'all' ? locations[1] : 'all')}
                  className="px-8 py-5 rounded-2xl bg-primary text-white font-bold hover:shadow-lg transition-all flex items-center gap-3"
                >
                  <Filter className="w-5 h-5" />
                  Filter
                </button>
              </div>
            </div>

            {/* Filter tags (Visual suggestion of active filters) */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {['Location', 'Impact', 'Status'].map((filter) => (
                <span key={filter} className="px-4 py-2 rounded-full bg-primary/5 border border-primary/20 text-sm font-medium text-primary cursor-pointer hover:bg-primary/10 transition-all flex items-center gap-2">
                  {filter}: <span className="font-bold">All</span>
                </span>
              ))}
            </div>
          </motion.div>

          {/* Projects Grid */}
          <motion.div
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8"
          >
            <AnimatePresence mode="popLayout">
              {isLoading ? (
                <div className="col-span-full flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
                  <p className="text-xl text-muted-foreground font-bold">Discovering projects...</p>
                </div>
              ) : filteredProjects.length === 0 ? (
                <div className="col-span-full text-center py-20">
                  <p className="text-xl text-muted-foreground font-bold">No projects found matching your criteria.</p>
                </div>
              ) : (
                filteredProjects.map((project) => {
                  const Icon = project.impactType === "Trees" ? TreePine : project.impactType === "Water" ? Droplets : Leaf;
                  const color = project.impactType === "Trees" ? "from-emerald-500 to-teal-500" : project.impactType === "Water" ? "from-cyan-500 to-blue-500" : "from-amber-400 to-orange-500";

                  return (
                    <motion.div
                      key={project.id}
                      layout
                      variants={fadeUp}
                      whileHover={{ y: -10 }}
                      className="group relative h-full"
                    >
                      <div className="card-premium h-full p-8 rounded-[2.5rem] bg-card/40 backdrop-blur-md border-2 border-white shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col">
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-10 rounded-bl-[100px] group-hover:opacity-20 transition-opacity`} />

                        <div className="relative z-10 space-y-6 flex-1">
                          <div className="flex justify-between items-start">
                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                              <Icon className="w-8 h-8 text-white" />
                            </div>
                            <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${project.status === 'Active' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                              }`}>
                              {project.status}
                            </span>
                          </div>

                          <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                              {project.title}
                            </h3>
                            <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                              {project.description}
                            </p>
                          </div>

                          <div className="space-y-3 pt-4">
                            <div className="flex items-center gap-3 text-sm font-semibold text-muted-foreground">
                              <MapPin className="w-4 h-4 text-primary" />
                              {project.location}
                            </div>
                            <div className="flex items-center gap-3 text-sm font-semibold text-muted-foreground">
                              <Leaf className="w-4 h-4 text-primary" />
                              {project.ngo || "Verified NGO"}
                            </div>
                          </div>

                          {/* Funding Progress */}
                          <div className="pt-4 space-y-3">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                              <span>${(project.fundingReceived || 0).toLocaleString()} raised</span>
                              <span>${(project.fundingGoal || 0).toLocaleString()} goal</span>
                            </div>
                            <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden border border-border/50">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${((project.fundingReceived || 0) / (project.fundingGoal || 1)) * 100}%` }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className={`h-full bg-gradient-to-r ${color}`}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="pt-8 border-t border-border mt-8 flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Verified Impact</p>
                            <p className="font-bold text-primary flex items-center gap-1">
                              <TrendingUp className="w-4 h-4" />
                              {project.impactValue} {project.impactType}
                            </p>
                          </div>
                          <Link
                            to={`/projects/${project.id}`}
                            className="group/btn relative px-8 py-4 rounded-2xl bg-primary text-white font-bold hover:shadow-lg transition-all overflow-hidden flex items-center gap-2"
                          >
                            <span className="relative z-10">View Project</span>
                            <ArrowRight className="w-4 h-4 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
        main</main>

      {/* Modern CTA */}
      <section className="py-24 relative overflow-hidden mt-20">
        <div className="absolute inset-x-0 bottom-0 top-1/2 bg-muted/30 -z-10" />
        <div className="max-w-4xl mx-auto px-4 text-center space-y-10">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-4xl md:text-6xl font-black gradient-text-animated"
          >
            Empower a Greener Future.
          </motion.h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Are you leading a project that needs verification and funding? Join our global network of verified NGOs and start your journey today.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/login" className="btn-gradient px-12 py-6 text-xl inline-flex items-center gap-3">
              Submit Your Proposal
              <ArrowRight className="w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
