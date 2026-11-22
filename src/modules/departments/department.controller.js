import {
  validateCreateDepartment,
  validateDeanUpdateDepartment,
  validateDepartmentHeadUpdateDepartment,
} from "./department.validation.js";
import {
  createDepartment,
  updateDepartmentByDean,
  updateDepartmentByHead,
  getDepartments,
  getDepartmentById,
  getMyDepartment,
} from "./department.service.js";

export async function getDepartmentsController(req, res, next) {
  try {
    const departments = await getDepartments();

    return res.status(200).json({
      success: true,
      count: departments.length,
      data: departments,
    });
  } catch (error) {
    next(error);
  }
}

export async function getDepartmentByIdController(req, res, next) {
  try {
    const department = await getDepartmentById(req.params.id);

    res.status(200).json({
      success: true,
      data: department,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMyDepartmentController(req, res, next) {
  try {
    const department = await getMyDepartment(req.user.id);

    return res.status(200).json({
      success: true,
      data: department,
    });
  } catch (error) {
    next(error);
  }
}

export async function createDepartmentController(req, res, next) {
  const validation = validateCreateDepartment(req.body);

  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: validation.errors,
    });
  }

  try {
    // create department
    const department = await createDepartment(validation.data);

    return res.status(201).json({
      success: true,
      message: "Department created successfully.",
      data: department,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateDepartmentByDeanController(req, res, next) {
  const validation = validateDeanUpdateDepartment(req.body);

  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      message: "Validation Failed.",
      errors: validation.errors,
    });
  }

  try {
    const department = await updateDepartmentByDean(
      req.params.id,
      validation.data,
    );

    return res.status(200).json({
      success: true,
      message: "Department updated successfully.",
      data: department,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateDepartmentByHeadController(req, res, next) {
  const validation = validateDepartmentHeadUpdateDepartment(req.body);

  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: validation.errors,
    });
  }

  try {
    const department = await updateDepartmentByHead(
      req.user.id,
      validation.data,
    );

    return res.status(200).json({
      success: true,
      message: "Department information updated successfully.",
      data: department,
    });
  } catch (error) {
    next(error);
  }
}
