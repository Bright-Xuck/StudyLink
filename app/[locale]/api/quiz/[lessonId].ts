// pages/api/quiz/[lessonId].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/db';
import Quiz from '@/lib/models/Quiz';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false,
      message: 'Method not allowed' 
    });
  }

  try {
    const { lessonId } = req.query;

    // Validate lessonId
    if (!lessonId || typeof lessonId !== 'string') {
      return res.status(400).json({ 
        success: false,
        message: 'Valid lesson ID is required' 
      });
    }

    // Connect to database
    await connectDB();

    // Find quiz for this lesson
    const quiz = await Quiz.findOne({ lessonId }).lean();

    // If no quiz found
    if (!quiz) {
      return res.status(404).json({ 
        success: false,
        message: 'No quiz available for this lesson',
        hasQuiz: false 
      });
    }

    // Type assertion for quiz
    const quizData = quiz as any;

    // Remove correct answers and explanations from questions
    // This prevents cheating by inspecting the response
    const sanitizedQuestions = quizData.questions.map(
      ({ correctAnswer, explanation, ...question }: any) => ({
        ...question,
        _id: question._id?.toString(), // Convert ObjectId to string
      })
    );

    const sanitizedQuiz = {
      _id: quizData._id.toString(),
      lessonId: quizData.lessonId,
      moduleId: quizData.moduleId,
      title: quizData.title,
      questions: sanitizedQuestions,
      hasQuiz: true,
    };

    return res.status(200).json({
      success: true,
      data: sanitizedQuiz,
    });

  } catch (error) {
    console.error('Error fetching quiz:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Failed to fetch quiz. Please try again later.' 
    });
  }
}