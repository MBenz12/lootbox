import mongoose from 'mongoose';

const MONGODB_URL = 'mongodb+srv://doadmin:T59j637L28DC4mQf@db-mongodb-sfo3-35637-7da3f833.mongo.ondigitalocean.com/admin?tls=true&authSource=admin&replicaSet=db-mongodb-sfo3-35637';

// @ts-ignore
let cached = global.mongoose;

if (!cached) {
  // @ts-ignore
  cached = global.mongoose = { conn: null, promise: null };
}

async function connect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: true,
    };

    cached.promise = mongoose.connect(MONGODB_URL, opts).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connect;