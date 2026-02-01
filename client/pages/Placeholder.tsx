import { Navbar } from "@/components/layout/Navbar";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface PlaceholderProps {
  title: string;
  description: string;
}

export function Placeholder({ title, description }: PlaceholderProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-primary">{title}</h1>
            <p className="text-xl text-gray-600">{description}</p>
          </div>

          <div className="bg-white rounded-2xl border-2 border-dashed border-green-200 p-12">
            <div className="space-y-4">
              <p className="text-gray-700">
                This page is ready for development. Continue chatting with your
                AI assistant to build out the features for this page.
              </p>
              <p className="text-sm text-gray-600">
                Let them know what you'd like to see here, and they'll implement
                it for you!
              </p>
            </div>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-primary text-white hover:bg-primary/90 transition-all font-semibold"
          >
            Return to Home
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
