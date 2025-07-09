import mongoose from 'mongoose';

const PurchaseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  amount: Number,
  quantity: Number,
  paymentId: String,
  PayerID: String,
  cart: String,
}, { timestamps: true });

const Purchase = mongoose.model('Purchase', PurchaseSchema);
export default Purchase

