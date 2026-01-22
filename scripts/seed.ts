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
    type: "reading" as const,
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

// Content mappings for each module's lessons
const contentByModule: Record<string, Record<number, string>> = {
  // Course 1: Research Methods & Ethics
  "introduction-to-research": {
    1: `# Introduction to Research Fundamentals

## Understanding Research

Research is a systematic process of inquiry that aims to expand knowledge and understanding in a particular field. It involves formulating questions, gathering data, analyzing information, and drawing conclusions based on evidence.

### The Research Process

The research process typically follows these key steps:

1. **Problem Identification**: Recognizing a gap in knowledge or a question that needs answering
2. **Literature Review**: Examining existing research and theories on the topic
3. **Research Design**: Planning how you will conduct your investigation
4. **Data Collection**: Gathering information through various methods
5. **Analysis**: Processing and examining the collected data
6. **Conclusion**: Drawing insights and answering your research questions
7. **Dissemination**: Sharing findings with the academic community

## Types of Research

Different types of research serve different purposes:

- **Basic Research**: Seeks to expand knowledge and understanding
- **Applied Research**: Aims to solve practical problems
- **Exploratory Research**: Investigates new or poorly understood phenomena
- **Descriptive Research**: Describes characteristics of a population or phenomenon
- **Explanatory Research**: Seeks to explain why something happens

Understanding these distinctions helps researchers choose appropriate methodologies for their specific questions.`,
    2: `# Research Paradigms and Worldviews

## What is a Research Paradigm?

A research paradigm is a philosophical framework that guides how researchers approach their work. It encompasses beliefs about the nature of reality (ontology), how we know things (epistemology), and the methods we use to investigate (methodology).

### Major Research Paradigms

**Positivist Paradigm**
- Assumes reality is objective and independent of human observation
- Emphasizes quantitative methods and statistical analysis
- Seeks universal laws and generalizable findings

**Interpretivist Paradigm**
- Recognizes that reality is socially constructed
- Emphasizes understanding meaning and context
- Uses qualitative methods and in-depth analysis

**Critical Realist Paradigm**
- Accepts both objective reality and subjective interpretation
- Combines quantitative and qualitative approaches
- Focuses on understanding mechanisms and structures

## Choosing a Paradigm

Your research question and objectives should guide your paradigm selection. Different paradigms are suited to different types of inquiry, and researchers often combine elements from multiple paradigms in contemporary research.`,
    3: `# The Research Question and Problem Statement

## Developing a Strong Research Question

A research question is the foundation of any research project. It should be:

- **Clear and specific**: Unambiguous and focused
- **Answerable**: Able to be investigated through empirical research
- **Significant**: Important to your field and relevant to stakeholders
- **Feasible**: Achievable within your time and resource constraints
- **Researchable**: Not purely philosophical or opinion-based

### Components of a Research Question

1. **Variables**: The concepts you're investigating
2. **Population**: Who or what you're studying
3. **Context**: The setting or circumstances of the study
4. **Relationship**: How variables relate to each other

## Problem Statements

A problem statement articulates the issue your research addresses. It should:
- Provide context and background
- Explain why the problem matters
- Suggest gaps in current knowledge
- Lead naturally to your research questions

Well-defined research questions and problem statements set the stage for rigorous and meaningful research.`
  },
  "research-design-methodology": {
    1: `# Quantitative Research Methods

## Overview of Quantitative Research

Quantitative research involves collecting and analyzing numerical data to test hypotheses and answer research questions. It emphasizes measurement, statistical analysis, and generalization.

### Key Characteristics

- **Numerical Data**: Uses numbers and statistics
- **Large Sample Sizes**: Aims for representative samples
- **Objective Measurement**: Uses standardized instruments
- **Statistical Analysis**: Applies mathematical techniques
- **Generalizability**: Seeks to generalize findings to populations

### Common Quantitative Methods

**Surveys and Questionnaires**
- Gather data from many participants
- Can be distributed in-person, online, or by mail
- Provide standardized, comparable data

**Experiments**
- Manipulate variables to test cause-and-effect
- Use control and experimental groups
- Provide strong evidence of causation

**Correlational Studies**
- Examine relationships between variables
- No manipulation of variables
- Cannot establish causation but indicates associations`,
    2: `# Qualitative Research Methods

## Understanding Qualitative Research

Qualitative research explores phenomena in depth, seeking to understand meaning, context, and human experiences. It uses non-numerical data such as text, images, and observations.

### Key Characteristics

- **Textual Data**: Uses words, descriptions, and observations
- **Small Sample Sizes**: In-depth study of few cases
- **Flexible Design**: Evolves as understanding develops
- **Contextual Understanding**: Emphasizes real-world context
- **Interpretive Analysis**: Focuses on meaning and patterns

### Common Qualitative Methods

**Interviews**
- One-on-one conversations with participants
- Provides rich, detailed information
- Allows for follow-up questions and clarification

**Focus Groups**
- Discussions with multiple participants
- Captures group dynamics and perspectives
- Efficient for gathering diverse viewpoints

**Ethnography**
- Long-term immersion in a community or organization
- Observational study with participant interaction
- Provides deep cultural understanding`,
    3: `# Mixed-Methods and Research Design Selection

## Mixed-Methods Research

Mixed-methods research combines quantitative and qualitative approaches in a single study. This integration can provide comprehensive understanding by leveraging strengths of both approaches.

### Integration Strategies

**Convergent Design**
- Collect and analyze quantitative and qualitative data separately
- Compare and integrate findings
- Provides validation through triangulation

**Explanatory Sequential Design**
- Collect quantitative data first
- Use qualitative data to explain quantitative findings
- Qualitative phase builds on initial results

**Exploratory Sequential Design**
- Conduct qualitative exploration first
- Use findings to develop quantitative instruments
- Quantitative phase tests patterns discovered qualitatively

## Selecting Your Research Design

Consider these factors:
- Research questions and objectives
- Available resources and timeline
- Access to participants and data
- Your expertise and preferences
- Paradigmatic alignment

The right design aligns with your research goals and practical constraints.`
  },
  "research-ethics-data-analysis": {
    1: `# Research Ethics and Participant Protection

## Ethical Principles in Research

Research ethics ensure that studies respect participant dignity and rights. Key ethical principles include:

### Autonomy (Informed Consent)

Participants must:
- Understand the research purpose and procedures
- Know potential risks and benefits
- Voluntarily agree to participate
- Be able to withdraw at any time

**Effective Consent Requires:**
- Clear, understandable language
- Full disclosure of procedures and risks
- No coercion or undue inducement
- Time to ask questions

### Beneficence and Non-Maleficence

- Maximize potential benefits
- Minimize potential harms
- Balance risks against benefits
- Provide support if harm occurs

### Justice

- Fair selection of participants
- Fair distribution of research benefits
- Equitable access to data
- Protection of vulnerable populations`,
    2: `# Data Management and Analysis Fundamentals

## Organizing Your Data

Proper data management is crucial for research integrity:

- **Data Security**: Protect participant confidentiality
- **Documentation**: Record data collection methods clearly
- **Organization**: Use consistent naming and structures
- **Backup**: Maintain multiple secure copies
- **Access Control**: Limit access to authorized personnel

## Quantitative Data Analysis

### Descriptive Statistics

Describe and summarize data:
- **Measures of Central Tendency**: Mean, median, mode
- **Measures of Variation**: Standard deviation, range
- **Frequencies**: How often values occur
- **Distributions**: Shape and pattern of data

### Inferential Statistics

Make predictions and test hypotheses:
- **Hypothesis Testing**: Determine if findings are statistically significant
- **Confidence Intervals**: Estimate population parameters
- **Regression Analysis**: Examine relationships between variables`,
    3: `# Qualitative Data Analysis and Interpretation

## Qualitative Analysis Approaches

### Thematic Analysis

1. **Familiarization**: Read and immerse yourself in data
2. **Coding**: Assign labels to meaningful data segments
3. **Theme Development**: Identify patterns and relationships
4. **Theme Review**: Ensure themes fit the data
5. **Definition**: Clearly define each theme
6. **Reporting**: Present themes with supporting evidence

### Content Analysis

- Systematically categorize content
- Quantify patterns in qualitative data
- Count frequency of codes or categories
- Analyze patterns and relationships

## Data Interpretation

- Support conclusions with evidence
- Consider alternative explanations
- Acknowledge limitations
- Relate findings to existing literature
- Discuss implications and applications

Quality qualitative analysis balances rigor with meaningful insight into human experience.`
  },
  
  // Course 2: Computer Science Research
  "cs-research-fundamentals": {
    1: `# CS Research Methods and Fundamentals

## The Nature of Computer Science Research

Computer Science research investigates computational problems, algorithms, systems, and applications. CS research contributes novel insights that advance the field through publications in conferences and journals.

### Types of CS Research

**Theoretical Research**
- Studies computational complexity and algorithms
- Proves mathematical properties
- Develops new computational models
- Publication venues: ACM STOC, SIAM

**Systems Research**
- Designs and implements computing systems
- Addresses performance, reliability, and scalability
- Creates infrastructure and tools
- Publication venues: OSDI, SOSP, USENIX

**Application Research**
- Develops practical solutions to problems
- Applies CS to other domains
- Creates novel applications
- Publication venues: Domain-specific conferences

## CS Research Venues

### Conferences
- Premier publication venue in CS
- Selective acceptance (15-30%)
- Provides feedback and networking
- Examples: ICML, PLDI, SIGMOD

### Journals
- In-depth presentation of work
- Longer publication timelines
- Examples: ACM Transactions series, IEEE TSE

### Workshops and Seminars
- Emerging ideas and work-in-progress
- Community discussion and feedback`,
    2: `# Literature Review in Computer Science

## Conducting a CS Literature Review

A literature review synthesizes existing knowledge and identifies research gaps. In CS, this involves surveying papers, standards, and systems.

### Information Sources

**Academic Databases**
- ACM Digital Library (comprehensive CS coverage)
- IEEE Xplore (systems and engineering)
- Google Scholar (broad multidisciplinary)
- Semantic Scholar (AI-powered search)

**Conference Proceedings**
- Premier conferences publish cutting-edge work
- Papers available through conference websites
- Proceedings indexed in digital libraries

**Technical Reports and Preprints**
- ArXiv for preprints before publication
- University technical reports
- Corporate research publications

## Synthesizing Literature

1. **Identify Key Papers**: Find seminal and recent works
2. **Categorize Research**: Organize by approach or topic
3. **Identify Gaps**: Find unanswered questions
4. **Summarize Trends**: Note evolution of the field
5. **Position Your Work**: Show where your research fits

Effective literature reviews establish context and motivation for CS research.`,
    3: `# Research Contributions in Computer Science

## What Constitutes a Research Contribution?

A CS research contribution must:
- Be **novel**: Introduce something not previously published
- Be **significant**: Have meaningful impact or insight
- Be **technically sound**: Employ rigorous methods
- Be **documented**: Clearly described and reproducible

### Types of Contributions

**Algorithmic Contributions**
- New algorithms with better properties (faster, smaller, etc.)
- Improved complexity analysis
- Novel algorithmic techniques
- Must prove properties and demonstrate advantages

**Systems Contributions**
- New system design or architecture
- Performance improvements
- Novel implementation techniques
- Must include evaluation and comparison

**Empirical Contributions**
- Novel experimental findings
- Benchmark datasets
- Large-scale studies
- Must use rigorous experimental methodology

**Theoretical Contributions**
- New proofs or mathematical results
- Computational complexity bounds
- Formal models and specifications
- Must be mathematically rigorous

## Evaluating Significance

Consider:
- Does it solve an important problem?
- Does it advance the field?
- Does it open new research directions?
- Does it impact practice?`
  },
  "experimental-design-cs": {
    1: `# Designing CS Experiments

## Experimental Methodology in CS

CS experiments test hypotheses about algorithms, systems, or applications. Well-designed experiments provide evidence for claims and enable reproducible results.

### Experimental Components

**Independent Variables** (what you manipulate)
- Algorithm parameters
- System configuration
- Input characteristics
- Environmental factors

**Dependent Variables** (what you measure)
- Execution time
- Memory usage
- Throughput
- Accuracy or quality metrics

**Controls** (what you hold constant)
- Hardware specifications
- Software versions
- Input distributions
- Experimental environment

## Experimental Design Patterns

**Comparative Studies**
- Compare new approach to baselines
- Multiple implementations under same conditions
- Fair comparison requires careful control

**Parametric Studies**
- Vary one parameter systematically
- Measure effects on performance
- Identify optimal configurations

**Scalability Studies**
- Test behavior with increasing scale
- Examine growth rates and limits
- Important for systems research`,
    2: `# Measurement and Benchmarking in CS

## Selecting Metrics

Choose metrics that:
- Directly measure your research questions
- Are reproducible and comparable
- Account for trade-offs (time vs. space)
- Reflect real-world usage patterns

### Common CS Metrics

**Performance Metrics**
- Execution time (wall-clock or CPU)
- Memory usage
- Throughput (operations per second)
- Latency (response time)

**Quality Metrics**
- Accuracy for ML/AI systems
- Approximation ratio for algorithms
- Compression ratio for data structures
- Error rate for systems

## Benchmarking Best Practices

1. **Multiple Runs**: Execute experiments many times
2. **Warm-up**: Discard early runs affected by initialization
3. **Consistent Environment**: Control system state and load
4. **Statistical Analysis**: Report averages, standard deviations
5. **Reproducibility**: Document all parameters and setup

Benchmarking rigor strengthens confidence in experimental results.`,
    3: `# Statistical Analysis of Experimental Results

## Analyzing CS Experiment Results

Statistical analysis transforms raw measurements into meaningful conclusions.

### Descriptive Statistics

Report:
- **Mean**: Average performance
- **Standard Deviation**: Variability in measurements
- **Median**: Middle value (robust to outliers)
- **Min/Max**: Range of observations

### Statistical Significance

Test whether observed differences are:
- Real (not due to random variation)
- Consistent (reproducible)
- Meaningful (practically significant)

**Hypothesis Testing**
- Null hypothesis: No difference between approaches
- P-value: Probability of observing results if null true
- Significance level: Typically p < 0.05

### Presenting Results

**Graphs and Tables**
- Box plots show distribution and outliers
- Line graphs show trends across parameters
- Tables provide precise values
- Error bars indicate uncertainty

Always distinguish correlation from causation and consider confounding factors.`
  },
  "publishing-presentation": {
    1: `# Preparing Your Research for Publication

## Publication Process Overview

The journey from research completion to published paper:

1. **Manuscript Preparation**: Write your paper
2. **Venue Selection**: Choose conference or journal
3. **Submission**: Submit to editorial system
4. **Desk Review**: Editor's initial assessment
5. **Review Process**: Expert peer review (1-3 months)
6. **Revision**: Respond to reviewer feedback
7. **Acceptance/Publication**: Paper is published

### Conference vs. Journal

**Conferences**
- Faster publication (6-12 months)
- Selective (10-30% acceptance)
- Provides feedback and networking
- Time-sensitive deadlines

**Journals**
- Longer publication (1-2 years)
- More selective (varies widely)
- In-depth review and revision
- More stable reference

## Paper Structure

Standard CS paper sections:
- **Abstract**: Concise summary
- **Introduction**: Motivation and contributions
- **Related Work**: Literature review
- **Methods**: Your approach and design
- **Results**: Experimental findings
- **Discussion**: Interpretation and implications
- **Conclusion**: Summary and future work`,
    2: `# Responding to Peer Review

## Understanding Reviewer Comments

Reviewers evaluate:
- Novelty and originality
- Technical soundness
- Clarity of presentation
- Experimental rigor
- Significance of contributions

### Types of Reviews

**Acceptance**: Paper is accepted, sometimes with minor revisions
**Major Revision**: Significant issues require substantial work
**Rejection**: Paper doesn't meet standards, encourage resubmission elsewhere

## The Rebuttal Process

Your rebuttal should:
1. **Thank Reviewers**: Show appreciation for feedback
2. **Summarize Changes**: List all modifications
3. **Address Concerns**: Explain how you fixed issues
4. **Provide Justification**: Support decisions with evidence
5. **Be Professional**: Avoid defensiveness

### Tips for Effective Rebuttals

- Point-by-point response to each comment
- Quote reviewer comments for clarity
- Reference specific pages and experiments
- Acknowledge valid criticisms gracefully
- Explain changes in the revised manuscript

Strong rebuttals often result in acceptance after revision.`,
    3: `# Presenting Your Research

## Effective Research Presentations

### Presentation Components

**Slide Design**
- Minimal text (one idea per slide)
- Clear, readable fonts (18pt minimum)
- Professional color scheme
- High-quality figures and diagrams

**Verbal Delivery**
- Speak clearly and pace yourself
- Make eye contact with audience
- Use gestures naturally
- Practice extensively

**Content Organization**
- Opening: Engage audience and motivate topic
- Main contribution: Clearly explain novel aspects
- Results: Show evidence for claims
- Conclusion: Summarize impact and future work

### Common Presentation Mistakes

- Reading slides verbatim
- Overly technical slides
- Rushed explanations
- Unclear motivation
- Poor figure quality

## Conference Presentations

**Time Management**
- Plan for questions and transitions
- Allocate time to key contributions
- Leave time for audience questions
- Have backup slides for deep dives

Practice presentations with colleagues to receive feedback before the conference.`
  },

  // Course 3: Introduction to Academic Writing
  "academic-writing-basics": {
    1: `# Fundamentals of Academic Writing

## What is Academic Writing?

Academic writing communicates research, analysis, and ideas to scholarly audiences. It is:
- **Formal**: Professional tone without slang
- **Objective**: Based on evidence, not opinion
- **Structured**: Organized with clear progression
- **Supported**: Every claim backed by evidence
- **Precise**: Uses accurate, specific language

### Key Characteristics

**Clarity**
- Use clear, direct sentences
- Avoid jargon or explain terms
- One main idea per paragraph
- Logical flow between ideas

**Precision**
- Choose words carefully
- Use technical terms correctly
- Provide specific examples
- Define ambiguous terms

**Evidence-Based**
- Support arguments with citations
- Use credible sources
- Acknowledge alternative views
- Distinguish fact from interpretation

## Audience and Purpose

Consider your readers:
- Academic discipline and expertise
- Expectations and conventions
- What they need to understand
- How they'll use your writing

Different disciplines have different conventions (humanities, sciences, social sciences).`,
    2: `# Building Strong Arguments

## Thesis Statements

A thesis statement is your main argument or claim. It should:

- **Be Specific**: Clearly state your position
- **Be Arguable**: Present a claim, not a fact
- **Be Supportable**: Evidence exists to support it
- **Be Concise**: One sentence when possible

**Weak Thesis**: "This paper discusses global warming."
**Strong Thesis**: "Reducing carbon emissions through renewable energy adoption is essential to mitigate climate change impacts by 2050."

## Supporting Your Argument

**Topic Sentences**
- State the main idea of each paragraph
- Connect to your thesis
- Guide reader through argument

**Evidence**
- Direct quotes from sources
- Paraphrased information
- Statistical data
- Examples and case studies

**Analysis**
- Explain how evidence supports your claim
- Connect evidence to your argument
- Consider counterarguments
- Show significance

## Paragraph Structure

Each paragraph should:
1. Begin with a topic sentence
2. Present evidence or examples
3. Analyze and interpret the evidence
4. Connect back to your thesis

Well-structured arguments are persuasive and easy to follow.`,
    3: `# Academic Tone and Style

## Maintaining Academic Tone

Academic tone is:
- **Professional**: No casual language or slang
- **Objective**: Avoid first person unless appropriate
- **Formal**: Complete sentences, proper grammar
- **Balanced**: Acknowledge different perspectives

**Conversational (Not Academic)**
"Technology is really changing how we communicate, and it's pretty awesome."

**Academic**
"Digital communication technologies have significantly altered interpersonal interaction patterns and social dynamics."

## Common Writing Problems

**Passive Voice Overuse**
- Academic writing benefits from active voice
- Use passive voice purposefully, not by default
- Active: "Researchers conducted the study"
- Passive: "The study was conducted"

**Vague Language**
- Use specific, precise terms
- Avoid "very," "really," "interesting"
- Quantify when possible
- Define technical terms

**First Person Usage**
- In some fields, "I" is acceptable
- In others, use "the author" or passive voice
- Consult discipline-specific guidelines
- Use consistently throughout

## Editing for Clarity

Review your writing for:
- Sentence length and complexity
- Word choice appropriateness
- Grammar and punctuation
- Consistent terminology
- Logical flow`
  },
  "citation-referencing": {
    1: `# Understanding Citations and Plagiarism

## What is Plagiarism?

Plagiarism is using others' work or ideas without proper acknowledgment. It includes:
- Copying text without quotation marks
- Paraphrasing without citation
- Using ideas without attribution
- Self-plagiarism (reusing your own work)
- Inadequate paraphrasing

### Forms of Plagiarism

**Direct Plagiarism**: Copying exact words without quotes or citations
**Mosaic Plagiarism**: Mixing unquoted words with citations
**Accidental Plagiarism**: Incorrect citation or paraphrasing
**Self-Plagiarism**: Submitting same work twice

## Avoiding Plagiarism

- Take careful notes during research
- Distinguish between quotes and paraphrases
- Cite everything that isn't common knowledge
- Use quotation marks for exact words
- Follow citation style consistently

## Why Citations Matter

Citations:
- Give credit to sources
- Allow readers to verify claims
- Demonstrate research depth
- Follow ethical academic standards
- Build credibility through scholarship

Proper attribution is fundamental to academic integrity.`,
    2: `# Citation Styles and Systems

## Major Citation Styles

**APA (American Psychological Association)**
- Used in: Psychology, social sciences, education
- Format: Author-date system (Smith, 2020)
- In-text citations with reference list

**MLA (Modern Language Association)**
- Used in: Humanities, literature, language
- Format: Author-page system (Smith 45)
- Works cited list at end

**Chicago/Turabian**
- Used in: History, humanities, some social sciences
- Format: Notes and bibliography system
- Footnotes or endnotes with bibliography

**IEEE (Institute of Electrical and Electronics Engineers)**
- Used in: Engineering, computer science
- Format: Numbered citations [1], [2]
- References list at end

## Choosing a Citation Style

Consider:
- Your discipline or field
- Instructor or publication requirements
- Consistency within your document
- Available formatting tools

Each style has specific rules for books, journals, websites, and other sources.`,
    3: `# Creating Accurate References

## Reference List Requirements

Your reference list should:
- Include all cited sources
- Be organized alphabetically
- Use consistent formatting
- Provide complete publication information
- Follow the selected style precisely

## Creating Different Reference Types

**Books**
Include: Author, publication year, title, publisher, location

**Journal Articles**
Include: Author, year, article title, journal name, volume, issue, pages

**Websites**
Include: Author, date accessed, URL, site title

**Multimedia**
Include: Creator, date, title, medium, source

## Formatting Tools

**Reference Managers** (automate formatting)
- Zotero (free)
- Mendeley (free and paid)
- EndNote (paid)
- RefWorks (institutional)

These tools:
- Store and organize sources
- Generate citations automatically
- Create bibliographies
- Format in multiple styles

Using reference management software reduces errors and saves time in citation formatting.`
  },
  "writing-research-papers": {
    1: `# Structuring Your Research Paper

## Standard Research Paper Format

### Title and Abstract
**Title**: Clear, concise statement of paper content
**Abstract**: 150-250 word summary including:
- Research question
- Methods used
- Key findings
- Implications

The abstract allows readers to quickly understand your work.

### Introduction
Establish context and motivation:
1. **Hook**: Engage reader with significance
2. **Background**: Explain relevant concepts
3. **Problem Statement**: Identify the gap
4. **Research Question**: What will you investigate?
5. **Thesis**: Your main contribution

Introductions should move from general to specific.

### Literature Review
Synthesize existing knowledge:
- Identify key works and theories
- Discuss major findings
- Show evolution of the field
- Identify research gaps
- Position your work within existing literature

A strong literature review shows comprehensive knowledge of your topic.`,
    2: `# Methods and Results Sections

## Methodology Section

Explain how you conducted research:
- **Research Design**: Overall approach
- **Participants/Subjects**: Who or what you studied
- **Data Collection**: Procedures and instruments
- **Data Analysis**: How you processed data
- **Validity and Reliability**: How you ensured quality

Sufficient detail allows others to:
- Understand your approach
- Evaluate appropriateness
- Replicate the study
- Assess limitations

## Results Section

Present your findings:
- Report data relevant to research questions
- Use tables and figures for clarity
- Organize logically (by research question often)
- Present factually without interpretation
- Note statistical significance

**Results Section Features**:
- Objective tone
- Past tense
- References to tables and figures
- No discussion of implications
- Clear and complete

Results should be presented clearly so readers understand what you found.`,
    3: `# Discussion and Conclusion

## Discussion Section

Interpret your findings:
1. **Restate Findings**: Briefly summarize key results
2. **Interpret**: What do findings mean?
3. **Compare to Literature**: How do they fit with existing knowledge?
4. **Discuss Implications**: What's the significance?
5. **Acknowledge Limitations**: What are constraints?
6. **Suggest Future Work**: What remains unanswered?

Discussion is where you explain why your findings matter.

### Addressing Limitations

Honestly discuss:
- Sample size constraints
- Methodological limitations
- Generalizability limitations
- Practical constraints
- Future improvements

Acknowledging limitations strengthens rather than weakens your work.

## Conclusion

- **Summarize**: Main findings and contributions
- **Broader Impact**: Significance for the field
- **Applications**: Practical or theoretical implications
- **Future Directions**: Open questions for further research
- **Final Thought**: Memorable closing

## Reference List

Complete citations for all sources:
- Organized alphabetically
- Formatted consistently
- Using appropriate citation style
- Only sources actually cited

Well-written research papers advance knowledge through clear communication of rigorous investigation.`
  }
};


// Quiz questions templates by module slug
const quizQuestionsByModule: Record<string, any[]> = {
  // Course 1: Research Methods & Ethics
  "introduction-to-research": [
    {
      type: "mcq" as const,
      questionText: "What is a research paradigm?",
      questionTextFr: "Qu'est-ce qu'un paradigme de recherche?",
      options: [
        "A type of statistical test",
        "A philosophical framework guiding research",
        "A research instrument",
        "A data collection method",
      ],
      optionsFr: [
        "Un type de test statistique",
        "Un cadre philosophique guidant la recherche",
        "Un instrument de recherche",
        "Une méthode de collecte de données",
      ],
      correctAnswer: "A philosophical framework guiding research",
      correctAnswerFr: "Un cadre philosophique guidant la recherche",
      explanation:
        "A research paradigm is a philosophical framework that guides how research should be conducted.",
      explanationFr:
        "Un paradigme de recherche est un cadre philosophique qui guide la façon dont la recherche doit être menée.",
      points: 10,
      order: 1,
    },
    {
      type: "mcq" as const,
      questionText: "What is the first step in the research process?",
      questionTextFr:
        "Quelle est la première étape du processus de recherche?",
      options: [
        "Data collection",
        "Identifying a research problem",
        "Writing the conclusion",
        "Publishing results",
      ],
      optionsFr: [
        "Collecte de données",
        "Identifier un problème de recherche",
        "Rédiger la conclusion",
        "Publier les résultats",
      ],
      correctAnswer: "Identifying a research problem",
      correctAnswerFr: "Identifier un problème de recherche",
      explanation:
        "The research process begins with identifying a clear research problem or question.",
      explanationFr:
        "Le processus de recherche commence par l'identification d'un problème ou d'une question de recherche claire.",
      points: 10,
      order: 2,
    },
    {
      type: "mcq" as const,
      questionText: "What characterizes exploratory research?",
      questionTextFr: "Qu'est-ce qui caractérise la recherche exploratoire?",
      options: [
        "Testing hypotheses",
        "Investigating new areas with little prior knowledge",
        "Confirming existing theories",
        "Collecting only numerical data",
      ],
      optionsFr: [
        "Tester des hypothèses",
        "Enquêter sur de nouveaux domaines avec peu de connaissances préalables",
        "Confirmer les théories existantes",
        "Collecter uniquement des données numériques",
      ],
      correctAnswer: "Investigating new areas with little prior knowledge",
      correctAnswerFr:
        "Enquêter sur de nouveaux domaines avec peu de connaissances préalables",
      explanation:
        "Exploratory research is used to investigate new or poorly understood phenomena.",
      explanationFr:
        "La recherche exploratoire est utilisée pour enquêter sur des phénomènes nouveaux ou mal compris.",
      points: 10,
      order: 3,
    },
    {
      type: "mcq" as const,
      questionText: "What is a research question?",
      questionTextFr: "Qu'est-ce qu'une question de recherche?",
      options: [
        "A question asked to participants",
        "A specific inquiry that guides the research",
        "A hypothesis to test",
        "A survey instrument",
      ],
      optionsFr: [
        "Une question posée aux participants",
        "Une enquête spécifique qui guide la recherche",
        "Une hypothèse à tester",
        "Un instrument d'enquête",
      ],
      correctAnswer: "A specific inquiry that guides the research",
      correctAnswerFr: "Une enquête spécifique qui guide la recherche",
      explanation:
        "A research question is a clear, focused question that guides the entire research study.",
      explanationFr:
        "Une question de recherche est une question claire et ciblée qui guide l'ensemble de l'étude de recherche.",
      points: 10,
      order: 4,
    },
    {
      type: "mcq" as const,
      questionText: "What is the difference between basic and applied research?",
      questionTextFr:
        "Quelle est la différence entre la recherche fondamentale et appliquée?",
      options: [
        "Basic is easier than applied",
        "Basic seeks knowledge; applied solves practical problems",
        "Applied is always quantitative",
        "Basic doesn't require ethics approval",
      ],
      optionsFr: [
        "La fondamentale est plus facile que l'appliquée",
        "La fondamentale cherche la connaissance; l'appliquée résout des problèmes pratiques",
        "L'appliquée est toujours quantitative",
        "La fondamentale ne nécessite pas d'approbation éthique",
      ],
      correctAnswer: "Basic seeks knowledge; applied solves practical problems",
      correctAnswerFr:
        "La fondamentale cherche la connaissance; l'appliquée résout des problèmes pratiques",
      explanation:
        "Basic research aims to expand knowledge, while applied research aims to solve practical problems.",
      explanationFr:
        "La recherche fondamentale vise à élargir les connaissances, tandis que la recherche appliquée vise à résoudre des problèmes pratiques.",
      points: 10,
      order: 5,
    },
  ],

  "research-design-methodology": [
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
      order: 1,
    },
    {
      type: "mcq" as const,
      questionText: "What is a mixed-methods approach?",
      questionTextFr: "Qu'est-ce qu'une approche à méthodes mixtes?",
      options: [
        "Using multiple statistical tests",
        "Combining qualitative and quantitative methods",
        "Mixing different populations",
        "Using various survey questions",
      ],
      optionsFr: [
        "Utiliser plusieurs tests statistiques",
        "Combiner des méthodes qualitatives et quantitatives",
        "Mélanger différentes populations",
        "Utiliser diverses questions d'enquête",
      ],
      correctAnswer: "Combining qualitative and quantitative methods",
      correctAnswerFr:
        "Combiner des méthodes qualitatives et quantitatives",
      explanation:
        "Mixed-methods research integrates both qualitative and quantitative approaches in a single study.",
      explanationFr:
        "La recherche à méthodes mixtes intègre des approches qualitatives et quantitatives dans une seule étude.",
      points: 10,
      order: 2,
    },
    {
      type: "mcq" as const,
      questionText: "What is an experimental research design?",
      questionTextFr: "Qu'est-ce qu'un plan de recherche expérimental?",
      options: [
        "Observing without intervention",
        "Manipulating variables to test cause-effect",
        "Collecting survey data",
        "Interviewing participants",
      ],
      optionsFr: [
        "Observer sans intervention",
        "Manipuler des variables pour tester la cause à effet",
        "Collecter des données d'enquête",
        "Interviewer les participants",
      ],
      correctAnswer: "Manipulating variables to test cause-effect",
      correctAnswerFr:
        "Manipuler des variables pour tester la cause à effet",
      explanation:
        "Experimental designs involve manipulating independent variables to observe effects on dependent variables.",
      explanationFr:
        "Les plans expérimentaux impliquent de manipuler des variables indépendantes pour observer les effets sur les variables dépendantes.",
      points: 10,
      order: 3,
    },
    {
      type: "mcq" as const,
      questionText: "What is sampling in research?",
      questionTextFr: "Qu'est-ce que l'échantillonnage dans la recherche?",
      options: [
        "Testing products",
        "Selecting participants from a population",
        "Collecting data samples",
        "Trying different methods",
      ],
      optionsFr: [
        "Tester des produits",
        "Sélectionner des participants d'une population",
        "Collecter des échantillons de données",
        "Essayer différentes méthodes",
      ],
      correctAnswer: "Selecting participants from a population",
      correctAnswerFr: "Sélectionner des participants d'une population",
      explanation:
        "Sampling is the process of selecting a subset of individuals from a population to represent the whole.",
      explanationFr:
        "L'échantillonnage est le processus de sélection d'un sous-ensemble d'individus d'une population pour représenter l'ensemble.",
      points: 10,
      order: 4,
    },
    {
      type: "mcq" as const,
      questionText: "What is a case study research design?",
      questionTextFr: "Qu'est-ce qu'un plan de recherche d'étude de cas?",
      options: [
        "Testing legal cases",
        "In-depth investigation of a single case or small group",
        "Large-scale survey research",
        "Laboratory experiments",
      ],
      optionsFr: [
        "Tester des cas juridiques",
        "Enquête approfondie sur un seul cas ou petit groupe",
        "Recherche d'enquête à grande échelle",
        "Expériences de laboratoire",
      ],
      correctAnswer: "In-depth investigation of a single case or small group",
      correctAnswerFr: "Enquête approfondie sur un seul cas ou petit groupe",
      explanation:
        "Case study research involves detailed examination of a single case or small number of cases in their real-world context.",
      explanationFr:
        "La recherche par étude de cas implique un examen détaillé d'un seul cas ou d'un petit nombre de cas dans leur contexte réel.",
      points: 10,
      order: 5,
    },
  ],

  "research-ethics-data-analysis": [
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
      order: 1,
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
      order: 2,
    },
    {
      type: "mcq" as const,
      questionText: "What is anonymity in research?",
      questionTextFr: "Qu'est-ce que l'anonymat dans la recherche?",
      options: [
        "Hiding the research purpose",
        "Protecting participant identities",
        "Secret research projects",
        "Anonymous authors",
      ],
      optionsFr: [
        "Cacher l'objectif de la recherche",
        "Protéger l'identité des participants",
        "Projets de recherche secrets",
        "Auteurs anonymes",
      ],
      correctAnswer: "Protecting participant identities",
      correctAnswerFr: "Protéger l'identité des participants",
      explanation:
        "Anonymity means that participant identities are not known even to the researchers.",
      explanationFr:
        "L'anonymat signifie que l'identité des participants n'est même pas connue des chercheurs.",
      points: 10,
      order: 3,
    },
    {
      type: "mcq" as const,
      questionText: "What is descriptive statistics?",
      questionTextFr: "Qu'est-ce que la statistique descriptive?",
      options: [
        "Writing descriptions of data",
        "Summarizing and describing data characteristics",
        "Making predictions",
        "Testing hypotheses",
      ],
      optionsFr: [
        "Écrire des descriptions de données",
        "Résumer et décrire les caractéristiques des données",
        "Faire des prédictions",
        "Tester des hypothèses",
      ],
      correctAnswer: "Summarizing and describing data characteristics",
      correctAnswerFr:
        "Résumer et décrire les caractéristiques des données",
      explanation:
        "Descriptive statistics summarize and describe the main features of a dataset.",
      explanationFr:
        "Les statistiques descriptives résument et décrivent les principales caractéristiques d'un ensemble de données.",
      points: 10,
      order: 4,
    },
    {
      type: "mcq" as const,
      questionText: "What is thematic analysis?",
      questionTextFr: "Qu'est-ce que l'analyse thématique?",
      options: [
        "Analyzing movie themes",
        "Identifying patterns and themes in qualitative data",
        "Statistical correlation analysis",
        "Experimental design",
      ],
      optionsFr: [
        "Analyser les thèmes de films",
        "Identifier des modèles et des thèmes dans les données qualitatives",
        "Analyse de corrélation statistique",
        "Conception expérimentale",
      ],
      correctAnswer: "Identifying patterns and themes in qualitative data",
      correctAnswerFr:
        "Identifier des modèles et des thèmes dans les données qualitatives",
      explanation:
        "Thematic analysis is a method for identifying, analyzing, and reporting patterns within qualitative data.",
      explanationFr:
        "L'analyse thématique est une méthode pour identifier, analyser et rapporter des modèles dans les données qualitatives.",
      points: 10,
      order: 5,
    },
  ],

  // Course 2: Computer Science Research
  "cs-research-fundamentals": [
    {
      type: "mcq" as const,
      questionText: "What is the primary purpose of a literature review in CS?",
      questionTextFr:
        "Quel est l'objectif principal d'une revue de littérature en informatique?",
      options: [
        "To copy existing algorithms",
        "To identify gaps and understand state-of-the-art",
        "To fill paper pages",
        "To avoid doing experiments",
      ],
      optionsFr: [
        "Copier les algorithmes existants",
        "Identifier les lacunes et comprendre l'état de l'art",
        "Remplir les pages du papier",
        "Éviter de faire des expériences",
      ],
      correctAnswer: "To identify gaps and understand state-of-the-art",
      correctAnswerFr:
        "Identifier les lacunes et comprendre l'état de l'art",
      explanation:
        "Literature reviews help CS researchers understand current knowledge and identify research gaps.",
      explanationFr:
        "Les revues de littérature aident les chercheurs en informatique à comprendre les connaissances actuelles et à identifier les lacunes de recherche.",
      points: 10,
      order: 1,
    },
    {
      type: "mcq" as const,
      questionText: "What are common CS research venues?",
      questionTextFr:
        "Quels sont les lieux de recherche courants en informatique?",
      options: [
        "Only journals",
        "Conferences and journals",
        "Only workshops",
        "Social media",
      ],
      optionsFr: [
        "Seulement des revues",
        "Conférences et revues",
        "Seulement des ateliers",
        "Réseaux sociaux",
      ],
      correctAnswer: "Conferences and journals",
      correctAnswerFr: "Conférences et revues",
      explanation:
        "CS research is published in both peer-reviewed conferences and academic journals.",
      explanationFr:
        "La recherche en informatique est publiée dans des conférences évaluées par des pairs et des revues académiques.",
      points: 10,
      order: 2,
    },
    {
      type: "mcq" as const,
      questionText: "What is a research contribution in CS?",
      questionTextFr:
        "Qu'est-ce qu'une contribution de recherche en informatique?",
      options: [
        "Any code written",
        "Novel insight, method, or solution advancing the field",
        "Using existing libraries",
        "Writing documentation",
      ],
      optionsFr: [
        "N'importe quel code écrit",
        "Aperçu, méthode ou solution novateurs faisant progresser le domaine",
        "Utiliser des bibliothèques existantes",
        "Écrire de la documentation",
      ],
      correctAnswer: "Novel insight, method, or solution advancing the field",
      correctAnswerFr:
        "Aperçu, méthode ou solution novateurs faisant progresser le domaine",
      explanation:
        "A research contribution must provide novel insights or solutions that advance the field.",
      explanationFr:
        "Une contribution de recherche doit fournir des aperçus ou solutions novateurs qui font progresser le domaine.",
      points: 10,
      order: 3,
    },
    {
      type: "mcq" as const,
      questionText: "What is a research hypothesis in CS?",
      questionTextFr:
        "Qu'est-ce qu'une hypothèse de recherche en informatique?",
      options: [
        "A guess about anything",
        "A testable prediction about system behavior or performance",
        "The final conclusion",
        "A programming assumption",
      ],
      optionsFr: [
        "Une supposition sur n'importe quoi",
        "Une prédiction testable sur le comportement ou la performance du système",
        "La conclusion finale",
        "Une hypothèse de programmation",
      ],
      correctAnswer:
        "A testable prediction about system behavior or performance",
      correctAnswerFr:
        "Une prédiction testable sur le comportement ou la performance du système",
      explanation:
        "A research hypothesis is a testable statement predicting relationships between variables.",
      explanationFr:
        "Une hypothèse de recherche est une déclaration testable prédisant les relations entre les variables.",
      points: 10,
      order: 4,
    },
    {
      type: "mcq" as const,
      questionText: "What makes good CS research writing?",
      questionTextFr:
        "Qu'est-ce qui fait une bonne rédaction de recherche en informatique?",
      options: [
        "Using complex jargon",
        "Clear, precise, and reproducible descriptions",
        "Hiding implementation details",
        "Long paragraphs",
      ],
      optionsFr: [
        "Utiliser un jargon complexe",
        "Descriptions claires, précises et reproductibles",
        "Cacher les détails d'implémentation",
        "Longs paragraphes",
      ],
      correctAnswer: "Clear, precise, and reproducible descriptions",
      correctAnswerFr: "Descriptions claires, précises et reproductibles",
      explanation:
        "Good CS research writing prioritizes clarity, precision, and reproducibility.",
      explanationFr:
        "Une bonne rédaction de recherche en informatique privilégie la clarté, la précision et la reproductibilité.",
      points: 10,
      order: 5,
    },
  ],

  "experimental-design-cs": [
    {
      type: "mcq" as const,
      questionText: "What is a benchmark in CS research?",
      questionTextFr:
        "Qu'est-ce qu'un benchmark dans la recherche en informatique?",
      options: [
        "A type of chair",
        "A standard test to compare performance",
        "A research paper format",
        "A programming language",
      ],
      optionsFr: [
        "Un type de chaise",
        "Un test standard pour comparer les performances",
        "Un format d'article de recherche",
        "Un langage de programmation",
      ],
      correctAnswer: "A standard test to compare performance",
      correctAnswerFr: "Un test standard pour comparer les performances",
      explanation:
        "Benchmarks are standardized tests used to compare algorithm or system performance.",
      explanationFr:
        "Les benchmarks sont des tests standardisés utilisés pour comparer les performances d'algorithmes ou de systèmes.",
      points: 10,
      order: 1,
    },
    {
      type: "mcq" as const,
      questionText: "What is algorithmic complexity analysis?",
      questionTextFr: "Qu'est-ce que l'analyse de complexité algorithmique?",
      options: [
        "Making algorithms complicated",
        "Analyzing time and space requirements",
        "Counting lines of code",
        "Debugging algorithms",
      ],
      optionsFr: [
        "Rendre les algorithmes compliqués",
        "Analyser les exigences en temps et en espace",
        "Compter les lignes de code",
        "Déboguer les algorithmes",
      ],
      correctAnswer: "Analyzing time and space requirements",
      correctAnswerFr: "Analyser les exigences en temps et en espace",
      explanation:
        "Complexity analysis evaluates the computational resources (time and space) required by an algorithm.",
      explanationFr:
        "L'analyse de complexité évalue les ressources computationnelles (temps et espace) requises par un algorithme.",
      points: 10,
      order: 2,
    },
    {
      type: "mcq" as const,
      questionText: "What is A/B testing in software engineering research?",
      questionTextFr:
        "Qu'est-ce que le test A/B dans la recherche en génie logiciel?",
      options: [
        "Testing vitamins",
        "Comparing two versions to determine which performs better",
        "Alphabetical testing",
        "Testing grades",
      ],
      optionsFr: [
        "Tester des vitamines",
        "Comparer deux versions pour déterminer laquelle performe mieux",
        "Test alphabétique",
        "Tester des notes",
      ],
      correctAnswer: "Comparing two versions to determine which performs better",
      correctAnswerFr:
        "Comparer deux versions pour déterminer laquelle performe mieux",
      explanation:
        "A/B testing compares two variants to determine which performs better on specified metrics.",
      explanationFr:
        "Le test A/B compare deux variantes pour déterminer laquelle performe mieux sur des métriques spécifiées.",
      points: 10,
      order: 3,
    },
    {
      type: "mcq" as const,
      questionText: "What is statistical significance in CS experiments?",
      questionTextFr:
        "Qu'est-ce que la signification statistique dans les expériences informatiques?",
      options: [
        "Important findings",
        "Results unlikely due to random chance",
        "Large datasets",
        "Significant code changes",
      ],
      optionsFr: [
        "Des découvertes importantes",
        "Résultats peu probables dus au hasard",
        "Grands ensembles de données",
        "Changements de code importants",
      ],
      correctAnswer: "Results unlikely due to random chance",
      correctAnswerFr: "Résultats peu probables dus au hasard",
      explanation:
        "Statistical significance indicates that results are unlikely to have occurred by chance alone.",
      explanationFr:
        "La signification statistique indique que les résultats sont peu probables d'être survenus par hasard seul.",
      points: 10,
      order: 4,
    },
    {
      type: "mcq" as const,
      questionText: "What is reproducibility in CS research?",
      questionTextFr:
        "Qu'est-ce que la reproductibilité dans la recherche en informatique?",
      options: [
        "Copying results",
        "Ability for others to replicate experiments and obtain similar results",
        "Reusing code",
        "Repeating the same experiment",
      ],
      optionsFr: [
        "Copier des résultats",
        "Capacité pour d'autres de répliquer les expériences et obtenir des résultats similaires",
        "Réutiliser du code",
        "Répéter la même expérience",
      ],
      correctAnswer:
        "Ability for others to replicate experiments and obtain similar results",
      correctAnswerFr:
        "Capacité pour d'autres de répliquer les expériences et obtenir des résultats similaires",
      explanation:
        "Reproducibility means other researchers can replicate your experiments and verify your results.",
      explanationFr:
        "La reproductibilité signifie que d'autres chercheurs peuvent répliquer vos expériences et vérifier vos résultats.",
      points: 10,
      order: 5,
    },
  ],

  "publishing-presentation": [
    {
      type: "mcq" as const,
      questionText: "What is peer review?",
      questionTextFr: "Qu'est-ce que l'évaluation par les pairs?",
      options: [
        "Friends reviewing your work",
        "Expert evaluation of research before publication",
        "Reviewing your classmates",
        "Self-evaluation",
      ],
      optionsFr: [
        "Des amis évaluant votre travail",
        "Évaluation experte de la recherche avant publication",
        "Évaluer vos camarades de classe",
        "Auto-évaluation",
      ],
      correctAnswer: "Expert evaluation of research before publication",
      correctAnswerFr:
        "Évaluation experte de la recherche avant publication",
      explanation:
        "Peer review is the evaluation of research by experts in the field before publication.",
      explanationFr:
        "L'évaluation par les pairs est l'évaluation de la recherche par des experts du domaine avant publication.",
      points: 10,
      order: 1,
    },
    {
      type: "mcq" as const,
      questionText: "What is a rebuttal in the review process?",
      questionTextFr:
        "Qu'est-ce qu'une réfutation dans le processus d'évaluation?",
      options: [
        "Rejecting all criticism",
        "Author's response addressing reviewer concerns",
        "A second submission",
        "Arguing with editors",
      ],
      optionsFr: [
        "Rejeter toute critique",
        "Réponse de l'auteur adressant les préoccupations des évaluateurs",
        "Une deuxième soumission",
        "Argumenter avec les éditeurs",
      ],
      correctAnswer: "Author's response addressing reviewer concerns",
      correctAnswerFr:
        "Réponse de l'auteur adressant les préoccupations des évaluateurs",
      explanation:
        "A rebuttal is the author's formal response to reviewer comments and concerns.",
      explanationFr:
        "Une réfutation est la réponse formelle de l'auteur aux commentaires et préoccupations des évaluateurs.",
      points: 10,
      order: 2,
    },
    {
      type: "mcq" as const,
      questionText: "What makes an effective research presentation?",
      questionTextFr:
        "Qu'est-ce qui rend une présentation de recherche efficace?",
      options: [
        "Reading slides word-for-word",
        "Clear narrative, visual aids, and engaging delivery",
        "Using maximum text on slides",
        "Avoiding eye contact",
      ],
      optionsFr: [
        "Lire les diapositives mot à mot",
        "Récit clair, aides visuelles et présentation engageante",
        "Utiliser le maximum de texte sur les diapositives",
        "Éviter le contact visuel",
      ],
      correctAnswer: "Clear narrative, visual aids, and engaging delivery",
      correctAnswerFr:
        "Récit clair, aides visuelles et présentation engageante",
      explanation:
        "Effective presentations combine clear storytelling with good visuals and engaging delivery.",
      explanationFr:
        "Les présentations efficaces combinent une narration claire avec de bonnes visuelles et une présentation engageante.",
      points: 10,
      order: 3,
    },
    {
      type: "mcq" as const,
      questionText: "What is an acceptance rate in conference rankings?",
      questionTextFr:
        "Qu'est-ce qu'un taux d'acceptation dans les classements de conférences?",
      options: [
        "How many people attend",
        "Percentage of submitted papers that are accepted",
        "Speaker acceptance",
        "Venue capacity",
      ],
      optionsFr: [
        "Combien de personnes assistent",
        "Pourcentage d'articles soumis qui sont acceptés",
        "Acceptation des conférenciers",
        "Capacité du lieu",
      ],
      correctAnswer: "Percentage of submitted papers that are accepted",
      correctAnswerFr: "Pourcentage d'articles soumis qui sont acceptés",
      explanation:
        "Acceptance rate indicates the selectivity of a conference based on the ratio of accepted to submitted papers.",
      explanationFr:
        "Le taux d'acceptation indique la sélectivité d'une conférence basée sur le ratio d'articles acceptés sur soumis.",
      points: 10,
      order: 4,
    },
    {
      type: "mcq" as const,
      questionText: "What is a camera-ready version?",
      questionTextFr: "Qu'est-ce qu'une version prête pour l'impression?",
      options: [
        "A paper with photos",
        "Final version formatted for publication",
        "Paper reviewed by photographers",
        "Draft version",
      ],
      optionsFr: [
        "Un article avec des photos",
        "Version finale formatée pour publication",
        "Article évalué par des photographes",
        "Version brouillon",
      ],
      correctAnswer: "Final version formatted for publication",
      correctAnswerFr: "Version finale formatée pour publication",
      explanation:
        "Camera-ready is the final, properly formatted version of a paper ready for publication.",
      explanationFr:
        "La version prête pour l'impression est la version finale correctement formatée d'un article prêt pour publication.",
      points: 10,
      order: 5,
    },
  ],

  // Course 3: Introduction to Academic Writing
  "academic-writing-basics": [
    {
      type: "mcq" as const,
      questionText: "What characterizes academic writing style?",
      questionTextFr: "Qu'est-ce qui caractérise le style d'écriture académique?",
      options: [
        "Casual and conversational",
        "Formal, objective, and evidence-based",
        "Creative and emotional",
        "Personal opinions",
      ],
      optionsFr: [
        "Décontracté et conversationnel",
        "Formel, objectif et basé sur des preuves",
        "Créatif et émotionnel",
        "Opinions personnelles",
      ],
      correctAnswer: "Formal, objective, and evidence-based",
      correctAnswerFr: "Formel, objectif et basé sur des preuves",
      explanation:
        "Academic writing is characterized by formal language, objectivity, and reliance on evidence.",
      explanationFr:
        "L'écriture académique est caractérisée par un langage formel, l'objectivité et la dépendance aux preuves.",
      points: 10,
      order: 1,
    },
    {
      type: "mcq" as const,
      questionText: "What is the purpose of a thesis statement?",
      questionTextFr: "Quel est l'objectif d'un énoncé de thèse?",
      options: [
        "To ask questions",
        "To present the main argument of the paper",
        "To list references",
        "To introduce the author",
      ],
      optionsFr: [
        "Poser des questions",
        "Présenter l'argument principal de l'article",
        "Lister les références",
        "Présenter l'auteur",
      ],
      correctAnswer: "To present the main argument of the paper",
      correctAnswerFr: "Présenter l'argument principal de l'article",
      explanation:
        "A thesis statement clearly presents the main argument or claim of an academic paper.",
      explanationFr:
        "Un énoncé de thèse présente clairement l'argument ou la revendication principale d'un article académique.",
      points: 10,
      order: 2,
    },
    {
      type: "mcq" as const,
      questionText: "What should academic paragraphs contain?",
      questionTextFr: "Que devraient contenir les paragraphes académiques?",
      options: [
        "Random thoughts",
        "Topic sentence, evidence, and analysis",
        "Only opinions",
        "Unrelated ideas",
      ],
      optionsFr: [
        "Pensées aléatoires",
        "Phrase sujet, preuves et analyse",
        "Seulement des opinions",
        "Idées non liées",
      ],
      correctAnswer: "Topic sentence, evidence, and analysis",
      correctAnswerFr: "Phrase sujet, preuves et analyse",
      explanation:
        "Academic paragraphs should have a clear topic sentence, supporting evidence, and analytical commentary.",
      explanationFr:
        "Les paragraphes académiques devraient avoir une phrase sujet claire, des preuves à l'appui et un commentaire analytique.",
      points: 10,
      order: 3,
    },
    {
      type: "mcq" as const,
      questionText: "What is academic tone?",
      questionTextFr: "Qu'est-ce que le ton académique?",
      options: [
        "Emotional and passionate",
        "Neutral, objective, and professional",
        "Casual and friendly",
        "Persuasive and biased",
      ],
      optionsFr: [
        "Émotionnel et passionné",
        "Neutre, objectif et professionnel",
        "Décontracté et amical",
        "Persuasif et biaisé",
      ],
      correctAnswer: "Neutral, objective, and professional",
      correctAnswerFr: "Neutre, objectif et professionnel",
      explanation:
        "Academic tone should be neutral, objective, and maintain professional distance.",
      explanationFr:
        "Le ton académique devrait être neutre, objectif et maintenir une distance professionnelle.",
      points: 10,
      order: 4,
    },
    {
      type: "mcq" as const,
      questionText: "What is signposting in academic writing?",
      questionTextFr: "Qu'est-ce que la signalisation dans l'écriture académique?",
      options: [
        "Using road signs",
        "Guiding readers through the text with transitional phrases",
        "Posting on social media",
        "Creating bullet points",
      ],
      optionsFr: [
        "Utiliser des panneaux routiers",
        "Guider les lecteurs à travers le texte avec des phrases de transition",
        "Publier sur les réseaux sociaux",
        "Créer des puces",
      ],
      correctAnswer:
        "Guiding readers through the text with transitional phrases",
      correctAnswerFr:
        "Guider les lecteurs à travers le texte avec des phrases de transition",
      explanation:
        "Signposting uses transitional phrases and clear structure to guide readers through your argument.",
      explanationFr:
        "La signalisation utilise des phrases de transition et une structure claire pour guider les lecteurs à travers votre argument.",
      points: 10,
      order: 5,
    },
  ],

  "citation-referencing": [
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
      order: 1,
    },
    {
      type: "mcq" as const,
      questionText: "What is APA citation style primarily used for?",
      questionTextFr:
        "Pour quoi le style de citation APA est-il principalement utilisé?",
      options: [
        "Literature and humanities",
        "Social sciences and psychology",
        "History",
        "Law",
      ],
      optionsFr: [
        "Littérature et sciences humaines",
        "Sciences sociales et psychologie",
        "Histoire",
        "Droit",
      ],
      correctAnswer: "Social sciences and psychology",
      correctAnswerFr: "Sciences sociales et psychologie",
      explanation:
        "APA (American Psychological Association) style is commonly used in social sciences and psychology.",
      explanationFr:
        "Le style APA (American Psychological Association) est couramment utilisé dans les sciences sociales et la psychologie.",
      points: 10,
      order: 2,
    },
    {
      type: "mcq" as const,
      questionText: "What is a bibliography?",
      questionTextFr: "Qu'est-ce qu'une bibliographie?",
      options: [
        "A biography of the author",
        "List of all sources consulted or cited",
        "A book about libraries",
        "Table of contents",
      ],
      optionsFr: [
        "Une biographie de l'auteur",
        "Liste de toutes les sources consultées ou citées",
        "Un livre sur les bibliothèques",
        "Table des matières",
      ],
      correctAnswer: "List of all sources consulted or cited",
      correctAnswerFr: "Liste de toutes les sources consultées ou citées",
      explanation:
        "A bibliography is a comprehensive list of sources used or consulted in research.",
      explanationFr:
        "Une bibliographie est une liste complète des sources utilisées ou consultées dans la recherche.",
      points: 10,
      order: 3,
    },
    {
      type: "mcq" as const,
      questionText: "What is the difference between a direct quote and paraphrasing?",
      questionTextFr:
        "Quelle est la différence entre une citation directe et une paraphrase?",
      options: [
        "No difference",
        "Direct quote uses exact words; paraphrase restates in own words",
        "Paraphrasing is plagiarism",
        "Direct quotes don't need citations",
      ],
      optionsFr: [
        "Aucune différence",
        "Citation directe utilise les mots exacts; paraphrase reformule dans ses propres mots",
        "La paraphrase est du plagiat",
        "Les citations directes n'ont pas besoin de citations",
      ],
      correctAnswer:
        "Direct quote uses exact words; paraphrase restates in own words",
      correctAnswerFr:
        "Citation directe utilise les mots exacts; paraphrase reformule dans ses propres mots",
      explanation:
        "Direct quotes reproduce exact words, while paraphrasing restates ideas in your own words (both need citations).",
      explanationFr:
        "Les citations directes reproduisent les mots exacts, tandis que la paraphrase reformule les idées dans vos propres mots (les deux nécessitent des citations).",
      points: 10,
      order: 4,
    },
    {
      type: "mcq" as const,
      questionText: "When should you cite a source?",
      questionTextFr: "Quand devriez-vous citer une source?",
      options: [
        "Only for direct quotes",
        "When using others' ideas, data, or words",
        "Never",
        "Only if asked",
      ],
      optionsFr: [
        "Seulement pour les citations directes",
        "Lors de l'utilisation des idées, données ou mots d'autrui",
        "Jamais",
        "Seulement si demandé",
      ],
      correctAnswer: "When using others' ideas, data, or words",
      correctAnswerFr:
        "Lors de l'utilisation des idées, données ou mots d'autrui",
      explanation:
        "You must cite whenever you use others' ideas, data, words, or any information that isn't common knowledge.",
      explanationFr:
        "Vous devez citer chaque fois que vous utilisez les idées, données, mots ou toute information d'autrui qui n'est pas de notoriété publique.",
      points: 10,
      order: 5,
    },
  ],

  "writing-research-papers": [
    {
      type: "mcq" as const,
      questionText: "What is the purpose of an abstract?",
      questionTextFr: "Quel est l'objectif d'un résumé?",
      options: [
        "To confuse readers",
        "To provide a concise summary of the entire paper",
        "To list keywords",
        "To replace the introduction",
      ],
      optionsFr: [
        "Confondre les lecteurs",
        "Fournir un résumé concis de l'ensemble de l'article",
        "Lister les mots-clés",
        "Remplacer l'introduction",
      ],
      correctAnswer: "To provide a concise summary of the entire paper",
      correctAnswerFr:
        "Fournir un résumé concis de l'ensemble de l'article",
      explanation:
        "An abstract provides a brief, comprehensive summary of the paper's content, methods, and findings.",
      explanationFr:
        "Un résumé fournit un bref résumé complet du contenu, des méthodes et des résultats de l'article.",
      points: 10,
      order: 1,
    },
    {
      type: "mcq" as const,
      questionText:
        "What should be included in a research paper introduction?",
      questionTextFr:
        "Que devrait inclure l'introduction d'un article de recherche?",
      options: [
        "Only the thesis statement",
        "Background, context, and thesis statement",
        "Detailed methodology",
        "All references",
      ],
      optionsFr: [
        "Seulement l'énoncé de thèse",
        "Contexte, arrière-plan et énoncé de thèse",
        "Méthodologie détaillée",
        "Toutes les références",
      ],
      correctAnswer: "Background, context, and thesis statement",
      correctAnswerFr: "Contexte, arrière-plan et énoncé de thèse",
      explanation:
        "Introductions should provide background, establish context, and present the thesis statement.",
      explanationFr:
        "Les introductions devraient fournir le contexte, établir l'arrière-plan et présenter l'énoncé de thèse.",
      points: 10,
      order: 2,
    },
    {
      type: "mcq" as const,
      questionText: "What is a literature review section?",
      questionTextFr: "Qu'est-ce qu'une section de revue de littérature?",
      options: [
        "A book review",
        "Critical analysis of existing research on the topic",
        "A list of books read",
        "Author biographies",
      ],
      optionsFr: [
        "Une critique de livre",
        "Analyse critique de la recherche existante sur le sujet",
        "Une liste de livres lus",
        "Biographies d'auteurs",
      ],
      correctAnswer: "Critical analysis of existing research on the topic",
      correctAnswerFr:
        "Analyse critique de la recherche existante sur le sujet",
      explanation:
        "A literature review critically analyzes and synthesizes existing research relevant to your topic.",
      explanationFr:
        "Une revue de littérature analyse et synthétise de manière critique la recherche existante pertinente à votre sujet.",
      points: 10,
      order: 3,
    },
    {
      type: "mcq" as const,
      questionText: "What should a conclusion section do?",
      questionTextFr: "Que devrait faire une section de conclusion?",
      options: [
        "Introduce new information",
        "Summarize findings and discuss implications",
        "Copy the introduction",
        "List all references",
      ],
      optionsFr: [
        "Introduire de nouvelles informations",
        "Résumer les résultats et discuter des implications",
        "Copier l'introduction",
        "Lister toutes les références",
      ],
      correctAnswer: "Summarize findings and discuss implications",
      correctAnswerFr: "Résumer les résultats et discuter des implications",
      explanation:
        "Conclusions should summarize key findings, discuss implications, and suggest future research directions.",
      explanationFr:
        "Les conclusions devraient résumer les principales conclusions, discuter des implications et suggérer des directions de recherche futures.",
      points: 10,
      order: 4,
    },
    {
      type: "mcq" as const,
      questionText: "What is the purpose of a methodology section?",
      questionTextFr: "Quel est l'objectif d'une section méthodologie?",
      options: [
        "To confuse readers",
        "To explain how the research was conducted",
        "To present results",
        "To cite sources",
      ],
      optionsFr: [
        "Confondre les lecteurs",
        "Expliquer comment la recherche a été menée",
        "Présenter les résultats",
        "Citer des sources",
      ],
      correctAnswer: "To explain how the research was conducted",
      correctAnswerFr: "Expliquer comment la recherche a été menée",
      explanation:
        "The methodology section describes the research methods, procedures, and approaches used in the study.",
      explanationFr:
        "La section méthodologie décrit les méthodes de recherche, procédures et approches utilisées dans l'étude.",
      points: 10,
      order: 5,
    },
  ],
};

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
      const lessons = lessonsTemplate.map((template, index) => {
        // Get content for this lesson from the contentByModule mapping
        const moduleContent = contentByModule[moduleData.slug];
        const lessonContent = moduleContent ? moduleContent[template.order] : faker.lorem.paragraphs(5, "<br/><br/>");
        
        return {
          title: `${moduleData.title} - Lesson ${index + 1}`,
          titleFr: `${moduleData.titleFr} - Leçon ${index + 1}`,
          description: faker.lorem.sentence(15),
          descriptionFr: faker.lorem.sentence(15),
          type: template.type,
          content: lessonContent,
          contentFr: lessonContent,
          duration: template.duration,
          order: template.order,
          isPreview: template.isPreview,
          hasQuiz: template.hasQuiz,
        };
      });

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

      // Get questions for this module's slug
      const moduleQuestions = quizQuestionsByModule[courseModule.slug] || [];

      if (moduleQuestions.length === 0) {
        console.warn(`⚠️  No questions found for module: ${courseModule.slug}`);
        continue;
      }

      for (const lesson of lessonsWithQuiz) {
        const quiz = await Quiz.create({
          moduleId: courseModule._id,
          lessonId: lesson._id,
          title: `${lesson.title} - Quiz`,
          titleFr: `${lesson.titleFr} - Quiz`,
          description: `Test your knowledge on ${lesson.title}`,
          descriptionFr: `Testez vos connaissances sur ${lesson.titleFr}`,
          questions: moduleQuestions,
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
