import { Schema, model, models } from 'mongoose';

const prizeSchema = new Schema({
  url: {
    type: String,
    required: true,
    unique: true,
  },
}, { timestamps: true });

export default models.prizes || model('prizes', prizeSchema);