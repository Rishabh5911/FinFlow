const jwt = require('jsonwebtoken');

const authMiddleware = (req,res,next) => {
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            success:false,
            message:"token is missing"
        })
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch(error){
        console.error("Error in auth middleware:",error);
        return res.status(401).json({
            success:false,
            message:"Invalid token"
        })
    }
}


module.exports = authMiddleware;