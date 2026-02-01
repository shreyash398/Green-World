import { useMemo } from "react";

interface Particle {
    id: number;
    size: number;
    x: number;
    y: number;
    delay: number;
    duration: number;
    opacity: number;
}

interface ParticleBackgroundProps {
    count?: number;
    className?: string;
}

export function ParticleBackground({
    count = 50,
    className = "",
}: ParticleBackgroundProps) {
    const particles = useMemo<Particle[]>(() => {
        return Array.from({ length: count }, (_, i) => ({
            id: i,
            size: Math.random() * 6 + 2,
            x: Math.random() * 100,
            y: Math.random() * 100,
            delay: Math.random() * 10,
            duration: Math.random() * 15 + 10,
            opacity: Math.random() * 0.5 + 0.1,
        }));
    }, [count]);

    return (
        <div
            className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
        >
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className="absolute rounded-full bg-primary"
                    style={{
                        width: particle.size,
                        height: particle.size,
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        opacity: particle.opacity,
                        animation: `particle-float ${particle.duration}s ease-in-out infinite`,
                        animationDelay: `${particle.delay}s`,
                    }}
                />
            ))}

            {/* Gradient orbs */}
            <div
                className="absolute w-96 h-96 rounded-full blur-3xl opacity-20 animate-float-slow"
                style={{
                    background:
                        "radial-gradient(circle, hsl(152 76% 36% / 0.4) 0%, transparent 70%)",
                    top: "-10%",
                    right: "-10%",
                }}
            />
            <div
                className="absolute w-80 h-80 rounded-full blur-3xl opacity-15 animate-float"
                style={{
                    background:
                        "radial-gradient(circle, hsl(168 76% 42% / 0.4) 0%, transparent 70%)",
                    bottom: "-5%",
                    left: "-5%",
                    animationDelay: "3s",
                }}
            />
            <div
                className="absolute w-64 h-64 rounded-full blur-3xl opacity-10 animate-float-slow"
                style={{
                    background:
                        "radial-gradient(circle, hsl(142 70% 45% / 0.3) 0%, transparent 70%)",
                    top: "40%",
                    left: "50%",
                    animationDelay: "5s",
                }}
            />
        </div>
    );
}
