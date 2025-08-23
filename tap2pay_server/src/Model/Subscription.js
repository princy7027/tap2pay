import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming a User model exists
    required: true,
  },
  agreementId: {
    type: String,
    required: true,
  },
  planId: {
    type: String,
    // required: true,
  },
  state: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  payerInfo: {
    email: {
      type: String,
      required: true,
    },
    payerId: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
  },
}, { timestamps: true });

export default mongoose.model('Subscription', subscriptionSchema);
