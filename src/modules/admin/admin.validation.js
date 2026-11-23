const ALLOWED_ROLES = ["DEAN", "COORDINATOR"];

export function validateCreateUser(body) {
  const errors = [];

  const { name, email, role, employeeId } = body ?? {};

  //validate name
  if (typeof name !== "string" || name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long.");
  }

  //validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (typeof email !== "string" || !emailRegex.test(email.trim())) {
    errors.push("A valid email address is required.");
  }

  //validate name
  if (typeof employeeId !== "string" || employeeId.trim().length < 2) {
    errors.push("Employee Id must be at least 2 characters long.");
  }

  //validate role
  if (!ALLOWED_ROLES.includes(role)) {
    errors.push("Role must be either DEAN or COORDINATOR.");
  }

  if(errors.length > 0) {
    return {
        valid: false,
        errors,
    }
  }
  

  return {
    valid: true,
    data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
        employeeId,
    }
  };
}


export function validateUpdateUser(body) {
  const errors = [];

  const {
    name,
    email,
    username,
    employeeId,
    phone,
    jobTitle,
    office,
  } = body ?? {};

  // Check that at least one field is provided
  if (
    name === undefined &&
    email === undefined &&
    username === undefined &&
    employeeId === undefined &&
    phone === undefined &&
    jobTitle === undefined &&
    office === undefined
  ) {
    errors.push("At least one field must be provided.");
  }

  // Validate name
  if (
    name !== undefined &&
    (typeof name !== "string" || name.trim().length < 2)
  ) {
    errors.push("Name must be at least 2 characters long.");
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    email !== undefined &&
    (typeof email !== "string" || !emailRegex.test(email.trim()))
  ) {
    errors.push("A valid email address is required.");
  }

  // Validate username
  if (
    username !== undefined &&
    (typeof username !== "string" ||
      username.trim().length < 5 ||
      username.trim().length > 30)
  ) {
    errors.push("Username must be between 5 and 30 characters.");
  }

  // Validate employee ID
  if (
    employeeId !== undefined &&
    (typeof employeeId !== "string" || employeeId.trim().length < 2)
  ) {
    errors.push("Employee ID must be at least 2 characters long.");
  }

  // Validate optional profile fields
  for (const [field, value] of Object.entries({
    phone,
    jobTitle,
    office,
  })) {
    if (value !== undefined && typeof value !== "string") {
      errors.push(`${field} must be a string.`);
    }
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors,
    };
  }

  const data = {};

  if (name !== undefined) data.name = name.trim();
  if (email !== undefined) data.email = email.trim().toLowerCase();
  if (username !== undefined) data.username = username.trim();
  if (employeeId !== undefined) data.employeeId = employeeId.trim();
  if (phone !== undefined) data.phone = phone.trim();
  if (jobTitle !== undefined) data.jobTitle = jobTitle.trim();
  if (office !== undefined) data.office = office.trim();

  return {
    valid: true,
    data,
  };
}