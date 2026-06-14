// backend/src/controllers/taskController.js
import Task from "../models/Task.js";

// 1. LẤY DANH SÁCH TASK (Có tích hợp sẵn bộ lọc thông minh)
export const getTasks = async (req, res) => {
  try {
    const { status, priority, filter } = req.query;
    let query = { userId: req.userId }; // Luôn luôn lọc theo User đang đăng nhập

    // Lọc theo trạng thái (todo, in_progress, done) hoặc Độ ưu tiên nếu có truyền lên
    if (status) query.status = status;
    if (priority) query.priority = priority;

    // BỘ LỌC THỜI GIAN THÔNG MINH (Today, Week, Overdue)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (filter === "today") {
      // Hạn chót trong ngày hôm nay
      query.dueDate = {
        $gte: today,
        $lt: tomorrow,
      };
    } else if (filter === "week") {
      // Hạn chót trong vòng 7 ngày tới
      const endOfWeek = new Date(today);
      endOfWeek.setDate(endOfWeek.getDate() + 7);
      query.dueDate = {
        $gte: today,
        $lte: endOfWeek,
      };
    } else if (filter === "overdue") {
      // Đã quá hạn và chưa hoàn thành
      query.dueDate = { $lt: today };
      query.status = { $ne: "done" };
    }

    // Lấy danh sách ra và sắp xếp theo thứ tự mới nhất lên đầu
    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Lỗi khi lấy danh sách công việc!",
        error: error.message,
      });
  }
};

// 2. THÊM TASK MỚI
export const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, tags, subTasks } = req.body;

    if (!title) {
      return res
        .status(400)
        .json({ message: "Tiêu đề công việc không được để trống!" });
    }

    const newTask = new Task({
      userId: req.userId, // Gắn ID người tạo lấy từ token bảo mật
      title,
      description,
      priority,
      dueDate,
      tags,
      subTasks,
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi tạo công việc mới!", error: error.message });
  }
};

// 3. CẬP NHẬT TASK (Sửa tiêu đề, trạng thái, sub-task...)
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm task và kiểm tra xem có đúng là của User này sở hữu không
    const task = await Task.findOne({ _id: id, userId: req.userId });
    if (!task) {
      return res
        .status(404)
        .json({
          message: "Không tìm thấy công việc hoặc bạn không có quyền sửa!",
        });
    }

    // Cập nhật các trường dữ liệu truyền lên bằng hàm findByIdAndUpdate
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }, // Trả về data mới sau khi sửa và check kĩ kiểu dữ liệu
    );

    res.status(200).json(updatedTask);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi cập nhật công việc!", error: error.message });
  }
};

// 4. XÓA TASK
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm và xóa đúng task của User đó
    const task = await Task.findOneAndDelete({ _id: id, userId: req.userId });
    if (!task) {
      return res
        .status(404)
        .json({
          message: "Không tìm thấy công việc hoặc bạn không có quyền xóa!",
        });
    }

    res.status(200).json({ message: "Xóa công việc thành công!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi xóa công việc!", error: error.message });
  }
};
