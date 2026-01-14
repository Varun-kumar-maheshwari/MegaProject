class ApiResponse {
    constructor(statusCode, data, message = ""){
        this.statusCode = statusCode;
        this.data = data || null;
        this.message = message || null;
        this.success = statusCode < 400
    }
}

export { ApiResponse };