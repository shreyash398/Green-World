import { Navbar } from "@/components/layout/Navbar";
import {
  BarChart3,
  Building2,
  Leaf,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { statsApi, projectsApi, usersApi } from "@/lib/api";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, projectsRes, usersRes] = await Promise.all([
        statsApi.platform(),
        projectsApi.list({ status: "all" }),
        usersApi.list(),
      ]);
      setStats(statsRes);
      setProjects(projectsRes.projects);
      setUsers(usersRes.users);
    } catch (error: any) {
      toast.error("Failed to load admin data");
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await usersApi.delete(id);
      toast.success("User deleted");
      fetchData();
    } catch (e) {
      toast.error("Deletion failed");
    }
  };

  const platformMetrics = [
    { label: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "text-blue-500" },
    { label: "NGOs", value: stats?.totalNGOs || 0, icon: Leaf, color: "text-primary" },
    {
      label: "Corporates",
      value: stats?.totalCorporates || 0,
      icon: Building2,
      color: "text-purple-500",
    },
    { label: "Projects", value: stats?.totalProjects || 0, icon: TrendingUp, color: "text-accent" },
  ];

  const pendingApprovals = projects.filter(p => p.status === "draft" || p.status === "Pending");

  const chartData = stats?.growthData || [
    { date: "Jan 1", projects: 0, users: 0, impact: 0 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Monitor platform metrics and manage approvals
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-green-100">
          {[
            { id: "overview", label: "Overview" },
            { id: "approvals", label: "Pending Approvals" },
            { id: "users", label: "User Management" },
            { id: "reports", label: "Reports" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 font-semibold transition-colors ${activeTab === tab.id
                ? "text-primary border-b-2 border-primary"
                : "text-gray-600 hover:text-primary"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Platform Metrics */}
            <div className="grid md:grid-cols-4 gap-6">
              {platformMetrics.map((metric) => {
                const Icon = metric.icon;
                return (
                  <div
                    key={metric.label}
                    className="bg-white rounded-xl p-6 border border-green-100 shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Icon className={`w-6 h-6 ${metric.color}`} />
                      </div>
                      <span className="text-3xl font-bold text-gray-900">
                        {metric.value}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{metric.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Growth Chart */}
            <div className="bg-white rounded-xl p-6 border border-green-100 shadow-sm">
              <h2 className="text-xl font-bold text-primary mb-6">
                Platform Growth
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="projects"
                    stroke="#16a34a"
                    name="Projects"
                  />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#0ea5e9"
                    name="Users"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Pending Approvals Summary */}
            <div className="bg-white rounded-xl p-6 border border-green-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-primary">
                  Pending Approvals Summary
                </h2>
                <span className="text-2xl font-bold text-yellow-500">{pendingApprovals.length}</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">NGO Registrations</span>
                  <span className="font-semibold text-gray-900">0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Project Approvals</span>
                  <span className="font-semibold text-gray-900">{pendingApprovals.length}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Approvals Tab */}
        {activeTab === "approvals" && (
          isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-gray-500 font-bold">Checking authorizations...</p>
            </div>
          ) : pendingApprovals.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500 font-bold">No pending registrations or project submissions.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingApprovals.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-green-100 p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="grid md:grid-cols-5 gap-6 items-center">
                    <div>
                      <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
                        Project
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {item.title}
                      </h3>
                    </div>

                    <div className="text-gray-600">
                      <p className="text-sm">Submitted</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-yellow-500" />
                        <span className={`font-semibold ${item.status === "Pending"
                          ? "text-yellow-600"
                          : "text-blue-600"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>

                    <div></div>

                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={async () => {
                          try {
                            await projectsApi.update(item.id, { status: 'active' });
                            toast.success("Project approved!");
                            fetchData();
                          } catch (e) { toast.error("Approval failed"); }
                        }}
                        className="px-4 py-2 rounded-lg bg-accent text-primary hover:bg-accent/90 transition-all text-sm font-semibold flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Approve
                      </button>
                      <button className="px-4 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition-all text-sm font-semibold">
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="bg-white rounded-xl border border-green-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-green-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-primary">User Management</h2>
              <span className="badge-premium px-3 py-1 text-xs">{users.length} Total Users</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-green-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Organization</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Joined</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{u.name}</div>
                        <div className="text-xs text-gray-500">{u.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${u.role === 'admin' ? 'bg-red-100 text-red-600' :
                          u.role === 'ngo' ? 'bg-primary/10 text-primary' :
                            u.role === 'corporate' ? 'bg-blue-100 text-blue-600' :
                              'bg-gray-100 text-gray-600'
                          }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{u.organizationName || "-"}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="text-red-600 hover:text-red-800 font-bold text-xs p-2 rounded-lg hover:bg-red-50 transition-all"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === "reports" && (
          <div className="bg-white rounded-xl border border-green-100 p-8">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold text-primary">
                Platform Reports
              </h3>
              <p className="text-gray-600">
                Generate comprehensive platform analytics and reports
              </p>
              <div className="flex gap-4 justify-center mt-6">
                <button className="px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition-all font-semibold">
                  Impact Report
                </button>
                <button className="px-6 py-3 rounded-lg border border-primary text-primary hover:bg-primary/5 transition-all font-semibold">
                  User Analytics
                </button>
                <button className="px-6 py-3 rounded-lg border border-primary text-primary hover:bg-primary/5 transition-all font-semibold">
                  Financial Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div >
  );
}
