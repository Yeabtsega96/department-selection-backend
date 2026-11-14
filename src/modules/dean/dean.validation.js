
export function validateCreateDepartmentHead(body) {
    const errors = [];
    const { name, email } = body ?? {};

   
    if (typeof name !== "string" || name.trim().length < 2) {
        errors.push("Name must be at least 2 characters long.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(typeof email !== "string" || !emailRegex.test(email.trim())) {
        errors.push("A valid email address is required.");
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
        }
    }
}