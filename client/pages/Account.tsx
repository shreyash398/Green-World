import { Navbar } from "@/components/layout/Navbar";
import { ParticleBackground } from "@/components/effects/ParticleBackground";
import {
    User,
    Mail,
    Shield,
    Bell,
    LogOut,
    Settings,
    ChevronRight,
    Sparkles,
    Camera
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { authApi } from "@/lib/api";
import { toast } from "sonner";

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }
    }
};

export default function Account() {
    const navigate = useNavigate();
    const { user, logout, setUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || "",
        organizationName: user?.organizationName || ""
    });

    useEffect(() => {
        if (!user) {
            navigate("/login");
        } else {
            setFormData({
                name: user.name || "",
                organizationName: user.organizationName || ""
            });
        }
    }, [user, navigate]);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const handleUpdateProfile = async () => {
        try {
            const res = await authApi.updateProfile(formData);
            setUser(res.user);
            toast.success("Profile updated successfully!");
            setIsEditing(false);
        } catch (error) {
            toast.error("Failed to update profile");
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-background overflow-hidden selection:bg-primary/20">
            <Navbar />

            <div className="fixed inset-0 -z-10">
                <ParticleBackground count={15} />
                <div className="absolute inset-0 gradient-bg-radial opacity-30" />
            </div>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: { transition: { staggerChildren: 0.1 } }
                    }}
                    className="space-y-8"
                >
                    {/* Header */}
                    <motion.div variants={fadeUp} className="flex flex-col md:flex-row items-center gap-8 mb-12">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full border-4 border-primary/20 overflow-hidden bg-muted flex items-center justify-center text-4xl shadow-xl">
                                {user.email[0].toUpperCase()}
                            </div>
                            <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:scale-110 transition-transform">
                                <Camera className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="text-center md:text-left space-y-2">
                            {isEditing ? (
                                <div className="space-y-4">
                                    <input
                                        className="text-4xl font-black bg-transparent border-b-2 border-primary focus:outline-none"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                    {user.role !== 'volunteer' && (
                                        <input
                                            className="block text-xl font-bold bg-transparent border-b-2 border-primary/50 focus:outline-none"
                                            value={formData.organizationName || ""}
                                            placeholder="Organization Name"
                                            onChange={e => setFormData({ ...formData, organizationName: e.target.value })}
                                        />
                                    )}
                                    <div className="flex gap-2">
                                        <button onClick={handleUpdateProfile} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold">Save</button>
                                        <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm font-bold">Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h1 className="text-4xl font-black tracking-tight">{user.name || user.email.split('@')[0]}</h1>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                        <span className="badge-premium px-4 py-1.5 uppercase tracking-widest text-xs font-black">
                                            {user.role} Member
                                        </span>
                                        <span className="text-muted-foreground font-medium flex items-center gap-2">
                                            <Mail className="w-4 h-4" /> {user.email}
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>

                    {/* Settings Grid */}
                    <div className="grid md:grid-cols-1 gap-6">
                        <motion.div variants={fadeUp} className="card-glass p-8 rounded-[2.5rem] border-2 border-white shadow-xl space-y-6">
                            <h2 className="text-2xl font-black flex items-center gap-3">
                                <Settings className="w-6 h-6 text-primary" />
                                Account Settings
                            </h2>

                            <div className="space-y-4">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-primary/5 transition-all group border border-transparent hover:border-primary/10"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold">Personal Information</p>
                                            <p className="text-sm text-muted-foreground">Update your name and organization details</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1" />
                                </button>

                                {[
                                    { icon: Shield, label: "Security & Password", detail: "Manage your account security" },
                                    { icon: Bell, label: "Notification Preferences", detail: "Choose how we contact you" },
                                ].map((item, i) => (
                                    <button key={i} className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-primary/5 transition-all group border border-transparent hover:border-primary/10">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                                <item.icon className="w-5 h-5" />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-bold">{item.label}</p>
                                                <p className="text-sm text-muted-foreground">{item.detail}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1" />
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Logout Section */}
                        <motion.div variants={fadeUp} className="flex justify-center pt-8">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-10 py-4 rounded-2xl bg-destructive/10 text-destructive font-black hover:bg-destructive hover:text-white transition-all shadow-lg hover:shadow-destructive/20 border-2 border-destructive/20"
                            >
                                <LogOut className="w-5 h-5" />
                                Sign Out Account
                            </button>
                        </motion.div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
