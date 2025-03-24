// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import QuizPage from "./QuizPage";

// const Questions = () => {

//     const [questions, setQuestions] = useState();

//     useEffect(() => {
//         axios.get("http://localhost:8083/api/questions/getRandom")
//         .then(res => {
//             console.log("Data ", res.data); // Use res.data directly
//             setQuestions(res.data); // Set the questions state with the data
//         })
//         .catch(exception => {
//             console.error("Exception e", exception); // Handle any exceptions
//         });
//     }, [])


//     return (
//         <div>
//             <QuizPage questions={questions} />
//         </div>
//     )
// }

// export default Questions;