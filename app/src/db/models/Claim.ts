import { Schema, model, models } from 'mongoose';

const claimSchema = new Schema({
  user: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  discordId: {
    type: String,
    required: true,
  },
  lootboxName: {
    type: String,
    required: true,
  },
  prizeIndex: {
    type: Number,
    required: true,
  },
  itemIndex: {
    type: Number,
    required: true,
  }
}, { timestamps: true });

export default models.claims || model('claims', claimSchema);