import { Navbar } from "@/components/layout/Navbar";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileText } from "lucide-react";

export default function Privacy() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="max-w-4xl mx-auto px-4 py-20 space-y-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-6"
                >
                    <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto text-primary">
                        <Shield className="w-10 h-10" />
                    </div>
                    <h1 className="text-5xl font-black">Privacy Policy</h1>
                    <p className="text-xl text-muted-foreground">Effective Date: January 2024</p>
                </motion.div>

                <div className="card-glass p-12 rounded-[3rem] border-2 border-white shadow-xl space-y-10 prose prose-lg prose-invert max-w-none text-muted-foreground">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                            <Eye className="w-6 h-6 text-primary" />
                            1. Information We Collect
                        </h2>
                        <p>
                            We collect information you provide directly to us when you create an account, participate in a project, or communicate with us. This includes your name, email address, corporate affiliation (if applicable), and any impact data or photos you upload.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                            <Lock className="w-6 h-6 text-primary" />
                            2. How We Use Your Information
                        </h2>
                        <p>
                            We use the information we collect to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Verify environmental impact claims and milestones.</li>
                            <li>Facilitate communication between Corporates, NGOs, and Volunteers.</li>
                            <li>Generate transparency reports and impact certificates.</li>
                            <li>Improve our platform's security and performance.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                            <FileText className="w-6 h-6 text-primary" />
                            3. Data Sharing and Transparency
                        </h2>
                        <p>
                            As a transparency-first platform, certain project data (such as impact metrics, location, and non-sensitive photos) may be made public to verify results. Personal contact information is never shared without explicit consent.
                        </p>
                    </section>

                    <section className="space-y-4 pt-10 border-t border-border">
                        <p className="text-sm italic">
                            Questions regarding our privacy practices? Contact us at <a href="mailto:privacy@greenworld.eco" className="text-primary hover:underline">privacy@greenworld.eco</a>
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
}
