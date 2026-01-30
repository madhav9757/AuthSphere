import EndUser from "../models/endUsers.models.js";
import Session from "../models/session.model.js";
import Project from "../models/project.model.js";
import mongoose from "mongoose";

// Helper to get date ranges
const getDateRanges = () => {
    const now = new Date();
    // Today at 00:00:00
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Last 30 days starting from 29 days ago at 00:00:00
    const startOfPeriod = new Date(today);
    startOfPeriod.setDate(startOfPeriod.getDate() - 29);

    // Previous 30 days starting from 59 days ago
    const startOfPrevPeriod = new Date(startOfPeriod);
    startOfPrevPeriod.setDate(startOfPrevPeriod.getDate() - 30);

    return { now, today, startOfPeriod, startOfPrevPeriod };
};

// Security Helper: verify developer owns the project
const verifyOwnership = async (projectId, developerId) => {
    const project = await Project.findOne({ _id: projectId, developer: developerId });
    return !!project;
};

export const getAnalyticsOverview = async (req, res) => {
    try {
        const { projectId } = req.params;
        const developerId = req.developer._id;

        if (!await verifyOwnership(projectId, developerId)) {
            return res.status(403).json({ success: false, message: "Forbidden: You don't own this project" });
        }

        const { today, startOfPeriod, startOfPrevPeriod } = getDateRanges();
        const pId = new mongoose.Types.ObjectId(projectId);

        // Signups this period (30 days) vs previous period
        const signupsMonth = await EndUser.countDocuments({ projectId: pId, createdAt: { $gte: startOfPeriod } });
        const signupsPrevMonth = await EndUser.countDocuments({ projectId: pId, createdAt: { $gte: startOfPrevPeriod, $lt: startOfPeriod } });

        // Logins today (since midnight)
        const loginsToday = await Session.countDocuments({ projectId: pId, createdAt: { $gte: today } });
        const loginsYesterday = await Session.countDocuments({
            projectId: pId,
            createdAt: {
                $gte: new Date(today.getTime() - 24 * 60 * 60 * 1000),
                $lt: today
            }
        });

        // MAU (Monthly Active Users) - Unique users with at least one session in last 30 days
        const mau = await Session.distinct("endUserId", { projectId: pId, createdAt: { $gte: startOfPeriod }, isValid: true }).then(ids => ids.length);
        const totalUsers = await EndUser.countDocuments({ projectId: pId });

        // Calculate trends
        const calcTrend = (curr, prev) => {
            if (prev === 0) return curr > 0 ? "+100%" : "0%";
            const diff = ((curr - prev) / prev) * 100;
            return (diff >= 0 ? "+" : "") + diff.toFixed(1) + "%";
        };

        const result = {
            signups: {
                month: signupsMonth,
                trend: calcTrend(signupsMonth, signupsPrevMonth)
            },
            logins: {
                today: loginsToday,
                trend: calcTrend(loginsToday, loginsYesterday)
            },
            activeUsers: {
                mau,
                retention: totalUsers > 0 ? ((mau / totalUsers) * 100).toFixed(1) + "%" : "0%"
            },
            health: {
                latency: "102ms",
                uptime: "99.99%"
            }
        };

        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getAnalyticsCharts = async (req, res) => {
    try {
        const { projectId } = req.params;
        const developerId = req.developer._id;

        if (!await verifyOwnership(projectId, developerId)) {
            return res.status(403).json({ success: false, message: "Forbidden: You don't own this project" });
        }

        const { startOfPeriod } = getDateRanges();
        const pId = new mongoose.Types.ObjectId(projectId);

        // Daily Signups over last 30 days
        const rawDailySignups = await EndUser.aggregate([
            { $match: { projectId: pId, createdAt: { $gte: startOfPeriod } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Daily Active Users (DAU) over last 30 days
        const rawDailyActiveUsers = await Session.aggregate([
            { $match: { projectId: pId, createdAt: { $gte: startOfPeriod } } },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        userId: "$endUserId"
                    }
                }
            },
            {
                $group: {
                    _id: "$_id.date",
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const dailySignups = [];
        const dailyActiveUsers = [];
        for (let i = 0; i < 30; i++) {
            const date = new Date(startOfPeriod);
            date.setDate(date.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];

            const signupFound = rawDailySignups.find(d => d._id === dateStr);
            dailySignups.push({
                date: dateStr,
                count: signupFound ? signupFound.count : 0
            });

            const activeFound = rawDailyActiveUsers.find(d => d._id === dateStr);
            dailyActiveUsers.push({
                date: dateStr,
                count: activeFound ? activeFound.count : 0
            });
        }

        // Provider breakdown - Formatted for PieChart
        const providerBreakdown = await EndUser.aggregate([
            { $match: { projectId: pId } },
            {
                $group: {
                    _id: "$provider",
                    value: { $sum: 1 }
                }
            },
            {
                $project: {
                    name: { $cond: [{ $eq: ["$_id", "local"] }, "Email", "$_id"] },
                    value: 1,
                    _id: 0
                }
            },
            { $sort: { value: -1 } }
        ]);

        const result = {
            dailySignups,
            dailyActiveUsers,
            providerDistribution: providerBreakdown
        };

        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getRecentActivity = async (req, res) => {
    try {
        const { projectId } = req.params;
        const developerId = req.developer._id;

        if (!await verifyOwnership(projectId, developerId)) {
            return res.status(403).json({ success: false, message: "Forbidden: You don't own this project" });
        }

        const pId = new mongoose.Types.ObjectId(projectId);

        const recentSessions = await Session.find({ projectId: pId })
            .sort({ createdAt: -1 })
            .limit(10)
            .populate("endUserId", "username email picture provider");

        return res.status(200).json({
            success: true,
            data: {
                recentLogins: recentSessions.map(s => ({
                    user: s.endUserId ? s.endUserId.username : 'Unknown',
                    email: s.endUserId ? s.endUserId.email : 'Unknown',
                    picture: s.endUserId ? s.endUserId.picture : null,
                    provider: s.endUserId ? s.endUserId.provider : 'local',
                    timestamp: s.createdAt,
                    device: s.userAgent || 'Desktop'
                }))
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
