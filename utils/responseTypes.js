const ResponseTypes = {
    SUCCESS: {
        code: 200,
        status: "success",
        message: "Operation completed successfully"
    },
    CREATED: {
        code: 201,
        status: "success",
        message: "Resource created successfully"
    },
    BAD_REQUEST: {
        code: 400,
        status: "error",
        message: "Bad request"
    },
    UNAUTHORIZED: {
        code: 401,
        status: "error",
        message: "Unauthorized"
    },
    FORBIDDEN: {
        code: 403,
        status: "error",
        message: "Forbidden"
    },
    NOT_FOUND: {
        code: 404,
        status: "error",
        message: "Resource not found"
    },
    SERVER_ERROR: {
        code: 500,
        status: "error",
        message: "Internal server error"
    }
};

module.exports = ResponseTypes;