import Question from "../Models/Question.js";

// Prompt to generate interview questions with answers
export const questionAnswerPrompt = (role, experience, topicsToFocus, numberOfQuestions) => (
  `
You are an AI trained to generate technical interview questions and answers.
Task:
- Role: ${role}
- Candidate Experience: ${experience}
- Focus Topics: ${topicsToFocus}
- Write: ${numberOfQuestions} interview questions.

Instructions:
- For each question, generate a detailed but beginner-friendly answer.
- If the answer requires a code example, include a small code block.
- Keep formatting very clean.
- Return a pure JSON array in the following format:

[
  {
    "question": "question here",
    "answer": "answer here"
  },
  ...
]

Important: Do not add any extra text. Only return valid JSON.
  `
);

// Prompt to explain a concept behind a question
export const conceptExplainPrompt = (question) => (
  `
You are an AI trained to explain the concept behind interview questions.

Task:
- Explain the following interview question and its concept in depth as if you are teaching a beginner developer.
- Question: "${question}"
- After the explanation, provide a short and clear title that summarizes the concept.

Instructions:
- Keep the formatting very clean and clear.
- Return the result as a valid JSON object in the following format:

{
  "title": "short title here",
  "explanation": "Explanation here"
}

Important: Do NOT add any extra text outside the JSON format. Only return valid JSON.
  `
);
