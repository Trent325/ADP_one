import mongoose, { Document, Schema } from 'mongoose';

export interface ILoginRecord extends Document {
  userId: string;
  username: string;
  loginTime: Date;
}

const LoginRecordSchema: Schema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  loginTime: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const LoginRecord = mongoose.model<ILoginRecord>('LoginRecord', LoginRecordSchema);

export default LoginRecord;
