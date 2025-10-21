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
        type: "reading" as const,
        content: `# 🧭 Module 1: Understanding the Concept of Research

## Lesson 1.1: What is Research?

**Objective:** To introduce learners to the formal definition, characteristics, and purposes of research, distinguishing it from everyday inquiry.

---

### **Topic 1: Definition of Research**

Research is a systematic and logical process of inquiry and investigation. It involves collecting, analyzing, and interpreting data to answer questions, solve problems, or understand a phenomenon.  
The word *“research”* is derived from the French *“rechercher,”* meaning “to seek out” or “to search again.” This implies a careful and structured search for new knowledge.

**Formal Definition:**  
> Research is a systematic investigative process employed to increase or revise current knowledge by discovering new facts. It is not just about gathering information; it is about creating new knowledge that is verifiable and built upon previous knowledge.

At its core, research is about moving from the known to the unknown with a clear plan.

---

### **Topic 2: Characteristics of Good Research**

A good research study must possess several key characteristics:

- **Systematic:** Follows a structured, planned, and orderly process.  
- **Empirical:** Based on observation or experience; supported by evidence.  
- **Logical:** Guided by reasoning (inductive and deductive).  
- **Replicable and Transmittable:** Procedures and findings can be repeated and verified.  
- **Objective:** Free from personal bias or emotions.  
- **Controlled:** Ensures variables are managed for accurate results.  
- **Rigorous:** Follows justified and appropriate methods to find answers.

---

### **Topic 3: Purposes of Research**

Research serves various purposes, broadly categorized as:

1. **Exploratory Research:** Conducted to explore a poorly understood problem or generate new ideas.  
   *Example:* Studying customer preferences before launching a new product.

2. **Descriptive Research:** Aims to describe a situation, phenomenon, or population accurately.  
   *Example:* Conducting a national census.

3. **Explanatory (Causal) Research:** Seeks to explain why things happen by identifying cause-and-effect relationships.  
   *Example:* Studying the relationship between study hours and exam scores.

4. **Predictive Research:** Uses existing data to forecast future trends or outcomes.  
   *Example:* Predicting future sales based on marketing spend.

---

### **Topic 4: Difference Between Everyday Inquiry and Scientific Research**

| **Feature** | **Everyday Inquiry** | **Scientific Research** |
|--------------|----------------------|---------------------------|
| **Approach** | Intuitive, casual, subjective | Systematic, structured, objective |
| **Observation** | Casual and uncontrolled | Deliberate, controlled, systematic |
| **Hypotheses** | Vague guesses or assumptions | Testable and structured |
| **Evidence** | Based on personal experience or anecdotes | Based on empirical, verifiable data |
| **Bias** | Prone to personal biases | Actively minimizes bias |
| **Conclusion** | Often final and resistant to change | Tentative; open to revision |
| **Example** | Asking a friend if a coffee shop is good | Conducting a customer satisfaction study using a survey |

---

### **Topic 5: Examples from Different Fields**

- **Natural Sciences (Biology):** Testing a new vaccine’s effectiveness.  
- **Social Sciences (Sociology):** Studying how social media affects youth political engagement.  
- **Engineering:** Designing efficient materials for solar panels.  
- **Business:** Using A/B testing to optimize website conversion rates.

---

## Lesson 1.2: Importance of Research

**Objective:** To help learners appreciate the critical role of research in advancing knowledge, shaping society, solving complex problems, and understanding researcher responsibilities.

---

### **Topic 1: Role of Research in Knowledge Generation**

Research is the engine of knowledge creation — transforming speculation into proven understanding.

- **Building on Existing Knowledge:** Builds upon previous findings to expand understanding.  
- **Challenging Previous Findings:** Self-correcting nature refines and improves old theories.  
- **Filling Knowledge Gaps:** Explores unanswered questions.  
- **Developing Theories and Frameworks:** Creates models that explain complex phenomena.

---

### **Topic 2: Impact of Research on Society, Policy, and Innovation**

#### **Impact on Society:**
- **Health and Medicine:** Leads to vaccines, treatments, and longer lifespans.  
- **Technology:** Powers innovations like smartphones and the internet.  
- **Understanding Ourselves:** Enhances understanding of human behavior and culture.

#### **Impact on Policy:**
- **Evidence-Based Decision-Making:** Informs rational government and organizational policies.  
  - *Example:* Economic research shapes fiscal policy; environmental studies guide climate policies.

#### **Impact on Innovation:**
- **Driving Economic Growth:** R&D creates new industries and jobs.  
- **Innovation Pipeline:** Foundational studies lead to future breakthroughs (e.g., quantum computing).

---

### **Topic 3: The Link Between Research and Problem-Solving**

Research is structured problem-solving through:

1. **Defining the Problem:** Framing the issue precisely.  
2. **Diagnosing the Cause:** Using data to find root causes.  
3. **Developing and Testing Solutions:** Experimenting and evaluating potential solutions.  
4. **Evaluating the Outcome:** Measuring and refining the results for continuous improvement.

---

### **Topic 4: Ethical and Social Responsibilities of Researchers**

#### **Ethical Responsibilities:**
- **Integrity:** Honesty in reporting data; no falsification or plagiarism.  
- **Participant Welfare:** Respecting consent, privacy, and dignity.  
- **Objectivity:** Avoiding bias and maintaining neutrality.

#### **Social Responsibilities:**
- **Impact Awareness:** Considering how findings are used or misused.  
- **Contribution to the Public Good:** Conducting research that benefits society and promotes accessibility of findings.

---

## Lesson 1.3: Characteristics of a Good Researcher

**Objective:** To identify the personal and professional qualities essential for effective, rigorous, and ethical research.

---

### **Introduction**

The researcher is the heart of the research process. Their mindset, values, and discipline determine the quality of outcomes.

---

### **Topic 1: Curiosity and Critical Thinking**

- **Curiosity (The Engine):** A constant desire to understand “why” and “how.”  
  - *Examples of curiosity-driven questions:*  
    - Why does this happen?  
    - Can we do this better?  
    - What if we changed our perspective?

- **Critical Thinking (The Steering Wheel):** The ability to analyze, evaluate, and question information objectively.  
  - Analyze data critically.  
  - Evaluate arguments logically.  
  - Recognize biases and question assumptions.

---

### **Topic 2: Objectivity and Honesty**

- **Objectivity:**  
  - Let evidence, not emotion, guide conclusions.  
  - Avoid manipulating data to confirm personal beliefs.

- **Honesty:**  
  - Never fabricate or falsify data.  
  - Cite sources accurately to avoid plagiarism.  
  - Acknowledge study limitations transparently.

---

### **Topic 3: Perseverance and Time Management**

- **Perseverance:**  
  - Embrace setbacks as learning opportunities.  
  - Maintain patience and determination throughout long projects.

- **Time Management:**  
  - Set achievable goals and deadlines.  
  - Break large projects into smaller tasks.  
  - Keep detailed records and balance multiple tasks efficiently.

---

### **Topic 4: Ethical Integrity**

Ethical integrity is the researcher's moral compass.

- Prioritize participant welfare and rights.  
- Uphold accountability and transparency.  
- Follow professional ethical standards.  
- Consider societal impacts before publication or implementation.

> A brilliant mind without ethical integrity can cause more harm than good.  
> The credibility of research relies on the honesty and responsibility of researchers.

---

## ✅ **Conclusion**

This concludes **Module 1: Understanding the Concept of Research**.  
You now understand:
- What research is and its main characteristics.  
- Why research matters in knowledge, society, and innovation.  
- The ethical and personal qualities of a good researcher.
`,
        duration: 15,
        order: 1,
        isPreview: false,
      },
      {
        title: "Philosophical Foundations of Research",
        titleFr: "Types de recherche",
        description:
          "To introduce learners to the core philosophical assumptions (paradigms, ontology, epistemology, and axiology) that underpin all research.",
        descriptionFr:
          "Explorez la recherche qualitative, quantitative et les méthodes mixtes",
        type: "reading" as const,
        content: `

## Lesson 2.1: Research Paradigms

**Objective:**  
To explain what research paradigms are and to introduce the three major paradigms that guide scientific and social inquiry: **positivism, interpretivism, and pragmatism**.

---

### 🔹 Topic 1: Definition of Paradigms

In the context of research, a *paradigm* is a fundamental model or frame of reference that shapes how we see the world and how we conduct our research. It is a set of shared beliefs, assumptions, and principles that influence what is studied, how it is studied, and how the results are interpreted.

Think of a paradigm as a pair of glasses — the color and prescription of the lenses determine how you see everything. Similarly, a researcher's chosen paradigm influences their entire approach: from the questions they ask to the methods they use.  
It’s the **"worldview"** of the researcher. Understanding paradigms helps explain why different studies are designed in such different ways.

---

### 🔹 Topic 2: Overview of the Three Main Paradigms

While there are many philosophical paradigms, most research can be understood through three major ones:

#### 1. **Positivism**
The positivist paradigm is the foundation of the traditional scientific method. It assumes that there is a single, objective reality that exists independently of our perceptions. The goal is to discover this reality and the universal laws that govern it.

- **Core Beliefs:** Reality is objective, measurable, and predictable.  
- **Researcher's Role:** Neutral, detached observer.  
- **Typical Methods:** Quantitative (controlled experiments, surveys, statistical analysis).  
- **Example:** A medical researcher conducts a double-blind clinical trial to test a drug’s effectiveness under controlled conditions.

#### 2. **Interpretivism (Constructivism)**
Interpretivism contrasts positivism. It assumes that reality is socially constructed and subjective. There are multiple realities created by individuals and groups based on their experiences, cultures, and interpretations.

- **Core Beliefs:** Reality is subjective, complex, and socially constructed.  
- **Researcher's Role:** Active participant who interprets meaning.  
- **Typical Methods:** Qualitative (interviews, observations, case studies).  
- **Example:** An anthropologist lives within a community to understand its cultural rituals and social structures.

#### 3. **Pragmatism**
Pragmatism offers a middle ground. It focuses on *what works* to solve a particular problem rather than abstract debates about reality. The research question drives the choice of methods.

- **Core Beliefs:** Reality is practical and problem-centered.  
- **Researcher's Role:** Practical problem-solver, method-flexible.  
- **Typical Methods:** Mixed methods (combining quantitative & qualitative).  
- **Example:** Educational researchers use surveys to measure outcomes and interviews to explore reasons behind them.

---

### 🔹 Topic 3: Comparison of Paradigms

| **Feature** | **Positivism** | **Interpretivism** | **Pragmatism** |
|--------------|----------------|--------------------|----------------|
| **View of Reality** | Objective, single, measurable | Subjective, multiple, socially constructed | Practical, problem-centered |
| **Goal of Research** | To explain, predict, and control | To understand and interpret meaning | To solve practical problems |
| **Researcher's Role** | Detached observer | Engaged participant | Flexible problem-solver |
| **Common Methods** | Quantitative | Qualitative | Mixed methods |
| **Associated Reasoning** | Deductive (theory → data) | Inductive (data → theory) | Abductive (moving between data & theory) |

---

## Lesson 2.2: Research Ontology, Epistemology, and Axiology

**Objective:**  
To define the core philosophical concepts of **ontology**, **epistemology**, and **axiology**, and explain how they relate to a researcher's choice of paradigm and methodology.

---

### 🔹 Introduction
If a paradigm is the researcher's overall *worldview*, then ontology, epistemology, and axiology are the specific philosophical beliefs that make up that worldview.  
Understanding these helps deconstruct a paradigm into its core components.

---

### 🔹 Topic 1: Ontology (The Nature of Reality)

Ontology asks: **"What exists?"** or **"What is the nature of being?"**

In research, the ontological question is whether there is one objective reality or multiple subjective realities.

- **Objectivism:**  
  Ontological stance of *Positivism.*  
  Reality exists independently of perception; it can be discovered through observation.  

- **Constructivism / Subjectivism:**  
  Ontological stance of *Interpretivism.*  
  Reality is constructed through social interaction and meaning-making.

---

### 🔹 Topic 2: Epistemology (The Nature of Knowledge)

Epistemology asks: **"What can we know?"** and **"How can we know it?"**

It deals with how a researcher gains knowledge about reality and is directly linked to ontology.

- **Objectivist Epistemology (Positivism):**  
  Knowledge is discovered through objective measurement and observation.  

- **Constructivist Epistemology (Interpretivism):**  
  Knowledge is created through interaction and interpretation of human experiences.

---

### 🔹 Topic 3: Axiology (The Role of Values in Research)

Axiology concerns **values and ethics** — it asks: *"What role do values play in inquiry?"*

- **Value-Free (Positivism):**  
  Research should be neutral and objective; values must not influence findings.

- **Value-Laden (Interpretivism & Pragmatism):**  
  Research is inherently influenced by the researcher's values and context.  
  Emphasis is on transparency (reflexivity) rather than eliminating bias.

---

### 🔹 Topic 4: Relationship Among Ontology, Epistemology, and Methodology

These philosophical concepts form a logical chain — the **“Golden Thread”** of research design:

\`\`\`
Paradigm → Ontology → Epistemology → Methodology → Methods
\`\`\`

- **Paradigm:** The worldview (e.g., Positivism)  
- **Ontology:** Nature of reality (e.g., objective)  
- **Epistemology:** Nature of knowledge (e.g., measurable through observation)  
- **Methodology:** Overall research strategy (e.g., experimental)  
- **Methods:** Tools used (e.g., surveys, experiments)

**Example Chain**

- **Paradigm:** Interpretivism  
- **Ontology:** Reality is subjective and socially constructed  
- **Epistemology:** Knowledge is gained through understanding people’s lived experiences  
- **Methodology:** Ethnography  
- **Methods:** Participant observation & unstructured interviews  

Understanding this chain helps researchers design coherent, defensible studies and critically evaluate others' work.`,
        contentFr:
          "<h2>Types de recherche</h2><p>Il existe trois principaux types de recherche: qualitative, quantitative et méthodes mixtes...</p>",
        duration: 30,
        order: 2,
        isPreview: false,
      },
      {
        title: "Types and Approaches of Research",
        titleFr: "Ressources de recherche",
        description:
          "To classify the major types of research and provide a detailed understanding of the three main research approaches",
        descriptionFr:
          "Téléchargez des modèles et des guides pour votre recherche",
        type: "reading" as const,
        content: ` **Introduction**  
Research is not a monolithic activity. Studies can be categorized in several ways, often along different dimensions simultaneously. Understanding these classifications helps you quickly grasp the intent and design of a research paper — and choose the right approach for your own questions.

---

## Lesson 3.1: Classifications of Research

---

### 🔹 Topic 1: Basic vs. Applied Research
**Classification Basis:** Purpose or objective of the research.

#### **Basic Research (Fundamental or Pure Research)**
- **Goal:** To expand existing knowledge and develop or refine theories. It is curiosity-driven, seeking understanding without immediate practical application.  
- **Question:** "Why do things happen the way they do?"  
- **Example:** A physicist studying the behavior of subatomic particles to understand fundamental laws of physics.

#### **Applied Research**
- **Goal:** To solve specific, practical problems and produce findings that can be applied directly.  
- **Question:** "How can we solve this problem?"  
- **Example:** An agricultural researcher testing fertilizers to determine which yields the highest crop output.

---

### 🔹 Topic 2: Quantitative vs. Qualitative Research
**Classification Basis:** The nature of the data collected.

#### **Quantitative Research**
- Gathers **numerical data** analyzed statistically.  
- Focuses on **measurement**, **relationships between variables**, and **generalization** to larger populations.  
- Example: Measuring income levels and education attainment across regions.

#### **Qualitative Research**
- Gathers **non-numerical data** (words, images, observations).  
- Focuses on **depth**, **context**, and **meaning** rather than generalization.  
- Example: Conducting interviews to explore people’s lived experiences.

---

### 🔹 Topic 3: Experimental vs. Non-Experimental Research
**Classification Basis:** The researcher’s control or manipulation of variables.

#### **Experimental Research**
- **Design:** Researcher introduces an *intervention* (independent variable) and measures its *effect* (dependent variable).  
- **Goal:** To establish cause-and-effect relationships.  
- **Example:** Comparing test results between students using a new app vs. traditional teaching.

#### **Non-Experimental Research**
- **Design:** Observes variables as they occur naturally, without manipulation.  
- **Goal:** To describe phenomena or explore relationships.  
- **Example:** Surveying students’ study hours and comparing with academic performance.

---

### 🔹 Topic 4: Descriptive, Analytical, Exploratory & Explanatory Research

| **Type** | **Goal** | **Example** |
|-----------|-----------|--------------|
| **Exploratory** | Explore an unclear problem; gain insights and hypotheses for future study. | Conducting interviews to understand a new social trend. |
| **Descriptive** | Describe characteristics of a population or event (“what,” “where,” “when”). | A market survey describing consumer demographics. |
| **Explanatory (Causal)** | Explain “why” — determine cause-and-effect relationships. | Experimenting to test if a new drug reduces symptoms. |
| **Analytical** | Critically analyze existing data or literature. | Reviewing prior studies to synthesize findings on climate change. |

---

## Lesson 3.2: Quantitative Research

**Objective:**  
To understand the nature, logic, and core components of quantitative research.

---

### 🔹 Topic 1: Nature of Quantitative Research
Grounded in the **positivist paradigm**, quantitative research emphasizes **objectivity**, **measurement**, and **statistical analysis**.  
It tests theories and hypotheses using structured tools like surveys and experiments.

---

### 🔹 Topic 2: Deductive Reasoning
Quantitative research follows **deductive (“top-down”) reasoning**:

1. **Start with a Theory** – General idea about how the world works.  
2. **Formulate a Hypothesis** – A specific, testable statement.  
3. **Collect Data** – Measure variables systematically.  
4. **Analyze Results** – Accept or reject the hypothesis.  

\`\`\`
Theory → Hypothesis → Observation → Confirmation
\`\`\`

---

### 🔹 Topic 3: Measurement, Variables, and Hypothesis Testing

- **Variable:** Any characteristic that can vary or be measured.  
  - **Independent Variable (IV):** Manipulated cause.  
  - **Dependent Variable (DV):** Observed effect.  

**Measurement:** Assigning numbers to variables based on defined rules.

**Hypothesis Testing:**  
- **H₀ (Null Hypothesis):** No effect or relationship.  
- **H₁ (Alternative Hypothesis):** There is an effect or relationship.  
Statistical analysis determines if results are significant enough to reject H₀.

---

### 🔹 Topic 4: Data Collection Tools
- **Questionnaires/Surveys:** Structured, close-ended questions (e.g., Likert scales).  
- **Experiments:** Controlled tests to measure effects of variables.  
- **Structured Observation:** Systematic recording of observed behavior or events.

---

### 🔹 Topic 5: Data Analysis Basics

| **Type** | **Purpose** | **Examples** |
|-----------|--------------|---------------|
| **Descriptive Statistics** | Summarize and describe data. | Mean, median, mode, standard deviation. |
| **Inferential Statistics** | Draw conclusions from a sample to a population. | T-tests, chi-square tests, regression analysis. |

---

## Lesson 3.3: Qualitative Research

**Objective:**  
To explain the nature, logic, and components of qualitative research.

---

### 🔹 Topic 1: Nature of Qualitative Research
Grounded in the **interpretivist paradigm**, qualitative research explores **meaning**, **context**, and **experience**.  
Data is often textual, visual, or verbal — collected through direct engagement in the participant’s environment.

---

### 🔹 Topic 2: Inductive Reasoning
Qualitative research uses **inductive (“bottom-up”) reasoning**:

1. **Collect Observations:** Gather rich, detailed data.  
2. **Identify Patterns:** Detect recurring ideas or behaviors.  
3. **Formulate Hypothesis:** Develop tentative explanations.  
4. **Build Theory:** Derive conceptual understanding from data.

\`\`\`
Observation → Pattern → Hypothesis → Theory
\`\`\`

---

### 🔹 Topic 3: Common Methods
- **In-depth Interviews:** Open-ended conversations exploring participants’ perspectives.  
- **Focus Groups:** Group discussions generating interactive insights.  
- **Observations:** Immersive fieldwork documenting real-world behaviors and events.

---

### 🔹 Topic 4: Data Interpretation (Themes and Patterns)
Qualitative data analysis involves identifying **themes** and **patterns**:

1. **Familiarization:** Immerse in data.  
2. **Coding:** Tag data with labels.  
3. **Theme Generation:** Cluster related codes.  
4. **Review & Define Themes:** Craft coherent narratives.

---

### 🔹 Topic 5: Ensuring Trustworthiness
Qualitative rigor is built on **trustworthiness**, using four criteria:

| **Criterion** | **Equivalent in Quantitative Research** | **Meaning** |
|----------------|------------------------------------------|-------------|
| **Credibility** | Internal Validity | Accuracy of representation |
| **Transferability** | External Validity | Applicability to other contexts |
| **Dependability** | Reliability | Stability and consistency of data |
| **Confirmability** | Objectivity | Freedom from researcher bias |

---

## Lesson 3.4: Mixed Methods Research

**Objective:**  
To describe how mixed methods combine quantitative and qualitative paradigms for comprehensive insights.

---

### 🔹 Topic 1: Combining Approaches
**Mixed Methods Research** (MMR) integrates both **quantitative** and **qualitative** data to capture the strengths of each.  
It is grounded in the **pragmatist paradigm**, emphasizing **“what works”** to answer complex research questions.

---

### 🔹 Topic 2: Common Design Types

| **Design Type** | **Description** | **Example** |
|------------------|-----------------|--------------|
| **Sequential** | One phase informs the next (e.g., qualitative → quantitative). | Use interviews to design a follow-up survey. |
| **Concurrent** | Collect both data types simultaneously and merge results. | Run surveys and interviews at the same time. |
| **Transformative** | Guided by social justice or theoretical framework. | Using feminist theory to design inclusive research. |

---

### 🔹 Topic 3: Strengths and Challenges

#### **Strengths**
- Provides richer, more comprehensive understanding.  
- Answers broader research questions.  
- Enables triangulation — validating results through multiple methods.  
- Compensates for the weaknesses of individual approaches.

#### **Challenges**
- Time-consuming and complex to execute.  
- Requires dual expertise in quantitative and qualitative methods.  
- Integration and interpretation can be conceptually demanding.

---

✅ **This completes Module 3: Classifications and Approaches to Research.**  
You now understand the key distinctions and integrations among **quantitative, qualitative, and mixed methods** approaches.`,
        duration: 10,
        order: 3,
        isPreview: false,
      },
      {
        title: "The Research Process",
        titleFr: "Effectuer des recherches de littérature",
        description:
          "To provide a comprehensive, step-by-step guide to the entire research process",
        descriptionFr:
          "Apprenez des stratégies efficaces pour rechercher dans les bases de données académiques et les bibliothèques.",
        type: "reading" as const,
        content: `# **The Research Process**

The **research process** is a structured sequence of steps that guides a researcher from an initial question to a well-reasoned conclusion. While it is often presented as a linear list, in practice, it is a **cyclical and iterative process**—researchers may move back and forth between steps as their understanding deepens. However, this formal structure provides an essential roadmap for conducting **rigorous and logical research**.

---

## **Lesson 4.1: Steps in the Research Process**

The research journey can be broken down into **seven key steps**:

1. **Identifying a Research Problem**  
   This involves finding a gap in existing knowledge, a contradiction in previous findings, or a real-world problem needing a solution. A broad topic is narrowed down to a specific, researchable issue.

2. **Reviewing the Literature**  
   Understanding what is already known about your topic by systematically finding, reading, and synthesizing previous research.

3. **Formulating Objectives and Hypotheses**  
   Clearly stating what you intend to achieve. Develop specific research questions, measurable objectives, and testable hypotheses.

4. **Selecting a Research Design and Methodology**  
   This is your study’s **blueprint**—decide the approach (quantitative, qualitative, or mixed methods) and design (experiment, survey, case study, etc.) best suited to your research.

5. **Collecting Data**  
   Execute your plan by gathering data using your chosen methods (e.g., interviews, surveys, experiments).

6. **Analyzing and Interpreting Data**  
   Process the data to find meaning—using statistics for quantitative research and thematic analysis for qualitative research.

7. **Drawing Conclusions and Reporting Results**  
   Summarize findings, explain their significance, acknowledge limitations, and make recommendations in a report, thesis, or presentation.

---

## **Lesson 4.2: Problem Identification and Research Questions**

### **Defining a Research Problem**
A research problem is a **specific issue, difficulty, or gap** in knowledge that justifies your study. It may arise from:
- Observations in your field  
- A gap in existing literature  
- Theoretical debates needing resolution  
- Practical real-world issues  

### **Criteria for a Good Research Problem (FINER)**
- **Feasible:** You can complete it with available time and resources.  
- **Interesting:** Keeps you motivated.  
- **Novel:** Adds new knowledge or confirms/refutes existing work.  
- **Ethical:** Can be done without harming participants.  
- **Relevant:** Adds value to the field or society.

### **Developing Research Questions and Objectives**
- **Research Questions** guide the entire project.  
  - *Example:* “What is the impact of mobile banking adoption on the financial inclusion of small business owners in Buea?”
- **Research Objectives** break down what needs to be done.  
  - *Objective 1:* To identify the adoption rates of mobile banking services among small business owners in Buea.  
  - *Objective 2:* To assess the relationship between mobile banking usage and small enterprise growth.

### **From Broad Topic to Specific Focus**
| Stage | Example |
|-------|----------|
| Broad Topic | Digital Technology |
| Narrower Field | FinTech in Africa |
| Specific Topic | Mobile Banking's Impact on Small Businesses |
| Focused Problem | Barriers and benefits of mobile banking for female-owned SMEs in Cameroon |

---

## **Lesson 4.3: Literature Review**

### **Purpose of a Literature Review**
A **literature review** critically evaluates existing research to:
- Demonstrate knowledge of the field  
- Identify research gaps  
- Discover theoretical frameworks  
- Avoid duplication  
- Refine research questions  

### **Sources of Literature**
- **Primary Sources:** Original research studies (journal articles).  
- **Secondary Sources:** Reviews, textbooks, encyclopedias.  
- **Databases:** Google Scholar, JSTOR, PubMed, Scopus, university portals.

### **Synthesizing Findings**
- **Identify Themes:** Look for common topics or trends.  
- **Structure by Theme:** Discuss agreements/disagreements among authors.  
- **Use a Synthesis Matrix:** Map articles (rows) to key themes (columns).

### **Avoiding Plagiarism**
- **Cite Everything** used from other works.  
- **Paraphrase Correctly**—express ideas in your own words.  
- **Quote Sparingly** and always cite with page numbers.  
- **Use Reference Managers** like Zotero or Mendeley.

---

## **Lesson 4.4: Research Design**

### **Concept and Importance**
A **research design** is the logical structure connecting research questions to data collection and analysis. It ensures your evidence supports valid conclusions.

### **Types of Research Designs**
- **Experimental:** Tests cause-and-effect relationships.  
- **Correlational:** Measures statistical relationships without manipulation.  
- **Descriptive:** Describes characteristics or phenomena.  
- **Case Study:** In-depth investigation of one subject or event.

### **Variables, Sampling, and Control**
- **Variables:**  
  - Independent (IV), Dependent (DV), Confounding variables.  
- **Sampling:**  
  - *Probability Sampling:* Random, generalizable.  
  - *Non-Probability Sampling:* Convenience or purposive sampling.  
- **Control:** Minimize confounding effects, often with a control group.

### **Validity and Reliability**
- **Reliability:** Consistency of results.  
- **Validity:** Accuracy of measurement.  
  - *Internal Validity:* Confidence in causal relationships.  
  - *External Validity:* Generalizability of results.

---

## **Lesson 4.5: Data Collection Methods**

### **Primary vs. Secondary Data**
- **Primary Data:** Collected firsthand (surveys, interviews, experiments).  
- **Secondary Data:** Previously collected data (census, archives, prior studies).

### **Tools for Data Collection**
- **Questionnaires/Surveys:** Quantitative, standardized data.  
- **Interviews:** Qualitative, in-depth insights.  
- **Observations:** Behavior in natural settings.  
- **Documents/Records:** Existing materials and reports.

### **Ethical Considerations**
- **Informed Consent:** Participation must be voluntary and informed.  
- **Confidentiality & Anonymity:** Protect participant identity.  
- **Do No Harm:** Safeguard participants from physical/psychological harm.

---

## **Lesson 4.6: Data Analysis and Interpretation**

### **Quantitative Analysis**
- **Descriptive Statistics:** Summarize data (mean, median, SD).  
- **Inferential Statistics:** Generalize findings and test hypotheses (*p* < .05).

### **Qualitative Analysis**
- **Transcription:** Convert recordings to text.  
- **Coding:** Label key ideas.  
- **Thematic Analysis:** Group codes into major themes.

### **Presenting Findings**
- **Tables:** Show exact data values.  
- **Charts & Graphs:** Visualize trends and comparisons.  
- **Narratives:** Describe qualitative results with quotes.

---

## **Lesson 4.7: Report Writing and Presentation**

### **Structure of a Research Report (IMRaD)**
1. **Abstract:** 150–250-word summary.  
2. **Introduction:** Research problem, literature review, hypotheses.  
3. **Methods:** Detailed description of design, participants, and procedures.  
4. **Results:** Findings with tables and figures (no interpretation).  
5. **Discussion:** Interpretation, comparison with prior work, limitations.  
6. **Conclusion:** Summary, implications, and future recommendations.  
7. **References:** Full list of cited works.

### **Referencing Styles**
- **APA:** Social sciences.  
- **MLA:** Humanities.  
- **Chicago/Turabian:** History and related fields.  

### **Effective Presentation of Results**
- **Know Your Audience:** Adjust detail and terminology.  
- **Tell a Story:** Clear beginning, middle, and end.  
- **Use Visuals:** Clean, labeled graphs and charts.  
- **Be Clear and Concise:** Focus on key insights and implications.

---

✨ *In summary, the research process is a disciplined, iterative, and evidence-based journey—from identifying a problem to communicating findings—that builds reliable knowledge and advances human understanding.*
`,
        duration: 20,
        order: 4,
        isPreview: false,
      },
      {
        title: "Ethics in Research",
        titleFr: "Effectuer des recherches de littérature",
        description:
          "To instill a deep understanding of the ethical principles and professional integrity required in all research.",
        descriptionFr:
          "Apprenez des stratégies efficaces pour rechercher dans les bases de données académiques et les bibliothèques.",
        type: "reading" as const,
        content: `## **Introduction**
Zenith scholar are not just a set of rules to follow; they are the **moral compass** that guides the entire research process. Ethical conduct ensures that the pursuit of knowledge does not come at the cost of human dignity or scientific truth. Lapses in ethics can harm individuals, erode public trust in science, and invalidate research findings. This module covers the **non-negotiable principles** that every researcher must uphold.

---

## **Topic 1: Importance of Ethics in Research**

The importance of zenith scholar rests on three fundamental pillars:

### **1. Protecting Human Participants**
The primary ethical obligation is to protect research participants from **physical, psychological, social,** and **economic harm**.  
Historical examples, such as the *Tuskegee Syphilis Study*, remind us of the consequences of unethical research practices where participants were deceived and denied treatment for decades. These cases led to the establishment of strict ethical codes to ensure participant welfare remains the top priority.

### **2. Ensuring Research Integrity and Validity**
Ethics are essential to the **quality and reliability** of research.  
Scientific knowledge depends on trust. When researchers fabricate or falsify data, they not only act dishonestly but also contaminate the scientific record — potentially leading to serious consequences, especially in fields like medicine. Upholding integrity ensures that research findings remain **valid and credible**.

### **3. Maintaining Public Trust**
Since much research is **publicly funded** and intended to benefit society, researchers must maintain transparency and honesty.  
Public trust is essential for:
- Continued funding and support.  
- Willing participation in studies.  
- Acceptance and application of research findings in policy and practice.

---

## **Topic 2: Informed Consent, Confidentiality, and Anonymity**

These are the **three core mechanisms** for protecting research participants.

### **Informed Consent**
Informed consent is a **continuous dialogue** through which individuals voluntarily agree to participate in a study after being fully informed.  
Key elements include:

- **Full Disclosure:** Clear explanation of the research purpose, procedures, duration, risks, and benefits.  
- **Comprehension:** Information should be understandable and free from technical jargon.  
- **Voluntariness:** Participation must be free from coercion or undue influence.  
- **Right to Withdraw:** Participants can leave at any time without penalty.  
- **Special Populations:** Extra care must be taken for children, prisoners, and those with diminished cognitive capacity.

### **Confidentiality**
Confidentiality means the researcher **knows the participant’s identity** but protects it from disclosure.  
Data is de-identified by removing personal details and replacing them with **codes or pseudonyms**.

### **Anonymity**
Anonymity provides an even higher level of privacy—**the researcher does not know** who the participant is.  
This often applies to anonymous surveys or suggestion boxes.

| **Feature** | **Confidentiality** | **Anonymity** |
|--------------|---------------------|----------------|
| **Researcher’s Knowledge** | Researcher knows the participant’s identity. | Researcher does not know the participant’s identity. |
| **Promise** | To protect the identity from being disclosed. | The identity cannot be disclosed because it is unknown. |
| **Example** | An in-depth interview where names are coded. | An online survey with no login required. |

---

## **Topic 3: Avoiding Plagiarism and Data Fabrication**

These principles protect the **integrity** of the researcher’s work.

### **Plagiarism**
Plagiarism is the act of using another person’s ideas, words, or work **without proper acknowledgment**.  
It includes:
- Copying text directly.  
- Paraphrasing too closely.  
- **Self-plagiarism** (reusing one’s own published work without citation).  

✅ *Avoid plagiarism through careful note-taking and consistent, accurate citation.*

### **Data Fabrication and Falsification**
These are serious forms of research misconduct:

- **Fabrication:** Making up data or results.  
- **Falsification:** Manipulating materials, equipment, or data to misrepresent results.  

Both actions corrupt the research record, **undermine science**, and **destroy credibility**.

---

## **Topic 4: Ethical Review Boards and Approvals**

### **Ethical Review Board (ERB) / Institutional Review Board (IRB)**
An ERB (or IRB) is a committee that **reviews and approves** research proposals involving human participants.  
These boards include researchers, community representatives, and legal experts.  
In **Cameroon**, universities like the **University of Buea** have their own ERBs.

### **Purpose and Process**
The ERB ensures that all research is **ethically sound** and protects participant rights.  
Before starting data collection, researchers must submit:
- The research protocol and design.  
- Informed consent forms.  
- Recruitment strategies.  
- Data security measures.  
- Risk assessments and mitigation plans.  

The board may approve, request revisions, or reject a study.  
**ERB approval is mandatory** before any participant interaction begins.

---

## ✅ **Conclusion**
Ethical conduct is the **foundation of all credible research**.  
It safeguards participants, preserves scientific integrity, and sustains public trust — ensuring that the pursuit of knowledge remains a force for good.`,
        duration: 20,
        order: 5,
        isPreview: false,
      },
      {
        title: "Practical Applications and Project",
        titleFr: "Effectuer des recherches de littérature",
        description:
          "To transition from theory to practice by guiding learners through the process of developing a mini research proposal",
        descriptionFr:
          "Apprenez des stratégies efficaces pour rechercher dans les bases de données académiques et les bibliothèques.",
        type: "reading" as const,
        content: `## **Welcome**
Welcome to the final module of **Introduction to Research**. Throughout this course we explored the *what*, *why*, and *how* of research. Now it’s time to put that knowledge into action. This module gives you the tools and confidence to begin your own research journey: how to structure a research proposal (your blueprint) and how to read and critique the work of others — a core skill for every researcher.

---

## **Lesson 6.1: Developing a Mini Research Proposal**
**Objective:** Learn essential proposal components and prepare a basic proposal for a small-scale study.

### **Introduction to Proposals**
A research proposal is a clear, concise, structured document that:
- Serves as a roadmap for your project, and  
- Persuades supervisors or funders that your study is worthwhile, valid, and feasible.

### **Topic 1: Choosing a Topic**
A strong topic is the foundation of a good project.

- **Follow Your Interest:** Pick subjects that genuinely intrigue you — coursework topics, daily-life problems, or local issues in Buea. Passion fuels persistence.  
- **Look for Gaps:** While reading, ask: *What isn’t being discussed?* Is there a local context (e.g., Cameroon) missing from the literature?  
- **Be Practical:** Use the **FINER** criteria (Feasible, Interesting, Novel, Ethical, Relevant). Make sure you have time, resources, and access.  
- **Narrow It Down:** Move from broad to focused:

  - **Broad area:** Public Health  
  - **Specific field:** Water-borne diseases in urban areas  
  - **Focused topic:** Community perceptions of cholera prevention  
  - **Researchable problem:** *Investigating the factors influencing the adoption of water purification practices among households in the Bova Bomboko community.*

### **Topic 2: Writing Core Sections**
**Problem Statement** — the heart of your proposal. Structure it like this:
1. **The Ideal / Context:** Describe the desired state.  
   *Example:* “Access to clean drinking water is essential for public health…”  
2. **The Reality / Gap:** State the problem.  
   *Example:* “However, communities like Bova Bomboko still face recurrent cholera outbreaks…”  
3. **Consequence & Proposal:** Why it matters and what your study will do.  
   *Example:* “This study will identify barriers to adopting safe water practices to inform targeted health campaigns.”

**Research Objectives** — make them SMART (Specific, Measurable, Achievable, Relevant, Time-bound).  
- *Example Objective 1:* Identify primary sources of household drinking water in Bova Bomboko.  
- *Example Objective 2:* Assess residents’ knowledge of water purification methods.  
- *Example Objective 3:* Determine socio-economic factors influencing adoption.

**Methodology** — the “how-to”:
- **Research Design:** e.g., descriptive cross-sectional study.  
- **Population & Sampling:** e.g., heads of households in Bova Bomboko; convenience sample of 100 households.  
- **Data Collection:** e.g., structured questionnaire via face-to-face interviews.  
- **Data Analysis:** e.g., descriptive statistics (frequencies, percentages) using Microsoft Excel.

### **Topic 3: Drafting Timelines and Expected Outcomes**
**Timelines:** Use a simple table or Gantt chart to show feasibility.

| Phase                          | Week 1–2 | Week 3–4 | Week 5–6 | Week 7–8 |
|-------------------------------:|:--------:|:--------:|:--------:|:--------:|
| Finalize proposal & get approval|    X     |          |          |          |
| Develop questionnaire          |    X     |    X     |          |          |
| Data collection                |          |          |    X     |    X     |
| Data analysis & report writing |          |          |          |    X     |

*Export to Sheets*

**Expected Outcomes:**
- **Academic:** Contribute to limited literature on water sanitation practices in semi-urban Cameroon.  
- **Practical:** Provide local health authorities with data to design effective cholera prevention interventions.

---

## **Lesson 6.2: Case Studies and Review**
**Objective:** Develop skills to critically analyze published research and understand strengths and weaknesses.

### **Introduction**
Good researchers are also good consumers of research. Critical reading helps you learn methods, spot gaps, and understand quality standards in your field.

### **Topic 1: How to Analyze a Published Research Paper**
- Use Google Scholar (or another database) to find a relevant article.  
- **Reading order:** Abstract → Introduction & Conclusion → Methods & Results. Don’t try to understand every word; extract the core elements.

### **Topic 2: Identify Key Research Elements**
Use these guiding questions when deconstructing a paper:

- **Research Problem:** What central question do the authors address? (Usually at the Introduction’s end.)  
- **Literature Review / Gap:** What gap does the study aim to fill?  
- **Methodology:** What is the design (experiment, survey, case study)? Who were participants and how were they sampled? What tools were used?  
- **Findings:** What are the main results? (Check key tables/figures and Results text.)  
- **Discussion & Conclusion:** How do authors interpret results? What implications do they claim? What limitations do they acknowledge?  
- **Your Critique:** Are the conclusions convincing? Any unacknowledged methodological weaknesses?

### **Topic 3: Reflection on Learning**
This course maps a path from the philosophy of knowledge to practical research skills. Reflect on these prompts:
- How has your definition of *research* changed since Module 1?  
- What is the single most important concept you’ll take away from the course?  
- What area of research are you now most interested in exploring?

> Research is a skill that grows with practice. This course is a starting point — your research journey has just begun.

---`,
        duration: 20,
        order: 6,
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
        content: "https://youtu.be/v-MLGYuWLBo",
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
        content: "https://youtu.be/v-MLGYuWLBo",
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
        content: "https://youtu.be/v-MLGYuWLBo",
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
        content: "https://youtu.be/v-MLGYuWLBo",
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
        content: "https://youtu.be/v-MLGYuWLBo",
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
        content: "https://youtu.be/v-MLGYuWLBo",
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
        content: "https://youtu.be/v-MLGYuWLBo",
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
        content: "https://youtu.be/v-MLGYuWLBo",
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
        content: "https://youtu.be/v-MLGYuWLBo",
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
        content: "https://youtu.be/v-MLGYuWLBo",
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
        content: "https://youtu.be/v-MLGYuWLBo",
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
        content: "https://youtu.be/v-MLGYuWLBo",
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
        content: "https://youtu.be/v-MLGYuWLBo",
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
        content: "https://youtu.be/v-MLGYuWLBo",
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
    title: "Plagiarism & Zenith Scholar",
    titleFr: "Plagiat et éthique de la recherche",
    description:
      "Understand zenith scholar, avoid plagiarism, and conduct research with integrity.",
    descriptionFr:
      "Comprenez l'éthique de la recherche, évitez le plagiat et menez des recherches avec intégrité.",
    slug: "plagiarism-research-ethics",
    imageUrl:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800",
    isFree: true,
    price: 0,
    content: "# Plagiarism & Zenith Scholar\n\nConduct research ethically...",
    contentFr:
      "# Plagiat et éthique de la recherche\n\nMenez des recherches éthiquement...",
    duration: "2 weeks",
    level: "beginner" as const,
    objectives: [
      "Understand zenith scholar principles",
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
        content: "https://youtu.be/v-MLGYuWLBo",
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
        content: "https://youtu.be/v-MLGYuWLBo",
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
        content: "https://youtu.be/v-MLGYuWLBo",
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
