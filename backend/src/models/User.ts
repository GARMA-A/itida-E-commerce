import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

// -----------------------------
// 1. Define Address subdocument
// -----------------------------
interface IAddress {
  type: "billing" | "shipping" | "both";
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault?: boolean;
}

const AddressSchema: Schema<IAddress> = new Schema<IAddress>({
  type: {
    type: String,
    enum: ["billing", "shipping", "both"],
    required: true,
  },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});

// -----------------------------
// 2. Define User interface
// -----------------------------
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  dateofBirth?: Date;
  profilImage?: string;
  isActive: boolean;
  emailVerified: boolean;
  addresses?: IAddress[];
  createdAt: Date;
  updatedAt: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
}

// -----------------------------
// 3. Define User Schema
// -----------------------------
const UserSchema: Schema<IUser> = new Schema<IUser>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please enter a valid email"],
    },
    password: { type: String, required: true, minlength: 7 },
    phoneNumber: { type: String },
    dateofBirth: { type: Date },
    profilImage: { type: String },
    isActive: { type: Boolean, default: true },
    emailVerified: { type: Boolean, default: false },
    addresses: [AddressSchema],
  },
  {
    timestamps: true,
  }
);

// -----------------------------
// 4. Hash password before saving
// -----------------------------
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// -----------------------------
// 5. Compare password method
// -----------------------------
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// -----------------------------
// 6. Export Model
// -----------------------------
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
