/* eslint-disable @typescript-eslint/no-explicit-any */
import dotenv from "dotenv";
import path from "path";

// Load .env.local file
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import mongoose from "mongoose";
import { faker } from "@faker-js/faker";

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

// Import models
import Course from "../lib/models/Course";
import Module from "../lib/models/Module";
import { Quiz } from "../lib/models/Quiz";
import User from "../lib/models/User";
import Certificate from "../lib/models/Certificate";

// Seed data
const courses = [
  {
    title: "Research Methods & Ethics",
    titleFr: "Méthodes de recherche et éthique",
    description:
      "Comprehensive course covering fundamental research methodologies, ethical considerations, and best practices for conducting academic research.",
    descriptionFr:
      "Cours complet couvrant les méthodologies de recherche fondamentales, les considérations éthiques et les meilleures pratiques pour mener des recherches académiques.",
    slug: "research-methods-ethics",
    imageUrl:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
    department: "Biochemistry",
    faculty: "Faculty of Science",
    isFree: false,
    price: 50000,
    currency: "XAF",
    duration: "8 weeks",
    level: "intermediate" as const,
    objectives: [
      "Understand core research methodologies",
      "Apply ethical principles in research",
      "Design and conduct research studies",
      "Analyze and interpret research data",
    ],
    objectivesFr: [
      "Comprendre les méthodologies de recherche de base",
      "Appliquer les principes éthiques dans la recherche",
      "Concevoir et mener des études de recherche",
      "Analyser et interpréter les données de recherche",
    ],
    prerequisites: ["Basic understanding of academic writing"],
    prerequisitesFr: ["Compréhension de base de l'écriture académique"],
    instructor: "Dr. Sarah Johnson",
    instructorBio: "Professor of Research Methodology with 15 years experience",
    order: 1,
    isPublished: true,
    enrolledCount: 150,
  },
  {
    title: "Computer Science Research",
    titleFr: "Recherche en informatique",
    description:
      "Advanced research techniques specifically tailored for computer science, including algorithm analysis, software engineering research, and experimental design.",
    descriptionFr:
      "Techniques de recherche avancées spécialement adaptées à l'informatique, y compris l'analyse d'algorithmes, la recherche en génie logiciel et la conception expérimentale.",
    slug: "computer-science-research",
    imageUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
    department: "Computer Science",
    faculty: "Faculty of Science",
    isFree: false,
    price: 75000,
    currency: "XAF",
    duration: "10 weeks",
    level: "advanced" as const,
    objectives: [
      "Master CS-specific research methods",
      "Conduct empirical software engineering studies",
      "Perform algorithm complexity analysis",
      "Publish in top-tier CS conferences",
    ],
    objectivesFr: [
      "Maîtriser les méthodes de recherche spécifiques à l'informatique",
      "Mener des études empiriques en génie logiciel",
      "Effectuer l'analyse de complexité des algorithmes",
      "Publier dans des conférences informatiques de premier plan",
    ],
    prerequisites: ["Programming experience", "Basic algorithms knowledge"],
    prerequisitesFr: [
      "Expérience en programmation",
      "Connaissance de base des algorithmes",
    ],
    instructor: "Dr. Michael Chen",
    instructorBio: "Senior Researcher in Computer Science and AI",
    order: 2,
    isPublished: true,
    enrolledCount: 89,
  },
  {
    title: "Introduction to Academic Writing",
    titleFr: "Introduction à l'écriture académique",
    description:
      "Learn the fundamentals of academic writing, citation styles, and how to structure research papers effectively.",
    descriptionFr:
      "Apprenez les fondamentaux de l'écriture académique, les styles de citation et comment structurer efficacement les articles de recherche.",
    slug: "introduction-academic-writing",
    imageUrl:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800",
    department: "English",
    faculty: "Faculty of Arts",
    isFree: true,
    price: 0,
    currency: "XAF",
    duration: "4 weeks",
    level: "beginner" as const,
    objectives: [
      "Master academic writing styles",
      "Learn proper citation techniques",
      "Structure research papers effectively",
      "Avoid plagiarism",
    ],
    objectivesFr: [
      "Maîtriser les styles d'écriture académique",
      "Apprendre les techniques de citation appropriées",
      "Structurer efficacement les articles de recherche",
      "Éviter le plagiat",
    ],
    prerequisites: [],
    prerequisitesFr: [],
    instructor: "Dr. Emily Wilson",
    instructorBio: "Writing Center Director and Linguistics Professor",
    order: 3,
    isPublished: true,
    enrolledCount: 234,
  },
];

const modulesData = [
  // Course 1: Research Methods & Ethics - Modules
  {
    courseIndex: 0,
    title: "Introduction to Research",
    titleFr: "Introduction à la recherche",
    description:
      "Learn the fundamentals of research, including research philosophy, types of research, and the research process.",
    descriptionFr:
      "Apprenez les fondamentaux de la recherche, y compris la philosophie de recherche, les types de recherche et le processus de recherche.",
    slug: "introduction-to-research",
    imageUrl:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
    content:
      "This module covers the fundamental concepts of research methodology...",
    contentFr:
      "Ce module couvre les concepts fondamentaux de la méthodologie de recherche...",
    duration: "3 weeks",
    level: "beginner" as const,
    objectives: [
      "Understand different research paradigms",
      "Identify research problems and questions",
      "Learn the research process steps",
    ],
    objectivesFr: [
      "Comprendre les différents paradigmes de recherche",
      "Identifier les problèmes et questions de recherche",
      "Apprendre les étapes du processus de recherche",
    ],
    order: 1,
    isPublished: true,
  },
  {
    courseIndex: 0,
    title: "Research Design & Methodology",
    titleFr: "Conception et méthodologie de recherche",
    description:
      "Explore various research designs and methodologies including quantitative, qualitative, and mixed methods approaches.",
    descriptionFr:
      "Explorez diverses conceptions et méthodologies de recherche, y compris les approches quantitatives, qualitatives et mixtes.",
    slug: "research-design-methodology",
    imageUrl:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
    content:
      "This module explores different research designs and methodologies...",
    contentFr:
      "Ce module explore différentes conceptions et méthodologies de recherche...",
    duration: "3 weeks",
    level: "intermediate" as const,
    objectives: [
      "Compare quantitative and qualitative approaches",
      "Design research studies",
      "Select appropriate methodologies",
    ],
    objectivesFr: [
      "Comparer les approches quantitatives et qualitatives",
      "Concevoir des études de recherche",
      "Sélectionner des méthodologies appropriées",
    ],
    order: 2,
    isPublished: true,
  },
  {
    courseIndex: 0,
    title: "Research Ethics & Data Analysis",
    titleFr: "Éthique de la recherche et analyse de données",
    description:
      "Understand ethical principles in research and learn essential data analysis techniques.",
    descriptionFr:
      "Comprenez les principes éthiques dans la recherche et apprenez les techniques essentielles d'analyse de données.",
    slug: "research-ethics-data-analysis",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
    content:
      "This module covers research ethics and basic data analysis techniques...",
    contentFr:
      "Ce module couvre l'éthique de la recherche et les techniques de base d'analyse de données...",
    duration: "2 weeks",
    level: "intermediate" as const,
    objectives: [
      "Apply ethical principles in research",
      "Analyze qualitative and quantitative data",
      "Interpret research findings",
    ],
    objectivesFr: [
      "Appliquer les principes éthiques dans la recherche",
      "Analyser des données qualitatives et quantitatives",
      "Interpréter les résultats de recherche",
    ],
    order: 3,
    isPublished: true,
  },

  // Course 2: Computer Science Research - Modules
  {
    courseIndex: 1,
    title: "CS Research Fundamentals",
    titleFr: "Fondamentaux de la recherche en informatique",
    description:
      "Introduction to computer science research methods, literature review strategies, and paper writing.",
    descriptionFr:
      "Introduction aux méthodes de recherche en informatique, stratégies de revue de littérature et rédaction d'articles.",
    slug: "cs-research-fundamentals",
    imageUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
    content:
      "This module introduces computer science specific research methods...",
    contentFr:
      "Ce module présente les méthodes de recherche spécifiques à l'informatique...",
    duration: "3 weeks",
    level: "intermediate" as const,
    objectives: [
      "Conduct CS literature reviews",
      "Identify research gaps in CS",
      "Write CS research papers",
    ],
    objectivesFr: [
      "Effectuer des revues de littérature en informatique",
      "Identifier les lacunes de recherche en informatique",
      "Rédiger des articles de recherche en informatique",
    ],
    order: 1,
    isPublished: true,
  },
  {
    courseIndex: 1,
    title: "Experimental Design in CS",
    titleFr: "Conception expérimentale en informatique",
    description:
      "Learn to design and conduct experiments in software engineering, algorithms, and systems research.",
    descriptionFr:
      "Apprenez à concevoir et mener des expériences en génie logiciel, algorithmes et recherche de systèmes.",
    slug: "experimental-design-cs",
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
    content: "This module covers experimental design in computer science...",
    contentFr:
      "Ce module couvre la conception expérimentale en informatique...",
    duration: "4 weeks",
    level: "advanced" as const,
    objectives: [
      "Design CS experiments",
      "Collect and analyze CS data",
      "Validate algorithms and systems",
    ],
    objectivesFr: [
      "Concevoir des expériences en informatique",
      "Collecter et analyser des données informatiques",
      "Valider des algorithmes et systèmes",
    ],
    order: 2,
    isPublished: true,
  },
  {
    courseIndex: 1,
    title: "Publishing & Presentation",
    titleFr: "Publication et présentation",
    description:
      "Master the art of publishing in top CS conferences and presenting your research effectively.",
    descriptionFr:
      "Maîtrisez l'art de publier dans les meilleures conférences informatiques et de présenter efficacement vos recherches.",
    slug: "publishing-presentation",
    imageUrl:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800",
    content:
      "This module focuses on publishing and presentation skills for CS researchers...",
    contentFr:
      "Ce module se concentre sur les compétences de publication et de présentation pour les chercheurs en informatique...",
    duration: "3 weeks",
    level: "advanced" as const,
    objectives: [
      "Submit to top CS conferences",
      "Prepare effective research presentations",
      "Respond to reviewer comments",
    ],
    objectivesFr: [
      "Soumettre aux meilleures conférences informatiques",
      "Préparer des présentations de recherche efficaces",
      "Répondre aux commentaires des examinateurs",
    ],
    order: 3,
    isPublished: true,
  },

  // Course 3: Introduction to Academic Writing - Modules
  {
    courseIndex: 2,
    title: "Academic Writing Basics",
    titleFr: "Bases de l'écriture académique",
    description:
      "Learn the fundamental principles of academic writing, including structure, style, and tone.",
    descriptionFr:
      "Apprenez les principes fondamentaux de l'écriture académique, y compris la structure, le style et le ton.",
    slug: "academic-writing-basics",
    imageUrl:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800",
    content: "This module covers the basics of academic writing...",
    contentFr: "Ce module couvre les bases de l'écriture académique...",
    duration: "2 weeks",
    level: "beginner" as const,
    objectives: [
      "Understand academic writing conventions",
      "Structure academic papers",
      "Use appropriate academic tone",
    ],
    objectivesFr: [
      "Comprendre les conventions de l'écriture académique",
      "Structurer des articles académiques",
      "Utiliser un ton académique approprié",
    ],
    order: 1,
    isPublished: true,
  },
  {
    courseIndex: 2,
    title: "Citation and Referencing",
    titleFr: "Citation et référencement",
    description:
      "Master different citation styles and learn how to properly reference sources in your academic work.",
    descriptionFr:
      "Maîtrisez différents styles de citation et apprenez à référencer correctement les sources dans votre travail académique.",
    slug: "citation-referencing",
    imageUrl:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800",
    content:
      "This module teaches proper citation and referencing techniques...",
    contentFr:
      "Ce module enseigne les techniques de citation et de référencement appropriées...",
    duration: "1 week",
    level: "beginner" as const,
    objectives: [
      "Use APA, MLA, and Chicago styles",
      "Create proper references",
      "Avoid plagiarism",
    ],
    objectivesFr: [
      "Utiliser les styles APA, MLA et Chicago",
      "Créer des références appropriées",
      "Éviter le plagiat",
    ],
    order: 2,
    isPublished: true,
  },
  {
    courseIndex: 2,
    title: "Writing Research Papers",
    titleFr: "Rédaction d'articles de recherche",
    description:
      "Learn how to structure and write effective research papers from introduction to conclusion.",
    descriptionFr:
      "Apprenez à structurer et rédiger des articles de recherche efficaces de l'introduction à la conclusion.",
    slug: "writing-research-papers",
    imageUrl:
      "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800",
    content: "This module focuses on writing complete research papers...",
    contentFr:
      "Ce module se concentre sur la rédaction d'articles de recherche complets...",
    duration: "1 week",
    level: "beginner" as const,
    objectives: [
      "Write compelling introductions",
      "Structure literature reviews",
      "Present results and conclusions",
    ],
    objectivesFr: [
      "Rédiger des introductions convaincantes",
      "Structurer les revues de littérature",
      "Présenter les résultats et conclusions",
    ],
    order: 3,
    isPublished: true,
  },
];

// Lessons template (3 lessons per module)
const lessonsTemplate = [
  {
    order: 1,
    type: "reading" as const,
    duration: 25,
    isPreview: true,
    hasQuiz: true,
  },
  {
    order: 2,
    type: "video" as const,
    duration: 30,
    isPreview: false,
    hasQuiz: true,
  },
  {
    order: 3,
    type: "reading" as const,
    duration: 20,
    isPreview: false,
    hasQuiz: true,
  },
];

// Quiz questions template
const quizQuestionsTemplate = [
  {
    type: "mcq" as const,
    questionText: "What is the primary purpose of a literature review?",
    questionTextFr: "Quel est l'objectif principal d'une revue de littérature?",
    options: [
      "To fill space in your paper",
      "To identify gaps in existing research",
      "To copy other people's work",
      "To show you can read",
    ],
    optionsFr: [
      "Remplir de l'espace dans votre article",
      "Identifier les lacunes dans la recherche existante",
      "Copier le travail des autres",
      "Montrer que vous pouvez lire",
    ],
    correctAnswer: "To identify gaps in existing research",
    correctAnswerFr: "Identifier les lacunes dans la recherche existante",
    explanation:
      "A literature review helps identify what has been studied and where knowledge gaps exist.",
    explanationFr:
      "Une revue de littérature aide à identifier ce qui a été étudié et où existent les lacunes de connaissances.",
    points: 10,
    order: 1,
  },
  {
    type: "mcq" as const,
    questionText: "Which research method uses numerical data?",
    questionTextFr:
      "Quelle méthode de recherche utilise des données numériques?",
    options: ["Qualitative", "Quantitative", "Ethnographic", "Case study"],
    optionsFr: [
      "Qualitative",
      "Quantitative",
      "Ethnographique",
      "Étude de cas",
    ],
    correctAnswer: "Quantitative",
    correctAnswerFr: "Quantitative",
    explanation:
      "Quantitative research collects and analyzes numerical data statistically.",
    explanationFr:
      "La recherche quantitative collecte et analyse des données numériques statistiquement.",
    points: 10,
    order: 2,
  },
  {
    type: "mcq" as const,
    questionText: "What is informed consent?",
    questionTextFr: "Qu'est-ce que le consentement éclairé?",
    options: [
      "Forcing participants to join",
      "Voluntary agreement after full disclosure",
      "Keeping secrets from participants",
      "Paying people to participate",
    ],
    optionsFr: [
      "Forcer les participants à rejoindre",
      "Accord volontaire après divulgation complète",
      "Garder des secrets aux participants",
      "Payer les gens pour participer",
    ],
    correctAnswer: "Voluntary agreement after full disclosure",
    correctAnswerFr: "Accord volontaire après divulgation complète",
    explanation:
      "Informed consent means participants voluntarily agree after understanding the research fully.",
    explanationFr:
      "Le consentement éclairé signifie que les participants acceptent volontairement après avoir pleinement compris la recherche.",
    points: 10,
    order: 3,
  },
  {
    type: "mcq" as const,
    questionText: "What does 'p < 0.05' typically indicate?",
    questionTextFr: "Que signifie généralement 'p < 0,05'?",
    options: [
      "The result is not significant",
      "There's a 95% chance the result is due to chance",
      "The result is statistically significant",
      "The study has 5 participants",
    ],
    optionsFr: [
      "Le résultat n'est pas significatif",
      "Il y a 95% de chance que le résultat soit dû au hasard",
      "Le résultat est statistiquement significatif",
      "L'étude a 5 participants",
    ],
    correctAnswer: "The result is statistically significant",
    correctAnswerFr: "Le résultat est statistiquement significatif",
    explanation:
      "A p-value less than 0.05 typically indicates statistical significance at the 5% level.",
    explanationFr:
      "Une valeur p inférieure à 0,05 indique généralement une signification statistique au niveau de 5%.",
    points: 10,
    order: 4,
  },
  {
    type: "mcq" as const,
    questionText: "What is plagiarism?",
    questionTextFr: "Qu'est-ce que le plagiat?",
    options: [
      "Proper citation",
      "Using others' work without attribution",
      "Paraphrasing correctly",
      "Original research",
    ],
    optionsFr: [
      "Citation appropriée",
      "Utiliser le travail d'autrui sans attribution",
      "Paraphraser correctement",
      "Recherche originale",
    ],
    correctAnswer: "Using others' work without attribution",
    correctAnswerFr: "Utiliser le travail d'autrui sans attribution",
    explanation:
      "Plagiarism is using someone else's work or ideas without proper acknowledgment.",
    explanationFr:
      "Le plagiat est l'utilisation du travail ou des idées de quelqu'un d'autre sans reconnaissance appropriée.",
    points: 10,
    order: 5,
  },
];

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...\n");

    // Connect to database
    await connectDB();

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await Course.deleteMany({});
    await Module.deleteMany({});
    await Quiz.deleteMany({});
    await Certificate.deleteMany({});
    await User.deleteMany({});
    console.log("✅ Cleared existing data\n");

    // Create courses
    console.log("📚 Creating courses...");
    const createdCourses = await Course.insertMany(courses);
    console.log(`✅ Created ${createdCourses.length} courses`);
    createdCourses.forEach((course) => {
      console.log(
        `   - ${course.title} (${
          course.isFree ? "FREE" : `${course.price} XAF`
        })`
      );
    });
    console.log("");

    // Create modules with lessons
    console.log("📖 Creating modules with lessons...");
    const createdModules = [];

    for (const moduleData of modulesData) {
      const course = createdCourses[moduleData.courseIndex];

      // Generate lessons for this module
      const lessons = lessonsTemplate.map((template, index) => ({
        title: `${moduleData.title} - Lesson ${index + 1}`,
        titleFr: `${moduleData.titleFr} - Leçon ${index + 1}`,
        description: faker.lorem.sentence(15),
        descriptionFr: faker.lorem.sentence(15),
        type: template.type,
        content:
          template.type === "video"
            ? "https://youtu.be/v-MLGYuWLBo"
            : faker.lorem.paragraphs(5, "<br/><br/>"),
        contentFr: faker.lorem.paragraphs(5, "<br/><br/>"),
        duration: template.duration,
        order: template.order,
        isPreview: template.isPreview,
        hasQuiz: template.hasQuiz,
      }));

      const courseModule = await Module.create({
        courseId: course._id,
        title: moduleData.title,
        titleFr: moduleData.titleFr,
        description: moduleData.description,
        descriptionFr: moduleData.descriptionFr,
        slug: moduleData.slug,
        imageUrl: moduleData.imageUrl,
        content: moduleData.content,
        contentFr: moduleData.contentFr,
        objectives: moduleData.objectives,
        objectivesFr: moduleData.objectivesFr,
        duration: moduleData.duration,
        level: moduleData.level,
        order: moduleData.order,
        lessons,
        isPublished: moduleData.isPublished,
      });

      createdModules.push(courseModule);

      // Update course with module reference
      await Course.findByIdAndUpdate(course._id, {
        $push: { modules: courseModule._id },
      });

      console.log(`   ✅ ${courseModule.title} (${lessons.length} lessons)`);
    }
    console.log(`✅ Created ${createdModules.length} modules\n`);

    // Create quizzes
    console.log("❓ Creating quizzes...");
    const createdQuizzes = [];

    for (const courseModule of createdModules) {
      // Create one quiz for each lesson that has hasQuiz: true
      const lessonsWithQuiz = courseModule.lessons.filter(
        (l: any) => l.hasQuiz
      );

      for (const lesson of lessonsWithQuiz) {
        const quiz = await Quiz.create({
          moduleId: courseModule._id,
          lessonId: lesson._id,
          title: `${lesson.title} - Quiz`,
          titleFr: `${lesson.titleFr} - Quiz`,
          description: `Test your knowledge on ${lesson.title}`,
          descriptionFr: `Testez vos connaissances sur ${lesson.titleFr}`,
          questions: quizQuestionsTemplate,
          passingScore: 70,
          timeLimit: 15, // 15 minutes
          maxAttempts: 3,
          isPublished: true,
        });

        createdQuizzes.push(quiz);
      }
    }

    console.log(`✅ Created ${createdQuizzes.length} quizzes\n`);

    // Create sample users
    console.log("👤 Creating sample users...");

    // Create admin user
    await User.create({
      name: "Admin User",
      email: "admin@researchethics.com",
      password: "password123", // Will be hashed by the pre-save hook
      role: "admin",
      isEmailVerified: true,
      purchasedCourses: createdCourses.map((course) => course._id),
    });
    console.log("   ✅ Created admin user: admin@researchethics.com");

    // Create sample student users
    const studentUsers = [];
    const departments = [
      "Computer Science",
      "Mathematics",
      "Physics",
      "Chemistry",
      "Microbiology",
      "Biochemistry",
      "Economics",
      "Management",
      "English",
      "French",
      "Nursing",
      "Public Health",
    ];

    for (let i = 0; i < 8; i++) {
      const student = await User.create({
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        password: "password123", // Will be hashed by the pre-save hook
        phone: `6${faker.string.numeric(8)}`,
        department: faker.helpers.arrayElement(departments),
        role: "student",
        isEmailVerified: true,
        purchasedCourses: [createdCourses[i % createdCourses.length]._id],
      });
      studentUsers.push(student);
    }
    console.log(`✅ Created ${studentUsers.length} sample students\n`);

    // Create sample certificates
    console.log("🎓 Creating sample certificates...");
    const certificates = [];

    for (let i = 0; i < 5; i++) {
      const student = studentUsers[i % studentUsers.length];
      const course = createdCourses[i % createdCourses.length];
      const totalLessons = course.modules.length * 3; // 3 lessons per module

      const certificate = await Certificate.create({
        userId: student._id,
        courseId: course._id,
        certificateNumber: `RC-2024-${String(i + 1).padStart(6, "0")}`,
        studentName: student.name,
        courseName: course.title,
        courseNameFr: course.titleFr,
        completionDate: faker.date.past({ years: 1 }),
        issueDate: new Date(),
        finalScore: faker.number.int({ min: 85, max: 100 }),
        totalLessons: totalLessons,
        totalQuizzes: totalLessons, // One quiz per lesson
        timeSpent: faker.number.int({ min: 600, max: 1200 }), // 10-20 hours in minutes
        issuedBy: "ResearchEthics Platform",
        signatory: "Dr. John Doe",
        signatoryTitle: "Director of Academic Programs",
        verificationCode: faker.string.alphanumeric(16).toUpperCase(),
        verified: true,
        pdfGenerated: false,
      });

      certificates.push(certificate);
    }

    console.log(`✅ Created ${certificates.length} sample certificates\n`);

    // Summary
    console.log("=".repeat(60));
    console.log("✨ DATABASE SEEDING COMPLETED SUCCESSFULLY!");
    console.log("=".repeat(60));
    console.log("\n📊 Summary:");
    console.log(`   • Courses: ${createdCourses.length}`);
    console.log(`   • Modules: ${createdModules.length}`);
    console.log(
      `   • Lessons: ${createdModules.reduce(
        (sum, m) => sum + m.lessons.length,
        0
      )}`
    );
    console.log(`   • Quizzes: ${createdQuizzes.length}`);
    console.log(`   • Users: ${studentUsers.length + 1} (including admin)`);
    console.log(`   • Certificates: ${certificates.length}`);

    console.log("\n🔑 Login Credentials:");
    console.log("   Admin:");
    console.log("     Email: admin@researchethics.com");
    console.log("     Password: password123");
    console.log("\n   Sample Students:");
    studentUsers.slice(0, 3).forEach((student, index) => {
      console.log(`     ${index + 1}. ${student.email} / password123`);
    });

    console.log("\n🎓 Sample Certificates:");
    certificates.forEach((cert, index) => {
      console.log(
        `     ${index + 1}. ${cert.certificateNumber} - ${cert.studentName}`
      );
    });

    console.log("\n✅ You can now run your application!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
