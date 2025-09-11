import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    unique: [true, "username already taken"]  
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
  },
  role: {
    type: String,
    default: 'user'
  },
  otp: {
    type: String
  },
  otpExpires: {
    type: Date
  },
  appliedDrives: [
    {
      drive: { type: mongoose.Schema.Types.ObjectId, ref: 'Drive' },
      status: {
        type: String,
        enum: ['pending', 'approve', 'reject'],
        default: 'pending',
      },
      appliedAt: { type: Date, default: Date.now },
    }
  ],
  joinedDrive: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Drive'
  }],
  donations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donation'
  }]
},
  {
    timestamps: true,
  }
)



userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
})

export default mongoose.model("User", userSchema);