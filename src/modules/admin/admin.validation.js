const ALLOWED_ROLES = ["DEAN", "COORDINATOR"];

export function validateCreateUser(body) {
  const errors = [];

  const { name, email, role } = body ?? {};

  //validate name
  if (typeof name !== "string" || name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long.");
  }

  //validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (typeof email !== "string" || !emailRegex.test(email.trim())) {
    errors.push("A valid email address is required.");
  }

  //validate role
  if (!ALLOWED_ROLES.includes(role)) {
    errors.push("Role must be either DEAN or COORDINATOR.");
  }

  if(errors.length > 0) {
    return {
        valid: fasle,
        errors,
    }
  }
  

  return {
    valid: true,
    data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
    }
  };
}
