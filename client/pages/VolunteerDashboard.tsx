import { Navbar } from "@/components/layout/Navbar";
import {
  MapPin,
  Calendar,
  Users,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  Download,
  X,
  Sparkles,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { projectsApi, volunteersApi, VolunteerStats } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function VolunteerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("available");
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [myProjectsData, setMyProjectsData] = useState<any[]>([]);
  const [stats, setStats] = useState<VolunteerStats>({
    hoursVolunteered: 0,
    projectsCompleted: 0,
    certificatesEarned: 0,
    impactScore: 0,
  });

  const [selectedCert, setSelectedCert] = useState<any>(null);
  const [selectedViewProject, setSelectedViewProject] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [availableRes, myRes, statsRes] = await Promise.all([
        projectsApi.list(),
        volunteersApi.myProjects(),
        volunteersApi.stats(),
      ]);
      setProjects(availableRes.projects);
      setMyProjectsData(myRes.projects);
      setStats(statsRes);
    } catch (error: any) {
      toast.error("Failed to load dashboard data");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (projectId: number) => {
    try {
      await projectsApi.register(projectId);
      toast.success("Successfully registered for the project!");
      fetchData(); // Refresh data
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 relative">
      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          body * { visibility: hidden !important; }
          .cert-print-only, .cert-print-only * { visibility: visible !important; }
          .cert-print-only { 
            position: fixed !important; 
            left: 0 !important; 
            top: 0 !important; 
            width: 100% !important; 
            height: 100% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            background: white !important;
          }
          .no-print { display: none !important; }
          @page { size: landscape; margin: 0; }
        }
      `}} />

      <div className="no-print">
        <Navbar />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 no-print">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary">Volunteer Portal</h1>
          <p className="text-gray-600 mt-2">
            Find projects and track your environmental contributions
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-green-100 shadow-sm">
            <div className="text-3xl font-bold text-primary">{stats.hoursVolunteered}</div>
            <p className="text-gray-600 text-sm font-medium">Hours Volunteered</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-green-100 shadow-sm">
            <div className="text-3xl font-bold text-accent">{stats.projectsCompleted}</div>
            <p className="text-gray-600 text-sm font-medium">Projects Completed</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-green-100 shadow-sm">
            <div className="text-3xl font-bold text-primary">{stats.impactScore}</div>
            <p className="text-gray-600 text-sm font-medium">Impact Score</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-green-100 shadow-sm">
            <div className="text-3xl font-bold text-blue-500">{stats.certificatesEarned}</div>
            <p className="text-gray-600 text-sm font-medium">Certificates Earned</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 mb-8 border-b border-green-100">
          {[
            { id: "available", label: "Available Projects" },
            { id: "myProjects", label: "My Projects" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 font-bold transition-all relative ${activeTab === tab.id
                ? "text-primary"
                : "text-gray-400 hover:text-primary"
                }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full"
                />
              )}
            </button>
          ))}
        </div>

        {/* Available Projects */}
        {activeTab === "available" && (
          isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="text-gray-500 font-bold">Loading available projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
              <p className="text-gray-500 font-bold">No projects available at the moment.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-[2.5rem] border border-green-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all group flex flex-col"
                >
                  <div className="h-48 bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center relative overflow-hidden">
                    <div className="text-7xl group-hover:scale-125 transition-transform duration-500">
                      {project.image || "🌱"}
                    </div>
                    <div className="absolute top-4 right-4 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full text-xs font-black text-primary uppercase tracking-widest border border-primary/10">
                      {project.location}
                    </div>
                  </div>

                  <div className="p-8 flex-1 flex flex-col">
                    <div className="mb-6">
                      <p className="font-bold text-accent uppercase tracking-[0.2em] text-[10px] mb-2">{project.ngo}</p>
                      <h3 className="text-2xl font-black text-primary leading-tight">
                        {project.title}
                      </h3>
                    </div>

                    <div className="space-y-4 mb-8">
                      <div className="flex items-center gap-3 text-gray-500 font-bold text-sm">
                        <Calendar className="w-4 h-4 text-primary" />
                        {new Date(project.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-3 text-gray-500 font-bold text-sm">
                        <Users className="w-4 h-4 text-primary" />
                        {project.volunteers} Active Volunteers
                      </div>
                    </div>

                    <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Target</p>
                        <p className="text-xl font-black text-accent">{project.impactValue || project.impactType || "High Impact"}</p>
                      </div>
                      <button
                        onClick={() => handleRegister(project.id)}
                        disabled={project.isRegistered}
                        className={`px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2 transition-all shadow-lg ${project.isRegistered
                          ? "bg-green-100 text-primary cursor-default"
                          : "bg-primary text-white hover:bg-primary/90 hover:shadow-primary/30 hover:-translate-y-1 active:translate-y-0"
                          }`}
                      >
                        {project.isRegistered ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <>
                            Join
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )
        )}

        {/* My Projects */}
        {activeTab === "myProjects" && (
          isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="text-gray-500 font-bold">Loading your projects...</p>
            </div>
          ) : myProjectsData.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
              <p className="text-gray-500 font-bold">You haven't joined any projects yet.</p>
              <button
                onClick={() => setActiveTab("available")}
                className="mt-4 text-primary font-black hover:underline"
              >
                Explore Available Projects
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {myProjectsData.map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-[2.5rem] border border-green-100 p-8 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
                  <div className="grid lg:grid-cols-6 gap-8 items-center">
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-4 mb-2">
                        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${project.status === "Completed" ? "bg-accent/10 text-accent" : "bg-yellow-100 text-yellow-700"
                          }`}>
                          {project.status}
                        </div>
                        <span className="text-gray-400 font-bold text-xs">{project.date}</span>
                      </div>
                      <h3 className="text-2xl font-black text-primary mb-1">
                        {project.name}
                      </h3>
                      <p className="font-bold text-gray-500 uppercase tracking-tighter text-xs">{project.ngo}</p>
                    </div>

                    <div className="flex flex-col items-center justify-center bg-gray-50/50 p-4 rounded-2xl">
                      <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Hours</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-primary">{project.hours}</span>
                        <span className="text-xs font-bold text-gray-400 uppercase">hrs</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center bg-gray-50/50 p-4 rounded-2xl">
                      <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Impact Created</p>
                      <p className="font-black text-gray-900 text-lg text-center leading-tight">
                        {project.impact}
                      </p>
                    </div>

                    <div className="lg:col-span-2 flex gap-4 justify-end">
                      {project.certificate && (
                        <motion.button
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedCert(project)}
                          className="flex-1 max-w-[180px] py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-white relative overflow-hidden group/cert shadow-lg"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-accent to-emerald-400 transition-transform duration-500 group-hover/cert:scale-110" />
                          <span className="relative z-10 flex items-center gap-2">
                            <Award className="w-5 h-5" />
                            Certificate
                          </span>
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedViewProject(project)}
                        className="flex-1 max-w-[180px] py-4 rounded-2xl border-2 border-primary text-primary font-black flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all duration-300 shadow-md"
                      >
                        View
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )
        )}
      </div>

      {/* Project Details Modal */}
      <AnimatePresence>
        {selectedViewProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm no-print">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[3rem] max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-8 border-b flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-4 text-primary">
                  <div className="text-4xl bg-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm">
                    {selectedViewProject.image}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black">{selectedViewProject.name}</h2>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{selectedViewProject.ngo}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedViewProject(null)}
                  className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-2xl transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-12 bg-white">
                {/* Hero Data */}
                <div className="grid grid-cols-3 gap-6">
                  <div className="bg-primary/5 p-6 rounded-[2rem] border border-primary/10 flex flex-col items-center justify-center text-center">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Time Invested</p>
                    <p className="text-3xl font-black text-primary">{selectedViewProject.hours} hrs</p>
                  </div>
                  <div className="bg-accent/5 p-6 rounded-[2rem] border border-accent/10 flex flex-col items-center justify-center text-center">
                    <p className="text-[10px] font-black text-accent uppercase tracking-widest mb-1">Direct Impact</p>
                    <p className="text-xl font-black text-accent">{selectedViewProject.impact}</p>
                  </div>
                  <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100 flex flex-col items-center justify-center text-center">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Carbon Offset</p>
                    <p className="text-xl font-black text-emerald-600">{selectedViewProject.carbonOffset}</p>
                  </div>
                </div>

                {/* Description sections */}
                <div className="grid md:grid-cols-2 gap-12 items-start">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Project Mission</h4>
                      <p className="text-xl text-gray-800 leading-relaxed font-bold font-serif italic border-l-4 border-primary/20 pl-6">
                        "{selectedViewProject.description}"
                      </p>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Deep Dive</h4>
                      <p className="text-sm text-gray-600 leading-relaxed font-medium">
                        {selectedViewProject.longDescription}
                      </p>
                    </div>
                  </div>

                  {/* Milestones in the side column */}
                  <div>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6">Execution Milestones</h4>
                    <div className="space-y-3">
                      {selectedViewProject.milestones.map((ms: any, i: number) => (
                        <div key={i} className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100 group/ms hover:border-primary/20 transition-all">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${ms.status === 'Done' ? 'bg-accent/20 text-accent' :
                            ms.status === 'In Progress' ? 'bg-yellow-100 text-yellow-600' :
                              'bg-gray-200 text-gray-400'
                            }`}>
                            {ms.status === 'Done' ? <CheckCircle2 className="w-5 h-5" /> :
                              ms.status === 'In Progress' ? <Clock className="w-5 h-5 animate-pulse" /> :
                                <div className="w-2 h-2 rounded-full bg-current" />}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800 text-sm">{ms.title}</p>
                            <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">{ms.status}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Impact Gallery */}
                <div>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6 text-center">Impact Gallery</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {selectedViewProject.gallery?.map((img: string, i: number) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.02 }}
                        className="aspect-square rounded-[2rem] overflow-hidden border-4 border-gray-50 shadow-inner group/img relative"
                      >
                        <img
                          src={img}
                          alt="Impact"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-end p-6">
                          <p className="text-white text-xs font-black uppercase tracking-widest">Field Observation #{i + 1}</p>
                        </div>
                      </motion.div>
                    ))}
                    {/* Placeholder for more photos */}
                    <div className="aspect-square rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 group hover:border-primary/20 transition-all cursor-pointer bg-gray-50">
                      <Sparkles className="w-8 h-8 mb-2 opacity-20 group-hover:opacity-100 transition-opacity" />
                      <p className="text-[10px] font-black uppercase tracking-widest">More coming soon</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-gray-50 border-t flex justify-center">
                <button
                  onClick={() => setSelectedViewProject(null)}
                  className="px-16 py-5 bg-primary text-white font-black rounded-2xl hover:bg-primary/90 transition-all shadow-2xl shadow-primary/20 scale-100 hover:scale-105 active:scale-95"
                >
                  Return to Dashboard
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Certificate Modal */}
      <AnimatePresence>
        {selectedCert && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm no-print">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[3rem] max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-8 border-b flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-3 text-primary">
                  <Award className="w-8 h-8" />
                  <h2 className="text-2xl font-black">Volunteer Certificate</h2>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => setSelectedCert(null)}
                    className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-2xl transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handlePrint}
                    className="px-8 py-3 bg-primary text-white font-black rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download PDF
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-12 bg-gray-100 flex items-center justify-center">
                {/* Visual Certificate */}
                <div className="bg-white shadow-2xl rounded-sm p-20 w-full max-w-[297mm] aspect-[1.414/1] relative overflow-hidden flex flex-col items-center justify-center border-[20px] border-primary/5 cert-print-only">
                  {/* Decorative Background Elements */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

                  {/* Corners */}
                  <div className="absolute top-10 left-10 w-20 h-20 border-t-4 border-l-4 border-primary/20" />
                  <div className="absolute top-10 right-10 w-20 h-20 border-t-4 border-r-4 border-primary/20" />
                  <div className="absolute bottom-10 left-10 w-20 h-20 border-b-4 border-l-4 border-primary/20" />
                  <div className="absolute bottom-10 right-10 w-20 h-20 border-b-4 border-r-4 border-primary/20" />

                  <div className="text-center relative z-10 space-y-8">
                    <div className="flex justify-center mb-8">
                      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                        <Award className="w-12 h-12 text-primary" />
                      </div>
                    </div>

                    <div>
                      <h4 className="text-primary font-black uppercase tracking-[0.4em] text-sm mb-4">Certificate of Excellence</h4>
                      <h1 className="text-6xl font-black text-gray-900 mb-2">Volunteer Merit</h1>
                      <p className="text-xl text-gray-500 font-bold uppercase tracking-widest italic">Presented To</p>
                    </div>

                    <div className="py-6 border-b-2 border-gray-100 min-w-[400px]">
                      <h2 className="text-5xl font-serif text-gray-800 italic">{user?.name || "Volunteer"}</h2>
                    </div>

                    <div className="max-w-2xl mx-auto space-y-4">
                      <p className="text-xl text-gray-600 leading-relaxed">
                        For outstanding dedication and environmental contribution during the
                        <span className="text-primary font-black mx-2 uppercase tracking-wide">
                          {selectedCert.name}
                        </span>
                        conducted by
                        <span className="font-black text-gray-900 mx-2">
                          {selectedCert.ngo}
                        </span>.
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-12 pt-12 items-end">
                      <div className="space-y-2">
                        <p className="text-3xl font-black text-primary">{selectedCert.hours} hrs</p>
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest border-t pt-2 border-gray-100">Contributed</p>
                      </div>
                      <div className="pb-4">
                        <ShieldCheck className="w-16 h-16 text-accent mx-auto opacity-20" />
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-4">Verified by Greenworld</p>
                      </div>
                      <div className="space-y-2">
                        <p className="font-bold text-gray-900">{selectedCert.date}</p>
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest border-t pt-2 border-gray-100">Issue Date</p>
                      </div>
                    </div>
                  </div>

                  {/* Seals & Badges */}
                  <div className="absolute bottom-10 right-20 flex items-center gap-4 opacity-50">
                    <div className="w-16 h-16 rounded-full border border-gray-200 flex items-center justify-center"><Sparkles className="w-8 h-8" /></div>
                    <div className="w-16 h-16 rounded-full border border-gray-200 flex items-center justify-center font-black">GW</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
