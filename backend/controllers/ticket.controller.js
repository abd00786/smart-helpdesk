import Ticket from "../models/ticket.model.js";
import Activity from "../models/activity.model.js";

export const createTicket = async (req, res) => {
  try {
    const { title, description, priority, category } = req.body;
    
    const ticket = new Ticket({
      title,
      description,
      priority: priority || "low",
      category: category || "other",
      status: "open",
      reporter: req.user.id,
      slaDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24hr SLA
    });

    await ticket.save();
    await ticket.populate("reporter", "name email");

    // Log activity
    await Activity.create({
      ticket: ticket._id,
      user: req.user.id,
      action: "created",
      description: "Ticket created",
    });

    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTickets = async (req, res) => {
  try {
    const { status, priority, assignee } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignee) filter.assignee = assignee;

    const tickets = await Ticket.find(filter)
      .populate("reporter", "name email")
      .populate("assignee", "name email")
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("reporter", "name email")
      .populate("assignee", "name email");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validTransitions = {
      open: ["in_progress", "closed"],
      in_progress: ["resolved", "open"],
      resolved: ["closed", "open"],
      closed: [],
    };

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (!validTransitions[ticket.status].includes(status)) {
      return res.status(400).json({ message: `Cannot transition from ${ticket.status} to ${status}` });
    }

    const oldStatus = ticket.status;
    ticket.status = status;

    if (status === "resolved") {
      ticket.resolutionTime = Date.now() - ticket.createdAt;
    }

    await ticket.save();

    // Log activity
    await Activity.create({
      ticket: id,
      user: req.user.id,
      action: "status_changed",
      oldValue: oldStatus,
      newValue: status,
      description: `Status changed from ${oldStatus} to ${status}`,
    });

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const assignTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignee } = req.body;

    const ticket = await Ticket.findByIdAndUpdate(
      id,
      { assignee },
      { new: true }
    ).populate("reporter", "name email").populate("assignee", "name email");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Log activity
    await Activity.create({
      ticket: id,
      user: req.user.id,
      action: "assigned",
      newValue: assignee,
      description: `Ticket assigned`,
    });

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateTicketPriority = async (req, res) => {
  try {
    const { id } = req.params;
    const { priority } = req.body;

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const oldPriority = ticket.priority;
    ticket.priority = priority;
    await ticket.save();

    // Log activity
    await Activity.create({
      ticket: id,
      user: req.user.id,
      action: "priority_changed",
      oldValue: oldPriority,
      newValue: priority,
      description: `Priority changed from ${oldPriority} to ${priority}`,
    });

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
