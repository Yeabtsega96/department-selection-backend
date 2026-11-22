import { fromNodeHeaders } from "better-auth/node";
import { validateCreateDepartmentHead } from "./dean.validation.js";
import { createDepartmentHead, createDepartmentHeadAssignment } from "./dean.service.js";
import { validateCreateAssignment } from "./department-head-assignment.validation.js"

export async function createDepartmentHeadController(req, res, next) {
  // 1. Validate request body
  const validation = validateCreateDepartmentHead(req.body);

  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: validation.errors,
    });
  }

  try {
    // 2. Create department head through the service
    const { user, temporaryPassword } = await createDepartmentHead({
      data: validation.data,
      headers: fromNodeHeaders(req.headers),
    });
    // 3. Return the created user and temporary password
    return res.status(201).json({
      success: true,
      message: "Department Head account created successfully.",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
          role: user.role,
          isActive: user.isActive,
        },
        temporaryPassword,
      },
    });
  } catch (error) {
    next(error);
  }
}




export async function createDepartmentHeadAssignmentController(req, res, next) {
  const validation = validateCreateAssignment(req.body);
 
  if(!validation.valid) {
    return res.status(400).json({
      sucess: false,
      message: "Validation failed.",
      errors: validation.errors,
    })
  }

  try {
    const assignment = await createDepartmentHeadAssignment({
      data: validation.data,
      assignedBy: req.user.id,
    })

    return res.status(201).json({
      success: true,
      message: "Department Head assigned successfully.",
      data: assignment,
    })
  } catch (error) {
    next(error);
  }
}