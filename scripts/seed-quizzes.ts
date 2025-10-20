import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import mongoose from "mongoose";
import Module, { ILesson } from "../lib/models/Module";
import Quiz from "../lib/models/Quiz";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  await mongoose.connect(MONGODB_URI);
  console.log("✅ MongoDB connected");
}

// Sample quiz data following the new model definition
const sampleQuizzes = [
  {
    lessonTitle: "What is Research?",
    moduleSlug: "introduction-to-research",
    quizData: {
      title: "Understanding Research Fundamentals",
      titleFr: "Comprendre les Fondamentaux de la Recherche",
      description: "Test your knowledge of research basics and fundamentals",
      descriptionFr: "Testez vos connaissances des bases de la recherche",
      passingScore: 85,
      timeLimit: 15,
      maxAttempts: 3,
      questions: [
        {
          type: "mcq",
          questionText:
            "What is the etymological origin of the word 'research'?",
          questionTextFr:
            "Quelle est l'origine étymologique du mot 'recherche'?",
          options: [
            "Latin word 'recherche' meaning to investigate",
            "French word 'rechercher' meaning to seek out",
            "Greek word 'researchos' meaning to discover",
            "German word 'forschen' meaning to explore",
          ],
          optionsFr: [
            "Mot latin 'recherche' signifiant enquêter",
            "Mot français 'rechercher' signifiant chercher",
            "Mot grec 'researchos' signifiant découvrir",
            "Mot allemand 'forschen' signifiant explorer",
          ],
          correctAnswer: "French word 'rechercher' meaning to seek out",
          correctAnswerFr: "Mot français 'rechercher' signifiant chercher",
          points: 1,
          explanation:
            "The word 'research' comes from the French 'rechercher,' which means 'to seek out' or 'to search again.'",
          explanationFr:
            "Le mot 'recherche' vient du français 'rechercher', qui signifie 'chercher' ou 'chercher à nouveau'.",
          order: 1,
        },
        {
          type: "mcq",
          questionText:
            "Which of the following is NOT a characteristic of good research?",
          questionTextFr:
            "Lequel des éléments suivants n'est PAS une caractéristique d'une bonne recherche?",
          options: [
            "Systematic and structured",
            "Based on observation or experience",
            "Influenced by personal bias",
            "Replicable and transmittable",
          ],
          optionsFr: [
            "Systématique et structuré",
            "Basé sur l'observation ou l'expérience",
            "Influencé par les préjugés personnels",
            "Reproductible et transmissible",
          ],
          correctAnswer: "Influenced by personal bias",
          correctAnswerFr: "Influencé par les préjugés personnels",
          points: 1,
          explanation:
            "Good research should be objective and free from personal bias. It must follow systematic procedures and be based on empirical evidence.",
          explanationFr:
            "Une bonne recherche doit être objective et exempte de préjugés personnels. Elle doit suivre des procédures systématiques et être basée sur des preuves empiriques.",
          order: 2,
        },
        {
          type: "mcq",
          questionText:
            "What type of research aims to describe a situation or phenomenon accurately?",
          questionTextFr:
            "Quel type de recherche vise à décrire avec précision une situation ou un phénomène?",
          options: [
            "Exploratory Research",
            "Descriptive Research",
            "Explanatory Research",
            "Predictive Research",
          ],
          optionsFr: [
            "Recherche Exploratoire",
            "Recherche Descriptive",
            "Recherche Explicative",
            "Recherche Prédictive",
          ],
          correctAnswer: "Descriptive Research",
          correctAnswerFr: "Recherche Descriptive",
          points: 1,
          explanation:
            "Descriptive research aims to accurately describe characteristics of a population, situation, or phenomenon.",
          explanationFr:
            "La recherche descriptive vise à décrire avec précision les caractéristiques d'une population, d'une situation ou d'un phénomène.",
          order: 3,
        },
        {
          type: "short-answer",
          questionText:
            "Explain in your own words the difference between everyday inquiry and scientific research. Provide one example of each.",
          questionTextFr:
            "Expliquez avec vos propres mots la différence entre l'enquête quotidienne et la recherche scientifique. Donnez un exemple de chacun.",
          correctAnswer:
            "Scientific research is systematic, objective, and evidence-based while everyday inquiry is casual and subjective",
          correctAnswerFr:
            "La recherche scientifique est systématique, objective et fondée sur des preuves tandis que l'enquête quotidienne est décontractée et subjective",
          points: 2,
          explanation:
            "Scientific research follows structured methods with controlled observations and testable hypotheses, minimizing bias. Everyday inquiry is intuitive, based on personal experience, and often includes personal biases. Example: Asking a friend about a coffee shop (everyday) vs. conducting a customer satisfaction survey (scientific).",
          explanationFr:
            "La recherche scientifique suit des méthodes structurées avec des observations contrôlées et des hypothèses testables, minimisant les biais. L'enquête quotidienne est intuitive, basée sur l'expérience personnelle et inclut souvent des biais personnels. Exemple: Demander à un ami à propos d'un café (quotidien) vs. mener une enquête de satisfaction client (scientifique).",
          order: 4,
        },
        {
          type: "mcq",
          questionText:
            "Which characteristic of a good researcher is described as 'the ability to analyze, evaluate, and question information objectively'?",
          questionTextFr:
            "Quelle caractéristique d'un bon chercheur est décrite comme 'la capacité d'analyser, d'évaluer et de questionner l'information objectivement'?",
          options: [
            "Curiosity",
            "Critical Thinking",
            "Perseverance",
            "Ethical Integrity",
          ],
          optionsFr: [
            "Curiosité",
            "Pensée Critique",
            "Persévérance",
            "Intégrité Éthique",
          ],
          correctAnswer: "Critical Thinking",
          correctAnswerFr: "Pensée Critique",
          points: 1,
          explanation:
            "Critical thinking involves analyzing data critically, evaluating arguments logically, and recognizing biases and assumptions.",
          explanationFr:
            "La pensée critique implique d'analyser les données de manière critique, d'évaluer les arguments logiquement et de reconnaître les biais et les hypothèses.",
          order: 5,
        },
      ],
    },
  },
  {
    lessonTitle: "Philosophical Foundations of Research",
    moduleSlug: "introduction-to-research",
    quizData: {
      title: "Research Paradigms Quiz",
      titleFr: "Quiz sur les Paradigmes de Recherche",
      description:
        "Test your understanding of research paradigms and philosophical foundations",
      descriptionFr:
        "Testez votre compréhension des paradigmes de recherche et des fondements philosophiques",
      passingScore: 85,
      timeLimit: 12,
      maxAttempts: 3,
      questions: [
        {
          type: "mcq",
          questionText:
            "Which research paradigm assumes there is a single, objective reality that exists independently of our perceptions?",
          questionTextFr:
            "Quel paradigme de recherche suppose qu'il existe une réalité objective unique qui existe indépendamment de nos perceptions?",
          options: [
            "Positivism",
            "Interpretivism",
            "Pragmatism",
            "Constructivism",
          ],
          optionsFr: [
            "Positivisme",
            "Interprétivisme",
            "Pragmatisme",
            "Constructivisme",
          ],
          correctAnswer: "Positivism",
          correctAnswerFr: "Positivisme",
          points: 1,
          explanation:
            "Positivism is grounded in the belief that reality is objective, measurable, and predictable, existing independently of human perception.",
          explanationFr:
            "Le positivisme repose sur la croyance que la réalité est objective, mesurable et prévisible, existant indépendamment de la perception humaine.",
          order: 1,
        },
        {
          type: "mcq",
          questionText:
            "What type of research methods are typically associated with interpretivism?",
          questionTextFr:
            "Quel type de méthodes de recherche est généralement associé à l'interprétivisme?",
          options: [
            "Quantitative methods like experiments",
            "Qualitative methods like interviews",
            "Mixed methods only",
            "Statistical analysis",
          ],
          optionsFr: [
            "Méthodes quantitatives comme les expériences",
            "Méthodes qualitatives comme les entrevues",
            "Méthodes mixtes uniquement",
            "Analyse statistique",
          ],
          correctAnswer: "Qualitative methods like interviews",
          correctAnswerFr: "Méthodes qualitatives comme les entrevues",
          points: 1,
          explanation:
            "Interpretivism typically uses qualitative methods such as interviews, observations, and case studies to understand subjective meanings and experiences.",
          explanationFr:
            "L'interprétivisme utilise généralement des méthodes qualitatives telles que les entrevues, les observations et les études de cas pour comprendre les significations et expériences subjectives.",
          order: 2,
        },
        {
          type: "short-answer",
          questionText:
            "Define 'ontology' in the context of research and explain how it differs between positivism and interpretivism.",
          questionTextFr:
            "Définissez 'l'ontologie' dans le contexte de la recherche et expliquez en quoi elle diffère entre le positivisme et l'interprétivisme.",
          correctAnswer:
            "Ontology is the nature of reality; positivism views reality as objective while interpretivism views it as subjective",
          correctAnswerFr:
            "L'ontologie est la nature de la réalité; le positivisme considère la réalité comme objective tandis que l'interprétivisme la considère comme subjective",
          points: 2,
          explanation:
            "Ontology asks 'What exists?' Positivism (objectivism) believes reality exists independently and can be discovered. Interpretivism (constructivism) believes reality is socially constructed through interaction.",
          explanationFr:
            "L'ontologie demande 'Qu'est-ce qui existe?' Le positivisme (objectivisme) croit que la réalité existe indépendamment et peut être découverte. L'interprétivisme (constructivisme) croit que la réalité est socialement construite par l'interaction.",
          order: 3,
        },
        {
          type: "mcq",
          questionText:
            "Which paradigm is focused on 'what works' to solve practical problems rather than philosophical debates about reality?",
          questionTextFr:
            "Quel paradigme se concentre sur 'ce qui fonctionne' pour résoudre des problèmes pratiques plutôt que sur des débats philosophiques sur la réalité?",
          options: [
            "Positivism",
            "Interpretivism",
            "Pragmatism",
            "Critical Theory",
          ],
          optionsFr: [
            "Positivisme",
            "Interprétivisme",
            "Pragmatisme",
            "Théorie Critique",
          ],
          correctAnswer: "Pragmatism",
          correctAnswerFr: "Pragmatisme",
          points: 1,
          explanation:
            "Pragmatism focuses on practical problem-solving and allows researchers to use whatever methods work best for their research question.",
          explanationFr:
            "Le pragmatisme se concentre sur la résolution pratique de problèmes et permet aux chercheurs d'utiliser les méthodes qui fonctionnent le mieux pour leur question de recherche.",
          order: 4,
        },
        {
          type: "mcq",
          questionText: "Epistemology is concerned with:",
          questionTextFr: "L'épistémologie concerne:",
          options: [
            "The nature of reality",
            "The nature of knowledge and how we know things",
            "The role of values in research",
            "The choice of research methods",
          ],
          optionsFr: [
            "La nature de la réalité",
            "La nature de la connaissance et comment nous connaissons les choses",
            "Le rôle des valeurs dans la recherche",
            "Le choix des méthodes de recherche",
          ],
          correctAnswer: "The nature of knowledge and how we know things",
          correctAnswerFr:
            "La nature de la connaissance et comment nous connaissons les choses",
          points: 1,
          explanation:
            "Epistemology deals with questions like 'What can we know?' and 'How can we know it?'",
          explanationFr:
            "L'épistémologie traite de questions telles que 'Que pouvons-nous connaître?' et 'Comment pouvons-nous le connaître?'",
          order: 5,
        },
      ],
    },
  },
  {
    lessonTitle: "Types and Approaches of Research",
    moduleSlug: "introduction-to-research",
    quizData: {
      title: "Research Classifications Quiz",
      titleFr: "Quiz sur les Classifications de Recherche",
      description:
        "Assess your knowledge of different research types and approaches",
      descriptionFr:
        "Évaluez vos connaissances des différents types et approches de recherche",
      passingScore: 85,
      timeLimit: 15,
      maxAttempts: 3,
      questions: [
        {
          type: "mcq",
          questionText:
            "Research that aims to expand knowledge and develop theories without immediate practical application is called:",
          questionTextFr:
            "La recherche qui vise à élargir les connaissances et à développer des théories sans application pratique immédiate s'appelle:",
          options: [
            "Applied Research",
            "Basic Research",
            "Exploratory Research",
            "Experimental Research",
          ],
          optionsFr: [
            "Recherche Appliquée",
            "Recherche Fondamentale",
            "Recherche Exploratoire",
            "Recherche Expérimentale",
          ],
          correctAnswer: "Basic Research",
          correctAnswerFr: "Recherche Fondamentale",
          points: 1,
          explanation:
            "Basic (or fundamental/pure) research is curiosity-driven and seeks to expand knowledge without immediate practical application.",
          explanationFr:
            "La recherche fondamentale (ou pure) est motivée par la curiosité et cherche à élargir les connaissances sans application pratique immédiate.",
          order: 1,
        },
        {
          type: "mcq",
          questionText:
            "Which type of research reasoning moves from general theory to specific observations?",
          questionTextFr:
            "Quel type de raisonnement de recherche va de la théorie générale aux observations spécifiques?",
          options: [
            "Inductive reasoning",
            "Deductive reasoning",
            "Abductive reasoning",
            "Analogical reasoning",
          ],
          optionsFr: [
            "Raisonnement inductif",
            "Raisonnement déductif",
            "Raisonnement abductif",
            "Raisonnement analogique",
          ],
          correctAnswer: "Deductive reasoning",
          correctAnswerFr: "Raisonnement déductif",
          points: 1,
          explanation:
            "Deductive reasoning ('top-down') starts with a theory, formulates a hypothesis, collects data, and confirms or rejects the hypothesis.",
          explanationFr:
            "Le raisonnement déductif ('descendant') commence par une théorie, formule une hypothèse, collecte des données et confirme ou rejette l'hypothèse.",
          order: 2,
        },
        {
          type: "short-answer",
          questionText:
            "Explain the main difference between experimental and non-experimental research. Give one example of each.",
          questionTextFr:
            "Expliquez la principale différence entre la recherche expérimentale et non expérimentale. Donnez un exemple de chacune.",
          correctAnswer:
            "Experimental research manipulates variables to test cause-effect while non-experimental observes without manipulation",
          correctAnswerFr:
            "La recherche expérimentale manipule les variables pour tester la cause-effet tandis que la non-expérimentale observe sans manipulation",
          points: 2,
          explanation:
            "Experimental research manipulates an independent variable to measure its effect (e.g., testing a teaching method). Non-experimental research observes variables naturally (e.g., surveying study hours and grades).",
          explanationFr:
            "La recherche expérimentale manipule une variable indépendante pour mesurer son effet (par exemple, tester une méthode d'enseignement). La recherche non expérimentale observe les variables naturellement (par exemple, enquêter sur les heures d'étude et les notes).",
          order: 3,
        },
        {
          type: "mcq",
          questionText:
            "Qualitative research typically uses which type of reasoning?",
          questionTextFr:
            "La recherche qualitative utilise généralement quel type de raisonnement?",
          options: [
            "Deductive (theory to data)",
            "Inductive (data to theory)",
            "Neither inductive nor deductive",
            "Always mixed reasoning",
          ],
          optionsFr: [
            "Déductif (théorie vers données)",
            "Inductif (données vers théorie)",
            "Ni inductif ni déductif",
            "Toujours raisonnement mixte",
          ],
          correctAnswer: "Inductive (data to theory)",
          correctAnswerFr: "Inductif (données vers théorie)",
          points: 1,
          explanation:
            "Qualitative research uses inductive ('bottom-up') reasoning: collecting observations, identifying patterns, and building theory from data.",
          explanationFr:
            "La recherche qualitative utilise un raisonnement inductif ('ascendant'): collecter des observations, identifier des modèles et construire une théorie à partir des données.",
          order: 4,
        },
        {
          type: "mcq",
          questionText: "What is the main strength of mixed methods research?",
          questionTextFr:
            "Quelle est la principale force de la recherche à méthodes mixtes?",
          options: [
            "It's faster than single-method research",
            "It combines strengths of quantitative and qualitative approaches",
            "It requires less expertise",
            "It always costs less",
          ],
          optionsFr: [
            "C'est plus rapide que la recherche à méthode unique",
            "Elle combine les forces des approches quantitatives et qualitatives",
            "Elle nécessite moins d'expertise",
            "Elle coûte toujours moins cher",
          ],
          correctAnswer:
            "It combines strengths of quantitative and qualitative approaches",
          correctAnswerFr:
            "Elle combine les forces des approches quantitatives et qualitatives",
          points: 1,
          explanation:
            "Mixed methods research provides comprehensive understanding by combining strengths of both approaches, enabling triangulation.",
          explanationFr:
            "La recherche à méthodes mixtes fournit une compréhension complète en combinant les forces des deux approches, permettant la triangulation.",
          order: 5,
        },
      ],
    },
  },
];

async function seedQuizzes() {
  try {
    console.log("🌱 Starting quiz seeding process...\n");

    await connectDB();

    // Clear all existing quizzes
    const deleteResult = await Quiz.deleteMany({});
    console.log(`🗑️  Cleared ${deleteResult.deletedCount} existing quizzes\n`);

    let totalCreated = 0;
    const errors: string[] = [];

    for (const quizEntry of sampleQuizzes) {
      try {
        // Find the module
        const courseModule = await Module.findOne({
          slug: quizEntry.moduleSlug,
        });

        if (!courseModule) {
          errors.push(
            `Module "${quizEntry.moduleSlug}" not found. Skipping quiz for "${quizEntry.lessonTitle}".`
          );
          continue;
        }

        // Find the lesson within the module
        const lesson = courseModule.lessons.find(
          (l: ILesson) =>
            l.title === quizEntry.lessonTitle
        );

        if (!lesson) {
          errors.push(
            `Lesson "${quizEntry.lessonTitle}" not found in module "${courseModule.title}". Skipping.`
          );
          continue;
        }

        // Create the quiz with all required fields
        const quiz = await Quiz.create({
          lessonId: new mongoose.Types.ObjectId(String(lesson._id)),
          moduleId: new mongoose.Types.ObjectId(String(courseModule._id)),
          title: quizEntry.quizData.title,
          titleFr: quizEntry.quizData.titleFr,
          description: quizEntry.quizData.description,
          descriptionFr: quizEntry.quizData.descriptionFr,
          questions: quizEntry.quizData.questions,
          passingScore: quizEntry.quizData.passingScore,
          timeLimit: quizEntry.quizData.timeLimit,
          maxAttempts: quizEntry.quizData.maxAttempts,
          isPublished: true,
        });

        console.log(`✅ Created quiz: "${quiz.title}"`);
        console.log(`   📚 Module: ${courseModule.title}`);
        console.log(`   📖 Lesson: ${lesson.title}`);
        console.log(`   ❓ Questions: ${quiz.questions.length}`);
        console.log(`   🎯 Passing Score: ${quiz.passingScore}%`);
        console.log(`   ⏱️  Time Limit: ${quiz.timeLimit} minutes`);
        console.log(`   🔄 Max Attempts: ${quiz.maxAttempts}\n`);

        totalCreated++;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        errors.push(
          `Error creating quiz for "${quizEntry.lessonTitle}": ${errorMessage}`
        );
      }
    }

    // Summary
    console.log("═".repeat(60));
    console.log("📊 SEEDING SUMMARY");
    console.log("═".repeat(60));
    console.log(`✅ Successfully created: ${totalCreated} quizzes`);
    console.log(`❌ Errors: ${errors.length}`);

    if (errors.length > 0) {
      console.log("\n⚠️  ERRORS:");
      errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    }

    console.log("\n✨ Quiz seeding completed!\n");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ FATAL ERROR during quiz seeding:", error);
    process.exit(1);
  }
}

// Run the seeder
seedQuizzes();
