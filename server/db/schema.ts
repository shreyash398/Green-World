import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// Users table - supports all 4 roles: corporate, ngo, volunteer, admin
export const users = sqliteTable("users", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    name: text("name").notNull(),
    role: text("role", { enum: ["corporate", "ngo", "volunteer", "admin"] }).notNull(),
    organizationName: text("organization_name"), // For corporate/NGO users
    createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Projects table - environmental initiatives created by NGOs
export const projects = sqliteTable("projects", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    longDescription: text("long_description"),
    location: text("location").notNull(),
    fundingGoal: integer("funding_goal").notNull().default(0),
    fundingReceived: integer("funding_received").notNull().default(0),
    status: text("status", { enum: ["draft", "active", "completed"] }).notNull().default("active"),
    impactType: text("impact_type"), // Trees, Water, Waste, Energy
    impactValue: text("impact_value"), // e.g., "5,000 trees", "2 tons waste"
    carbonOffset: text("carbon_offset"), // e.g., "3.2 tons/year"
    image: text("image"), // Emoji or URL
    ngoId: integer("ngo_id").notNull().references(() => users.id),
    createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Milestones for project progress tracking
export const milestones = sqliteTable("milestones", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    completed: integer("completed", { mode: "boolean" }).notNull().default(false),
    orderIndex: integer("order_index").notNull().default(0),
});

// Volunteer registrations for projects
export const registrations = sqliteTable("registrations", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
    hoursContributed: integer("hours_contributed").notNull().default(0),
    registeredAt: integer("registered_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Certificates earned by volunteers
export const certificates = sqliteTable("certificates", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
    hours: integer("hours").notNull(),
    issuedAt: integer("issued_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Project photos uploaded by NGOs
export const projectPhotos = sqliteTable("project_photos", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    uploadedAt: integer("uploaded_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
    projects: many(projects), // NGOs create projects
    registrations: many(registrations), // Volunteers register for projects
    certificates: many(certificates),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
    ngo: one(users, { fields: [projects.ngoId], references: [users.id] }),
    milestones: many(milestones),
    registrations: many(registrations),
    certificates: many(certificates),
    photos: many(projectPhotos),
}));

export const milestonesRelations = relations(milestones, ({ one }) => ({
    project: one(projects, { fields: [milestones.projectId], references: [projects.id] }),
}));

export const registrationsRelations = relations(registrations, ({ one }) => ({
    user: one(users, { fields: [registrations.userId], references: [users.id] }),
    project: one(projects, { fields: [registrations.projectId], references: [projects.id] }),
}));

export const certificatesRelations = relations(certificates, ({ one }) => ({
    user: one(users, { fields: [certificates.userId], references: [users.id] }),
    project: one(projects, { fields: [certificates.projectId], references: [projects.id] }),
}));

export const projectPhotosRelations = relations(projectPhotos, ({ one }) => ({
    project: one(projects, { fields: [projectPhotos.projectId], references: [projects.id] }),
}));
