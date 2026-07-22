export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly details?: any;

    constructor(message: string, statusCode: number, isOperational = true, details?: any) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational
        this.details = details;
        Error.captureStackTrace(this);
    }
}

//common errors
//Not found error
export class NotFoundError extends AppError {
    constructor(message = "Resource not found!") {
        super(message, 404);
    }
}

//Validation error (used for Joi/zod/react-hook-form validation error)
export class ValidationError extends AppError {
    constructor(message = "Invalid Request data", details?:any){
        super(message, 400, true, details);
    }
}

//Authentication error
export class AuthError extends AppError {
    constructor(message = "Unauthorized") {
        super(message, 401);
    }
}

//Forbidden error(For Insufficient access)
export class ForbiddenError extends AppError {
    constructor(message = "Forbidden access!") {
        super(message, 403);
    }
}

//DataBase error (For mongoDB/Postgres errors)
export class DatabaseError extends AppError {
    constructor(message = "Database Error!", details?: any) {
        super(message, 500, true, details);
    }
}

//Rate limiting error
export class RateLimitingError extends AppError {
    constructor(message = "Too many requests, try again later!") {
        super(message, 429)
    }
}
