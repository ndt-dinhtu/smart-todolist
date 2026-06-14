import mongoose from "mongoose";

export const connectionDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION);
   console.log('✅ Đã kết nối thành công tới MongoDB')
  } catch (error) {
    console.error('❌ Lỗi kết nối MongoDB:', err)
    process.exit(1);
  }
};
