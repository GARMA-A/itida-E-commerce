import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

const BankAccountSchema = new Schema({
  bankName: {
    type: String,
    required: true,
    trim: true,
  },
  accountNumber: {
    type: String,
    required: true,
  },
  routingNumber: {
    type: String,
    required: true,
  },
  accountHolderName: {
    type: String,
    required: true,
    trim: true,
  },
  accountType: {
    type: String,
    required: true,
    enum: ["checking", "savings"],
  },
});

const AddressSchema = new Schema({
  street: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    trim: true,
  },
  zipCode: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    trim: true,
  },
});

const SellerSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    businessName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    businessType: {
      type: String,
      required: true,
      enum: ["individual", "business", "corporation"],
    },
    businessAddress: {
      type: AddressSchema,
      required: true,
    },
    businessPhone: {
      type: String,
      required: true,
      trim: true,
    },
    businessEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, "Please enter a valid email"],
    },
    website: {
      type: String,
      trim: true,
    },
    logo: {
      type: String,
      trim: true,
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected", "suspended"],
      default: "pending",
    },
    verificationDocuments: [String],
    bankAccountInfo: {
      type: BankAccountSchema,
      required: true,
    },
    commissionRate: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 15,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    totalSales: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
SellerSchema.pre("save", async function(next) {
  if (!this.isModified("bankAccountInfo")) return next();

  try {
    const saltRounds = 10;
    if (this.bankAccountInfo.accountNumber) {
      this.bankAccountInfo.accountNumber = await bcrypt.hash(
        this.bankAccountInfo.accountNumber,
        saltRounds
      );
    }
    if (this.bankAccountInfo.routingNumber) {
      this.bankAccountInfo.routingNumber = await bcrypt.hash(
        this.bankAccountInfo.routingNumber,
        saltRounds
      );
    }
    next();
  } catch (err: any) {
    next(err);
  }
});

export default mongoose.model("Seller", SellerSchema);
