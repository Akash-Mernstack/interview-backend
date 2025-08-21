import Session from '../Models/session.js'
import Question from "../Models/Question.js"


//    @desc  create a new session and linded questions //
//    @route Post/api/session/create     //
//  @access Private   //

export const createSession = async (req, res) => {
    try {
        const { role, experience, topicsToFocus, description, questions } = req.body
        const userId = req.user._id //Asuming you have a middleware setting req.user //
        const session = await Session.create({
            user: userId,
            role,
            experience,
            topicsToFocus,
            description,
        })

        const questionDocs = await Promise.all(
            questions.map(async (q) => {
                const question = await Question.create({
                    session: session._id,
                    question: q.question,
                    answer: q.answer
                })
                return question._id;
            })

        )
        session.questions = questionDocs;
        await session.save()
        res.status(201).json({ success: true, session })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "server Error" })
    }
}

// desc Get all session for the logged-in user //
// @route Get/api/session/my-sessions //
// @access Private  //

export const getMySessions = async (req, res) => {
    try {
        const session = await Session.find({ user: req.user.id }).
            sort({ createdAt: -1 }).populate("questions")
        res.status(200).json(session)

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "server Error" })
    }

}


// desc  Get a session by ID with populed questions    //
// Route Get/api/session/:id //
// access Private // 
export const getSessionById = async (req, res) => {

    try {
        const session = await Session.findById(req.params.id).populate({
            path: "questions",
            options: { sort: { isPinned: -1, createdAt: 1 } },
        })
            .exec()


        if (!session) {
            return res.status(404).json({ success: false, message: "Session not found" })
        }
        return res.status(200).json({ success: true, session })
    } catch (error) {
        console.error("getSessionById error:", error);

        return res.status(500).json({ success: false, message: "server Error" })
    }
}

// desc delete a sesion and its question  //
// route Delete/api/session/:id //
// access Private //

export const deleteSession = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id)
        if (!session) {
            return res.status(404).json({ message: "Session not found" })
        }

        //check if the logged-in user ows this session //
        if (session.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "NOt aurhorized tp delete this session" })
        }

        // First,delete all questions linkde to this session//
        await Question.deleteMany();

        // then,delete the session //
        await session.deleteOne()

        res.status(200).json({ success: true, message: 'deleted successfully' })
    } catch (error) {
        res.status(500).json({ success: false, message: "server Error" })
    }

}
