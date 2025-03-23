class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something Went Wrong..",
        errors = [],
        stack = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.data = null;
        this.errors = errors;
        this.success = statusCode >= 400;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructure);
        }

    }
}

export { ApiError };