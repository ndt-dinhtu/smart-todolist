
import mongoose from 'mongoose';

const subTaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  isCompleted: { type: Boolean, default: false }
});

const taskSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['todo', 'in_progress', 'done'], 
    default: 'todo' 
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'low' 
  },
  dueDate: { type: Date, default: null }, 
  tags: [{ type: String }], 
  subTasks: [subTaskSchema], 
  pomodoroSessions: { type: Number, default: 0 }, 
}, { timestamps: true });


taskSchema.index({ userId: 1, dueDate: 1 });

export default mongoose.model('Task', taskSchema);