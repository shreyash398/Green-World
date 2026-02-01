import { Router } from "express";
import { db } from "../db";
import { registrations, projects, certificates, users, milestones, projectPhotos } from "../db/schema";
import { eq, and, sum, count } from "drizzle-orm";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// GET /api/volunteers/my-projects - Get volunteer's registered projects
router.get("/my-projects", authMiddleware, async (req, res) => {
    try {
        const userId = req.user!.id;

        // Get all registrations for user
        const userRegistrations = await db.select({
            registrationId: registrations.id,
            projectId: registrations.projectId,
            hoursContributed: registrations.hoursContributed,
            registeredAt: registrations.registeredAt,
            projectTitle: projects.title,
            projectDescription: projects.description,
            projectLongDescription: projects.longDescription,
            projectLocation: projects.location,
            projectStatus: projects.status,
            projectImage: projects.image,
            projectImpactValue: projects.impactValue,
            projectCarbonOffset: projects.carbonOffset,
            ngoId: projects.ngoId,
        })
            .from(registrations)
            .innerJoin(projects, eq(registrations.projectId, projects.id))
            .where(eq(registrations.userId, userId));

        // Get NGO names and certificates for each project
        const projectsWithDetails = await Promise.all(
            userRegistrations.map(async (reg) => {
                const [ngo] = await db.select({ name: users.name, organizationName: users.organizationName })
                    .from(users)
                    .where(eq(users.id, reg.ngoId));

                const [cert] = await db.select()
                    .from(certificates)
                    .where(and(
                        eq(certificates.userId, userId),
                        eq(certificates.projectId, reg.projectId)
                    ));

                const projectMilestones = await db.select()
                    .from(milestones)
                    .where(eq(milestones.projectId, reg.projectId))
                    .orderBy(milestones.orderIndex);

                const photos = await db.select()
                    .from(projectPhotos)
                    .where(eq(projectPhotos.projectId, reg.projectId));

                return {
                    id: reg.projectId,
                    name: reg.projectTitle,
                    description: reg.projectDescription,
                    longDescription: reg.projectLongDescription,
                    status: reg.projectStatus === "completed" ? "Completed" : "In Progress",
                    hours: reg.hoursContributed,
                    impact: reg.projectImpactValue || "Impact pending",
                    carbonOffset: reg.projectCarbonOffset || "Calculating...",
                    date: reg.registeredAt ? new Date(reg.registeredAt).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric"
                    }) : "N/A",
                    certificate: !!cert,
                    image: reg.projectImage || "🌱",
                    ngo: ngo?.organizationName || ngo?.name || "Unknown NGO",
                    milestones: projectMilestones.map(m => ({
                        id: m.id,
                        title: m.name,
                        status: m.completed ? 'Done' : 'In Progress', // Using dashboard-friendly status
                    })),
                    gallery: photos.map(p => p.url),
                };
            })
        );

        res.json({ projects: projectsWithDetails });
    } catch (error) {
        console.error("Error fetching volunteer projects:", error);
        res.status(500).json({ error: "Failed to fetch projects" });
    }
});

// GET /api/volunteers/stats - Get volunteer statistics
router.get("/stats", authMiddleware, async (req, res) => {
    try {
        const userId = req.user!.id;

        // Total hours volunteered
        const [hoursResult] = await db.select({ total: sum(registrations.hoursContributed) })
            .from(registrations)
            .where(eq(registrations.userId, userId));

        // Projects completed (where project status is completed)
        const completedProjects = await db.select({ count: count() })
            .from(registrations)
            .innerJoin(projects, eq(registrations.projectId, projects.id))
            .where(and(
                eq(registrations.userId, userId),
                eq(projects.status, "completed")
            ));

        // Certificates earned
        const [certCount] = await db.select({ count: count() })
            .from(certificates)
            .where(eq(certificates.userId, userId));

        // Impact score (simplified calculation)
        const totalHours = Number(hoursResult?.total) || 0;
        const impactScore = Math.round(totalHours * 35); // Simple multiplier

        res.json({
            hoursVolunteered: totalHours,
            projectsCompleted: completedProjects[0]?.count || 0,
            certificatesEarned: certCount?.count || 0,
            impactScore,
        });
    } catch (error) {
        console.error("Error fetching volunteer stats:", error);
        res.status(500).json({ error: "Failed to fetch statistics" });
    }
});

// GET /api/volunteers/certificates - Get earned certificates
router.get("/certificates", authMiddleware, async (req, res) => {
    try {
        const userId = req.user!.id;

        const userCertificates = await db.select({
            id: certificates.id,
            hours: certificates.hours,
            issuedAt: certificates.issuedAt,
            projectTitle: projects.title,
            projectId: projects.id,
            ngoId: projects.ngoId,
        })
            .from(certificates)
            .innerJoin(projects, eq(certificates.projectId, projects.id))
            .where(eq(certificates.userId, userId));

        // Get NGO names
        const certsWithNgo = await Promise.all(
            userCertificates.map(async (cert) => {
                const [ngo] = await db.select({ name: users.name, organizationName: users.organizationName })
                    .from(users)
                    .where(eq(users.id, cert.ngoId));

                return {
                    id: cert.id,
                    projectName: cert.projectTitle,
                    hours: cert.hours,
                    issuedAt: cert.issuedAt,
                    ngo: ngo?.organizationName || ngo?.name || "Unknown NGO",
                };
            })
        );

        res.json({ certificates: certsWithNgo });
    } catch (error) {
        console.error("Error fetching certificates:", error);
        res.status(500).json({ error: "Failed to fetch certificates" });
    }
});

// PUT /api/volunteers/log-hours - Log volunteer hours
router.put("/log-hours", authMiddleware, async (req, res) => {
    try {
        const userId = req.user!.id;
        const { projectId, hours } = req.body;

        if (!projectId || typeof hours !== "number" || hours < 0) {
            return res.status(400).json({ error: "Valid projectId and hours required" });
        }

        // Update hours
        const [updated] = await db.update(registrations)
            .set({ hoursContributed: hours })
            .where(and(
                eq(registrations.userId, userId),
                eq(registrations.projectId, projectId)
            ))
            .returning();

        if (!updated) {
            return res.status(404).json({ error: "Registration not found" });
        }

        res.json({ message: "Hours logged successfully", registration: updated });
    } catch (error) {
        console.error("Error logging hours:", error);
        res.status(500).json({ error: "Failed to log hours" });
    }
});

export default router;
