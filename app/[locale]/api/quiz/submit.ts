// pages/api/quiz/submit.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/db';
import Quiz, { QuizAttempt } from '@/lib/models/Quiz';

interface SubmitQuizBody {
  quizId: string;
  userId: string;
  answers: {
    questionId: string;
    answer: string;
  }[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      message: 'Method not allowed' 
    });
  }

  try {
    const { quizId, userId, answers } = req.body as SubmitQuizBody;

    // Validate request body
    if (!quizId || !userId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid request data. Quiz ID, User ID, and answers are required.' 
      });
    }

    // Connect to database
    await connectDB();

    // Fetch quiz with all data including correct answers
    const quiz = await Quiz.findById(quizId).lean();

    if (!quiz) {
      return res.status(404).json({ 
        success: false,
        message: 'Quiz not found' 
      });
    }

    // Type assertion for quiz
    const quizData = quiz as any;

    // Calculate score
    let score = 0;
    let totalPoints = 0;
    let correctCount = 0;

    const results = answers.map((userAnswer) => {
      // Find the corresponding question
      const question = quizData.questions.find(
        (q: any) => q._id?.toString() === userAnswer.questionId
      );

      // If question not found, mark as incorrect
      if (!question) {
        return {
          questionId: userAnswer.questionId,
          questionText: 'Question not found',
          userAnswer: userAnswer.answer,
          correctAnswer: '',
          isCorrect: false,
          points: 0,
          type: 'unknown',
        };
      }

      totalPoints += question.points;

      // Determine if answer is correct based on question type
      let isCorrect = false;
      
      if (question.type === 'mcq') {
        // MCQ: Exact match (case-sensitive for consistency)
        isCorrect = userAnswer.answer.trim() === question.correctAnswer.trim();
      } else if (question.type === 'structural') {
        // Structural: Case-insensitive comparison with whitespace normalization
        const userAns = userAnswer.answer.trim().toLowerCase();
        const correctAns = question.correctAnswer.trim().toLowerCase();
        
        // Check for exact match or if the correct answer is contained in user answer
        isCorrect = userAns === correctAns || userAns.includes(correctAns);
      }

      if (isCorrect) {
        score += question.points;
        correctCount++;
      }

      return {
        questionId: userAnswer.questionId,
        questionText: question.questionText,
        questionType: question.type,
        userAnswer: userAnswer.answer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        points: isCorrect ? question.points : 0,
        maxPoints: question.points,
        explanation: question.explanation || null,
      };
    });

    // Calculate percentage
    const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;

    // Save quiz attempt to database
    const attempt = await QuizAttempt.create({
      quizId,
      userId,
      score,
      totalPoints,
      percentage,
      answers: results,
      completedAt: new Date(),
    });

    // Return results
    return res.status(200).json({
      success: true,
      data: {
        attemptId: attempt._id.toString(),
        score,
        totalPoints,
        percentage,
        correctCount,
        totalQuestions: quizData.questions.length,
        results,
        passedQuiz: percentage >= 60, // You can adjust passing threshold
      },
    });

  } catch (error) {
    console.error('Error submitting quiz:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Failed to submit quiz. Please try again.' 
    });
  }
}