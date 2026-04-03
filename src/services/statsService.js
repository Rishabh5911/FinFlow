const Record = require('../models/Record');
const mongoose = require('mongoose');

exports.getStats = async (userId) => {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    
    const totals = await Record.aggregate([
        { $match: { belongsTo: userObjectId } }, 
        {
            $group: {
                _id: null,
                totalIncome: { $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] } },
                totalExpense: { $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] } }
            }
        },
        {
            $project: {
                _id: 0,
                totalIncome: 1,
                totalExpense: 1,
                netBalance: { $subtract: ["$totalIncome", "$totalExpense"] }
            }
        }
    ]);

    
    const categoryTotals = await Record.aggregate([
        { $match: { belongsTo: userObjectId } },
        {
            $group: {
                _id: "$category",
                totalAmount: { $sum: "$amount" },
                type: { $first: "$type" }
            }
        },
        { $sort: { totalAmount: -1 } }
    ]);

    
    const recentActivity = await Record.find({ belongsTo: userObjectId })
        .populate('belongsTo', 'name')
        .populate('createdBy', 'name')
        .sort({ date: -1 })
        .limit(5);

    
    const summary = totals.length > 0 ? totals[0] : { totalIncome: 0, totalExpense: 0, netBalance: 0 };

    return {
        summary,
        categoryWise: categoryTotals,
        recentActivity
    };
};