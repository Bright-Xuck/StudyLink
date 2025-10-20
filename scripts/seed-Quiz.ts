// scripts/seedQuizzes.ts
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import mongoose from "mongoose";
import Module from "../lib/models/Module";
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

// Sample quiz data - Add quizzes for your lessons here
const sampleQuizzes = [
  {
    lessonTitle: "What is Research?",
    moduleSlug: "introduction-to-research",
    quizTitle: "Understanding Research Fundamentals",
    questions: [
      {
        type: "mcq",
        questionText: "What is the etymological origin of the word 'research'?",
        options: [
          "Latin word 'recherche' meaning to investigate",
          "French word 'rechercher' meaning to seek out",
          "Greek word 'researchos' meaning to discover",
          "German word 'forschen' meaning to explore"
        ],
        correctAnswer: "French word 'rechercher' meaning to seek out",
        points: 1,
        explanation: "The word 'research' comes from the French 'rechercher,' which means 'to seek out' or 'to search again.'",
        order: 1,
      },
      {
        type: "mcq",
        questionText: "Which of the following is NOT a characteristic of good research?",
        options: [
          "Systematic and structured",
          "Based on observation or experience",
          "Influenced by personal bias",
          "Replicable and transmittable"
        ],
        correctAnswer: "Influenced by personal bias",
        points: 1,
        explanation: "Good research should be objective and free from personal bias. It must follow systematic procedures and be based on empirical evidence.",
        order: 2,
      },
      {
        type: "mcq",
        questionText: "What type of research aims to describe a situation or phenomenon accurately?",
        options: [
          "Exploratory Research",
          "Descriptive Research",
          "Explanatory Research",
          "Predictive Research"
        ],
        correctAnswer: "Descriptive Research",
        points: 1,
        explanation: "Descriptive research aims to accurately describe characteristics of a population, situation, or phenomenon.",
        order: 3,
      },
      {
        type: "structural",
        questionText: "Explain in your own words the difference between everyday inquiry and scientific research. Provide one example of each.",
        correctAnswer: "Scientific research is systematic, objective, and evidence-based while everyday inquiry is casual and subjective",
        points: 2,
        explanation: "Scientific research follows structured methods with controlled observations and testable hypotheses, minimizing bias. Everyday inquiry is intuitive, based on personal experience, and often includes personal biases. Example: Asking a friend about a coffee shop (everyday) vs. conducting a customer satisfaction survey (scientific).",
        order: 4,
      },
      {
        type: "mcq",
        questionText: "Which characteristic of a good researcher is described as 'the ability to analyze, evaluate, and question information objectively'?",
        options: [
          "Curiosity",
          "Critical Thinking",
          "Perseverance",
          "Ethical Integrity"
        ],
        correctAnswer: "Critical Thinking",
        points: 1,
        explanation: "Critical thinking involves analyzing data critically, evaluating arguments logically, and recognizing biases and assumptions.",
        order: 5,
      },
    ],
  },
  {
    lessonTitle: "Philosophical Foundations of Research",
    moduleSlug: "introduction-to-research",
    quizTitle: "Research Paradigms Quiz",
    questions: [
      {
        type: "mcq",
        questionText: "Which research paradigm assumes there is a single, objective reality that exists independently of our perceptions?",
        options: [
          "Positivism",
          "Interpretivism",
          "Pragmatism",
          "Constructivism"
        ],
        correctAnswer: "Positivism",
        points: 1,
        explanation: "Positivism is grounded in the belief that reality is objective, measurable, and predictable, existing independently of human perception.",
        order: 1,
      },
      {
        type: "mcq",
        questionText: "What type of research methods are typically associated with interpretivism?",
        options: [
          "Quantitative methods like experiments",
          "Qualitative methods like interviews",
          "Mixed methods only",
          "Statistical analysis"
        ],
        correctAnswer: "Qualitative methods like interviews",
        points: 1,
        explanation: "Interpretivism typically uses qualitative methods such as interviews, observations, and case studies to understand subjective meanings and experiences.",
        order: 2,
      },
      {
        type: "structural",
        questionText: "Define 'ontology' in the context of research and explain how it differs between positivism and interpretivism.",
        correctAnswer: "Ontology is the nature of reality; positivism views reality as objective while interpretivism views it as subjective",
        points: 2,
        explanation: "Ontology asks 'What exists?' Positivism (objectivism) believes reality exists independently and can be discovered. Interpretivism (constructivism) believes reality is socially constructed through interaction.",
        order: 3,
      },
      {
        type: "mcq",
        questionText: "Which paradigm is focused on 'what works' to solve practical problems rather than philosophical debates about reality?",
        options: [
          "Positivism",
          "Interpretivism",
          "Pragmatism",
          "Critical Theory"
        ],
        correctAnswer: "Pragmatism",
        points: 1,
        explanation: "Pragmatism focuses on practical problem-solving and allows researchers to use whatever methods work best for their research question.",
        order: 4,
      },
      {
        type: "mcq",
        questionText: "Epistemology is concerned with:",
        options: [
          "The nature of reality",
          "The nature of knowledge and how we know things",
          "The role of values in research",
          "The choice of research methods"
        ],
        correctAnswer: "The nature of knowledge and how we know things",
        points: 1,
        explanation: "Epistemology deals with questions like 'What can we know?' and 'How can we know it?'",
        order: 5,
      },
    ],
  },
  {
    lessonTitle: "Types and Approaches of Research",
    moduleSlug: "introduction-to-research",
    quizTitle: "Research Classifications Quiz",
    questions: [
      {
        type: "mcq",
        questionText: "Research that aims to expand knowledge and develop theories without immediate practical application is called:",
        options: [
          "Applied Research",
          "Basic Research",
          "Exploratory Research",
          "Experimental Research"
        ],
        correctAnswer: "Basic Research",
        points: 1,
        explanation: "Basic (or fundamental/pure) research is curiosity-driven and seeks to expand knowledge without immediate practical application.",
        order: 1,
      },
      {
        type: "mcq",
        questionText: "Which type of research reasoning moves from general theory to specific observations?",
        options: [
          "Inductive reasoning",
          "Deductive reasoning",
          "Abductive reasoning",
          "Analogical reasoning"
        ],
        correctAnswer: "Deductive reasoning",
        points: 1,
        explanation: "Deductive reasoning ('top-down') starts with a theory, formulates a hypothesis, collects data, and confirms or rejects the hypothesis.",
        order: 2,
      },
      {
        type: "structural",
        questionText: "Explain the main difference between experimental and non-experimental research. Give one example of each.",
        correctAnswer: "Experimental research manipulates variables to test cause-effect while non-experimental observes without manipulation",
        points: 2,
        explanation: "Experimental research manipulates an independent variable to measure its effect (e.g., testing a teaching method). Non-experimental research observes variables naturally (e.g., surveying study hours and grades).",
        order: 3,
      },
      {
        type: "mcq",
        questionText: "Qualitative research typically uses which type of reasoning?",
        options: [
          "Deductive (theory to data)",
          "Inductive (data to theory)",
          "Neither inductive nor deductive",
          "Always mixed reasoning"
        ],
        correctAnswer: "Inductive (data to theory)",
        points: 1,
        explanation: "Qualitative research uses inductive ('bottom-up') reasoning: collecting observations, identifying patterns, and building theory from data.",
        order: 4,
      },
      {
        type: "mcq",
        questionText: "What is the main strength of mixed methods research?",
        options: [
          "It's faster than single-method research",
          "It combines strengths of quantitative and qualitative approaches",
          "It requires less expertise",
          "It always costs less"
        ],
        correctAnswer: "It combines strengths of quantitative and qualitative approaches",
        points: 1,
        explanation: "Mixed methods research provides comprehensive understanding by combining strengths of both approaches, enabling triangulation.",
        order: 5,
      },
    ],
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

    for (const quizData of sampleQuizzes) {
      try {
        // Find the module
        const module = await Module.findOne({ slug: quizData.moduleSlug });

        if (!module) {
          errors.push(`Module "${quizData.moduleSlug}" not found. Skipping quiz for "${quizData.lessonTitle}".`);
          continue;
        }

        // Find the lesson within the module
        const lesson = module.lessons.find(
          (l: any) => l.title === quizData.lessonTitle
        );

        if (!lesson) {
          errors.push(`Lesson "${quizData.lessonTitle}" not found in module "${module.title}". Skipping.`);
          continue;
        }

        // Create the quiz - cast lesson._id to string
        const quiz = await Quiz.create({
          lessonId: (lesson as any)._id.toString(),
          moduleId: String(module._id),
          title: quizData.quizTitle,
          questions: quizData.questions,
        });

        console.log(`✅ Created quiz: "${quiz.title}"`);
        console.log(`   📚 Module: ${module.title}`);
        console.log(`   📖 Lesson: ${lesson.title}`);
        console.log(`   ❓ Questions: ${quiz.questions.length}\n`);
        
        totalCreated++;
      } catch (error: any) {
        errors.push(`Error creating quiz for "${quizData.lessonTitle}": ${error.message}`);
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