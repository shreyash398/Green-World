import { Router } from "express";
import { db } from "../db";
import { projects, milestones, projectPhotos, registrations, users } from "../db/schema";
import { eq, like, and, desc, sql, count } from "drizzle-orm";
import { authMiddleware, optionalAuthMiddleware, requireRole } from "../middleware/auth";
import { z } from "zod";

const router = Router();

// Validation schemas
const createProjectSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    longDescription: z.string().optional(),
    location: z.string().min(2),
    fundingGoal: z.number().min(0).default(0),
    impactType: z.string().optional(),
    impactValue: z.string().optional(),
    carbonOffset: z.string().optional(),
    image: z.string().optional(),
});

// GET /api/projects - List all projects
router.get("/", optionalAuthMiddleware, async (req, res) => {
    try {
        const { search, location, status, impactType, limit = "50", offset = "0" } = req.query;

        // Build query conditions
        const conditions = [];

        if (search && typeof search === "string") {
            conditions.push(like(projects.title, `%${search}%`));
        }

        if (location && typeof location === "string" && location !== "all") {
            conditions.push(eq(projects.location, location));
        }

        if (status && typeof status === "string" && status !== "all") {
            conditions.push(eq(projects.status, status as "draft" | "active" | "completed"));
        }

        if (impactType && typeof impactType === "string" && impactType !== "all") {
            conditions.push(eq(projects.impactType, impactType));
        }

        // Only show active/completed projects to non-NGO users
        if (!req.user || req.user.role !== "ngo") {
            conditions.push(sql`${projects.status} != 'draft'`);
        }

        const projectList = await db.select({
            id: projects.id,
            title: projects.title,
            description: projects.description,
            location: projects.location,
            fundingGoal: projects.fundingGoal,
            fundingReceived: projects.fundingReceived,
            status: projects.status,
            impactType: projects.impactType,
            impactValue: projects.impactValue,
            image: projects.image,
            ngoId: projects.ngoId,
            createdAt: projects.createdAt,
        })
            .from(projects)
            .where(conditions.length > 0 ? and(...conditions) : undefined)
            .orderBy(desc(projects.createdAt))
            .limit(parseInt(limit as string))
            .offset(parseInt(offset as string));

        // Get volunteer counts for each project
        const projectsWithCounts = await Promise.all(
            projectList.map(async (project) => {
                const [volunteerCount] = await db.select({ count: count() })
                    .from(registrations)
                    .where(eq(registrations.projectId, project.id));

                const [ngo] = await db.select({ name: users.name, organizationName: users.organizationName })
                    .from(users)
                    .where(eq(users.id, project.ngoId));

                const projectMilestones = await db.select()
                    .from(milestones)
                    .where(eq(milestones.projectId, project.id))
                    .orderBy(milestones.orderIndex);

                return {
                    ...project,
                    volunteers: volunteerCount?.count || 0,
                    ngo: ngo?.organizationName || ngo?.name || "Unknown NGO",
                    milestones: projectMilestones.map(m => ({
                        id: m.id,
                        name: m.name,
                        completed: m.completed,
                    })),
                };
            })
        );

        res.json({ projects: projectsWithCounts });
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ error: "Failed to fetch projects" });
    }
});

// GET /api/projects/:id - Get single project
router.get("/:id", optionalAuthMiddleware, async (req, res) => {
    try {
        const projectId = parseInt(req.params.id);

        const [project] = await db.select()
            .from(projects)
            .where(eq(projects.id, projectId));

        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        // Get milestones
        const projectMilestones = await db.select()
            .from(milestones)
            .where(eq(milestones.projectId, projectId))
            .orderBy(milestones.orderIndex);

        // Get volunteer count
        const [volunteerCount] = await db.select({ count: count() })
            .from(registrations)
            .where(eq(registrations.projectId, projectId));

        // Get NGO info
        const [ngo] = await db.select({ name: users.name, organizationName: users.organizationName })
            .from(users)
            .where(eq(users.id, project.ngoId));

        // Get project photos
        const photos = await db.select()
            .from(projectPhotos)
            .where(eq(projectPhotos.projectId, projectId));

        // Check if current user is registered
        let isRegistered = false;
        if (req.user) {
            const [registration] = await db.select()
                .from(registrations)
                .where(and(
                    eq(registrations.projectId, projectId),
                    eq(registrations.userId, req.user.id)
                ));
            isRegistered = !!registration;
        }

        res.json({
            ...project,
            milestones: projectMilestones.map(m => ({
                id: m.id,
                name: m.name,
                completed: m.completed,
            })),
            volunteers: volunteerCount?.count || 0,
            ngo: ngo?.organizationName || ngo?.name || "Unknown NGO",
            photos: photos.map(p => p.url),
            isRegistered,
        });
    } catch (error) {
        console.error("Error fetching project:", error);
        res.status(500).json({ error: "Failed to fetch project" });
    }
});

// POST /api/projects - Create new project (NGO only)
router.post("/", authMiddleware, requireRole("ngo", "admin"), async (req, res) => {
    try {
        const result = createProjectSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({ error: "Validation failed", details: result.error.errors });
        }

        const [newProject] = await db.insert(projects).values({
            ...result.data,
            ngoId: req.user!.id,
            status: "active",
        }).returning();

        res.status(201).json({ project: newProject });
    } catch (error) {
        console.error("Error creating project:", error);
        res.status(500).json({ error: "Failed to create project" });
    }
});

// PUT /api/projects/:id - Update project
router.put("/:id", authMiddleware, requireRole("ngo", "admin"), async (req, res) => {
    try {
        const projectId = parseInt(req.params.id);

        // Verify ownership (unless admin)
        if (req.user!.role !== "admin") {
            const [project] = await db.select()
                .from(projects)
                .where(eq(projects.id, projectId));

            if (!project || project.ngoId !== req.user!.id) {
                return res.status(403).json({ error: "Not authorized to update this project" });
            }
        }

        const [updated] = await db.update(projects)
            .set(req.body)
            .where(eq(projects.id, projectId))
            .returning();

        res.json({ project: updated });
    } catch (error) {
        console.error("Error updating project:", error);
        res.status(500).json({ error: "Failed to update project" });
    }
});

// PUT /api/projects/:id/milestones/:mid - Toggle milestone
router.put("/:id/milestones/:mid", authMiddleware, requireRole("ngo", "admin"), async (req, res) => {
    try {
        const projectId = parseInt(req.params.id);
        const milestoneId = parseInt(req.params.mid);

        // Get current milestone state
        const [milestone] = await db.select()
            .from(milestones)
            .where(eq(milestones.id, milestoneId));

        if (!milestone || milestone.projectId !== projectId) {
            return res.status(404).json({ error: "Milestone not found" });
        }

        // Toggle completion
        const [updated] = await db.update(milestones)
            .set({ completed: !milestone.completed })
            .where(eq(milestones.id, milestoneId))
            .returning();

        res.json({ milestone: updated });
    } catch (error) {
        console.error("Error updating milestone:", error);
        res.status(500).json({ error: "Failed to update milestone" });
    }
});

// POST /api/projects/:id/register - Register for project (Volunteer)
router.post("/:id/register", authMiddleware, async (req, res) => {
    try {
        const projectId = parseInt(req.params.id);
        const userId = req.user!.id;

        // Check if already registered
        const [existing] = await db.select()
            .from(registrations)
            .where(and(
                eq(registrations.projectId, projectId),
                eq(registrations.userId, userId)
            ));

        if (existing) {
            return res.status(400).json({ error: "Already registered for this project" });
        }

        // Create registration
        const [registration] = await db.insert(registrations).values({
            userId,
            projectId,
            hoursContributed: 0,
        }).returning();

        res.status(201).json({
            message: "Successfully registered for project",
            registration
        });
    } catch (error) {
        console.error("Error registering for project:", error);
        res.status(500).json({ error: "Failed to register for project" });
    }
});

export default router;
