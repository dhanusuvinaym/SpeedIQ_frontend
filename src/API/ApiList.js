// var base_url = "http://localhost:8083"
var base_url = "http://3.107.201.205:8080"

const enums = {
    BASE_URL: base_url,
    ENDPOINTS: {
        ADMIN: {
            VALIDATE: "/api/admin/validate",
            CREATE: "/api/admin/create",
            DELETE: "/api/admin/", // {id} need to provide
            UPDATE: "/api/admin/", // {id} need to provide
            GETALL: "/api/admin/getAll"
        },
        LOGIN: {
            VALIDATE: "/api/login/validate",
            REGISTER: "/api/login/create",
            UPDATE: "/api/login/update/", //{id} to be placed,
            DELETE: "/api/login/delete/",//{id} to be placed,
            BULKUPLOAD: "/api/login/upload",
            GET_ALL_LOGIN_DETAILS: "/api/login/getAll",
            DELELETALL:"/api/login/deleteAll"
        },
        Questions: {
            GET_RANDOM_QUESTIONS: "/api/questions/getRandom",
            UPDATE_QUESTION: "/api/questions/", //{id} to be placed
            DELETE_QUESTION: "/api/questions/", //{id} to be placed
            BULKUPLOAD: "/api/questions/upload",
            ADD_QUESTION: "/api/questions/add",
            GET_ALL_QUESTIONS: "/api/questions/getAll",
            DELELETALL:"/api/questions/deleteAll"
        },
        USERS_PERFORMANCE: {
            SAVE_DETAILS: "/api/userperformance/save", // Get all posts
            UPDATE_DETAILS: "/api/userperformance/update/", // {id} to be placed
            DELETE_DETAILS: "/api/userperformance/delete/", //  {id} to be placed
            GET_SINGLE_USER: "/api/userperformance/get/",//{id} to be placed
            GET_ALL_USERS: "/api/userperformance/getAll",
            GET_ALL_QUESTIONS_BY_TOKEN_ID: "/api/userperformance/getQuestionsByTokenId/",//{tokenid} need to add
            DELELETALL:"/api/userperformance/deleteAll"
        },
        ANALYSIS: {
            SAVE: "/api/analysis/save/",//{id need to provide}
            GET_ALL_ANALYSIS_BASED_ON_ID: "/api/analysis/getAll/",//{id need to provide}
            DELELETALL:"/api/analysis/deleteAll"
        }
    },
};

export default enums;
