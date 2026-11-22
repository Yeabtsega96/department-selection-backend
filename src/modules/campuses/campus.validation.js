export function validateCreateCampus(body) {
  const errors = [];

  const { name, code, location, description } = body ?? {};

  if (typeof code !== "string" || !code.trim()) {
    errors.push("Campus code is required.");
  }

  if (typeof name !== "string" || name.trim().length < 2) {
    errors.push("Campus name must contain at least 2 characters.");
  }

  if (
    location !== undefined &&
    location !== null &&
    typeof location !== "string"
  ) {
    errors.push("Location must be a string.");
  }

  if (
    description !== undefined &&
    description !== null &&
    typeof description !== "string"
  ) {
    errors.push("Description must be a string.");
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors: errors,
    };
  }

  return {
    valid: true,
    data: {
      code: code.trim().toUpperCase(),
      name: name.trim(),
      location: location?.trim() || null,
      description: description?.trim() || null,
    },
  };
}

export function validateUpdateCampus(body) {
  const errors = [];
  const data = {};

  const allowedFields = ["code", "name", "location", "description", "isActive"];

  if (!body || Object.keys(body).length === 0) {
    errors.push("At least one field is required.");
  }

  for (const field of Object.keys(body ?? {})) {
    if (!allowedFields.includes(field)) {
      errors.push(`Field '${field}' cannot be updated.`);
    }
  }

  if (body?.code !== undefined) {
    if (typeof body.code !== "string" || !body.code.trim()) {
      errors.push("Campus code cannot be empty.");
    } else {
      data.code = body.code.trim().toUpperCase();
    }
  }

  if (body?.name !== undefined) {
    if (typeof body.name !== "string" || !body.name.trim().length < 2) {
      errors.push("Campus name must contain at least 2 characters.");
    } else {
      data.name = body.name.trim();
    }
  }

  for (const field of ["location", "description"]) {
    if (body[field] !== undefined) {
      if (body[field] !== null && typeof body[field] !== "string") {
        errors.push(`${field} must be a string or null.`);
      } else {
        data[field] = body[field]?.trim() || null;
      }
    }
  }

  if (body?.isActive !== undefined) {
    if (typeof body.isActive !== "boolean") {
      errors.push("isActive must be a boolean.");
    } else {
      data.isActive = body.isActive;
    }
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors: errors,
    };
  }

  return {
    valid: true,
    data,
  };
}
