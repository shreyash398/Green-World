import { Router } from "express";
import { db } from "../db";
import { projects, registrations, users, certificates } from "../db/schema";
import { eq, and, desc } from "drizzle-orm";
import { authMiddleware, requireRole } from "../middleware/auth";

const router = Router();

// GET /api/ngo/volunteers - Get all volunteers registered for this NGO's projects
router.get("/volunteers", authMiddleware, requireRole("ngo"), async (req, res) => {
    try {
        const ngoId = req.user!.id;

        // Get NGO's projects
        const ngoProjects = await db.select().from(projects).where(eq(projects.ngoId, ngoId));
        const projectIds = ngoProjects.map(p => p.id);

        if (projectIds.length === 0) {
            return res.json({ volunteers: [] });
        }

        // Get registrations for these projects
        const registeredVolunteers = await db.select({
            id: users.id,
            name: users.name,
            email: users.email,
            projectId: registrations.projectId,
            projectTitle: projects.title,
            hours: registrations.hoursContributed,
            enrolledAt: registrations.registeredAt,
        })
            .from(registrations)
            .innerJoin(users, eq(registrations.userId, users.id))
            .innerJoin(projects, eq(registrations.projectId, projects.id))
            .where(eq(projects.ngoId, ngoId))
            .orderBy(desc(registrations.registeredAt));

        res.json({ volunteers: registeredVolunteers });
    } catch (error) {
        console.error("Error fetching NGO volunteers:", error);
        res.status(500).json({ error: "Failed to fetch volunteers" });
    }
});

// GET /api/ngo/funding - Get detailed funding breakdown for NGO projects
router.get("/funding", authMiddleware, requireRole("ngo"), async (req, res) => {
    try {
        const ngoId = req.user!.id;

        const ngoProjects = await db.select()
            .from(projects)
            .where(eq(projects.ngoId, ngoId))
            .orderBy(desc(projects.createdAt));

        const fundingDetails = ngoProjects.map(p => ({
            id: p.id,
            title: p.title,
            fundingGoal: p.fundingGoal,
            fundingReceived: p.fundingReceived,
            status: p.status,
            percent: Math.round((p.fundingReceived / (p.fundingGoal || 1)) * 100)
        }));

        res.json({ funding: fundingDetails });
    } catch (error) {
        console.error("Error fetching NGO funding:", error);
        res.status(500).json({ error: "Failed to fetch funding data" });
    }
});

export default router;
