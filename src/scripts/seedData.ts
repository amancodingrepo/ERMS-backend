import mongoose from "mongoose";
import { connectDB } from "../db/mongoose";
import Category from "../models/category.model";
import Report from "../models/report.model";
import Contact from "../models/contact.model";

async function seedData() {
  try {
    console.log("🌱 Starting data seeding...");

    await connectDB();
    console.log("✅ Connected to database");

    // Clear existing data
    await Category.deleteMany({});
    await Report.deleteMany({});
    await Contact.deleteMany({});
    console.log("🧹 Cleared existing data");

    // === 1️⃣ Create Categories ===
    const categories = await Category.create([
      {
        name: "Packaging Market Research",
        description:
          "In-depth research on global packaging trends, materials, and regional performance across paper, flexible, and plastic segments.",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1616627455957-df6d0435c4c8?q=80&w=800",
      },
      {
        name: "Sustainability & Eco-Packaging",
        description:
          "Market insights on environmentally sustainable, recyclable, and biodegradable packaging materials and practices.",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1607083206968-13611e1d3a43?q=80&w=800",
      },
      {
        name: "Regional Packaging Reports",
        description:
          "Comprehensive analysis of packaging industry performance across different countries and states, focusing on innovation and market share.",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1620231158340-cf05c9f2706e?q=80&w=800",
      },
    ]);
    console.log(`✅ Created ${categories.length} categories`);

    // === 2️⃣ Create Reports ===
    const reports = await Report.create([
      {
        title: "Global Flexible Packaging Market Report 2024–2030",
        category: categories[0]._id,
        summary:
          "Comprehensive analysis of the global flexible packaging market by material type, product form, and end-user industries, highlighting growth opportunities and key players.",
        description:
          "The global Flexible Packaging Market involves production and sales of flexible materials such as plastic, paper, and aluminum foil used for consumer and industrial goods. Its growth is driven by demand for lightweight, sustainable, and cost-efficient solutions across food, pharmaceuticals, and e-commerce sectors. North America dominates, while Asia-Pacific shows fastest CAGR due to industrialization and rising consumption.",
        publishDate: new Date("2024-04-10"),
        imageUrl:
          "https://images.unsplash.com/photo-1585386959984-a41552231693?q=80&w=800",
        price: 449.99,
        keyHighlights: [
          "Market CAGR 3.38% (2024–2030)",
          "Food and beverage sector leads usage",
          "Amcor, Sealed Air, and Mondi among key players",
        ],
        tableOfContent: [
          "Executive Summary",
          "Market Overview",
          "Key Drivers and Restraints",
          "Regional Insights",
          "Company Profiles",
          "Future Outlook",
        ],
        meta: {
          keywords: [
            "flexible packaging",
            "plastic film",
            "food packaging",
            "aluminum foil",
            "market forecast",
          ],
          seoDescription:
            "Detailed research on the global flexible packaging market with key drivers, segmentation, and future trends up to 2030.",
        },
      },
      {
        title: "Global Paper and Paperboard Packaging Market Report 2024–2030",
        category: categories[1]._id,
        summary:
          "Market report covering the rise of sustainable paper and paperboard packaging, driven by eco-regulations and consumer preference for recyclable materials.",
        description:
          "The Paper and Paperboard Packaging Market is expanding rapidly due to environmental awareness and regulatory restrictions on plastic. Corrugated boxes dominate, supported by e-commerce and food delivery sectors. Technological innovations in folding cartons and biodegradable coatings enhance market appeal. North America leads, while Asia-Pacific experiences the fastest growth.",
        publishDate: new Date("2024-05-02"),
        imageUrl:
          "https://images.unsplash.com/photo-1598454449130-7dbdf9a58a32?q=80&w=800",
        price: 399.0,
        keyHighlights: [
          "CAGR of 5.0% (2024–2030)",
          "Corrugated boxes dominate global demand",
          "Rising consumer shift toward eco-friendly packaging",
        ],
        tableOfContent: [
          "Market Summary",
          "Material Segmentation",
          "Sustainability Drivers",
          "Regional Market Analysis",
          "Competitive Landscape",
        ],
        meta: {
          keywords: [
            "paper packaging",
            "paperboard boxes",
            "eco-friendly packaging",
            "corrugated carton",
            "market growth",
          ],
          seoDescription:
            "Paper and paperboard packaging market insights focusing on sustainable materials, innovation, and regional dynamics.",
        },
      },
      {
        title: "United States Packaging Market Outlook 2024–2031",
        category: categories[2]._id,
        summary:
          "Analysis of the U.S. packaging industry segmented by material type and end-user industries, emphasizing sustainability and state-level trends.",
        description:
          "The U.S. packaging market is driven by demand for sustainable, cost-effective, and innovative packaging materials. California leads with eco-friendly adoption, while Texas shows the fastest CAGR due to industrial investments. Plastic remains dominant, supported by developments in recyclability and biodegradable polymers.",
        publishDate: new Date("2024-06-15"),
        imageUrl:
          "https://images.unsplash.com/photo-1624462604564-65096d3b7a2b?q=80&w=800",
        price: 499.0,
        keyHighlights: [
          "CAGR of 3.97% (2024–2031)",
          "Plastic dominates due to versatility",
          "California leads; Texas grows fastest",
        ],
        tableOfContent: [
          "U.S. Packaging Overview",
          "Material Analysis",
          "Market Drivers & Challenges",
          "Regional Insights",
          "Company Profiles",
          "Future Outlook",
        ],
        meta: {
          keywords: [
            "US packaging",
            "plastic packaging",
            "eco-friendly packaging",
            "Texas growth",
            "California sustainability",
          ],
          seoDescription:
            "In-depth study of the United States packaging market including state-level insights, trends, and growth projections through 2031.",
        },
      },
    ]);
    console.log(`✅ Created ${reports.length} reports`);

    // === 3️⃣ Create Contact Messages ===
    const contacts = await Contact.create([
      {
        name: "Olivia Martinez",
        email: "olivia.m@greentec.com",
        subject: "Flexible Packaging Inquiry",
        message:
          "Could you share regional data breakdowns for flexible packaging growth across Asia-Pacific?",
      },
      {
        name: "Ravi Sharma",
        email: "ravi@packsmart.in",
        subject: "Request for Paper Packaging Report",
        message:
          "We need access to your latest paper and paperboard packaging market insights for 2024.",
      },
      {
        name: "Eleanor White",
        email: "eleanor.white@uspackresearch.com",
        subject: "United States Packaging Insights",
        message:
          "Please provide purchase information for the U.S. Packaging Market Outlook report.",
      },
    ]);
    console.log(`✅ Created ${contacts.length} contact messages`);

    console.log("🎉 Data seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`- Categories: ${categories.length}`);
    console.log(`- Reports: ${reports.length}`);
    console.log(`- Contacts: ${contacts.length}`);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from database");
  }
}

if (require.main === module) {
  seedData()
    .then(() => {
      console.log("✅ Seeding completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Seeding failed:", error);
      process.exit(1);
    });
}

export default seedData;
