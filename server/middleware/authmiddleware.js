import jwt from 'jsonwebtoken';

const authmiddleware = (req,res,next)=>{
    const authHeader = req.headers.authorization;
    console.log("AUTH HEADER:", authHeader);
    if (!authHeader || !authHeader.startsWith("Bearer ")) {

        return res.status(401).json({message:"No TOKEN, authorization denied"});
    }
    const token = authHeader.split(" ")[1];
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        req.userId=decoded.id;
        next();
    }
    catch(error){
        res.status(401).json({message:"Invalid token"});
    }
}
export default authmiddleware;