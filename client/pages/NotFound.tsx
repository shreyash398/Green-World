import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[600px]">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-7xl font-bold text-primary">404</h1>
            <h2 className="text-3xl font-bold text-gray-900">Page Not Found</h2>
            <p className="text-xl text-gray-600 max-w-lg mx-auto">
              The page you're looking for doesn't exist. This route is ready for
              development. Tell your AI assistant what you'd like to build here!
            </p>
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
};

export default NotFound;
