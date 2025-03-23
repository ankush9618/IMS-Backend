const asynHandler = (responseHandler) => {
    return (req, res, next) => {
        Promise.resolve(responseHandler(req, res, next)).catch((err) => next(err));
    }
}

export { asynHandler };