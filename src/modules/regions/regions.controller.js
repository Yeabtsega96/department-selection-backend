import {
  validateCreateRegion,
  validateUpdateRegion,
  validateRegionStatus,
} from "./regions.validation.js";

import {
  createRegion,
  getRegions,
  getRegionById,
  updateRegion,
  updateRegionStatus,
} from "./regions.service.js";

// Helper: create a validation error
function sendValidationError(res, errors) {
  return res.status(400).json({
    success: false,
    message: "Validation failed.",
    errors,
  });
}

// Helper: convert query string booleans into actual booleans
function parseOptionalBoolean(value) {
  if (value === undefined) return undefined;
  if (value === "true") return true;
  if (value === "false") return false;

  return null;
}

export async function createRegionController(req, res, next) {
  const validation = validateCreateRegion(req.body);
  if (!validation.valid) {
    return sendValidationError(res, validation.errors);
  }

  try {
    const region = await createRegion(validation.data);

    res.status(201).json({
      success: true,
      message: "Region created successfully.",
      data: region,
    });
  } catch (error) {
    next(error);
  }
}

export async function getRegionsController(req, res, next) {
  try {
    const { search } = req.query;
    const isDevelopingRegion = parseOptionalBoolean(
      req.query.isDevelopingRegion,
    );
    const isActive = parseOptionalBoolean(req.query.isActive);

    const errors = [];

    if (search !== undefined && typeof search !== "string") {
      errors.push("search must be a string.");
    }

    if (
      req.query.isDevelopingRegion !== undefined &&
      isDevelopingRegion === null
    ) {
      errors.push("isDevelopingRegion must be true or false.");
    }

    if (req.query.isActive !== undefined && isActive === null) {
      errors.push("isActive must be true or false.");
    }

    if (errors.length > 0) {
      return sendValidationError(res, errors);
    }

    const result = await getRegions({
        search,
        isDevelopingRegion,
        isActive
    });

    return res.status(200).json({
        success: true,
        message: "Regions retrieved successfully.",
        data: result,
        total: result.total,
    })
  } catch (error) {
    next(error);
  }
}


export async function getRegionByIdController(req, res, next) {
    try {
        const region = await getRegionById(req.params.id);

        return res.status(200).json({
            sucess: true,
            message: "Region retrieved successfully.",
            data: region,
        })
    } catch (error) {
        next(error)
    }
}

export async function updateRegionController(req, res, next) {
    const validation = validateUpdateRegion(req.body);
    if(!validation.valid) {
        return sendValidationError(res, validation.errors);
    }

    try {
        const { id } = req.params;
        const updatedRegion = await updateRegion(id, validation.data);

        return res.status(200).json({
            success: true,
            message: "Region updated successfully.",
            data: updatedRegion,
        })
    } catch (error) {
        next(error);
    }
}


export async function updateRegionStatusController(req, res, next) {
    const validation = validateRegionStatus(req.body);
    if(!validation.valid) {
        return sendValidationError(res, validation.errors);
    }

    try {
        const updatedRegion = await updateRegionStatus(
            req.params.id, 
            validation.data.isActive
        );

        return res.status(200).json({
            success: true,
            message: "Region status updated successfully.",
            data: updatedRegion,
        })
    } catch (error) {
        next(error)
    }
}