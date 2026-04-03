const statsService = require('../services/statsService');

exports.getSummary = async (req, res) => {
    try {
        const userId = req.user.id; 
        
        const dashboardData = await statsService.getStats(userId);
        
        res.status(200).json({
            success: true,
            message: "Dashboard summary fetched successfully",
            data: dashboardData
        });
    } catch (error) {
        console.error("Dashboard Controller Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard summary due to server error"
        });
    }
};