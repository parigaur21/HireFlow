const asyncHandler = require('express-async-handler');
const Job = require('../models/Job');
const Application = require('../models/Application');
const User = require('../models/User');

// @desc    Get platform analytics
// @route   GET /api/analytics
// @access  Private
const getAnalytics = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const role = req.user.role;

    let analytics = {};

    if (role === 'recruiter' || role === 'admin') {
        // Recruiter analytics
        const myJobs = await Job.find({ postedBy: userId }).select('_id');
        const myJobIds = myJobs.map(j => j._id);

        const totalJobs = myJobs.length;
        const totalApplications = await Application.countDocuments({ job: { $in: myJobIds } });

        // Status breakdown
        const statusBreakdown = await Application.aggregate([
            { $match: { job: { $in: myJobIds } } },
            { $group: { _id: '$status', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        // Applications per job
        const applicationsPerJob = await Application.aggregate([
            { $match: { job: { $in: myJobIds } } },
            { $group: { _id: '$job', count: { $sum: 1 } } },
            {
                $lookup: {
                    from: 'jobs',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'jobInfo'
                }
            },
            { $unwind: '$jobInfo' },
            {
                $project: {
                    jobTitle: '$jobInfo.title',
                    company: '$jobInfo.company',
                    count: 1
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        // Average match score
        const avgScoreResult = await Application.aggregate([
            { $match: { job: { $in: myJobIds }, matchScore: { $gt: 0 } } },
            { $group: { _id: null, avgScore: { $avg: '$matchScore' } } }
        ]);

        // Applications over time (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const applicationsOverTime = await Application.aggregate([
            {
                $match: {
                    job: { $in: myJobIds },
                    createdAt: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Top skills in demand
        const topSkills = await Job.aggregate([
            { $match: { postedBy: userId } },
            { $unwind: '$requiredSkills' },
            { $group: { _id: '$requiredSkills', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        analytics = {
            totalJobs,
            totalApplications,
            statusBreakdown: statusBreakdown.map(s => ({ status: s._id, count: s.count })),
            applicationsPerJob,
            averageMatchScore: avgScoreResult[0]?.avgScore ? Math.round(avgScoreResult[0].avgScore) : 0,
            applicationsOverTime: applicationsOverTime.map(a => ({ date: a._id, count: a.count })),
            topSkills: topSkills.map(s => ({ skill: s._id, count: s.count }))
        };
    } else {
        // Candidate analytics
        const myApps = await Application.find({ candidate: userId })
            .populate('job', 'title company')
            .lean();

        const totalApplications = myApps.length;
        const statusBreakdown = {};
        let totalMatchScore = 0;
        let matchScoreCount = 0;

        myApps.forEach(app => {
            statusBreakdown[app.status] = (statusBreakdown[app.status] || 0) + 1;
            if (app.matchScore > 0) {
                totalMatchScore += app.matchScore;
                matchScoreCount++;
            }
        });

        const recentApplications = myApps
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
            .map(app => ({
                jobTitle: app.job?.title || 'Unknown',
                company: app.job?.company || 'Unknown',
                status: app.status,
                matchScore: app.matchScore || 0,
                appliedAt: app.createdAt
            }));

        analytics = {
            totalApplications,
            statusBreakdown: Object.entries(statusBreakdown).map(([status, count]) => ({ status, count })),
            averageMatchScore: matchScoreCount > 0 ? Math.round(totalMatchScore / matchScoreCount) : 0,
            recentApplications,
            activeApplications: myApps.filter(a => !['Rejected', 'Withdrawn', 'Hired'].includes(a.status)).length,
            hiredCount: statusBreakdown['Hired'] || 0,
            rejectedCount: statusBreakdown['Rejected'] || 0
        };
    }

    res.json({ success: true, data: analytics });
});

module.exports = { getAnalytics };
