
const ALLOWED_CREATE_FIELDS = [
  "code",
  "name",
  "isDevelopingRegion",
];

const ALLOWED_UPDATE_FIELDS = [
  "code",
  "name",
  "isDevelopingRegion",
];

const ALLOWED_CODES = /^[A-Z0-9_-]{2,10}$/;

// CREATE REGION
export function validateCreateRegion(body) {
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

  const { code, name, isDevelopingRegion } = body;

  if (typeof code !== "string" || !code.trim()) {
    errors.push("Region code is required.");
  } else if (!ALLOWED_CODES.test(code.trim().toUpperCase())) {
    errors.push(
      "Region code must contain 2-10 letters, numbers, underscores, or hyphens."
    );
  }

  if (typeof name !== "string" || !name.trim()) {
    errors.push("Region name is required.");
  } else if (name.trim().length < 2 || name.trim().length > 100) {
    errors.push("Region name must be between 2 and 100 characters.");
  }

  if (
    isDevelopingRegion !== undefined &&
    typeof isDevelopingRegion !== "boolean"
  ) {
    errors.push("isDevelopingRegion must be a boolean.");
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      code: code.trim().toUpperCase(),
      name: name.trim(),
      isDevelopingRegion: isDevelopingRegion ?? false,
    },
  };
}

// UPDATE REGION
export function validateUpdateRegion(body) {
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

  const { code, name, isDevelopingRegion } = body;

  if (code !== undefined) {
    if (typeof code !== "string" || !code.trim()) {
      errors.push("Region code cannot be empty.");
    } else if (!ALLOWED_CODES.test(code.trim().toUpperCase())) {
      errors.push("Invalid region code format.");
    }
  }

  if (name !== undefined) {
    if (typeof name !== "string" || !name.trim()) {
      errors.push("Region name cannot be empty.");
    } else if (name.trim().length < 2 || name.trim().length > 100) {
      errors.push("Region name must be between 2 and 100 characters.");
    }
  }

  if (
    isDevelopingRegion !== undefined &&
    typeof isDevelopingRegion !== "boolean"
  ) {
    errors.push("isDevelopingRegion must be a boolean.");
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      ...(code !== undefined && {
        code: code.trim().toUpperCase(),
      }),
      ...(name !== undefined && {
        name: name.trim(),
      }),
      ...(isDevelopingRegion !== undefined && {
        isDevelopingRegion,
      }),
    },
  };
}

// UPDATE REGION STATUS
export function validateRegionStatus(body) {
  if (
    !body ||
    typeof body !== "object" ||
    Array.isArray(body) ||
    ![true, false, "true", "false"].includes(body.isActive)
  ) {
    return {
      valid: false,
      errors: ["isActive must be true, false, 'true', or 'false'."],
    };
  }

  const unknownFields = Object.keys(body).filter(
    (field) => field !== "isActive"
  );

  if (unknownFields.length > 0) {
    return {
      valid: false,
      errors: [`Unexpected fields: ${unknownFields.join(", ")}.`],
    };
  }

  return {
    valid: true,
    data: {
      isActive: body.isActive === true || body.isActive === "true",
    },
  };
}
