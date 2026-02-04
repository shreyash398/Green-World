import { db } from "./index";
import { users, projects, milestones, registrations, certificates, projectPhotos } from "./schema";
// @ts-ignore
import bcrypt from "bcryptjs";
import { runMigrations } from "./migrate";
import { fileURLToPath } from 'node:url';

async function seed() {
    console.log("🌱 Seeding database...");

    // Run migrations first
    runMigrations();

    // Clear existing data for a fresh demo experience
    console.log("🧹 Clearing old data...");
    try {
        await db.delete(projectPhotos);
        await db.delete(certificates);
        await db.delete(registrations);
        await db.delete(milestones);
        await db.delete(projects);
        await db.delete(users);
    } catch (e) {
        console.log("⚠️  Note: Some tables might already be empty or missing.");
    }

    // Create password hash for demo users
    const passwordHash = await bcrypt.hash("password123", 10);

    // 1. Insert Admins
    const [adminUser] = await db.insert(users).values({
        email: "admin@greenworld.org",
        passwordHash,
        name: "Abhijit Magar",
        role: "admin",
    }).returning();

    // 2. Insert NGOs
    const ngos = await db.insert(users).values([
        {
            email: "contact@greenearthsociety.org",
            passwordHash,
            name: "Sarah Green",
            role: "ngo",
            organizationName: "Green Earth Society",
        },
        {
            email: "info@oceanians.org",
            passwordHash,
            name: "Marcus Wave",
            role: "ngo",
            organizationName: "Ocean Guardians",
        },
        {
            email: "contact@urbanlungs.org",
            passwordHash,
            name: "Dr. Elena Root",
            role: "ngo",
            organizationName: "Urban Lungs Initiative",
        }
    ]).returning();

    // 3. Insert Corporate Users
    const corporates = await db.insert(users).values([
        {
            email: "csr@techcorp.com",
            passwordHash,
            name: "TechCorp CSR Team",
            role: "corporate",
            organizationName: "TechCorp Inc.",
        },
        {
            email: "impact@eco-logistics.net",
            passwordHash,
            name: "Eco-Logistics Global",
            role: "corporate",
            organizationName: "Eco-Logistics",
        }
    ]).returning();

    // 4. Insert Volunteers (30 volunteers)
    const volunteerList = [];
    const names = [
        "John Doe", "Jane Smith", "Alex River", "Sam Forest", "Chris Cloud",
        "Pat Leaf", "Terry Stone", "Lee Moss", "Kelly Stream", "Ryan Peak",
        "Taylor Valley", "Morgan Lake", "Robin Glen", "Jordan Field", "Casey Wood",
        "Aarav Sharma", "Zoe Chen", "Omar Hassan", "Yuki Tanaka", "Elena Rossi",
        "Liam O'Brien", "Sofia Garcia", "Noah Wilson", "Mia Müller", "Lucas Silva",
        "Amara Okafor", "Hirosh Gupta", "Emily Dupont", "Dmitry Volkov", "Isabella Conti"
    ];

    for (const name of names) {
        const email = `${name.toLowerCase().replace(" ", ".").replace("'", "")}@example.com`;
        const [vol] = await db.insert(users).values({
            email,
            passwordHash,
            name,
            role: "volunteer",
        }).returning();
        volunteerList.push(vol);
    }

    // 5. Insert Projects
    const projectData = [
        {
            title: "Urban Forest Initiative",
            description: "Restoring the urban canopy in Mumbai to improve air quality and reduce heat.",
            longDescription: "This initiative transformed an abandoned industrial plot into a thriving 2-acre urban forest. Over 450 volunteers participated. It serves as a local 'green lung', reducing heat island effects by 4°C.",
            location: "Mumbai, India",
            fundingGoal: 50000,
            fundingReceived: 35000,
            status: "active" as const,
            impactType: "Trees",
            impactValue: "5,000",
            carbonOffset: "3.2 tons/year",
            image: "🌳",
            ngoId: ngos[0].id,
        },
        {
            title: "Coastal Cleanup Drive",
            description: "Removing plastic and waste from coastal areas to protect marine wildlife.",
            longDescription: "Focused on the Goa coastline, this drive mobilized youth to clear plastic accumulation. All waste is recycled through partner facilities.",
            location: "Goa, India",
            fundingGoal: 30000,
            fundingReceived: 18000,
            status: "active" as const,
            impactType: "Waste",
            impactValue: "5 tons",
            carbonOffset: "0.8 tons/year",
            image: "🌊",
            ngoId: ngos[1].id,
        },
        {
            title: "Mangrove Restoration",
            description: "Restoring 2,000 hectares of mangrove forests crucial for coastal biodiversity.",
            longDescription: "Working with local fishing communities to restore degraded mangrove ecosystems. Combines conservation with sustainable livelihoods.",
            location: "Kerala, India",
            fundingGoal: 45000,
            fundingReceived: 45000,
            status: "completed" as const,
            impactType: "Trees",
            impactValue: "2,000 ha",
            carbonOffset: "15 tons/year",
            image: "🌿",
            ngoId: ngos[0].id,
        },
        {
            title: "Water Harvesting System",
            description: "Install rainwater harvesting in 50 rural villages for sustainable water access.",
            location: "Rajasthan, India",
            fundingGoal: 60000,
            fundingReceived: 40000,
            status: "active" as const,
            impactType: "Water",
            impactValue: "2.1M liters",
            image: "💧",
            ngoId: ngos[1].id,
        },
        {
            title: "Smart Village Solar",
            description: "Implementing solar micro-grids in remote off-grid villages.",
            location: "Ladakh, India",
            fundingGoal: 85000,
            fundingReceived: 12000,
            status: "active" as const,
            impactType: "Energy",
            impactValue: "150 kWh",
            image: "☀️",
            ngoId: ngos[2].id,
        },
        {
            title: "School Garden Program",
            description: "Setting up 100 organic gardens in public schools to teach sustainability.",
            location: "Pune, India",
            fundingGoal: 25000,
            fundingReceived: 5000,
            status: "active" as const,
            impactType: "Trees",
            impactValue: "100 gardens",
            image: "🏫",
            ngoId: ngos[0].id,
        },
        {
            title: "Renewable Energy Hub",
            description: "A community center powered entirely by wind and solar, providing free education.",
            location: "Bangalore, India",
            fundingGoal: 120000,
            fundingReceived: 95000,
            status: "active" as const,
            impactType: "Energy",
            impactValue: "500 kWh",
            image: "🔋",
            ngoId: ngos[0].id,
        },
        {
            title: "Bio-Diversity Park",
            description: "Creating a sanctuary for endangered local flora and fauna in the city heart.",
            location: "Hyderabad, India",
            fundingGoal: 75000,
            fundingReceived: 62000,
            status: "active" as const,
            impactType: "Trees",
            impactValue: "1,200 types",
            image: "🦋",
            ngoId: ngos[0].id,
        },
        {
            title: "Solar Irrigation Pumps",
            description: "Providing 500 small-scale farmers with solar-powered irrigation systems.",
            location: "Gujarat, India",
            fundingGoal: 90000,
            fundingReceived: 15000,
            status: "active" as const,
            impactType: "Energy",
            impactValue: "500 pumps",
            image: "🚜",
            ngoId: ngos[0].id,
        },
        {
            title: "Plastic-Free Rivers",
            description: "Installing automated trash barriers in 10 major city rivers.",
            location: "Kolkata, India",
            fundingGoal: 55000,
            fundingReceived: 42000,
            status: "active" as const,
            impactType: "Waste",
            impactValue: "12 tons",
            image: "🏞️",
            ngoId: ngos[1].id,
        },
        {
            title: "Community Compost Network",
            description: "Setting up decentralized composting for 200 apartment complexes.",
            location: "Chennai, India",
            fundingGoal: 40000,
            fundingReceived: 38000,
            status: "active" as const,
            impactType: "Waste",
            impactValue: "50 tons",
            image: "♻️",
            ngoId: ngos[0].id,
        },
        {
            title: "Wildlife Corridor Protect",
            description: "Securing lands for safe passage of elephants across highways.",
            location: "Assam, India",
            fundingGoal: 150000,
            fundingReceived: 145000,
            status: "completed" as const,
            impactType: "Trees",
            impactValue: "500 acres",
            image: "🐘",
            ngoId: ngos[0].id,
        },
        {
            title: "Vertical Garden City",
            description: "Transforming flyover pillars into vertical gardens.",
            location: "Bangalore, India",
            fundingGoal: 65000,
            fundingReceived: 10000,
            status: "active" as const,
            impactType: "Trees",
            impactValue: "20,000 plants",
            image: "🏢",
            ngoId: ngos[2].id,
        },
        {
            title: "Smart Waste Bins",
            description: "Installing IoT-enabled smart bins for efficient waste collection.",
            location: "Surat, India",
            fundingGoal: 35000,
            fundingReceived: 5000,
            status: "active" as const,
            impactType: "Waste",
            impactValue: "1,000 bins",
            image: "🗑️",
            ngoId: ngos[1].id,
        },
        {
            title: "Green School Bus",
            description: "Retrofitting 20 school buses with electric engines and solar roofs.",
            location: "Mumbai, India",
            fundingGoal: 200000,
            fundingReceived: 50000,
            status: "active" as const,
            impactType: "Energy",
            impactValue: "20 buses",
            image: "🚌",
            ngoId: ngos[0].id,
        },
        {
            title: "Waste-to-Art Project",
            description: "Converting city landfill waste into public art and furniture.",
            location: "Delhi, India",
            fundingGoal: 15000,
            fundingReceived: 500,
            status: "draft" as const,
            impactType: "Waste",
            impactValue: "2 tons",
            image: "🎨",
            ngoId: ngos[2].id,
        }
    ];

    const seededProjects = [];
    for (const p of projectData) {
        const [project] = await db.insert(projects).values({
            title: p.title,
            description: p.description,
            longDescription: p.longDescription,
            location: p.location,
            fundingGoal: p.fundingGoal,
            fundingReceived: p.fundingReceived,
            status: p.status,
            impactType: p.impactType,
            impactValue: p.impactValue,
            carbonOffset: p.carbonOffset,
            image: p.image,
            ngoId: p.ngoId,
        }).returning();
        seededProjects.push(project);
    }

    // 6. Insert Milestones
    for (const project of seededProjects) {
        const milestoneNames = ["Planning & Permits", "Community Engagement", "Initial Implementation", "Growth Phase", "Verification"];
        const values = milestoneNames.map((name, index) => ({
            projectId: project.id,
            name,
            completed: project.status === "completed" || (project.status === "active" && index < 2),
            orderIndex: index
        }));
        await db.insert(milestones).values(values);
    }

    // 7. Insert Project Photos (Simulated)
    for (const project of seededProjects) {
        const photoUrls = [
            "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=800"
        ];
        for (const url of photoUrls) {
            await db.insert(projectPhotos).values({
                projectId: project.id,
                url
            });
        }
    }

    // 8. Registrations (Distribute volunteers across projects)
    for (const vol of volunteerList) {
        // Register each volunteer for 1-3 random projects
        const numProjects = Math.floor(Math.random() * 3) + 1;
        const shuffled = [...seededProjects].filter(p => p.status !== "draft").sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, numProjects);

        for (const project of selected) {
            const hours = Math.floor(Math.random() * 20) + 5;
            await db.insert(registrations).values({
                userId: vol.id,
                projectId: project.id,
                hoursContributed: hours,
            });

            // Issue certificate for completed projects or high contribution
            if (project.status === "completed" || hours > 15) {
                await db.insert(certificates).values({
                    userId: vol.id,
                    projectId: project.id,
                    hours: hours,
                });
            }
        }
    }

    console.log("✅ Database seeded successfully!");
    console.log("-----------------------------------");
    console.log("📧 Demo accounts (password: password123):");
    console.log(`👤 Admin: ${adminUser.email}`);
    console.log(`🏢 Corporate: ${corporates[0].email}`);
    console.log(`🏫 NGO: ${ngos[0].email}`);
    console.log(`🙋 Volunteer: ${volunteerList[0].email}`);
    console.log("-----------------------------------");
}

// Run if executed directly
import { fileURLToPath as fp } from 'node:url';

const isDirectRun = () => {
    try {
        const __filename = fp(import.meta.url);
        return process.argv[1] === __filename;
    } catch {
        return false;
    }
};

if (isDirectRun()) {
    seed().catch(console.error);
}

export { seed };
