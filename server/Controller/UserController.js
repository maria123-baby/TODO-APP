import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

const generateToken = (user) => {
    return jwt.sign({ email: user.email, id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });
}

export const Register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password){
            return res.status(400).json({ success: false, message: "All fields required" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already registered" });
        }
        console.log(username, password);
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({ username, email, password: hashedPassword });
        console.log(newUser);
        const token = generateToken(newUser);
        return res.status(201).json({
            success: true, message: "User registered successfully",
            token,
            user: { id: newUser._id, username: newUser.username, email: newUser.email }
        });

    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password){
            return res.status(400).json({ success: false, message: "All fields required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
    console.log("Sending invalid user response"); // Debug
            return res.status(400).json({ success: false, message: "Invalid user" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid Credentials" });
        }
        const token = generateToken(user);
        return res.status(201).json({
            success: true, message: "User is logged in successfully",
            token,
            user: { id: user._id, username: user.username, email: user.email }
        });


    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }

}

export const logout = async (req, res) => {
    res.status(200).json({ message: "User logout successfully" });
}