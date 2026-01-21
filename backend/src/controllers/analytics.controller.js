import EndUser from "../models/endUsers.models.js";
import Session from "../models/session.model.js";
import mongoose from "mongoose";

// Helper to get date ranges
const getDateRanges = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const prev30Days = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    return { today, last30Days, prev30Days };
};

// Simple In-memory Cache
const analyticsCache = new Map();
const CACHE_TTL = 30 * 1000; // Reduced to 30s for better "live" feel

const getCachedData = (key) => {
    const cached = analyticsCache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
    }
    return null;
};

const setCacheData = (key, data) => {
    analyticsCache.set(key, { data, timestamp: Date.now() });
};

export const getAnalyticsOverview = async (req, res) => {
    try {
        const { projectId } = req.params;

        const cacheKey = `overview_${projectId}`;
        const cached = getCachedData(cacheKey);
        if (cached) {
            return res.status(200).json({ success: true, data: cached });
        }

        const { today, last30Days, prev30Days } = getDateRanges();
        const pId = new mongoose.Types.ObjectId(projectId);

        // Signups this month vs last month
        const signupsMonth = await EndUser.countDocuments({ projectId: pId, createdAt: { $gte: last30Days } });
        const signupsPrevMonth = await EndUser.countDocuments({ projectId: pId, createdAt: { $gte: prev30Days, $lt: last30Days } });

        // Logins today
        const loginsToday = await Session.countDocuments({ projectId: pId, createdAt: { $gte: today } });
        const loginsYesterday = await Session.countDocuments({
            projectId: pId,
            createdAt: {
                $gte: new Date(today.getTime() - 24 * 60 * 60 * 1000),
                $lt: today
            }
        });

        // MAU (Monthly Active Users)
        const mau = await Session.distinct("endUserId", { projectId: pId, createdAt: { $gte: last30Days }, isValid: true }).then(ids => ids.length);
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
                latency: "102ms", // Simulated
                uptime: "99.99%"   // Simulated
            }
        };

        setCacheData(cacheKey, result);

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

        const cacheKey = `charts_${projectId}`;
        const cached = getCachedData(cacheKey);
        if (cached) {
            return res.status(200).json({ success: true, data: cached });
        }

        const { last30Days } = getDateRanges();
        const pId = new mongoose.Types.ObjectId(projectId);

        // Daily Signups over last 30 days
        const rawDailySignups = await EndUser.aggregate([
            { $match: { projectId: pId, createdAt: { $gte: last30Days } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Fill in missing days for a "perfect" chart
        const dailySignups = [];
        for (let i = 0; i < 30; i++) {
            const date = new Date(last30Days.getTime() + i * 24 * 60 * 60 * 1000);
            const dateStr = date.toISOString().split('T')[0];
            const found = rawDailySignups.find(d => d._id === dateStr);
            dailySignups.push({
                date: dateStr,
                count: found ? found.count : 0
            });
        }

        // Provider breakdown
        const providerBreakdown = await EndUser.aggregate([
            { $match: { projectId: pId } },
            {
                $group: {
                    _id: "$provider",
                    count: { $sum: 1 }
                }
            }
        ]);

        const result = {
            dailySignups,
            providerDistribution: providerBreakdown.reduce((acc, curr) => {
                const name = curr._id === "local" ? "Email" : curr._id;
                acc[name || 'Email'] = curr.count;
                return acc;
            }, {})
        };

        setCacheData(cacheKey, result);

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
