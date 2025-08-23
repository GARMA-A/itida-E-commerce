import mongoose, { Schema } from "mongoose";

const OrderItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const OrderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [OrderItemSchema],
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", OrderSchema);
