// import React, { useState, useEffect } from 'react';
// import { getCookie } from '../Cookies/GetCookies';
// import axios from 'axios';

// const QuizPage = ({ questions }) => {
//     const [answers, setAnswers] = useState({});
//     const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
//     const [startTime] = useState(new Date()); // Capture the start time

//     // Timer logic using useEffect
//     useEffect(() => {
//         if (timeLeft <= 0) {
//             handleSubmit(); // Auto-submit when time is up
//         }

//         const timer = setInterval(() => {
//             setTimeLeft((prevTime) => prevTime - 1);
//         }, 1000);

//         return () => clearInterval(timer); // Cleanup timer on component unmount
//     }, [timeLeft]);

//     // Format time for display
//     const formatTime = (time) => {
//         const minutes = Math.floor(time / 60);
//         const seconds = time % 60;
//         return `${minutes.toString().padStart(2, '0')}:${seconds
//             .toString()
//             .padStart(2, '0')}`;
//     };

//     const handleChange = (questionId, selectedOption) => {
//         setAnswers((prevAnswers) => ({
//             ...prevAnswers,
//             [questionId]: selectedOption,
//         }));
//     };

//     const handleSubmit = () => {
//         const endTime = new Date(); // Record the end time
//         const durationInMins = Math.round(
//             (endTime - startTime) / 60000
//         ); // Calculate duration in minutes

//         let marks = 0;
//         questions &&
//             questions.forEach((q) => {
//                 if (answers[q.id] === q.correctOption) {
//                     marks++;
//                 }
//             });

//         const username = getCookie('username');
//         const tokenId = getCookie('tokenId');

//         const requestBody = {
//             username: username,
//             tokenid: tokenId,
//             score: marks,
//             durationInMins: durationInMins,
//             dateTime:new Date(endTime).toISOString().slice(0, -1),
//         };

//         axios
//             .post('http://localhost:8083/api/userperformance/save', requestBody)
//             .then((data) => {
//                 console.log('Submitted test results:', data);
//             })
//             .catch((exception) => {
//                 console.error('Exception:', exception);
//             });

//         console.log('Total marks:', marks, 'Duration (mins):', durationInMins);
//         window.alert(
//             `Quiz submitted! \nYour Marks: ${marks}\nDuration: ${durationInMins} minutes`
//         );
//     };

//     return (
//         <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
//             <h1 style={{ textAlign: 'center', color: '#007BFF' }}>Quiz</h1>

//             {/* Timer display */}
//             <h2 style={{ textAlign: 'center', color: 'red' }}>
//                 Time Left: {formatTime(timeLeft)}
//             </h2>

//             {questions &&
//                 questions.map((question, index) => (
//                     <div
//                         key={question.id}
//                         style={{
//                             border: '1px solid #ccc',
//                             borderRadius: '10px',
//                             padding: '15px',
//                             marginBottom: '20px',
//                             backgroundColor: '#f9f9f9',
//                             boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
//                         }}
//                     >
//                         <h3 style={{ marginBottom: '10px' }}>
//                             {index + 1}. {question.question}
//                         </h3>
//                         <div>
//                             <label style={{ display: 'block', marginBottom: '5px' }}>
//                                 <input
//                                     type="radio"
//                                     name={`question-${question.id}`}
//                                     value="A"
//                                     onChange={() => handleChange(question.id, 'A')}
//                                     style={{ marginRight: '10px' }}
//                                 />
//                                 {question.optionA}
//                             </label>
//                             <label style={{ display: 'block', marginBottom: '5px' }}>
//                                 <input
//                                     type="radio"
//                                     name={`question-${question.id}`}
//                                     value="B"
//                                     onChange={() => handleChange(question.id, 'B')}
//                                     style={{ marginRight: '10px' }}
//                                 />
//                                 {question.optionB}
//                             </label>
//                             <label style={{ display: 'block', marginBottom: '5px' }}>
//                                 <input
//                                     type="radio"
//                                     name={`question-${question.id}`}
//                                     value="C"
//                                     onChange={() => handleChange(question.id, 'C')}
//                                     style={{ marginRight: '10px' }}
//                                 />
//                                 {question.optionC}
//                             </label>
//                             <label style={{ display: 'block', marginBottom: '5px' }}>
//                                 <input
//                                     type="radio"
//                                     name={`question-${question.id}`}
//                                     value="D"
//                                     onChange={() => handleChange(question.id, 'D')}
//                                     style={{ marginRight: '10px' }}
//                                 />
//                                 {question.optionD}
//                             </label>
//                         </div>
//                     </div>
//                 ))}
//             <button
//                 style={{
//                     backgroundColor: '#007BFF',
//                     color: '#fff',
//                     padding: '10px 20px',
//                     border: 'none',
//                     borderRadius: '5px',
//                     cursor: 'pointer',
//                     display: 'block',
//                     margin: '20px auto',
//                 }}
//                 onClick={handleSubmit}
//             >
//                 Submit Quiz
//             </button>
//         </div>
//     );
// };

// export default QuizPage;
