const Record = require('../models/Record');


exports.createRecord = async (req, res) => {
    try{
        const {amount,type,category,description,date,belongsTo} = req.body;

       
        if(!amount || !type || !category || !belongsTo){
            return res.status(400).json({
                success:false,
                message:"Please enter all required fields: amount,type,category and belongsTo"
            })
        }

        if(amount <0){
            return res.status(400).json({
                success:false,
                message:"Amount must be a positive number"
            })
        }

        if(!['income','expense'].includes(type)){
            return res.status(400).json({
                success:false,
                message:"Type must be either income or expense"
             })
        }

        const record = await Record.create({
            amount,
            type,
            category,
            description,
            date:date || Date.now(),
            belongsTo,
            createdBy:req.user.id,
        })

        return res.status(201).json({
            success:true,
            message:"Record created successfully",
            data:record,
        })
    }catch(error){
        console.error("Error in createRecord controller:",error);
        return res.status(500).json({
            success:false,
            message:"Record creation failed due to server error",
        })
    }
}



exports.getRecords = async (req, res) => {
    try {
        
        const { type, category, startDate, endDate } = req.query;
        let filter = {};

        if (type) {
            filter.type = type;
        }

        if (category) {
            filter.category = category; 
        }

        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate); 
            if (endDate) filter.date.$lte = new Date(endDate);  
        }


        const records = await Record.find(filter)
            .populate('belongsTo', 'name')
            .populate('createdBy', 'name')
            .sort({ date: -1, createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: records.length,
            message: records.length > 0 ? "Records fetched successfully" : "No records found matching criteria",
            data: records
        });

    } catch (error) {
        console.error("Error in getRecords controller:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch records due to server error"
        });
    }
};



exports.updateRecord = async(req,res) => {
    try{
        const recordId = req.params.id;
        const { amount, type, category, description, date } = req.body;

        if(!recordId){
            return res.status(400).json({
                success:false,
                message:"Record ID is required"
            })
        }

        if(!['income','expense'].includes(type)){
            return res.status(400).json({
                success:false,
                message:"Type must be either income or expense"
             })
        }


        if(!category){
            return res.status(400).json({
                success:false,
                message:"Category is required"
            })
        }

       
        if(amount < 0){
            return res.status(400).json({
                success:false,
                message:"Amount cannot be negative"
            }) 
        }
        

        const updatedRecord = await Record.findByIdAndUpdate(
            recordId, 
            {amount, type, category, description, date}, 
            {new: true}
        );

        if (!updatedRecord) {
            return res.status(404).json({
                success: false,
                message: "Record not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Record updated successfully",
            data: updatedRecord
        });

    }catch(error){
        console.error("Error in updateRecord controller:",error);
        return res.status(500).json({
            success:false,
            message:"Failed to update record due to server error"
        })
    }
}



exports.deleteRecord = async(req,res) => {
    try{
        const recordId = req.params.id;
      
        if(!recordId){
            return res.status(400).json({
                success:false,
                message:"Record ID is required"
            })
        }

        const deletedRecord = await Record.findByIdAndDelete(recordId);

        if (!deletedRecord) {
            return res.status(404).json({
                success: false,
                message: "Record not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Record deleted successfully",
        });

    }catch(error){
        console.error("Error in deleteRecord controller:",error);
        return res.status(500).json({
            success:false,
            message:"Failed to delete record due to server error"
        })
    }
}