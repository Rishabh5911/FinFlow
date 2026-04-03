const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter all required fields: name,email and password",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
        return res.status(400).json({
            success:false,
            message:"Please enter a valid email address"
        })
    }

    if (role) {
      const validRoles = ["Admin", "Analyst", "Viewer"];

      if (!validRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid role. Please provide a valid role Admin, Analyst or Viewer",
        });
      }
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const existingUser = await User.findOne({ email });
    if(existingUser){
        return res.status(400).json({
            success:false,
            message:"User already registered with this email"
        })
    }

   const user = await User.create({
    name,
    email,
    password,
    role:role || 'Viewer',
    status:'active',
   })

   return res.status(201).json({
    success:true,
    message:"User registered successfully",
    user:{
        id:user._id,
        name:user.name,
        email:user.email,
        role:user.role,
        status:user.status
    }
   })
  } catch (error) {
    console.error("Error in register controller:",error);
    return res.status(500).json({
        success:false,
        message:"Registration failed due to server error"
    })
  }
};




exports.login = async (req, res) => {
  try {
    const { email, password} = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter all fields",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
        return res.status(400).json({
            success:false,
            message:"Please enter a valid email address"
        })
    }

    
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if(!user){
        return res.status(400).json({
            success:false,
            message:"User not found with this email"
        })
    }

    if (user.status === 'inactive') {
      return res.status(403).json({ 
          success: false, 
          message: "Your account is inactive. Please contact the admin" 
      });
    }

    const isMatch = await user.comparePassword(password);
    if(!isMatch){
      return res.status(400).json({
        success:false,
        message:"Password is incorrect"
      })
    }

    const payload = {
      id:user._id,
      role:user.role
    }

    const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'24h'});
    res.cookie('token',token,{
      httpOnly:true,
      maxAge:24*60*60*1000,
    })


   return res.status(200).json({
    success:true,
    message:"User logged in successfully",
    user:{
        id:user._id,
        name:user.name,
        email:user.email,
        role:user.role
    }
   })
  } catch (error) {
    console.error("Error in login controller:",error);
    return res.status(500).json({
        success:false,
        message:"Login failed due to server error"
    })
  }
};



exports.updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { status, role } = req.body; 

        if (userId === req.user.id) {
            return res.status(400).json({
                success: false,
                message: "Admin cannot update their own status or role"
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (status) user.status = status;
        if (role) user.role = role;

        await user.save();

        res.status(200).json({
            success: true,
            message: "User account updated successfully",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status
            }
        });
    } catch (error) {
        console.error("Error in updateUser controller:",error);
        res.status(500).json({ 
          success: false, 
          message:"Failed to update user due to server error" 
        });
    }
};
