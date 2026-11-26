import {
  createStudent,
  getStudents,
  getStudentTemporaryPassword,
  getStudentById,
  updateStudent,
  updateStudentStatus,
} from "./students.service.js";
import {
  validateCreateStudent,
  validateUpdateStudent,
} from "./students.validation.js";

export async function createStudentController(req, res, next) {
  const validation = validateCreateStudent(req.body);

  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      message: "Validation Failed.",
      errors: validation.errors,
    });
  }

  try {
    const result = await createStudent({
      data: validation.data,
      headers: req.headers,
    });

    return res.status(201).json({
      success: true,
      message: "Student account created successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function getStudentsController(req, res, next) {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);

    const limit = Math.min(
      100,
      Math.max(1, Number.parseInt(req.query.limit, 10) || 10),
    );

    const { search, gender, regionId } = req.query;

    let studentStatus;

    if (req.query.studentStatus !== undefined) {
      if (!["true", "false"].includes(req.query.studentStatus)) {
        return res.status(400).json({
          success: false,
          message: "isActive must be true or false.",
        });
      }

      studentStatus = req.query.studentStatus === "true";
    }

    const result = await getStudents({
      page,
      limit,
      search,
      regionId,
      gender,
      studentStatus,
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

export async function getStudentTemporaryPasswordController(req, res, next) {
  try {
    const result = await getStudentTemporaryPassword(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Temporary student password retrieved successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function getStudentByIdController(req, res, next) {
  try {
    const student = await getStudentById(req.params.universityStudentId);

    return res.status(200).json({
      success: true,
      message: "Student retrieved successfully.",
      data: student,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateStudentController(req, res, next) {
  const validation = validateUpdateStudent(req.body);
  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      message: "Validation Failed.",
      errors: validation.errors,
    });
  }
  try {
    const updatedStudent = await updateStudent(
      req.params.universityStudentId,
      validation.data,
    );

    return res.status(200).json({
        success: true,
        message: "Student account updated successfully.",
        data: updatedStudent,
    })
  } catch (error) {
    next(error);
  }
}


export async function updateStudentStatusController(req, res, next) {
    try {
        const { universityStudentId } = req.params;
        const { isActive  } = req.body;

        if(typeof isActive !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "isActive must be a boolean."
            });
        }

        const result = await updateStudent(universityStudentId, isActive);

        res.status(200).json({
            success: true,
            message: `Student account ${isActive ? "activated" : "deactivated"} successfully.`,
            data: result,
        })
    } catch (error) {
        next(error);
    }
}
