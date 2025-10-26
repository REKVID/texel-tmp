import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ParticlesBackground } from "@/components/ParticlesBackground";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="main-container flex min-h-screen items-center justify-center">
      <ParticlesBackground />
      <div className="content-layer text-center">
        <h1 className="mb-4 text-4xl font-bold text-gradient">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-primary underline hover:text-primary/80 transition-colors">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
