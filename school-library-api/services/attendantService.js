const LibraryAttendant = require('../models/LibraryAttendant');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

class AttendantService {
  async createAttendant(data) {
    const { password, ...rest } = data;
    const hashedPassword = await bcrypt.hash(password, 12);

    const attendant = await LibraryAttendant.create({
      ...rest,
      password: hashedPassword
    });

    const attendantObj = attendant.toObject();
    delete attendantObj.password;
    return attendantObj;
  }

  async getAllAttendants() {
    const attendants = await LibraryAttendant.find().select('-password').sort({ createdAt: -1 });
    return attendants;
  }

  async login(staffId, password) {
    const attendant = await LibraryAttendant.findOne({ staffId }).select('+password');

    if (!attendant || !(await bcrypt.compare(password, attendant.password))) {
      throw new AppError('Invalid staff ID or password', 401);
    }

    const token = jwt.sign(
      { id: attendant._id, role: attendant.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    return {
      token,
      attendant: {
        id: attendant._id,
        name: attendant.name,
        staffId: attendant.staffId,
        role: attendant.role
      }
    };
  }
}

module.exports = new AttendantService();
