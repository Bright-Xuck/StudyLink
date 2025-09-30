import dotenv from "dotenv";
import path from "path";

// Load .env.local file
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env"
  );
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Global cache to prevent multiple connections in development
declare global {
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("✅ MongoDB connected successfully");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("❌ MongoDB connection error:", e);
    throw e;
  }

  return cached.conn;
}


import Module from "../lib/models/Module";

const modules = [
  {
    title: "Introduction to Research",
    titleFr: "Introduction à la recherche",
    description:
      "Learn the fundamentals of research, including research philosophy, types of research, and the research process.",
    descriptionFr:
      "Apprenez les fondamentaux de la recherche, y compris la philosophie de recherche, les types de recherche et le processus de recherche.",
    slug: "introduction-to-research",
    imageUrl:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
    isFree: true,
    price: 0,
    content:
      "# Introduction to Research\n\nThis module covers the basics of research methodology...",
    contentFr:
      "# Introduction à la recherche\n\nCe module couvre les bases de la méthodologie de recherche...",
    duration: "2 weeks",
    level: "beginner" as const,
    objectives: [
      "Understand what research is",
      "Identify different types of research",
      "Learn the research process",
      "Develop critical thinking skills",
    ],
    objectivesFr: [
      "Comprendre ce qu'est la recherche",
      "Identifier différents types de recherche",
      "Apprendre le processus de recherche",
      "Développer des compétences de pensée critique",
    ],
    order: 1,
    isPublished: true,
  },
  {
    title: "Literature Review & Referencing",
    titleFr: "Revue de littérature et références",
    description:
      "Master the art of conducting literature reviews, finding credible sources, and properly citing references.",
    descriptionFr:
      "Maîtrisez l'art de mener des revues de littérature, trouver des sources crédibles et citer correctement les références.",
    slug: "literature-review-referencing",
    imageUrl:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800",
    isFree: true,
    price: 0,
    content:
      "# Literature Review & Referencing\n\nLearn how to conduct systematic literature reviews...",
    contentFr:
      "# Revue de littérature et références\n\nApprenez à effectuer des revues de littérature systématiques...",
    duration: "3 weeks",
    level: "beginner" as const,
    objectives: [
      "Conduct effective literature searches",
      "Evaluate source credibility",
      "Master APA citation style",
      "Use reference management tools",
    ],
    objectivesFr: [
      "Effectuer des recherches de littérature efficaces",
      "Évaluer la crédibilité des sources",
      "Maîtriser le style de citation APA",
      "Utiliser des outils de gestion de références",
    ],
    order: 2,
    isPublished: true,
  },
  {
    title: "Research Methodology & Design",
    titleFr: "Méthodologie et conception de recherche",
    description:
      "Explore various research methodologies, learn to design robust studies, and select appropriate research approaches.",
    descriptionFr:
      "Explorez diverses méthodologies de recherche, apprenez à concevoir des études robustes et sélectionnez des approches de recherche appropriées.",
    slug: "research-methodology-design",
    imageUrl:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
    isFree: false,
    price: 15000,
    content:
      "# Research Methodology & Design\n\nDive deep into quantitative, qualitative, and mixed methods...",
    contentFr:
      "# Méthodologie et conception de recherche\n\nPlongez dans les méthodes quantitatives, qualitatives et mixtes...",
    duration: "4 weeks",
    level: "intermediate" as const,
    objectives: [
      "Understand different research paradigms",
      "Choose appropriate methodology",
      "Design research studies",
      "Develop research frameworks",
    ],
    objectivesFr: [
      "Comprendre différents paradigmes de recherche",
      "Choisir une méthodologie appropriée",
      "Concevoir des études de recherche",
      "Développer des cadres de recherche",
    ],
    order: 3,
    isPublished: true,
  },
  {
    title: "Data Collection Techniques",
    titleFr: "Techniques de collecte de données",
    description:
      "Master various data collection methods including surveys, interviews, observations, and experiments.",
    descriptionFr:
      "Maîtrisez diverses méthodes de collecte de données, y compris les enquêtes, les entretiens, les observations et les expériences.",
    slug: "data-collection-techniques",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
    isFree: false,
    price: 12000,
    content:
      "# Data Collection Techniques\n\nLearn various methods of collecting data...",
    contentFr:
      "# Techniques de collecte de données\n\nApprenez diverses méthodes de collecte de données...",
    duration: "3 weeks",
    level: "intermediate" as const,
    objectives: [
      "Design effective surveys",
      "Conduct qualitative interviews",
      "Use observational methods",
      "Ensure data quality",
    ],
    objectivesFr: [
      "Concevoir des enquêtes efficaces",
      "Mener des entretiens qualitatifs",
      "Utiliser des méthodes d'observation",
      "Assurer la qualité des données",
    ],
    order: 4,
    isPublished: true,
  },
  {
    title: "Data Analysis & Interpretation",
    titleFr: "Analyse et interprétation des données",
    description:
      "Learn statistical analysis, qualitative coding, and how to interpret research findings effectively.",
    descriptionFr:
      "Apprenez l'analyse statistique, le codage qualitatif et comment interpréter efficacement les résultats de recherche.",
    slug: "data-analysis-interpretation",
    imageUrl:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
    isFree: false,
    price: 18000,
    content:
      "# Data Analysis & Interpretation\n\nMaster data analysis techniques...",
    contentFr:
      "# Analyse et interprétation des données\n\nMaîtrisez les techniques d'analyse de données...",
    duration: "5 weeks",
    level: "advanced" as const,
    objectives: [
      "Perform statistical analyses",
      "Code qualitative data",
      "Interpret research findings",
      "Use analysis software (SPSS, NVivo)",
    ],
    objectivesFr: [
      "Effectuer des analyses statistiques",
      "Coder des données qualitatives",
      "Interpréter les résultats de recherche",
      "Utiliser des logiciels d'analyse (SPSS, NVivo)",
    ],
    order: 5,
    isPublished: true,
  },
  {
    title: "Academic Writing Skills",
    titleFr: "Compétences en rédaction académique",
    description:
      "Develop professional academic writing skills, including structure, style, and clarity.",
    descriptionFr:
      "Développez des compétences professionnelles en rédaction académique, y compris la structure, le style et la clarté.",
    slug: "academic-writing-skills",
    imageUrl:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800",
    isFree: false,
    price: 10000,
    content:
      "# Academic Writing Skills\n\nDevelop strong academic writing capabilities...",
    contentFr:
      "# Compétences en rédaction académique\n\nDéveloppez de solides capacités de rédaction académique...",
    duration: "3 weeks",
    level: "intermediate" as const,
    objectives: [
      "Write clear academic prose",
      "Structure arguments effectively",
      "Avoid common writing pitfalls",
      "Develop your academic voice",
    ],
    objectivesFr: [
      "Rédiger une prose académique claire",
      "Structurer efficacement les arguments",
      "Éviter les pièges courants de l'écriture",
      "Développer votre voix académique",
    ],
    order: 6,
    isPublished: true,
  },
  {
    title: "Proposal Development",
    titleFr: "Développement de propositions",
    description:
      "Learn to write compelling research proposals that get approved and funded.",
    descriptionFr:
      "Apprenez à rédiger des propositions de recherche convaincantes qui sont approuvées et financées.",
    slug: "proposal-development",
    imageUrl:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800",
    isFree: false,
    price: 14000,
    content: "# Proposal Development\n\nCraft winning research proposals...",
    contentFr:
      "# Développement de propositions\n\nRédigez des propositions de recherche gagnantes...",
    duration: "4 weeks",
    level: "intermediate" as const,
    objectives: [
      "Understand proposal structure",
      "Write clear research objectives",
      "Develop realistic timelines",
      "Create convincing budgets",
    ],
    objectivesFr: [
      "Comprendre la structure des propositions",
      "Rédiger des objectifs de recherche clairs",
      "Développer des calendriers réalistes",
      "Créer des budgets convaincants",
    ],
    order: 7,
    isPublished: true,
  },
  {
    title: "Thesis/Dissertation Writing",
    titleFr: "Rédaction de thèse/mémoire",
    description:
      "Complete guide to writing and defending your thesis or dissertation successfully.",
    descriptionFr:
      "Guide complet pour rédiger et défendre avec succès votre thèse ou mémoire.",
    slug: "thesis-dissertation-writing",
    imageUrl:
      "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=800",
    isFree: false,
    price: 20000,
    content:
      "# Thesis/Dissertation Writing\n\nComplete your thesis successfully...",
    contentFr:
      "# Rédaction de thèse/mémoire\n\nCompletez votre thèse avec succès...",
    duration: "6 weeks",
    level: "advanced" as const,
    objectives: [
      "Structure your thesis",
      "Write each chapter effectively",
      "Manage the writing process",
      "Prepare for defense",
    ],
    objectivesFr: [
      "Structurer votre thèse",
      "Rédiger chaque chapitre efficacement",
      "Gérer le processus d'écriture",
      "Préparer votre défense",
    ],
    order: 8,
    isPublished: true,
  },
  {
    title: "Plagiarism & Research Ethics",
    titleFr: "Plagiat et éthique de la recherche",
    description:
      "Understand research ethics, avoid plagiarism, and conduct research with integrity.",
    descriptionFr:
      "Comprenez l'éthique de la recherche, évitez le plagiat et menez des recherches avec intégrité.",
    slug: "plagiarism-research-ethics",
    imageUrl:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800",
    isFree: true,
    price: 0,
    content: "# Plagiarism & Research Ethics\n\nConduct research ethically...",
    contentFr:
      "# Plagiat et éthique de la recherche\n\nMenez des recherches éthiquement...",
    duration: "2 weeks",
    level: "beginner" as const,
    objectives: [
      "Understand research ethics principles",
      "Avoid plagiarism",
      "Cite sources properly",
      "Navigate ethical dilemmas",
    ],
    objectivesFr: [
      "Comprendre les principes d'éthique de la recherche",
      "Éviter le plagiat",
      "Citer correctement les sources",
      "Naviguer les dilemmes éthiques",
    ],
    order: 9,
    isPublished: true,
  },
  {
    title: "Oral Presentation & Defense Skills",
    titleFr: "Compétences en présentation orale et défense",
    description:
      "Master the art of presenting research findings and defending your work confidently.",
    descriptionFr:
      "Maîtrisez l'art de présenter les résultats de recherche et de défendre votre travail avec confiance.",
    slug: "oral-presentation-defense-skills",
    imageUrl:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800",
    isFree: false,
    price: 13000,
    content:
      "# Oral Presentation & Defense Skills\n\nPresent research confidently...",
    contentFr:
      "# Compétences en présentation orale et défense\n\nPrésentez la recherche avec confiance...",
    duration: "3 weeks",
    level: "intermediate" as const,
    objectives: [
      "Design effective presentations",
      "Deliver confident presentations",
      "Handle challenging questions",
      "Use visual aids effectively",
    ],
    objectivesFr: [
      "Concevoir des présentations efficaces",
      "Faire des présentations confiantes",
      "Gérer les questions difficiles",
      "Utiliser efficacement les aides visuelles",
    ],
    order: 10,
    isPublished: true,
  },
];

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    // Connect to database
    await connectDB();

    // Clear existing modules
    await Module.deleteMany({});
    console.log("✅ Cleared existing modules");

    // Insert new modules
    const result = await Module.insertMany(modules);
    console.log(`✅ Successfully seeded ${result.length} modules`);

    console.log("\n📚 Modules seeded:");
    result.forEach((module) => {
      console.log(
        `  - ${module.title} (${
          module.isFree ? "FREE" : `${module.price} XAF`
        })`
      );
    });

    console.log("\n✨ Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
