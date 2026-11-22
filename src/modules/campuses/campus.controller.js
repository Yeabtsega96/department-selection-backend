import { validateCreateCampus, validateUpdateCampus } from "./campus.validation.js"

import { createCampus, getCampuses, getCampusById, updateCampus } from "./campus.service.js"



// ADMIN: Create campus
export async function createCampusController(req, res, next) {
    const validation = validateCreateCampus(req.body);

    if(!validation.valid) {
        return res.status(400).json({
            success: false,
            message: "Validatiion Failed.",
            errors: validation.errors,
        })
    }

    try {
        const campus = await createCampus(validation.data);
        
        return res.status(201).json({
            success: true,
            message: "Campus created successfully.",
            data: campus,
        })
    } catch (error) {
        next(error)
    }
}


// PUBLIC: Get all campuses
export async function getCampusesController(req, res, next) {
    try {
        const campuses = await getCampuses();

        return res.status(200).json({
            success: true,
            count: campuses.length,
            data: campuses,
        })
    } catch (error) {
        next(error)
    }
}

// PUBLIC: Get campus by ID
export async function getCampusByIdController(req, res, next){
   try {
    const campus = await getCampusById(req.params.id);

    return res.status(200).json({
        success: true,
        data: campus,
    })
   } catch (error) {
    next(error)
   }
}

// ADMIN: Update campus
export async function updateCampusController(req, res, next) {
    const validation = validateUpdateCampus(req.body);

    if(!validation.valid) {
        return res.status(400).json({
            success: false,
            message: "Validation Failed.",
            errors: validation.errors,
        })
    }

    try {
        const campus = await updateCampus(req.params.id, validation.data);

        return res.status(200).json({
            success: true,
            message: "Campus updated successfully.",
            data: campus,
        })
    } catch (error) {
        next(error)
    }
}