import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    todo:[{
        text:{
                type: String,
                required: true
            },
            completed:{
                type:Boolean,
                default:false
            },
            createdAt:{type:Date,default:Date.now},
            deadline: { type: Date }
    }]
},{timestamps:true});
const User = mongoose.model("User",userSchema);
export default User;
