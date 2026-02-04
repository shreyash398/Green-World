import { Router } from "express";
import { db } from "../db";
import { users } from "../db/schema";
import { eq, desc } from "drizzle-orm";
import { authMiddleware, requireRole } from "../middleware/auth";

const router = Router();

// GET /api/users - List all users (Admin only)
router.get("/", authMiddleware, requireRole("admin"), async (req, res) => {
    try {
        const userList = await db.select({
            id: users.id,
            email: users.email,
            name: users.name,
            role: users.role,
            organizationName: users.organizationName,
            createdAt: users.createdAt,
        }).from(users).orderBy(desc(users.createdAt));

        res.json({ users: userList });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

// DELETE /api/users/:id - Delete user (Admin only)
router.delete("/:id", authMiddleware, requireRole("admin"), async (req, res) => {
    try {
        const userId = parseInt(req.params.id);

        // Don't allow deleting self
        if (userId === req.user!.id) {
            return res.status(400).json({ error: "Cannot delete your own admin account" });
        }

        await db.delete(users).where(eq(users.id, userId));
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Failed to delete user" });
    }
});

export default router;
