import { Navbar } from "@/components/layout/Navbar";
import { motion } from "framer-motion";
import { FileText, Gavel, Scale, AlertCircle } from "lucide-react";

export default function Terms() {
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
                        <Gavel className="w-10 h-10" />
                    </div>
                    <h1 className="text-5xl font-black">Terms of Service</h1>
                    <p className="text-xl text-muted-foreground">Last Updated: January 2024</p>
                </motion.div>

                <div className="card-glass p-12 rounded-[3rem] border-2 border-white shadow-xl space-y-10 prose prose-lg prose-invert max-w-none text-muted-foreground">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                            <Scale className="w-6 h-6 text-primary" />
                            1. Agreement to Terms
                        </h2>
                        <p>
                            By accessing or using the Greenworld platform, you agree to be bound by these Terms of Service. If you are using the platform on behalf of a Corporate entity or NGO, you represent that you have the authority to bind that entity to these terms.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                            <AlertCircle className="w-6 h-6 text-primary" />
                            2. Verification and Accuracy
                        </h2>
                        <p>
                            Any data uploaded to the platform for the purpose of verifying environmental impact must be accurate and truthful. NGOs are responsible for the validity of their project claims. Greenworld reserves the right to suspend accounts that provide fraudulent or misleading information.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                            <FileText className="w-6 h-6 text-primary" />
                            3. Platform Fees and Capital
                        </h2>
                        <p>
                            Capital committed through the platform is subject to specific project agreements. Greenworld facilitates the verification protocol and may charge service fees as outlined in separate partnership agreements.
                        </p>
                    </section>

                    <section className="space-y-4 pt-10 border-t border-border">
                        <p className="text-sm italic">
                            For full legal documentation, please contact our legal department at <a href="mailto:legal@greenworld.eco" className="text-primary hover:underline">legal@greenworld.eco</a>
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
}
