import {
  validateCreateAcademicYear,
  validateUpdateAcademicYear,
  validateAcademicYearStatus,
} from "./academic-years.validation.js";

import {
  createAcademicYear,
  getAcademicYears,
  getAcademicYearById,
  updateAcademicYear,
  updateAcademicYearStatus,
  setCurrentAcademicYear,
} from "./academic-years.service.js";

// Helper: send validation errors
function sendValidationError(res, errors) {
  return res.status(400).json({
    success: false,
    message: "Validation failed.",
    errors,
  });
}

export async function createAcademicYearController(req, res, next) {
  const validation = validateCreateAcademicYear(req.body);
  if (!validation.valid) {
    return sendValidationError(res, validation.errors);
  }
  try {
    const academicYear = await createAcademicYear(validation.data);

    return res.status(201).json({
      success: true,
      message: "Academic year created successfully.",
      data: academicYear,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAcademicYearsController(req, res, next) {
  try {
    const { search, status } = req.query;
    const errors = [];

    if (search !== undefined && typeof search !== "string") {
      errors.push("search must be a string.");
    }

    const allowedStatuses = ["UPCOMING", "ACTIVE", "COMPLETED"];

    if (status !== undefined && !allowedStatuses.includes(status)) {
      errors.push(`status must be one of: ${allowedStatuses.join(", ")}.`);
    }

    if (errors.length > 0) {
      return sendValidationError(res, errors);
    }
    const result = await getAcademicYears({ search, status });

    return res.status(200).json({
      success: true,
      message: "Academic years retrieved successfully.",
      data: result.data,
      total: result.total,
    });
  } catch (error) {
    next(error);
  }
}

// GET ACADEMIC YEAR BY ID
export async function getAcademicYearByIdController(req, res, next) {
  try {
    const academicYear = await getAcademicYearById(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Academic year retrieved successfully.",
      data: academicYear,
    });
  } catch (error) {
    next(error);
  }
}

// UPDATE ACADEMIC YEAR
export async function updateAcademicYearController(req, res, next) {
  const validation = validateUpdateAcademicYear(req.body);
  if (!validation.valid) {
    return sendValidationError(res, validation.errors);
  }

  try {
    const academicYear = await updateAcademicYear(
      req.params.id,
      validation.data,
    );

    return res.status(200).json({
      success: true,
      message: "Academic year updated successfully.",
      data: academicYear,
    });
  } catch (error) {
    next(error);
  }
}

// UPDATE ACADEMIC YEAR STATUS
export async function updateAcademicYearStatusController(req, res, next) {
  const validation = validateAcademicYearStatus(req.body);
  if (!validation.valid) {
    return sendValidationError(res, validation.errors);
  }

  try {
    const academicYear = await updateAcademicYearStatus(
      req.params.id,
      validation.data.status,
    );

    return res.status(200).json({
        success: true,
        message: "Academic year status updated successfully.",
        data: academicYear,
    })
  } catch (error) {
    next(error);
  }
}


// SET CURRENT ACADEMIC YEAR
export async function setCurrentAcademicYearController(req, res, next) {
    try {
        const academicYear = await setCurrentAcademicYear(req.params.id);

        res.status(200).json({
            success: true,
            message: "Current academic year updated successfully.",
            data: academicYear,
        })
    } catch (error) {
        next(error);
    }
}