import Question from "../Models/Question.js";
import Session from "../Models/session.js";



// desc Add additional questions to an existing session //
// route Post/api/questions/add //
// access Private //

export const addQuestionsToSession = async (req, res) => {
    try {
        const { sessionId, questions } = req.body
        if (!sessionId || !questions || !Array.isArray(questions)) {
            return res.status(400).json({ message: "error" })
        }

        const session = await Session.findById(sessionId)
        if (!session) {
            return res.status(404).json({ message: "Session not found" })
        }

        //  Create new Qesstions// 

        const createQuestions = await Question.insertMany(
            questions.map((q) => ({
                session: sessionId,
                question: q.question,
                answer: q.answer
            })
            )
        )
        // Update session to include new question Ids//
        session.questions.push(...createQuestions.map((q) => q._id))
        await session.save()

        res.status(201).json(createQuestions)

    } catch (error) {
        console.error("Error adding questions:", error.message);

        res.status(500).json({ message: "server Error" })
    }
}


// desc pin or unpin a question//
// route Post/api/question/:id/pin  //
// access Private //

export const togglePinQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        question.isPinned = !question.isPinned;
        await question.save(); // 👈 IMPORTANT
        console.log("Saved pinned status:", question.isPinned);

        res.status(200).json({ message: "Question pin status toggled", isPinned: question.isPinned });
    } catch (error) {
        console.error("Error toggling pin status:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const updateQuestionNote = async (req, res) => {
    try {
        const { note } = req.body

        const question = await Question.findById(req.params.id)


        if (!question) {
            return res.status(404).json({ success: false, message: "Questions not found" })
        }
        question.note = note || ""
        res.status(200).json({ success: true, question })
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
}