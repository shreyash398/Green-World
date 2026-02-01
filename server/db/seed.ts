import { db } from "./index";
import { users, projects, milestones, registrations, certificates } from "./schema";
import bcrypt from "bcryptjs";
import { runMigrations } from "./migrate";
import { fileURLToPath } from 'node:url';

async function seed() {
    console.log("🌱 Seeding database...");

    // Run migrations first
    runMigrations();

    // Check if data already exists
    const existingUsers = await db.select().from(users).limit(1);
    if (existingUsers.length > 0) {
        console.log("📦 Database already seeded, skipping...");
        return;
    }

    // Create password hash for demo users
    const passwordHash = await bcrypt.hash("password123", 10);

    // Insert demo users
    const [adminUser] = await db.insert(users).values({
        email: "admin@greenworld.org",
        passwordHash,
        name: "System Admin",
        role: "admin",
    }).returning();

    const [ngoUser1] = await db.insert(users).values({
        email: "contact@greenearthsociety.org",
        passwordHash,
        name: "Green Earth Society",
        role: "ngo",
        organizationName: "Green Earth Society",
    }).returning();

    const [ngoUser2] = await db.insert(users).values({
        email: "info@oceanians.org",
        passwordHash,
        name: "Ocean Guardians",
        role: "ngo",
        organizationName: "Ocean Guardians",
    }).returning();

    const [volunteerUser] = await db.insert(users).values({
        email: "volunteer@example.com",
        passwordHash,
        name: "John Doe",
        role: "volunteer",
    }).returning();

    const [corporateUser] = await db.insert(users).values({
        email: "csr@techcorp.com",
        passwordHash,
        name: "TechCorp CSR Team",
        role: "corporate",
        organizationName: "TechCorp Inc.",
    }).returning();

    // Insert demo projects
    const [project1] = await db.insert(projects).values({
        title: "Urban Forest Initiative",
        description: "A large-scale project aimed at restoring the urban canopy in the heart of the city. We focused on planting native species like Neem, Peepal, and Banyan to improve local air quality.",
        longDescription: "This initiative successfully transformed a 2-acre abandoned industrial plot into a thriving urban forest. Over 450 volunteers participated in the primary planting phase. The project now serves as a local 'green lung', reducing heat island effects by an average of 4°C in the immediate vicinity.",
        location: "Mumbai, India",
        fundingGoal: 50000,
        fundingReceived: 35000,
        status: "active",
        impactType: "Trees",
        impactValue: "5,000 trees",
        carbonOffset: "3.2 tons/year",
        image: "🌳",
        ngoId: ngoUser1.id,
    }).returning();

    const [project2] = await db.insert(projects).values({
        title: "Coastal Cleanup Drive",
        description: "Remove plastic and waste from coastal areas to protect marine ecosystems and wildlife.",
        longDescription: "Focused on the Goa coastline, this drive mobilized over 200 youths to clear devastating plastic accumulation. All collected waste was sent to our partner recycling facility.",
        location: "Goa, India",
        fundingGoal: 30000,
        fundingReceived: 18000,
        status: "active",
        impactType: "Waste",
        impactValue: "5 tons waste",
        carbonOffset: "0.8 tons/year",
        image: "🌊",
        ngoId: ngoUser2.id,
    }).returning();

    const [project3] = await db.insert(projects).values({
        title: "Mangrove Restoration",
        description: "Restore and protect 2,000 hectares of mangrove forests crucial for coastal biodiversity.",
        longDescription: "Working with local fishing communities, we are restoring degraded mangrove ecosystems along the Kerala coast. This project combines conservation with sustainable livelihood generation.",
        location: "Kerala, India",
        fundingGoal: 45000,
        fundingReceived: 45000,
        status: "completed",
        impactType: "Trees",
        impactValue: "2,000 hectares",
        carbonOffset: "15 tons/year",
        image: "🌿",
        ngoId: ngoUser1.id,
    }).returning();

    const [project4] = await db.insert(projects).values({
        title: "Water Harvesting System",
        description: "Install rainwater harvesting systems in 50 rural villages to provide sustainable water access.",
        location: "Rajasthan, India",
        fundingGoal: 60000,
        fundingReceived: 40000,
        status: "active",
        impactType: "Water",
        impactValue: "2.1M liters",
        image: "💧",
        ngoId: ngoUser2.id,
    }).returning();

    // Insert milestones for projects
    await db.insert(milestones).values([
        { projectId: project1.id, name: "Site Preparation", completed: true, orderIndex: 0 },
        { projectId: project1.id, name: "Community Education", completed: true, orderIndex: 1 },
        { projectId: project1.id, name: "Mass Planting", completed: false, orderIndex: 2 },
        { projectId: project1.id, name: "Initial Irrigation", completed: false, orderIndex: 3 },
    ]);

    await db.insert(milestones).values([
        { projectId: project2.id, name: "Area Scouting", completed: true, orderIndex: 0 },
        { projectId: project2.id, name: "Equipment Distribution", completed: true, orderIndex: 1 },
        { projectId: project2.id, name: "Collection Phase", completed: false, orderIndex: 2 },
        { projectId: project2.id, name: "Sorting & Recycling", completed: false, orderIndex: 3 },
    ]);

    await db.insert(milestones).values([
        { projectId: project3.id, name: "Initial Survey", completed: true, orderIndex: 0 },
        { projectId: project3.id, name: "Site Preparation", completed: true, orderIndex: 1 },
        { projectId: project3.id, name: "Planting Phase", completed: true, orderIndex: 2 },
        { projectId: project3.id, name: "Monitoring", completed: true, orderIndex: 3 },
    ]);

    // Register volunteer for projects
    await db.insert(registrations).values([
        { userId: volunteerUser.id, projectId: project1.id, hoursContributed: 12 },
        { userId: volunteerUser.id, projectId: project3.id, hoursContributed: 8 },
    ]);

    // Issue certificate for completed project
    await db.insert(certificates).values({
        userId: volunteerUser.id,
        projectId: project3.id,
        hours: 8,
    });

    console.log("✅ Database seeded successfully!");
    console.log("📧 Demo accounts created:");
    console.log("   Admin: admin@greenworld.org / password123");
    console.log("   NGO: contact@greenearthsociety.org / password123");
    console.log("   Volunteer: volunteer@example.com / password123");
    console.log("   Corporate: csr@techcorp.com / password123");
}

// Run if executed directly
import { dirname } from 'node:path';

const isDirectRun = () => {
    try {
        const __filename = fileURLToPath(import.meta.url);
        return process.argv[1] === __filename;
    } catch {
        return false;
    }
};

if (isDirectRun()) {
    seed().catch(console.error);
}

export { seed };
