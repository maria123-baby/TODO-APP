import authmiddleware from '../middleware/authmiddleware.js';
import User from '../models/user.model.js';
import express from 'express';

const router = express.Router();
console.log("TODO ROUTES FILE LOADED");
//Get all Todos
router.get('/todos',authmiddleware, async(req,res)=>{
    try{
        console.log("USER ID:", req.userId);
        const user = await User.findById(req.userId);
        console.log("USER:", user);
        console.log("GET /api/todos HIT");
        res.json(user.todo);
    }
    catch(error){
        res.status(500).json({message:error.messaage});
    }
})

//Add new Todo
router.post('/todos',authmiddleware,async(req,res)=>{
    console.log("POST /api/todos HIT");
    try{
    const user = await User.findById(req.userId);
    user.todo.push({
        text: req.body.text,
        completed:false
    });
    
        await user.save();
        res.status(201).json(user.todo[user.todo.length - 1]);
    }
    catch(error){
        res.status(400).json({message:error.messaage});
    }
})

//Update Todo
router.patch("/todos/:id",authmiddleware, async(req,res)=>{
    
    try{
        const user = await User.findById(req.userId);
        const todo = await user.todo.id(req.params.id);
        if(!todo) return res.status(404).send("Todo not found");

        if(req.body.text != undefined){
            todo.text = req.body.text;
        }
        if(req.body.completed!=undefined){
            todo.completed = req.body.completed;
        }
        await user.save();
        res.send("Todo updated");

    }
    catch(error){
        res.status(400).json({message:error.messaage});
    }
})

//Delete a todo
router.delete('/todos/:id',authmiddleware,async (req,res)=>{
    try{
        const user = await User.findById(req.userId);
        const todo = await user.todo.id(req.params.id);
        if(!todo) return res.status(404).send("Todo not found");
        todo.deleteOne();
        await user.save();
        res.send("Todo deleted");

    }
    catch(error){
       res.status(500).json({message:error.messaage});
    }
})

router.patch("/todos/:id/deadline", authmiddleware, async (req, res) => {
  try {
    const { deadline } = req.body; // expected ISO date string
    const user = await User.findById(req.userId);
    const todo = user.todo.id(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });

    todo.deadline = deadline; // update deadline
    await user.save();
    res.json({ message: "Deadline updated", todo });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;