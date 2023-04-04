import { Schema, model, models } from 'mongoose';

const playEventSchema = new Schema({
  signature: {
    type: String,
    required: true,
    unique: true,
  },
  lootboxName: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  rarity: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  name: String,
  symbol: String,
  mint: String,
  amount: Number,
});

export default models.playEvents || model('playEvents', playEventSchema);