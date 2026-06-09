-- StudyLink Neon/PostgreSQL migration
-- Run this in the Neon SQL editor (PostgreSQL client, not Supabase-specific helpers).
-- This file creates the core tables and starter data used by the current app.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Drop existing objects for a clean rerun
DROP TABLE IF EXISTS progress CASCADE;
DROP TABLE IF EXISTS certificates CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS quiz_attempts CASCADE;
DROP TABLE IF EXISTS quizzes CASCADE;
DROP TABLE IF EXISTS modules CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS users CASCADE;

DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS department_enum CASCADE;
DROP TYPE IF EXISTS course_level CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS payment_medium CASCADE;

CREATE TYPE user_role AS ENUM ('student', 'admin');
CREATE TYPE department_enum AS ENUM (
  'Computer Science',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Microbiology',
  'Biochemistry',
  'Geology',
  'Economics',
  'Management',
  'Sociology',
  'Psychology',
  'English',
  'French',
  'Linguistics',
  'Curriculum Studies',
  'Educational Psychology',
  'Nursing',
  'Public Health',
  'Civil Engineering',
  'Electrical Engineering',
  'Other'
);
CREATE TYPE course_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE payment_status AS ENUM ('created', 'pending', 'successful', 'failed', 'expired');
CREATE TYPE payment_medium AS ENUM ('mobile money', 'orange money');

-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  phone TEXT,
  department department_enum,
  role user_role NOT NULL DEFAULT 'student',
  is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  email_verification_token TEXT,
  reset_password_token TEXT,
  reset_password_expires TIMESTAMPTZ,
  purchased_courses UUID[] NOT NULL DEFAULT '{}'::UUID[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Courses
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_fr TEXT NOT NULL,
  description TEXT NOT NULL,
  description_fr TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  image_url TEXT NOT NULL,
  department department_enum NOT NULL,
  faculty TEXT,
  is_free BOOLEAN NOT NULL DEFAULT FALSE,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'XAF',
  duration TEXT DEFAULT '3 months',
  level course_level NOT NULL DEFAULT 'beginner',
  objectives TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  objectives_fr TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  prerequisites TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  prerequisites_fr TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  instructor TEXT,
  instructor_bio TEXT,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  "order" INTEGER NOT NULL DEFAULT 0,
  enrolled_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Modules (lessons stored as JSONB to preserve current nested structure)
CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  title_fr TEXT NOT NULL,
  description TEXT NOT NULL,
  description_fr TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  image_url TEXT NOT NULL,
  content TEXT NOT NULL,
  content_fr TEXT NOT NULL,
  duration TEXT DEFAULT '2 weeks',
  level course_level NOT NULL DEFAULT 'beginner',
  objectives TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  objectives_fr TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  lessons JSONB NOT NULL DEFAULT '[]'::JSONB,
  "order" INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Quizzes (questions stored as JSONB)
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID,
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  title_fr TEXT NOT NULL,
  description TEXT,
  description_fr TEXT,
  questions JSONB NOT NULL DEFAULT '[]'::JSONB,
  passing_score INTEGER NOT NULL DEFAULT 70,
  time_limit INTEGER,
  max_attempts INTEGER NOT NULL DEFAULT 3,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Quiz attempts (answers stored as JSONB)
CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  score NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_points NUMERIC(10,2) NOT NULL DEFAULT 0,
  percentage NUMERIC(5,2) NOT NULL DEFAULT 0,
  passed BOOLEAN NOT NULL DEFAULT FALSE,
  answers JSONB NOT NULL DEFAULT '[]'::JSONB,
  time_spent INTEGER,
  attempt_number INTEGER NOT NULL DEFAULT 1,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL CHECK (amount >= 100),
  currency TEXT NOT NULL DEFAULT 'XAF',
  transaction_id TEXT NOT NULL UNIQUE,
  external_id TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  email TEXT,
  status payment_status NOT NULL DEFAULT 'pending',
  medium payment_medium NOT NULL DEFAULT 'mobile money',
  failure_reason TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  initiated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Certificates
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  certificate_number TEXT NOT NULL UNIQUE,
  student_name TEXT NOT NULL,
  course_name TEXT NOT NULL,
  course_name_fr TEXT NOT NULL,
  completion_date TIMESTAMPTZ NOT NULL,
  issue_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  final_score NUMERIC(5,2) NOT NULL CHECK (final_score BETWEEN 0 AND 100),
  total_lessons INTEGER NOT NULL DEFAULT 0,
  total_quizzes INTEGER NOT NULL DEFAULT 0,
  time_spent INTEGER NOT NULL DEFAULT 0,
  issued_by TEXT NOT NULL DEFAULT 'ResearchEthics Platform',
  signatory TEXT DEFAULT 'Dr. John Doe',
  signatory_title TEXT DEFAULT 'Director of Academic Programs',
  verification_code TEXT NOT NULL UNIQUE,
  verified BOOLEAN NOT NULL DEFAULT TRUE,
  pdf_url TEXT,
  pdf_generated BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Progress tracking
CREATE TABLE progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  modules_progress JSONB NOT NULL DEFAULT '[]'::JSONB,
  total_modules INTEGER NOT NULL DEFAULT 0,
  completed_modules INTEGER NOT NULL DEFAULT 0,
  lessons_progress JSONB NOT NULL DEFAULT '[]'::JSONB,
  total_lessons INTEGER NOT NULL DEFAULT 0,
  completed_lessons INTEGER NOT NULL DEFAULT 0,
  course_progress_percentage NUMERIC(5,2) NOT NULL DEFAULT 0,
  quiz_attempts JSONB NOT NULL DEFAULT '[]'::JSONB,
  total_quizzes_passed INTEGER NOT NULL DEFAULT 0,
  total_quizzes_required INTEGER NOT NULL DEFAULT 0,
  certificate_issued BOOLEAN NOT NULL DEFAULT FALSE,
  certificate_issued_at TIMESTAMPTZ,
  certificate_id UUID,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_accessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_department ON users(department);
CREATE INDEX idx_courses_department ON courses(department);
CREATE INDEX idx_courses_is_published ON courses(is_published);
CREATE INDEX idx_modules_course_id ON modules(course_id);
CREATE INDEX idx_modules_is_published ON modules(is_published);
CREATE INDEX idx_quizzes_module_id ON quizzes(module_id);
CREATE INDEX idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_course_id ON payments(course_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_certificates_user_id ON certificates(user_id);
CREATE INDEX idx_certificates_course_id ON certificates(course_id);
CREATE INDEX idx_progress_user_course ON progress(user_id, course_id);
CREATE INDEX idx_progress_certificate_issued ON progress(certificate_issued);

-- Starter seed records
INSERT INTO users (id, name, email, password, phone, department, role, is_email_verified)
VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'Admin User', 'admin@studylink.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86AGR4K02F6', '237670123456', 'Computer Science', 'admin', TRUE),
  ('550e8400-e29b-41d4-a716-446655440001', 'John Doe', 'john@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86AGR4K02F6', '237671234567', 'Computer Science', 'student', TRUE),
  ('550e8400-e29b-41d4-a716-446655440002', 'Jane Smith', 'jane@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86AGR4K02F6', '237672345678', 'Mathematics', 'student', TRUE);

INSERT INTO courses (id, title, title_fr, description, description_fr, slug, image_url, department, faculty, is_free, price, currency, duration, level, instructor, is_published, "order")
VALUES
  ('650e8400-e29b-41d4-a716-446655440000', 'Introduction to Computer Science', 'Introduction à l''Informatique', 'Learn the fundamentals of computer science including algorithms, data structures, and programming concepts.', 'Apprenez les fondamentaux de l''informatique, y compris les algorithmes, les structures de données et les concepts de programmation.', 'intro-computer-science', '/courseContent/cs-intro.jpg', 'Computer Science', 'Faculty of Science', FALSE, 15000, 'XAF', '8 weeks', 'beginner', 'Dr. James Wilson', TRUE, 1),
  ('650e8400-e29b-41d4-a716-446655440001', 'Advanced Data Structures', 'Structures de Données Avancées', 'Master complex data structures like trees, graphs, and hash tables with practical applications.', 'Maîtrisez les structures de données complexes comme les arbres, les graphes et les tables de hachage avec des applications pratiques.', 'advanced-data-structures', '/courseContent/ds-advanced.jpg', 'Computer Science', 'Faculty of Science', FALSE, 20000, 'XAF', '10 weeks', 'intermediate', 'Dr. Emily Chen', TRUE, 2),
  ('650e8400-e29b-41d4-a716-446655440002', 'Calculus Fundamentals', 'Fondamentaux du Calcul', 'Explore the principles of calculus including limits, derivatives, and integrals.', 'Explorez les principes du calcul, y compris les limites, les dérivées et les intégrales.', 'calculus-fundamentals', '/courseContent/math-calculus.jpg', 'Mathematics', 'Faculty of Science', TRUE, 0, 'XAF', '12 weeks', 'beginner', 'Prof. Michael Zhang', TRUE, 3);

INSERT INTO modules (id, course_id, title, title_fr, description, description_fr, slug, image_url, content, content_fr, duration, level, objectives, objectives_fr, lessons, "order", is_published)
VALUES
  ('750e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440000', 'Programming Basics', 'Bases de la Programmation', 'Intro to programming concepts.', 'Introduction aux concepts de programmation.', 'programming-basics', '/courseContent/module-pb.jpg', 'Intro to programming concepts and first program.', 'Introduction aux concepts de programmation et premier programme.', '3 weeks', 'beginner', ARRAY['Understand variables', 'Write first program'], ARRAY['Comprendre les variables', 'Écrire votre premier programme'], '[{"title":"What is Programming?","titleFr":"Qu''est-ce que la Programmation?","type":"video","content":"https://example.com/videos/programming-intro.mp4","contentFr":"https://example.com/videos/programming-intro-fr.mp4","duration":15,"order":1,"isPreview":true,"hasQuiz":true}]'::JSONB, 1, TRUE),
  ('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 'Trees and Graphs', 'Arbres et Graphes', 'Advanced tree structures and graph algorithms.', 'Structures d''arbres avancées et algorithmes graphiques.', 'trees-and-graphs', '/courseContent/module-tg.jpg', 'Advanced tree structures and graph algorithms.', 'Structures d''arbres avancées et algorithmes graphiques.', '4 weeks', 'intermediate', ARRAY['Understand tree traversal', 'Apply graph algorithms'], ARRAY['Comprendre le parcours des arbres', 'Appliquer des algorithmes de graphes'], '[{"title":"Binary Trees","titleFr":"Arbres Binaires","type":"video","content":"https://example.com/videos/binary-trees.mp4","contentFr":"https://example.com/videos/binary-trees-fr.mp4","duration":30,"order":1,"isPreview":true,"hasQuiz":true}]'::JSONB, 1, TRUE);

INSERT INTO quizzes (id, lesson_id, module_id, title, title_fr, description, description_fr, questions, passing_score, time_limit, max_attempts, is_published)
VALUES
  ('850e8400-e29b-41d4-a716-446655440000', NULL, '750e8400-e29b-41d4-a716-446655440000', 'Quiz 1: Programming Basics', 'Quiz 1: Bases de la Programmation', 'Test the basics.', 'Testez les bases.', '[{"type":"mcq","questionText":"What is a variable?","questionTextFr":"Qu''est-ce qu''une variable ?","options":["A storage location","A function","A loop"],"optionsFr":["Un emplacement de stockage","Une fonction","Une boucle"],"correctAnswer":"A storage location","correctAnswerFr":"Un emplacement de stockage","points":10,"order":1}]'::JSONB, 70, 15, 3, TRUE);
