import { Navbar } from "@/components/layout/Navbar";
import {
  Plus,
  MapPin,
  Users,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  ImagePlus,
  FileText,
  Loader2,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { ParticleBackground } from "@/components/effects/ParticleBackground";
import { projectsApi, statsApi, ngoApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function NGODashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("projects");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [uploadingFor, setUploadingFor] = useState<number | null>(null);
  const [updatingFor, setUpdatingFor] = useState<number | null>(null);
  const [editDesc, setEditDesc] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fundingData, setFundingData] = useState<any[]>([]);
  const [volunteersData, setVolunteersData] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
    if (activeTab === "funding") fetchFunding();
    if (activeTab === "volunteers") fetchVolunteers();
  }, [activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [projectsRes, statsRes] = await Promise.all([
        projectsApi.list({ status: "all" }),
        statsApi.ngo(),
      ]);
      setProjects(projectsRes.projects.filter((p: any) => p.ngoId === user?.id || !user));
      setStats(statsRes);
    } catch (error: any) {
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFunding = async () => {
    try {
      const res = await ngoApi.funding();
      setFundingData(res.funding);
    } catch (e) { toast.error("Failed to load funding data"); }
  };

  const fetchVolunteers = async () => {
    try {
      const res = await ngoApi.volunteers();
      setVolunteersData(res.volunteers);
    } catch (e) { toast.error("Failed to load volunteer data"); }
  };

  const handlePhotoUpload = (projectId: number) => {
    setUploadingFor(projectId);
    fileInputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && uploadingFor) {
      const fileName = e.target.files[0].name;
      toast.success(`Photo "${fileName}" uploaded successfully!`);
      // In production, this would upload to server
      setUploadingFor(null);
    }
  };

  const handleUpdate = (projectId: number) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setUpdatingFor(projectId);
      setEditDesc(project.description);
    }
  };

  const saveUpdate = async () => {
    if (!updatingFor) return;
    try {
      await projectsApi.update(updatingFor, { description: editDesc });
      toast.success("Project updated successfully!");
      setUpdatingFor(null);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Update failed");
    }
  };

  const toggleMilestone = async (projectId: number, milestoneId: number) => {
    try {
      await projectsApi.toggleMilestone(projectId, milestoneId);
      toast.info("Milestone status updated");
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to update milestone");
    }
  };

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20 relative">
      <Navbar />

      <div className="fixed inset-0 -z-10">
        <ParticleBackground count={10} />
        <div className="absolute inset-0 gradient-bg-radial opacity-30" />
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={onFileChange}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-primary">NGO Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Manage projects and track environmental impact
              </p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition-all flex items-center gap-2 font-semibold shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Create Project
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-green-100">
          {["projects", "funding", "volunteers"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 font-semibold transition-colors capitalize ${activeTab === tab
                ? "text-primary border-b-2 border-primary"
                : "text-gray-600 hover:text-primary"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Projects Tab */}
        {activeTab === "projects" && (
          isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4 mx-auto" />
              <p className="text-gray-500 font-bold">Loading your projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500 font-bold">No projects created yet.</p>
              <button className="text-primary font-bold hover:underline mt-2">Create your first project</button>
            </div>
          ) : (
            <div className="space-y-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-xl border border-green-100 p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <div className="text-5xl mb-4">{project.image || "🌱"}</div>
                      <h3 className="text-2xl font-bold text-primary mb-2">
                        {project.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{project.description}</p>
                      <div className="flex items-center gap-2 text-gray-700 mb-2">
                        <MapPin className="w-4 h-4" />
                        {project.location}
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Users className="w-4 h-4" />
                        {project.volunteers || 0} Volunteers
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-primary mb-4">
                        Milestones
                      </h4>
                      <div className="space-y-3">
                        {project.milestones?.map((milestone: any) => (
                          <button
                            key={milestone.id}
                            onClick={() => toggleMilestone(project.id, milestone.id)}
                            className="flex items-center gap-3 w-full hover:bg-primary/5 p-2 rounded-lg transition-colors group/ms"
                          >
                            {milestone.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                            ) : (
                              <Clock className="w-5 h-5 text-gray-400 flex-shrink-0 group-hover/ms:text-primary" />
                            )}
                            <span
                              className={
                                milestone.completed
                                  ? "text-gray-500 line-through"
                                  : "text-foreground font-medium"
                              }
                            >
                              {milestone.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-primary mb-3">
                          Funding Status
                        </h4>
                        <div className="mb-2 flex justify-between text-sm">
                          <span className="text-gray-600">
                            ${(project.fundingReceived || 0).toLocaleString()}
                          </span>
                          <span className="text-gray-600">
                            ${(project.fundingGoal || 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{
                              width: `${((project.fundingReceived || 0) / (project.fundingGoal || 1)) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">
                          {Math.round(
                            ((project.fundingReceived || 0) / (project.fundingGoal || 1)) * 100,
                          )}
                          % funded
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => handlePhotoUpload(project.id)}
                          className="px-4 py-3 rounded-xl bg-accent/10 text-primary hover:bg-accent hover:text-white transition-all text-xs font-bold flex items-center justify-center gap-2 border border-accent/20"
                        >
                          <ImagePlus className="w-4 h-4" />
                          Photos
                        </button>
                        <button
                          onClick={() => handleUpdate(project.id)}
                          className="px-4 py-3 rounded-xl border-2 border-primary/20 text-primary hover:bg-primary/5 transition-all text-xs font-bold flex items-center justify-center gap-2"
                        >
                          <FileText className="w-4 h-4" />
                          Update
                        </button>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={async () => {
                            if (window.confirm("Complete this mission? This will move it to your impact portfolio.")) {
                              try {
                                await projectsApi.update(project.id, { status: "completed" });
                                toast.success("Mission completed! Great work.");
                                fetchData();
                              } catch (e: any) { toast.error(e.message); }
                            }
                          }}
                          className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all text-xs font-black flex items-center justify-center gap-2 ${project.status === 'completed'
                            ? 'border-accent text-accent bg-accent/5'
                            : 'border-primary text-primary hover:bg-primary/5'}`}
                          disabled={project.status === 'completed'}
                        >
                          {project.status === 'completed' ? 'Completed' : 'Finish Mission'}
                        </button>
                        <button
                          onClick={async () => {
                            if (window.confirm("Are you ABSOLUTELY sure? This will remove the mission and all its data.")) {
                              try {
                                await projectsApi.delete(project.id);
                                toast.success("Mission discarded.");
                                fetchData();
                              } catch (e: any) { toast.error(e.message); }
                            }
                          }}
                          className="px-4 py-3 rounded-xl border-2 border-red-100 text-red-500 hover:bg-red-50 transition-all text-xs font-bold flex items-center justify-center"
                        >
                          <Clock className="w-4 h-4 rotate-45" />
                        </button>
                      </div>

                      {project.photos?.length > 0 && (
                        <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-none">
                          {project.photos.map((url: string, i: number) => (
                            <div key={i} className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-border">
                              <img src={url} alt="Update" className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Edit Modal Placeholder (Simplified for logic) */}
        <AnimatePresence>
          {updatingFor && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setUpdatingFor(null)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative bg-white rounded-[2.5rem] p-10 max-w-lg w-full shadow-2xl border-2 border-primary/20"
              >
                <h3 className="text-3xl font-black mb-6">Update Project</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Project Status / Update</label>
                    <textarea
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      className="w-full h-32 rounded-2xl border-2 border-border p-4 focus:border-primary focus:outline-none transition-all text-lg font-medium"
                      placeholder="Describe the latest progress..."
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setUpdatingFor(null)}
                      className="flex-1 py-4 text-muted-foreground font-bold hover:bg-muted rounded-2xl transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveUpdate}
                      className="flex-1 btn-gradient py-4 rounded-2xl font-black text-white"
                    >
                      Save Update
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Funding Tab */}
        {activeTab === "funding" && (
          <div className="bg-white rounded-[2rem] border border-green-100 shadow-xl overflow-hidden">
            <div className="p-8 border-b border-green-100 bg-gray-50/50 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-primary mb-1">Funding Analytics</h3>
                <p className="text-gray-500 text-sm font-medium">Detailed breakdown of project budgets and allocations</p>
              </div>
              <DollarSign className="w-8 h-8 text-primary/20" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-green-100 text-xs font-black uppercase tracking-widest text-gray-400">
                    <th className="px-8 py-4">Target Mission</th>
                    <th className="px-8 py-4">Total Goal</th>
                    <th className="px-8 py-4">Received</th>
                    <th className="px-8 py-4">Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {fundingData.map(f => (
                    <tr key={f.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-6 font-bold text-gray-900">{f.title}</td>
                      <td className="px-8 py-6 font-medium text-gray-600">${f.fundingGoal.toLocaleString()}</td>
                      <td className="px-8 py-6 font-black text-primary">${f.fundingReceived.toLocaleString()}</td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${f.percent}%` }}
                              className="h-full bg-primary"
                            />
                          </div>
                          <span className="text-xs font-black text-primary">{f.percent}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Volunteers Tab */}
        {activeTab === "volunteers" && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-[2rem] border border-green-100 shadow-xl overflow-hidden">
              <div className="p-8 border-b border-green-100 bg-gray-50/50 flex justify-between items-center">
                <h3 className="text-2xl font-black text-primary">Active Contributors</h3>
                <Users className="w-8 h-8 text-primary/20" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b border-green-100 text-xs font-black uppercase tracking-widest text-gray-400">
                      <th className="px-8 py-4">Volunteer</th>
                      <th className="px-8 py-4">Project</th>
                      <th className="px-8 py-4 text-right">Hours</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {volunteersData.map((v, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-8 py-5">
                          <div className="font-bold text-gray-900">{v.name}</div>
                          <div className="text-xs text-gray-500 font-medium">{v.email}</div>
                        </td>
                        <td className="px-8 py-5 text-gray-600 font-medium">{v.projectTitle}</td>
                        <td className="px-8 py-5 text-right font-black text-primary">{v.hours} h</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-primary rounded-[2rem] p-8 text-white shadow-xl shadow-primary/20">
                <h4 className="text-xl font-black mb-2">Impact Summary</h4>
                <p className="text-primary-foreground/80 text-sm mb-6">Aggregate metrics across all active missions.</p>
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold uppercase tracking-widest opacity-60">Total Hours</span>
                    <span className="text-3xl font-black">{stats?.volunteerHours || 0}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold uppercase tracking-widest opacity-60">Success Certificates</span>
                    <span className="text-3xl font-black">{stats?.certificatesIssued || 0}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[2rem] border border-green-100 p-8 shadow-xl">
                <h4 className="font-black text-primary mb-4">Top Recruiters</h4>
                <div className="space-y-4">
                  {projects.slice(0, 3).map(p => (
                    <div key={p.id} className="flex justify-between items-center">
                      <span className="font-bold text-gray-700 truncate mr-4">{p.title}</span>
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-black">{p.volunteers || 0}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Project Modal */}
        <AnimatePresence>
          {isCreateModalOpen && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsCreateModalOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative bg-white rounded-[3rem] p-10 max-w-2xl w-full shadow-2xl border-2 border-primary/20 max-h-[90vh] overflow-y-auto"
              >
                <h3 className="text-4xl font-black mb-8 gradient-text">New Mission</h3>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const data = {
                      title: formData.get("title") as string,
                      location: formData.get("location") as string,
                      fundingGoal: Number(formData.get("fundingGoal")),
                      description: formData.get("description") as string,
                      impactType: (formData.get("impactType") as string) || "Trees",
                    };

                    try {
                      await projectsApi.create(data);
                      toast.success("Project created! Await admin approval.");
                      setIsCreateModalOpen(false);
                      fetchData();
                    } catch (error: any) {
                      toast.error(error.message || "Failed to create project");
                    }
                  }}
                  className="space-y-6"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Project Title</label>
                      <input name="title" required className="w-full px-6 py-4 rounded-2xl bg-muted/50 border-2 border-transparent focus:border-primary/30 focus:bg-white transition-all outline-none font-bold" placeholder="e.g. Green Lung Initiative" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Location</label>
                      <input name="location" required className="w-full px-6 py-4 rounded-2xl bg-muted/50 border-2 border-transparent focus:border-primary/30 focus:bg-white transition-all outline-none font-bold" placeholder="e.g. Mumbai, India" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Funding Goal ($)</label>
                      <input type="number" name="fundingGoal" required className="w-full px-6 py-4 rounded-2xl bg-muted/50 border-2 border-transparent focus:border-primary/30 focus:bg-white transition-all outline-none font-bold" placeholder="50000" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Impact Type</label>
                      <select name="impactType" className="w-full px-6 py-4 rounded-2xl bg-muted/50 border-2 border-transparent focus:border-primary/30 focus:bg-white transition-all outline-none font-bold appearance-none">
                        <option value="Trees">Trees Planted</option>
                        <option value="Water">Water Conserved</option>
                        <option value="Waste">Waste Recycled</option>
                        <option value="Carbon">CO2 Offset</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Mission Description</label>
                    <textarea name="description" required className="w-full h-32 px-6 py-4 rounded-2xl bg-muted/50 border-2 border-transparent focus:border-primary/30 focus:bg-white transition-all outline-none font-medium text-lg resize-none" placeholder="Deeply explain the goal of this initiative..." />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsCreateModalOpen(false)}
                      className="flex-1 py-5 text-muted-foreground font-black hover:bg-muted/50 rounded-2xl transition-all"
                    >
                      Discard
                    </button>
                    <button
                      type="submit"
                      className="flex-1 btn-gradient py-5 rounded-2xl font-black text-white shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      Launch Project
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div >
  );
}
