
const ALLOWED_CREATE_FIELDS = [
  "name",
  "startDate",
  "endDate",
];

const ALLOWED_UPDATE_FIELDS = [
  "name",
  "startDate",
  "endDate",
];

const ALLOWED_STATUSES = [
  "UPCOMING",
  "ACTIVE",
  "COMPLETED",
];

// Helper: validate date strings
function isValidDate(value) {
  return (
    typeof value === "string" &&
    !Number.isNaN(Date.parse(value)) &&
    /^\d{4}-\d{2}-\d{2}$/.test(value)
  );
}

// CREATE ACADEMIC YEAR
export function validateCreateAcademicYear(body) {
  const errors = [];

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return {
      valid: false,
      errors: ["Request body must be an object."],
    };
  }

  const unknownFields = Object.keys(body).filter(
    (field) => !ALLOWED_CREATE_FIELDS.includes(field)
  );

  if (unknownFields.length > 0) {
    errors.push(`Unexpected fields: ${unknownFields.join(", ")}.`);
  }

  const { name, startDate, endDate } = body;

  if (typeof name !== "string" || !name.trim()) {
    errors.push("Academic year name is required.");
  } else if (name.trim().length < 4 || name.trim().length > 30) {
    errors.push("Academic year name must be between 4 and 30 characters.");
  }

  if (!isValidDate(startDate)) {
    errors.push("startDate must be a valid date in YYYY-MM-DD format.");
  }

  if (!isValidDate(endDate)) {
    errors.push("endDate must be a valid date in YYYY-MM-DD format.");
  }

  if (isValidDate(startDate) && isValidDate(endDate)) {
    if (new Date(endDate) <= new Date(startDate)) {
      errors.push("endDate must be later than startDate.");
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      name: name.trim(),
      startDate,
      endDate,
    },
  };
}

// UPDATE ACADEMIC YEAR
export function validateUpdateAcademicYear(body) {
  const errors = [];

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return {
      valid: false,
      errors: ["Request body must be an object."],
    };
  }

  const fields = Object.keys(body);

  if (fields.length === 0) {
    errors.push("At least one field is required for update.");
  }

  const unknownFields = fields.filter(
    (field) => !ALLOWED_UPDATE_FIELDS.includes(field)
  );

  if (unknownFields.length > 0) {
    errors.push(`Unexpected fields: ${unknownFields.join(", ")}.`);
  }

  const { name, startDate, endDate } = body;

  if (name !== undefined) {
    if (typeof name !== "string" || !name.trim()) {
      errors.push("Academic year name cannot be empty.");
    } else if (name.trim().length < 4 || name.trim().length > 30) {
      errors.push("Academic year name must be between 4 and 30 characters.");
    }
  }

  if (startDate !== undefined && !isValidDate(startDate)) {
    errors.push("startDate must be a valid date in YYYY-MM-DD format.");
  }

  if (endDate !== undefined && !isValidDate(endDate)) {
    errors.push("endDate must be a valid date in YYYY-MM-DD format.");
  }

  if (
    isValidDate(startDate) &&
    isValidDate(endDate) &&
    new Date(endDate) <= new Date(startDate)
  ) {
    errors.push("endDate must be later than startDate.");
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      ...(name !== undefined && { name: name.trim() }),
      ...(startDate !== undefined && { startDate }),
      ...(endDate !== undefined && { endDate }),
    },
  };
}

// UPDATE ACADEMIC YEAR STATUS
export function validateAcademicYearStatus(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return {
      valid: false,
      errors: ["Request body must be an object."],
    };
  }

  const unknownFields = Object.keys(body).filter(
    (field) => field !== "status"
  );

  if (unknownFields.length > 0) {
    return {
      valid: false,
      errors: [`Unexpected fields: ${unknownFields.join(", ")}.`],
    };
  }

  if (!ALLOWED_STATUSES.includes(body.status)) {
    return {
      valid: false,
      errors: [
        `status must be one of: ${ALLOWED_STATUSES.join(", ")}.`,
      ],
    };
  }

  return {
    valid: true,
    data: {
      status: body.status,
    },
  };
}
