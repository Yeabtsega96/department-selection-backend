const DEPARTMENT_INFO_FIELDS = [
  "description",
  "vision",
  "mission",
  "objectives",
];


export function validateCreateDepartment(body) {
  const errors = [];

  const { code, name, campusId, description, vision, mission, objectives } =
    body ?? {};

  if (typeof code !== "string" || !code.trim()) {
    errors.push("Department code is required.");
  }

  if (typeof name !== "string" || name.trim().length < 2) {
    errors.push("Department name must contain at least 2 characters.");
  }

  if (typeof campusId !== "string" || !campusId.trim()) {
    errors.push("Campus ID is required.");
  }

  const optionalField = {
    description,
    vision,
    mission,
    objectives,
  };

  for (const [field, value] of Object.entries(optionalField)) {
    if (value !== undefined && value !== null && typeof value !== "string") {
      errors.push(`${field} must be a string.`);
    }
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors,
    };
  }

  return {
    valid: true,
    data: {
      code: code.trim().toUpperCase(),
      name: name.trim(),
      campusId: campusId.trim(),
      description: description?.trim() || null,
      vision: vision?.trim() || null,
      mission: mission?.trim() || null,
      objectives: objectives?.trim() || null,
    },
  };
}



// DEAN can update structural and descriptive fields.
export function validateDeanUpdateDepartment(body) {
  const errors = [];
  const data = {};

  const allowedFields = [
    "code",
    "name",
    "campusId",
    "isActive",
    ...DEPARTMENT_INFO_FIELDS,
  ];

  for (const field of Object.keys(body ?? {})) {
    if (!allowedFields.includes(field)) {
      errors.push(`Field '${field}' cannot be updated.`);
    }
  }

  if (!body || Object.keys(body).length === 0) {
    errors.push("At least one field is required.");
  }

  if (body?.code !== undefined) {
    if (typeof body.code !== "string" || !body.code.trim()) {
      errors.push("Department code cannot be empty.");
    } else {
      data.code = body.code.trim().toUpperCase();
    }
  }

  if (body?.name !== undefined) {
    if (typeof body.name !== "string" || body.name.trim().length < 2) {
      errors.push("Department name must contain at least 2 characters.");
    } else {
      data.name = body.name.trim();
    }
  }

  if (body?.campusId !== undefined) {
    if (typeof body.campusId !== "string" || !body.campusId.trim()) {
      errors.push("Campus ID cannot be empty.");
    } else {
      data.campusId = body.campusId.trim();
    }
  }

  if (body?.isActive !== undefined) {
    if (typeof body.isActive !== "boolean") {
      errors.push("isActive must be a boolean.");
    } else {
      data.isActive = body.isActive;
    }
  }

  for (const field of DEPARTMENT_INFO_FIELDS) {
    if (body?.[field] !== undefined) {
      if (body[field] !== null && typeof body[field] !== "string") {
        errors.push(`${field} must be a string or null.`);
      } else {
        data[field] = body[field]?.trim() || null;
      }
    }
  }

  if (errors.length) {
    return { valid: false, errors };
  }

  return { valid: true, data };
}

// Department Head can update descriptive information only.
export function validateDepartmentHeadUpdateDepartment(body) {
  const errors = [];
  const data = {};

  if (!body || Object.keys(body).length === 0) {
    errors.push("At least one field is required.");
  }

  for (const field of Object.keys(body ?? {})) {
    if (!DEPARTMENT_INFO_FIELDS.includes(field)) {
      errors.push(`You are not allowed to update '${field}'.`);
    }
  }

  for (const field of DEPARTMENT_INFO_FIELDS) {
    if (body?.[field] !== undefined) {
      if (body[field] !== null && typeof body[field] !== "string") {
        errors.push(`${field} must be a string or null.`);
      } else {
        data[field] = body[field]?.trim() || null;
      }
    }
  }

  if (errors.length) {
    return { valid: false, errors };
  }

  return { valid: true, data };
}