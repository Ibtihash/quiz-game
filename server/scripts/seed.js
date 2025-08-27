import 'dotenv/config';
import mongoose from 'mongoose';
import Question from '../models/Question.js';

const { MONGODB_URI } = process.env;

const sample = [
  {
    category: 'JavaScript',
    difficulty: 'easy',
    question: 'Which method is used to parse a JSON string into a JavaScript object?',
    options: [
      { label: 'A', text: 'JSON.stringify' },
      { label: 'B', text: 'JSON.parse' },
      { label: 'C', text: 'Object.fromJSON' },
      { label: 'D', text: 'parseJSON' }
    ],
    correctLabel: 'B'
  },
  {
    category: 'Web', difficulty: 'easy', question: 'What does CSS stand for?',
    options: [
      { label: 'A', text: 'Computer Style Sheets' },
      { label: 'B', text: 'Creative Style System' },
      { label: 'C', text: 'Cascading Style Sheets' },
      { label: 'D', text: 'Colorful Style Sheets' }
    ],
    correctLabel: 'C'
  },
  {
    category: 'React', difficulty: 'medium', question: 'Which hook is used for state in functional components?',
    options: [
      { label: 'A', text: 'useState' },
      { label: 'B', text: 'useMemo' },
      { label: 'C', text: 'useRef' },
      { label: 'D', text: 'useEffect' }
    ],
    correctLabel: 'A'
  },
  {
    category: 'MongoDB', difficulty: 'medium', question: 'What type is the _id field by default in MongoDB?',
    options: [
      { label: 'A', text: 'UUID' },
      { label: 'B', text: 'ObjectId' },
      { label: 'C', text: 'String' },
      { label: 'D', text: 'Number' }
    ],
    correctLabel: 'B'
  },
  {
    category: 'General', difficulty: 'easy', question: 'Which HTML tag is used to include JavaScript?',
    options: [
      { label: 'A', text: '<javascript>' },
      { label: 'B', text: '<js>' },
      { label: 'C', text: '<script>' },
      { label: 'D', text: '<code>' }
    ],
    correctLabel: 'C'
  }
];


async function run() {
try {
await mongoose.connect(MONGODB_URI);
await Question.deleteMany({});
await Question.insertMany(sample);
console.log('✅ Seeded questions:', sample.length);
} catch (e) {
console.error(e);
} finally {
await mongoose.disconnect();
process.exit(0);
}
}
run();