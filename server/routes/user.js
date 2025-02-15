import express from "express";
import passport from "passport";
import dotenv from "dotenv";
import  Usehellr  from '../model/User'

dotenv.config();

const router = express.Router();

router.get('/userdata',(req,res)=>{
     res.status(200).json({

     })
})




export default router; // Use export default instead of module.exports
