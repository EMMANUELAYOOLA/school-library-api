const catchAsync = require('../utils/catchAsync');
const attendantService = require('../services/attendantService');
const AppError = require('../utils/AppError');

exports.createAttendant = catchAsync(async (req, res) => {
  const attendant = await attendantService.createAttendant(req.body);
  res.status(201).json({
    status: 'success',
    data: { attendant }
  });
});

exports.getAllAttendants = catchAsync(async (req, res) => {
  const attendants = await attendantService.getAllAttendants();
  res.status(200).json({
    status: 'success',
    results: attendants.length,
    data: { attendants }
  });
});

exports.login = catchAsync(async (req, res) => {
  const { staffId, password } = req.body;

  if (!staffId || !password) {
    throw new AppError('Please provide staffId and password', 400);
  }

  const result = await attendantService.login(staffId, password);
  res.status(200).json({
    status: 'success',
    data: result
  });
});
