// This script updates the GetAssessmentById controller
// Copy and paste the following code to replace your controller:

export const GetAssessmentById = handleAsync(
  async (req: ExtendedRequest, res: Response, next: NextFunction) => {

    console.log("req.userId", req.userId);
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    
    // Populate questions and course information
    const assessment = await Assessment.findById(id)
      .populate('questions')
      .populate('course');

    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    console.log(`Assessment ${id} fetched with ${assessment.questions?.length || 0} populated questions`);
    res.status(200).json({ assessment });
  }
);
