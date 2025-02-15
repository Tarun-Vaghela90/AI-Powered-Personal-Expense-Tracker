import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserSchema = new Schema({
  name:{
    type:String,
  },
  email:{
    type:String,  
    require:true,
    unique: true
  },
  password:{
    type:String,
    require:true
  },
  date:{
    type: Date,
    default: Date.now
  }
});

export default  mongoose.model('User',UserSchema); 