import mongoose from 'mongoose';


const optionSchema = new mongoose.Schema({
label: { type: String, required: true }, // e.g., 'A', 'B', 'C', 'D'
text: { type: String, required: true }
}, { _id: false });


const questionSchema = new mongoose.Schema({
category: { type: String, default: 'General' },
difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
question: { type: String, required: true },
options: { type: [optionSchema], validate: v => v.length >= 2 },
correctLabel: { type: String, required: true } // matches one of option labels
}, { timestamps: true });


export default mongoose.model('Question', questionSchema);