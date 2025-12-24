
import mongoose from 'mongoose'
const strokeSchema=new mongoose.Schema({
    x0:Number,
    y0:Number,
    x1:Number,
    y1:Number,
    tool:String,
    color:String,
     lineWidth: Number
},{_id:false});



const drawingSchema= new mongoose.Schema({
    roomId:{
        type:String,
        required:true
    },
    strokes:[strokeSchema]
})




// const strokeSchema = new mongoose.Schema({
//   x0: Number, y0: Number, x1: Number, y1: Number,
//   tool: String, color: String, lineWidth: Number
// });
// const drawingSchema = new mongoose.Schema({
//   roomId: String,
//   strokes: [strokeSchema]
// });



// module.exports=mongoose.model('Drawing',drawingSchema)

const Drawing=mongoose.model("DRawing",drawingSchema)

export default Drawing



