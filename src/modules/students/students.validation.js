const ALLOWED_GENDERS = ["MALE", "FEMALE"];
const ALLOWED_EMAIL_TYPES = ["UNIVERSITY", "PERSONAL"];

export function validateCreateStudent(body) {
  const errors = [];

  const { name, universityStudentId, gender, regionId, enrollmentYear } =
    body ?? {};

  // Name
  if (!name || typeof name !== "string" || !name.trim()) {
    errors.push("Student name is required.");
  } else if (name.trim().length < 3 || name.trim().length > 100) {
    errors.push("Student name must be between 3 and 100 characters.");
  }

  // University student ID
  if (
    !universityStudentId ||
    typeof universityStudentId !== "string" ||
    !universityStudentId.trim()
  ) {
    errors.push("University student ID is required.");
  } else if (
    universityStudentId.trim().length < 3 ||
    universityStudentId.trim().length > 50
  ) {
    errors.push("University student ID must be between 3 and 50 characters.");
  }

  // Gender
  if (!gender || !ALLOWED_GENDERS.includes(gender)) {
    errors.push("Gender must be MALE or FEMALE.");
  }

  // Region
  if (!regionId || typeof regionId !== "string" || !regionId.trim()) {
    errors.push("Region is required.");
  }

  // Enrollment year
  const currentYear = new Date().getFullYear();

  if (
    enrollmentYear === undefined ||
    enrollmentYear === null ||
    !Number.isInteger(enrollmentYear)
  ) {
    errors.push("Enrollment year must be a valid integer.");
  } else if (enrollmentYear < 2000 || enrollmentYear > currentYear) {
    errors.push(`Enrollment year must be between 2000 and ${currentYear}.`);
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
      universityStudentId: universityStudentId.trim(),
      gender,
      regionId: regionId.trim(),
      enrollmentYear,
    },
  };
}
 

export function validateUpdateStudent(body) {
  const errors = [];
  const {
    name,
    email,
    universityStudentId,
    gender,
    regionId,
    enrollmentYear,
    emailType,
  } = body ?? {};

  // 1. Ensure at least one updatable field is present
  if (
    name === undefined &&
    email === undefined &&
    universityStudentId === undefined &&
    gender === undefined &&
    regionId === undefined &&
    enrollmentYear === undefined &&
    emailType === undefined
  ) {
    return {
      valid: false,
      errors: ["At least one field must be provided."],
    };
  }

  const sanitizedData = {};

  // 2. Name (keep consistent with create: 3-100 chars)
  if (name !== undefined) {
    if (typeof name !== "string" || name.trim().length < 3 || name.trim().length > 100) {
      errors.push("Student name must be between 3 and 100 characters.");
    } else {
      sanitizedData.name = name.trim();
    }
  }

  // 3. Email
  if (email !== undefined) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof email !== "string" || !emailRegex.test(email.trim())) {
      errors.push("A valid email address is required.");
    } else {
      sanitizedData.email = email.trim().toLowerCase();
    }
  }

  // 4. University student ID (keep consistent with create: 3-50 chars)
  if (universityStudentId !== undefined) {
    if (
      typeof universityStudentId !== "string" ||
      universityStudentId.trim().length < 3 ||
      universityStudentId.trim().length > 50
    ) {
      errors.push("University student ID must be between 3 and 50 characters.");
    } else {
      sanitizedData.universityStudentId = universityStudentId.trim();
    }
  }

  // 5. Gender
  if (gender !== undefined) {
    if (!ALLOWED_GENDERS.includes(gender)) {
      errors.push("Gender must be MALE or FEMALE.");
    } else {
      sanitizedData.gender = gender;
    }
  }

  // 6. Region ID
  if (regionId !== undefined) {
    if (typeof regionId !== "string" || !regionId.trim()) {
      errors.push("Region ID must be a valid non-empty string.");
    } else {
      sanitizedData.regionId = regionId.trim();
    }
  }

  // 7. Enrollment year
  if (enrollmentYear !== undefined) {
    const currentYear = new Date().getFullYear();
    if (!Number.isInteger(enrollmentYear) || enrollmentYear < 2000 || enrollmentYear > currentYear) {
      errors.push(`Enrollment year must be an integer between 2000 and ${currentYear}.`);
    } else {
      sanitizedData.enrollmentYear = enrollmentYear;
    }
  }

  // 8. Email type
  if (emailType !== undefined) {
    if (!ALLOWED_EMAIL_TYPES.includes(emailType)) {
      errors.push(`Email type must be one of: ${ALLOWED_EMAIL_TYPES.join(", ")}.`);
    } else {
      sanitizedData.emailType = emailType;
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
    data: sanitizedData,
  };
}
