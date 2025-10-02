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
    lessons: [
      {
        title: "What is Research?",
        titleFr: "Qu'est-ce que la recherche?",
        description:
          "Understand the fundamental concepts and definition of research",
        descriptionFr:
          "Comprendre les concepts fondamentaux et la définition de la recherche",
        type: "video" as const,
        content: "https://www.youtube.com/watch?v=example",
        duration: 15,
        order: 1,
        isPreview: true,
      },
      {
        title: "Types of Research",
        titleFr: "Types de recherche",
        description:
          "Explore qualitative, quantitative, and mixed methods research",
        descriptionFr:
          "Explorez la recherche qualitative, quantitative et les méthodes mixtes",
        type: "reading" as const,
        content:
          "<h2>Types of Research</h2><p>There are three main types of research: qualitative, quantitative, and mixed methods...</p>",
        contentFr:
          "<h2>Types de recherche</h2><p>Il existe trois principaux types de recherche: qualitative, quantitative et méthodes mixtes...</p>",
        duration: 30,
        order: 2,
        isPreview: false,
      },
      {
        title: "Research Resources",
        titleFr: "Ressources de recherche",
        description: "Download templates and guides for your research",
        descriptionFr:
          "Téléchargez des modèles et des guides pour votre recherche",
        type: "document" as const,
        content: "/documents/research-templates.pdf",
        duration: 10,
        order: 3,
        isPreview: false,
      },
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
    lessons: [
      {
        title: "Conducting Literature Searches",
        titleFr: "Effectuer des recherches de littérature",
        description:
          "Learn effective strategies for searching academic databases and libraries.",
        descriptionFr:
          "Apprenez des stratégies efficaces pour rechercher dans les bases de données académiques et les bibliothèques.",
        type: "video" as const,
        content: "https://www.youtube.com/watch?v=literature-search-example",
        duration: 20,
        order: 1,
        isPreview: true,
      },
      {
        title: "Evaluating Source Credibility",
        titleFr: "Évaluer la crédibilité des sources",
        description:
          "Criteria for assessing the reliability and relevance of sources.",
        descriptionFr:
          "Critères pour évaluer la fiabilité et la pertinence des sources.",
        type: "reading" as const,
        content:
          "<h2>Evaluating Sources</h2><p>Key factors include peer-review status, author credentials, and publication date...</p>",
        contentFr:
          "<h2>Évaluation des sources</h2><p>Les facteurs clés incluent le statut de revue par les pairs, les qualifications de l'auteur et la date de publication...</p>",
        duration: 25,
        order: 2,
        isPreview: false,
      },
      {
        title: "APA Citation Basics",
        titleFr: "Bases de citation APA",
        description:
          "Introduction to APA style for in-text citations and references.",
        descriptionFr:
          "Introduction au style APA pour les citations dans le texte et les références.",
        type: "video" as const,
        content: "https://www.youtube.com/watch?v=apa-citation-basics",
        duration: 18,
        order: 3,
        isPreview: false,
      },
      {
        title: "Reference Management Tools",
        titleFr: "Outils de gestion de références",
        description:
          "Overview of tools like Zotero and EndNote for organizing references.",
        descriptionFr:
          "Aperçu des outils comme Zotero et EndNote pour organiser les références.",
        type: "document" as const,
        content: "/documents/reference-tools-guide.pdf",
        duration: 15,
        order: 4,
        isPreview: false,
      },
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
    lessons: [
      {
        title: "Research Paradigms",
        titleFr: "Paradigmes de recherche",
        description:
          "Explore positivism, interpretivism, and critical theory in research.",
        descriptionFr:
          "Explorez le positivisme, l'interprétivisme et la théorie critique en recherche.",
        type: "reading" as const,
        content:
          "<h2>Research Paradigms</h2><p>Positivism assumes an objective reality...</p>",
        contentFr:
          "<h2>Paradigmes de recherche</h2><p>Le positivisme suppose une réalité objective...</p>",
        duration: 35,
        order: 1,
        isPreview: true,
      },
      {
        title: "Choosing Methodology",
        titleFr: "Choisir une méthodologie",
        description:
          "How to select quantitative, qualitative, or mixed methods based on research questions.",
        descriptionFr:
          "Comment sélectionner des méthodes quantitatives, qualitatives ou mixtes en fonction des questions de recherche.",
        type: "video" as const,
        content: "https://www.youtube.com/watch?v=choosing-methodology",
        duration: 22,
        order: 2,
        isPreview: false,
      },
      {
        title: "Designing Studies",
        titleFr: "Concevoir des études",
        description:
          "Steps to design experimental, correlational, and descriptive studies.",
        descriptionFr:
          "Étapes pour concevoir des études expérimentales, corrélationales et descriptives.",
        type: "reading" as const,
        content:
          "<h2>Study Design</h2><p>Experimental design involves manipulation of variables...</p>",
        contentFr:
          "<h2>Conception d'études</h2><p>La conception expérimentale implique la manipulation de variables...</p>",
        duration: 40,
        order: 3,
        isPreview: false,
      },
      {
        title: "Research Frameworks",
        titleFr: "Cadres de recherche",
        description:
          "Building conceptual and theoretical frameworks for your study.",
        descriptionFr:
          "Construire des cadres conceptuels et théoriques pour votre étude.",
        type: "document" as const,
        content: "/documents/frameworks-template.pdf",
        duration: 20,
        order: 4,
        isPreview: false,
      },
      {
        title: "Validity and Reliability",
        titleFr: "Validité et fiabilité",
        description: "Ensuring your research design is valid and reliable.",
        descriptionFr:
          "Assurer que votre conception de recherche est valide et fiable.",
        type: "video" as const,
        content: "https://www.youtube.com/watch?v=validity-reliability",
        duration: 25,
        order: 5,
        isPreview: false,
      },
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
    lessons: [
      {
        title: "Survey Design",
        titleFr: "Conception d'enquêtes",
        description:
          "Principles for creating effective surveys and questionnaires.",
        descriptionFr:
          "Principes pour créer des enquêtes et questionnaires efficaces.",
        type: "video" as const,
        content: "https://www.youtube.com/watch?v=survey-design",
        duration: 28,
        order: 1,
        isPreview: true,
      },
      {
        title: "Qualitative Interviews",
        titleFr: "Entretiens qualitatifs",
        description:
          "Techniques for conducting structured, semi-structured, and unstructured interviews.",
        descriptionFr:
          "Techniques pour mener des entretiens structurés, semi-structurés et non structurés.",
        type: "reading" as const,
        content:
          "<h2>Interview Techniques</h2><p>Semi-structured interviews allow flexibility while maintaining focus...</p>",
        contentFr:
          "<h2>Techniques d'entrevue</h2><p>Les entretiens semi-structurés permettent de la flexibilité tout en maintenant le focus...</p>",
        duration: 30,
        order: 2,
        isPreview: false,
      },
      {
        title: "Observational Methods",
        titleFr: "Méthodes d'observation",
        description: "Participant and non-participant observation strategies.",
        descriptionFr:
          "Stratégies d'observation participante et non participante.",
        type: "video" as const,
        content: "https://www.youtube.com/watch?v=observational-methods",
        duration: 20,
        order: 3,
        isPreview: false,
      },
      {
        title: "Experimental Data Collection",
        titleFr: "Collecte de données expérimentales",
        description: "Setting up experiments and controlling variables.",
        descriptionFr: "Mise en place d'expériences et contrôle des variables.",
        type: "document" as const,
        content: "/documents/experiment-guide.pdf",
        duration: 25,
        order: 4,
        isPreview: false,
      },
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
    lessons: [
      {
        title: "Statistical Analysis Basics",
        titleFr: "Bases de l'analyse statistique",
        description:
          "Descriptive and inferential statistics for quantitative data.",
        descriptionFr:
          "Statistiques descriptives et inférentielles pour les données quantitatives.",
        type: "video" as const,
        content: "https://www.youtube.com/watch?v=stats-basics",
        duration: 30,
        order: 1,
        isPreview: true,
      },
      {
        title: "Qualitative Data Coding",
        titleFr: "Codage des données qualitatives",
        description:
          "Thematic analysis and coding processes for qualitative data.",
        descriptionFr:
          "Analyse thématique et processus de codage pour les données qualitatives.",
        type: "reading" as const,
        content:
          "<h2>Qualitative Coding</h2><p>Open coding identifies initial concepts from the data...</p>",
        contentFr:
          "<h2>Codage qualitatif</h2><p>Le codage ouvert identifie les concepts initiaux à partir des données...</p>",
        duration: 45,
        order: 2,
        isPreview: false,
      },
      {
        title: "Interpreting Findings",
        titleFr: "Interprétation des résultats",
        description: "Drawing meaningful conclusions from data analysis.",
        descriptionFr:
          "Tirer des conclusions significatives de l'analyse des données.",
        type: "video" as const,
        content: "https://www.youtube.com/watch?v=interpreting-findings",
        duration: 25,
        order: 3,
        isPreview: false,
      },
      {
        title: "Using SPSS for Analysis",
        titleFr: "Utiliser SPSS pour l'analyse",
        description: "Hands-on tutorial for basic SPSS operations.",
        descriptionFr:
          "Tutoriel pratique pour les opérations de base avec SPSS.",
        type: "document" as const,
        content: "/documents/spss-tutorial.pdf",
        duration: 40,
        order: 4,
        isPreview: false,
      },
      {
        title: "NVivo for Qualitative Analysis",
        titleFr: "NVivo pour l'analyse qualitative",
        description: "Introduction to NVivo software for coding and analysis.",
        descriptionFr:
          "Introduction au logiciel NVivo pour le codage et l'analyse.",
        type: "video" as const,
        content: "https://www.youtube.com/watch?v=nvivo-intro",
        duration: 35,
        order: 5,
        isPreview: false,
      },
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
    lessons: [
      {
        title: "Academic Prose Structure",
        titleFr: "Structure de la prose académique",
        description: "Building clear and concise sentences and paragraphs.",
        descriptionFr:
          "Construire des phrases et paragraphes clairs et concis.",
        type: "reading" as const,
        content:
          "<h2>Academic Structure</h2><p>Use active voice where appropriate and vary sentence length...</p>",
        contentFr:
          "<h2>Structure académique</h2><p>Utilisez la voix active quand approprié et variez la longueur des phrases...</p>",
        duration: 20,
        order: 1,
        isPreview: true,
      },
      {
        title: "Argument Development",
        titleFr: "Développement d'arguments",
        description:
          "Crafting logical arguments with evidence and counterarguments.",
        descriptionFr:
          "Rédiger des arguments logiques avec preuves et contre-arguments.",
        type: "video" as const,
        content: "https://www.youtube.com/watch?v=argument-development",
        duration: 22,
        order: 2,
        isPreview: false,
      },
      {
        title: "Common Writing Pitfalls",
        titleFr: "Pièges courants de l'écriture",
        description:
          "Avoiding jargon overload, passive voice abuse, and redundancy.",
        descriptionFr:
          "Éviter la surcharge de jargon, l'abus de voix passive et la redondance.",
        type: "reading" as const,
        content:
          "<h2>Writing Pitfalls</h2><p>Redundancy occurs when ideas are repeated unnecessarily...</p>",
        contentFr:
          "<h2>Pièges d'écriture</h2><p>La redondance se produit quand des idées sont répétées inutilement...</p>",
        duration: 15,
        order: 3,
        isPreview: false,
      },
      {
        title: "Developing Academic Voice",
        titleFr: "Développer la voix académique",
        description: "Finding your unique voice while maintaining objectivity.",
        descriptionFr:
          "Trouver votre voix unique tout en maintenant l'objectivité.",
        type: "document" as const,
        content: "/documents/voice-exercises.pdf",
        duration: 25,
        order: 4,
        isPreview: false,
      },
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
    lessons: [
      {
        title: "Proposal Structure Overview",
        titleFr: "Aperçu de la structure des propositions",
        description: "Standard components of a research proposal.",
        descriptionFr: "Composants standards d'une proposition de recherche.",
        type: "video" as const,
        content: "https://www.youtube.com/watch?v=proposal-structure",
        duration: 18,
        order: 1,
        isPreview: true,
      },
      {
        title: "Writing Research Objectives",
        titleFr: "Rédiger des objectifs de recherche",
        description: "Crafting SMART objectives for your proposal.",
        descriptionFr: "Rédiger des objectifs SMART pour votre proposition.",
        type: "reading" as const,
        content:
          "<h2>Research Objectives</h2><p>Specific, Measurable, Achievable, Relevant, Time-bound...</p>",
        contentFr:
          "<h2>Objectifs de recherche</h2><p>Spécifiques, Mesurables, Atteignables, Pertinents, Temporels...</p>",
        duration: 20,
        order: 2,
        isPreview: false,
      },
      {
        title: "Timeline Planning",
        titleFr: "Planification de calendrier",
        description: "Creating Gantt charts and realistic timelines.",
        descriptionFr:
          "Créer des diagrammes de Gantt et des calendriers réalistes.",
        type: "document" as const,
        content: "/documents/timeline-template.pdf",
        duration: 15,
        order: 3,
        isPreview: false,
      },
      {
        title: "Budget Development",
        titleFr: "Développement de budget",
        description: "Estimating costs and justifying budget items.",
        descriptionFr:
          "Estimer les coûts et justifier les éléments budgétaires.",
        type: "video" as const,
        content: "https://www.youtube.com/watch?v=budget-development",
        duration: 25,
        order: 4,
        isPreview: false,
      },
      {
        title: "Peer Review Simulation",
        titleFr: "Simulation de revue par les pairs",
        description: "Practice reviewing and revising proposals.",
        descriptionFr: "Pratiquer la revue et la révision de propositions.",
        type: "reading" as const,
        content:
          "<h2>Peer Review</h2><p>Focus on clarity, feasibility, and innovation...</p>",
        contentFr:
          "<h2>Revue par les pairs</h2><p>Concentrez-vous sur la clarté, la faisabilité et l'innovation...</p>",
        duration: 30,
        order: 5,
        isPreview: false,
      },
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
    lessons: [
      {
        title: "Thesis Structure",
        titleFr: "Structure de la thèse",
        description: "Overall structure from abstract to appendices.",
        descriptionFr: "Structure globale de l'abstract aux annexes.",
        type: "reading" as const,
        content:
          "<h2>Thesis Structure</h2><p>Abstract summarizes the entire work...</p>",
        contentFr:
          "<h2>Structure de la thèse</h2><p>L'abstract résume l'ensemble du travail...</p>",
        duration: 25,
        order: 1,
        isPreview: true,
      },
      {
        title: "Writing the Literature Review Chapter",
        titleFr: "Rédiger le chapitre de revue de littérature",
        description: "Synthesizing literature into a cohesive chapter.",
        descriptionFr: "Synthétiser la littérature en un chapitre cohérent.",
        type: "video" as const,
        content: "https://www.youtube.com/watch?v=lit-review-chapter",
        duration: 35,
        order: 2,
        isPreview: false,
      },
      {
        title: "Methodology Chapter",
        titleFr: "Chapitre de méthodologie",
        description: "Detailing your research methods clearly.",
        descriptionFr: "Détailler vos méthodes de recherche clairement.",
        type: "reading" as const,
        content:
          "<h2>Methodology</h2><p>Describe population, sampling, and instruments...</p>",
        contentFr:
          "<h2>Méthodologie</h2><p>Décrivez la population, l'échantillonnage et les instruments...</p>",
        duration: 40,
        order: 3,
        isPreview: false,
      },
      {
        title: "Managing the Writing Process",
        titleFr: "Gérer le processus d'écriture",
        description: "Time management and overcoming writer's block.",
        descriptionFr:
          "Gestion du temps et surmonter le blocage de l'écrivain.",
        type: "document" as const,
        content: "/documents/writing-process-guide.pdf",
        duration: 20,
        order: 4,
        isPreview: false,
      },
      {
        title: "Preparing for Defense",
        titleFr: "Préparer la défense",
        description: "Anticipating questions and practicing your presentation.",
        descriptionFr:
          "Anticiper les questions et pratiquer votre présentation.",
        type: "video" as const,
        content: "https://www.youtube.com/watch?v=thesis-defense",
        duration: 30,
        order: 5,
        isPreview: false,
      },
      {
        title: "Results and Discussion Chapters",
        titleFr: "Chapitres résultats et discussion",
        description: "Presenting and discussing your findings.",
        descriptionFr: "Présenter et discuter vos résultats.",
        type: "reading" as const,
        content:
          "<h2>Results & Discussion</h2><p>Link findings back to research questions...</p>",
        contentFr:
          "<h2>Résultats & Discussion</h2><p>Liez les résultats aux questions de recherche...</p>",
        duration: 35,
        order: 6,
        isPreview: false,
      },
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
    lessons: [
      {
        title: "Ethics Principles",
        titleFr: "Principes d'éthique",
        description:
          "Core principles like beneficence, non-maleficence, and justice.",
        descriptionFr:
          "Principes de base comme la bienfaisance, la non-malfaisance et la justice.",
        type: "video" as const,
        content: "https://www.youtube.com/watch?v=ethics-principles",
        duration: 15,
        order: 1,
        isPreview: true,
      },
      {
        title: "Avoiding Plagiarism",
        titleFr: "Éviter le plagiat",
        description: "Types of plagiarism and strategies to prevent it.",
        descriptionFr: "Types de plagiat et stratégies pour les prévenir.",
        type: "reading" as const,
        content:
          "<h2>Avoiding Plagiarism</h2><p>Paraphrasing requires rewording in your own words...</p>",
        contentFr:
          "<h2>Éviter le plagiat</h2><p>La paraphrase nécessite de reformuler avec vos propres mots...</p>",
        duration: 20,
        order: 2,
        isPreview: false,
      },
      {
        title: "Proper Citation Practices",
        titleFr: "Pratiques de citation appropriées",
        description: "When and how to cite to maintain academic integrity.",
        descriptionFr:
          "Quand et comment citer pour maintenir l'intégrité académique.",
        type: "document" as const,
        content: "/documents/citation-practices.pdf",
        duration: 10,
        order: 3,
        isPreview: false,
      },
      {
        title: "Ethical Dilemmas in Research",
        titleFr: "Dilemmes éthiques en recherche",
        description: "Case studies on common ethical issues.",
        descriptionFr: "Études de cas sur les problèmes éthiques courants.",
        type: "reading" as const,
        content:
          "<h2>Ethical Dilemmas</h2><p>Confidentiality vs. public interest in reporting...</p>",
        contentFr:
          "<h2>Dilemmes éthiques</h2><p>Confidentialité vs. intérêt public dans le reporting...</p>",
        duration: 25,
        order: 4,
        isPreview: false,
      },
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
    lessons: [
      {
        title: "Designing Presentations",
        titleFr: "Concevoir des présentations",
        description: "Creating slides with effective visuals and content.",
        descriptionFr:
          "Créer des diapositives avec des visuels et contenu efficaces.",
        type: "video" as const,
        content: "https://www.youtube.com/watch?v=design-presentations",
        duration: 20,
        order: 1,
        isPreview: true,
      },
      {
        title: "Delivery Techniques",
        titleFr: "Techniques de présentation",
        description:
          "Body language, voice modulation, and engagement strategies.",
        descriptionFr:
          "Langage corporel, modulation de la voix et stratégies d'engagement.",
        type: "reading" as const,
        content:
          "<h2>Delivery</h2><p>Maintain eye contact to build rapport...</p>",
        contentFr:
          "<h2>Présentation</h2><p>Maintenez le contact visuel pour bâtir le rapport...</p>",
        duration: 18,
        order: 2,
        isPreview: false,
      },
      {
        title: "Handling Questions",
        titleFr: "Gérer les questions",
        description:
          "Strategies for responding to tough questions confidently.",
        descriptionFr:
          "Stratégies pour répondre aux questions difficiles avec confiance.",
        type: "video" as const,
        content: "https://www.youtube.com/watch?v=handling-questions",
        duration: 22,
        order: 3,
        isPreview: false,
      },
      {
        title: "Visual Aids Best Practices",
        titleFr: "Meilleures pratiques pour les aides visuelles",
        description: "Using charts, images, and avoiding clutter.",
        descriptionFr:
          "Utiliser des graphiques, images et éviter l'encombrement.",
        type: "document" as const,
        content: "/documents/visual-aids-guide.pdf",
        duration: 15,
        order: 4,
        isPreview: false,
      },
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
