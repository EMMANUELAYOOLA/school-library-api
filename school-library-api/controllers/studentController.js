const catchAsync = require('../utils/catchAsync');
const studentService = require('../services/studentService');

exports.createStudent = catchAsync(async (req, res) => {
  const student = await studentService.createStudent(req.body);
  res.status(201).json({
    status: 'success',
    data: { student }
  });
});

exports.getAllStudents = catchAsync(async (req, res) => {
  const students = await studentService.getAllStudents();
  res.status(200).json({
    status: 'success',
    results: students.length,
    data: { students }
  });
});

exports.getStudent = catchAsync(async (req, res) => {
  const student = await studentService.getStudentById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: { student }
  });
});
