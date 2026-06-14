class ApiClient{
    constructor(endPoint, url) {
        this.baseURL = "http://localhost:3000/api/v1/";
        this.defaultHeaders = {
            "Content-Type" : "application/json",
            Accept : "application/json"
        }
    }

    async customFetch(endpoint, options = {}){
        try {
           const url = (`${this.baseURL}${endpoint}`)
            const headers = {
               ...this.defaultHeaders,
                ...options.headers
            }
            const config = {
               ...options,
                headers,
                credentials : true
            }
            const response =await fetch(url, config)

            if(response.data !== "ok"){
                return res.status(400).json("Fetch failed")
            }

            const data = await response.json()
            return data;
        }
        catch(err) {

            console.error("error  " + err)
            throw err
        }
    }

}