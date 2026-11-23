export function validateCreateDepartmentHead(body) {
  const errors = [];
  const { name, email, employeeId } = body ?? {};

  if (typeof name !== "string" || name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long.");
  }

  if (typeof employeeId !== "string" || employeeId.trim().length < 2) {
    errors.push("Employee Id must be at least 2 characters long.");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (typeof email !== "string" || !emailRegex.test(email.trim())) {
    errors.push("A valid email address is required.");
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
      name: name.trim(),
      email: email.trim().toLowerCase(),
    },
  };
}

export function validateCreateDepartment(body) {
  const errors = [];

  const { name, code, campusId, description, mission, vision, objectives } =
    body ?? {};

  if (typeof name !== "string" || name.trim().length < 2) {
    errors.push("Department name must be at least 2 characters long.");
  }

  if (typeof code !== "string" || !code.trim()) {
    errors.push("Department code is required.");
  }

  if (typeof campusId !== "string" || !campusId.trim()) {
    errors.push("Campus ID is required.");
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
