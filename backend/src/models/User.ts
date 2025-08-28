import mongoose, { Document, Schema, Model, Types } from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

// Define Address subdocument
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

// Define User interface
export interface IUser extends Document {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  profileImage?: string;
  isActive: boolean;
  emailVerified: boolean;
  addresses?: IAddress[];
  createdAt: Date;
  updatedAt: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Define User Schema
const UserSchema: Schema<IUser> = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      index: true, // Add index for faster lookups
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: true,
      minlength: 1, // Allow numeric-only passwords
    },
    phoneNumber: { type: String },
    dateOfBirth: { type: Date },
    profileImage: { type: String },
    isActive: { type: Boolean, default: true },
    emailVerified: { type: Boolean, default: false },
    addresses: [AddressSchema],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();

  // Only hash if password is not already hashed (contains letters)
  if (!/^\$2[aby]\$\d+\$/.test(this.password)) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Export Model
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
