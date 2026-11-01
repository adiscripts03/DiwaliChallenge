import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose | null> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectToDatabase(): Promise<typeof mongoose | null> {
  if (!MONGODB_URI) {
    return null;
  }

  // Handle URL-encoded or angle-bracketed formats safely
  let cleanUri = MONGODB_URI.trim();
  // If user wrapped in <...>, strip outer brackets
  cleanUri = cleanUri.replace(/<([^>]+)>/g, '$1');

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose.connect(cleanUri, opts).then((mongooseInstance) => {
      console.log('MongoDB connected successfully');
      return mongooseInstance;
    }).catch((err) => {
      console.warn('MongoDB connection warning:', err.message);
      cached.promise = null;
      return null;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e: any) {
    cached.promise = null;
    console.warn('MongoDB failed to connect:', e.message);
    return null;
  }

  return cached.conn;
}

export interface UserStats {
  todaySolved: number;
  leetcode: number;
  codeforces: number;
  codechef: number;
  lastUpdated: string;
}

export interface UserHandles {
  leetcode: string;
  codeforces: string;
  codechef: string;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role?: 'user' | 'admin';
  handles: UserHandles;
  stats: UserStats;
  lastSyncAt?: string;
  createdAt: string;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    handles: {
      leetcode: { type: String, default: '' },
      codeforces: { type: String, default: '' },
      codechef: { type: String, default: '' },
    },
    stats: {
      todaySolved: { type: Number, default: 0 },
      leetcode: { type: Number, default: 0 },
      codeforces: { type: Number, default: 0 },
      codechef: { type: Number, default: 0 },
      lastUpdated: { type: String, default: () => new Date().toISOString() },
    },
    lastSyncAt: { type: String },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: false }
);

export const UserModel: mongoose.Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

const MetaSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: String, required: true },
});

export const MetaModel =
  mongoose.models.Meta || mongoose.model('Meta', MetaSchema);
