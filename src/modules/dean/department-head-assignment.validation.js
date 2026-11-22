
const ALLOWED_ASSIGNMENT_TYPES = ["PRIMARY", "ACTING"];

export function validateCreateAssignment(body) {
  const errors = [];

  const {
    departmentId,
    userId,
    assignmentType,
    startDate,
  } = body ?? {};

  // Validate department ID
  if (
    typeof departmentId !== "string" ||
    !departmentId.trim()
  ) {
    errors.push("A valid department ID is required.");
  }

  // Validate Department Head user ID
  if (
    typeof userId !== "string" ||
    !userId.trim()
  ) {
    errors.push("A valid Department Head user ID is required.");
  }

  // Validate assignment type
  if (!ALLOWED_ASSIGNMENT_TYPES.includes(assignmentType)) {
    errors.push("Assignment type must be PRIMARY or ACTING.");
  }

  // Validate start date
  if (
    typeof startDate !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(startDate) ||
    !Number.isFinite(Date.parse(`${startDate}T00:00:00.000Z`)) ||
    new Date(`${startDate}T00:00:00.000Z`).toISOString().slice(0, 10) !== startDate
  ) {
    errors.push("A valid start date in YYYY-MM-DD format is required.");
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
      departmentId: departmentId.trim(),
      userId: userId.trim(),
      assignmentType,
      startDate: new Date(`${startDate}T00:00:00.000Z`),
    },
  };
}
