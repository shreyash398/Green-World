import { Router } from "express";
import bcrypt from "bcryptjs";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { generateToken, authMiddleware, AuthUser } from "../middleware/auth";
import { z } from "zod";

const router = Router();

// Validation schemas
const registerSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    name: z.string().min(2, "Name must be at least 2 characters"),
    role: z.enum(["corporate", "ngo", "volunteer", "admin"]),
    organizationName: z.string().optional(),
});

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

// POST /api/auth/register
router.post("/register", async (req, res) => {
    try {
        const result = registerSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                error: "Validation failed",
                details: result.error.errors
            });
        }

        const { email, password, name, role, organizationName } = result.data;

        // Check if user already exists
        const existingUser = await db.select()
            .from(users)
            .where(eq(users.email, email.toLowerCase()))
            .limit(1);

        if (existingUser.length > 0) {
            return res.status(400).json({ error: "Email already registered" });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user
        const [newUser] = await db.insert(users).values({
            email: email.toLowerCase(),
            passwordHash,
            name,
            role,
            organizationName: organizationName || null,
        }).returning({
            id: users.id,
            email: users.email,
            name: users.name,
            role: users.role,
            organizationName: users.organizationName,
        });

        // Generate JWT
        const token = generateToken(newUser as AuthUser);

        res.status(201).json({
            message: "Account created successfully",
            user: newUser,
            token,
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Failed to create account" });
    }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
    try {
        const result = loginSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                error: "Validation failed",
                details: result.error.errors
            });
        }

        const { email, password } = result.data;

        // Find user
        const [user] = await db.select()
            .from(users)
            .where(eq(users.email, email.toLowerCase()))
            .limit(1);

        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.passwordHash);

        if (!isValidPassword) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Generate JWT
        const authUser: AuthUser = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role as AuthUser["role"],
            organizationName: user.organizationName,
        };

        const token = generateToken(authUser);

        res.json({
            message: "Login successful",
            user: authUser,
            token,
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Failed to login" });
    }
});

// GET /api/auth/me - Get current user
router.get("/me", authMiddleware, async (req, res) => {
    res.json({ user: req.user });
});

// POST /api/auth/logout - Logout (client-side token removal)
router.post("/logout", (req, res) => {
    // JWT tokens are stateless, so logout is handled client-side
    // This endpoint is here for API completeness
    res.json({ message: "Logged out successfully" });
});

// PUT /api/auth/profile - Update current user profile
router.put("/profile", authMiddleware, async (req, res) => {
    try {
        const userId = req.user!.id;
        const { name, organizationName } = req.body;

        const [updated] = await db.update(users)
            .set({
                name,
                organizationName
            })
            .where(eq(users.id, userId))
            .returning();

        const { passwordHash, ...userWithoutPassword } = updated;
        res.json({ user: userWithoutPassword });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ error: "Failed to update profile" });
    }
});

export default router;
