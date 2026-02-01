import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

// JWT secret - in production, use environment variable
const JWT_SECRET = process.env.JWT_SECRET || "greenworld-secret-key-change-in-production";
const JWT_EXPIRES_IN = "7d";

export interface AuthUser {
    id: number;
    email: string;
    name: string;
    role: "corporate" | "ngo" | "volunteer" | "admin";
    organizationName?: string | null;
}

// Extend Express Request to include user
declare global {
    namespace Express {
        interface Request {
            user?: AuthUser;
        }
    }
}

export function generateToken(user: AuthUser): string {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
}

export function verifyToken(token: string): { id: number; email: string; role: string } | null {
    try {
        return jwt.verify(token, JWT_SECRET) as { id: number; email: string; role: string };
    } catch {
        return null;
    }
}

// Authentication middleware - verifies JWT token
export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.slice(7);
    const decoded = verifyToken(token);

    if (!decoded) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }

    // Fetch full user from database
    const [user] = await db.select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        organizationName: users.organizationName,
    }).from(users).where(eq(users.id, decoded.id)).limit(1);

    if (!user) {
        return res.status(401).json({ error: "User not found" });
    }

    req.user = user as AuthUser;
    next();
}

// Optional auth middleware - doesn't fail if no token
export async function optionalAuthMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.slice(7);
        const decoded = verifyToken(token);

        if (decoded) {
            const [user] = await db.select({
                id: users.id,
                email: users.email,
                name: users.name,
                role: users.role,
                organizationName: users.organizationName,
            }).from(users).where(eq(users.id, decoded.id)).limit(1);

            if (user) {
                req.user = user as AuthUser;
            }
        }
    }

    next();
}

// Role-based access control middleware
export function requireRole(...allowedRoles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ error: "Authentication required" });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: "Insufficient permissions" });
        }

        next();
    };
}
