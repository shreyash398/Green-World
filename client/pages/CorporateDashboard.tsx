import { Navbar } from "@/components/layout/Navbar";
import {
  TrendingUp,
  TreePine,
  Droplets,
  DollarSign,
  Download,
  Plus,
  BarChart3,
  Calendar,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { statsApi, projectsApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function CorporateDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReportOpen, setIsReportOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, projectsRes] = await Promise.all([
        statsApi.corporate(),
        projectsApi.list(),
      ]);
      setStats(statsRes);
      setProjects(projectsRes.projects);
    } catch (error: any) {
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const impactMetrics = [
    {
      label: "Total Projects Funded",
      value: stats?.projectsFunded || 0,
      icon: TreePine,
      color: "text-primary",
    },
    {
      label: "CO₂ Offset (Tons)",
      value: stats?.co2Offset || 0,
      icon: Droplets,
      color: "text-blue-500",
    },
    {
      label: "Total Invested",
      value: `$${(stats?.totalInvested || 0).toLocaleString()}`,
      icon: DollarSign,
      color: "text-accent",
    },
    {
      label: "ROI on Impact",
      value: `${stats?.impactRoi || 0}%`,
      icon: TrendingUp,
      color: "text-green-600",
    },
  ];

  const chartData = stats?.monthlySpending || [
    { month: "Jan", spent: 0, target: 10000 },
    { month: "Feb", spent: 0, target: 10000 },
  ];

  const fundingBreakdown = stats?.fundingBreakdown || [
    { name: "Trees", value: 40, color: "#16a34a" },
    { name: "Water", value: 30, color: "#0ea5e9" },
    { name: "Waste", value: 20, color: "#f59e0b" },
    { name: "Other", value: 10, color: "#94a3b8" },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          .no-print { display: none !important; }
          .print-only { 
            visibility: visible !important;
            display: block !important;
            position: absolute !important; 
            left: 0 !important; 
            top: 0 !important; 
            width: 100% !important; 
            background: white !important;
          }
          body { visibility: hidden !important; background: white !important; }
          .print-only, .print-only * { visibility: visible !important; }
          @page { size: auto; margin: 10mm; }
        }
      `}} />
      <div className="no-print">
        <Navbar />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 no-print">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold text-primary">CSR Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Track your environmental impact and CSR spending
              </p>
            </div>
            <button
              onClick={() => window.location.href = '/projects'}
              className="px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition-all flex items-center gap-2 font-semibold shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Fund New Project
            </button>
          </div>
        </div>

        {/* Impact Metrics Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {impactMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.label}
                className="bg-white rounded-xl p-6 border border-green-100 shadow-sm"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-primary/10`}>
                    <Icon className={`w-6 h-6 ${metric.color}`} />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">
                    {metric.value}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">{metric.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Spending Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-green-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-primary">
                Monthly Spending
              </h2>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="spent" fill="#16a34a" />
                <Bar dataKey="target" fill="#d1d5db" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Funding Breakdown */}
          <div className="bg-white rounded-xl p-6 border border-green-100 shadow-sm">
            <h2 className="text-xl font-bold text-primary mb-6">
              Funding Breakdown
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={fundingBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                >
                  {fundingBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {fundingBreakdown.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    {item.name}
                  </span>
                  <span className="font-semibold">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Projects */}
        <div className="bg-white rounded-xl border border-green-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-green-100">
            <h2 className="text-xl font-bold text-primary">Active Projects</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-green-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Project Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Budget
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Spent
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Impact
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center">
                      <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
                      <p className="text-gray-500 font-bold">Loading projects...</p>
                    </td>
                  </tr>
                ) : projects.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center">
                      <p className="text-gray-500 font-bold">No active projects found.</p>
                    </td>
                  </tr>
                ) : (
                  projects.map((project) => (
                    <tr
                      key={project.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {project.title}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {project.location}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${project.status === "Active" ? "bg-green-100 text-primary" : "bg-gray-100 text-gray-700"}`}
                        >
                          {project.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-semibold">
                        ${(project.fundingGoal || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        ${(project.fundingReceived || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {project.impactValue || "High Impact"}
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-primary hover:text-primary/80 font-semibold text-sm">
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Download Report CTA */}
        <div className="mt-8 bg-gradient-to-r from-primary to-accent rounded-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-2">
            Download Your Impact Report
          </h3>
          <p className="mb-6 text-green-50">
            Generate a comprehensive CSR impact report for compliance and
            stakeholder communication
          </p>
          <button
            onClick={() => setIsReportOpen(true)}
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary hover:bg-green-50 rounded-lg font-semibold transition-all shadow-xl"
          >
            <Download className="w-5 h-5" />
            Generate PDF Report
          </button>
        </div>
      </div>

      {/* Report Preview Modal */}
      {isReportOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50 no-print">
              <h2 className="text-xl font-bold text-primary">Report Preview</h2>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsReportOpen(false)}
                  className="px-4 py-2 text-gray-600 font-semibold hover:bg-gray-200 rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePrint}
                  className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Print / Save PDF
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-12 bg-gray-100">
              {/* Actual Report Content (This will be the only thing visible in print) */}
              <div className="bg-white shadow-2xl mx-auto w-full max-w-[210mm] min-h-[297mm] p-[20mm] text-black print-only">
                <div className="flex justify-between items-start border-b-4 border-primary pb-8 mb-8">
                  <div>
                    <h1 className="text-4xl font-black text-primary mb-2 uppercase tracking-tighter">CSR Impact Report</h1>
                    <p className="text-gray-500 font-bold uppercase tracking-wider">Corporate Environmental Responsibility</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xl">Greenworld Platform</p>
                    <p className="text-gray-500">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-12 mb-12">
                  <div className="space-y-6">
                    <h2 className="text-xl font-black border-b-2 border-primary/20 pb-2">Impact Summary</h2>
                    <div className="space-y-4">
                      {impactMetrics.map(m => (
                        <div key={m.label} className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium">{m.label}</span>
                          <span className="font-black text-xl">{m.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                    <h2 className="text-xl font-black mb-4">Certification</h2>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      This document serves as proof of environmental impact generated through Greenworld's verified projects.
                      All metrics are validated through GPS tracking and satellite imagery.
                    </p>
                    <div className="pt-4 border-t border-gray-200 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center text-primary font-black">GW</div>
                      <div>
                        <p className="text-xs font-black uppercase text-gray-400">Verified by</p>
                        <p className="font-bold text-sm">Greenworld Audit Team</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-12">
                  <h2 className="text-xl font-black border-b-2 border-primary/20 pb-4 mb-6">Detailed Project Breakdown</h2>
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b-2 border-gray-900 text-sm uppercase tracking-widest">
                        <th className="py-3">Project</th>
                        <th className="py-3">Location</th>
                        <th className="py-3">Budget</th>
                        <th className="py-3 text-right">Impact</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {projects.map(p => (
                        <tr key={p.id} className="border-b border-gray-100">
                          <td className="py-4 font-bold">{p.title}</td>
                          <td className="py-4 text-gray-600">{p.location}</td>
                          <td className="py-4">${(p.fundingGoal || 0).toLocaleString()}</td>
                          <td className="py-4 text-right font-black text-primary">{p.impactValue || "High"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-auto pt-12 border-t text-center text-gray-400 text-xs">
                  <p>© 2026 Greenworld Environmental Platform. All data verified and secured by blockchain hashes.</p>
                  <p className="mt-1">Generated for Corporate Member Session ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
