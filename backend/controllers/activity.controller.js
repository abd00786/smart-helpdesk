import Activity from "../models/activity.model.js";

export const getActivityLog = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const activities = await Activity.find({ ticket: ticketId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createActivity = async (req, res) => {
  try {
    const activity = new Activity(req.body);
    await activity.save();
    await activity.populate("user", "name email");
    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
