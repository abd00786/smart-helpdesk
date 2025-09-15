import Ticket from "../models/ticket.model.js";

export const getTicketStats = async (req, res) => {
  try {
    const stats = {
      total: await Ticket.countDocuments(),
      open: await Ticket.countDocuments({ status: "open" }),
      in_progress: await Ticket.countDocuments({ status: "in_progress" }),
      resolved: await Ticket.countDocuments({ status: "resolved" }),
      closed: await Ticket.countDocuments({ status: "closed" }),
    };

    const byPriority = {
      low: await Ticket.countDocuments({ priority: "low" }),
      medium: await Ticket.countDocuments({ priority: "medium" }),
      high: await Ticket.countDocuments({ priority: "high" }),
      urgent: await Ticket.countDocuments({ priority: "urgent" }),
    };

    const byCategory = {
      hardware: await Ticket.countDocuments({ category: "hardware" }),
      software: await Ticket.countDocuments({ category: "software" }),
      network: await Ticket.countDocuments({ category: "network" }),
      other: await Ticket.countDocuments({ category: "other" }),
    };

    res.json({
      status: stats,
      priority: byPriority,
      category: byCategory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSLAMetrics = async (req, res) => {
  try {
    const tickets = await Ticket.find({ resolutionTime: { $exists: true, $ne: null } });

    if (tickets.length === 0) {
      return res.json({
        averageResolutionTime: 0,
        slaComplianceRate: 0,
        tickets: 0,
      });
    }

    const totalResolutionTime = tickets.reduce((sum, t) => sum + t.resolutionTime, 0);
    const avgResolutionTime = totalResolutionTime / tickets.length;

    const slaMet = tickets.filter((t) => t.resolutionTime <= 24 * 60 * 60 * 1000).length;
    const slaComplianceRate = ((slaMet / tickets.length) * 100).toFixed(2);

    res.json({
      averageResolutionTime: Math.round(avgResolutionTime / 1000 / 60), // in minutes
      slaComplianceRate: `${slaComplianceRate}%`,
      tickets: tickets.length,
      slaMet,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTicketTrends = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const tickets = await Ticket.find({ createdAt: { $gte: startDate } });

    const trends = {};
    tickets.forEach((ticket) => {
      const date = ticket.createdAt.toISOString().split("T")[0];
      trends[date] = (trends[date] || 0) + 1;
    });

    const trendsByCategory = {};
    tickets.forEach((ticket) => {
      const category = ticket.category;
      trendsByCategory[category] = (trendsByCategory[category] || 0) + 1;
    });

    const trendsByPriority = {};
    tickets.forEach((ticket) => {
      const priority = ticket.priority;
      trendsByPriority[priority] = (trendsByPriority[priority] || 0) + 1;
    });

    res.json({
      period: `${days} days`,
      byDate: trends,
      byCategory: trendsByCategory,
      byPriority: trendsByPriority,
      total: tickets.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getResolutionTimeHeatmap = async (req, res) => {
  try {
    const tickets = await Ticket.find({
      resolutionTime: { $exists: true, $ne: null },
      priority: { $exists: true },
      category: { $exists: true },
    });

    const heatmap = {};

    tickets.forEach((ticket) => {
      const key = `${ticket.priority}-${ticket.category}`;
      if (!heatmap[key]) {
        heatmap[key] = {
          count: 0,
          totalTime: 0,
          avgTime: 0,
        };
      }
      heatmap[key].count += 1;
      heatmap[key].totalTime += ticket.resolutionTime;
      heatmap[key].avgTime = Math.round(heatmap[key].totalTime / heatmap[key].count / 1000 / 60); // in minutes
    });

    res.json(heatmap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
