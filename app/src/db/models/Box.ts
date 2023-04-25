import { Schema, model, models } from 'mongoose';

const boxSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
  description: String,
  image: String,
}, { timestamps: true });

export default models.boxes || model('boxes', boxSchema);