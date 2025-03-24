import { Button, message, Modal } from 'antd';
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { getApi, inVallidateUser, postApi } from "../API/AllRequestTypeAPIsLogic";
import enums from "../API/ApiList";
import { clearCookies, getCookie, setCookie } from "../Cookies/GetCookies";
import { formatDuration, now } from '../DateTime';
import { CloseCircleOutlined } from '@ant-design/icons';


const QuizPage = (props) => {

    const [questionData, setQuestionsData] = useState(getCookie('questions') ? JSON.parse(getCookie('questions')) : null);
    const { updateQuestionsCount } = props;
    const { handleprevNextAction } = props;
    const { finalOutput } = props;
    const { clickedOnSubmit } = props;
    const [questionSelected, setQuestionSelected] = useState((props.selectedQuestion) - 1);
    let answersTemp = getCookie('answers');
    const [answers, setAnswers] = useState(answersTemp ? JSON.parse(answersTemp) : {});
    const user_id = parseInt(getCookie("id"));
    const [quizDone, setQuizDone] = useState(getCookie('quizDone') === 'true' ? true : false);
    const [showResults, setShowResults] = useState(getCookie('showResults') === 'true' ? true : false);
    const [correctOptions, setCorrectOptions] = useState(getCookie('correctOptions') ? JSON.parse(getCookie('correctOptions')) : {})
    const [totalMarks, setTotalMarks] = useState(getCookie('totalMarks') ? parseInt(getCookie('totalMarks')) : null);
    const navigate = useNavigate();
    const [startTime] = useState(getCookie('startTime') ? new Date(getCookie('startTime')) : new Date());
    const autoSubmit = props.autoSubmit
    const isDemo = getCookie("isdemo") === 'true'


    useEffect(() => {
        if (showResults) {
            finalOutput(totalMarks);
        }
    }, [showResults]);

    useEffect(() => {
        if (autoSubmit) {
            handleSubmit();
        }
    }, [autoSubmit])

    useEffect(() => {
        if (Object.keys(answers).length !== 0) {
            handleprevNextAction('N')
        }
    }, [answers])

    useEffect(() => {
        // console.log("props.selectedQuestion", props.selectedQuestion, questionSelected)
        // if ((props.selectedQuestion) !== questionSelected-1) {
        setQuestionSelected(parseInt(props.selectedQuestion) - 1)
        // }
    }, [props.selectedQuestion])

    useEffect(() => {
        if (!questionData) {
            const questionsTemp = getApi(enums.BASE_URL + enums.ENDPOINTS.Questions.GET_RANDOM_QUESTIONS, null);
            questionsTemp.then(data => {
                if (data) {
                    updateQuestionsCount(data.length);
                    setCookie("questions", JSON.stringify(data))
                    setCookie("questionsLength", data.length)
                    // document.cookie = `questions=${JSON.stringify(data)}; path=/;`;
                    // document.cookie = `questionsLength=${data.length}; path=/;`;
                    setQuestionsData(data);
                }
            }).catch(exception => {
                console.error("Exception in getting the random questions ", exception);
            })
        }
    }, [])

    console.log("questionData", questionData)

    const handleChange = (questionId, selectedOption) => {
        setAnswers((prevAnswers) => {
            const updatedAnswers = { ...prevAnswers, [questionId]: selectedOption };

            // Update the cookie
            setCookie("answers", JSON.stringify(updatedAnswers))
            // document.cookie = `answers=${JSON.stringify(updatedAnswers)}; path=/;`;
            // Return the updated state
            return updatedAnswers;
        });
    };

    const handleChangeInPagination = (flag) => {
        handleprevNextAction(flag);
    }

    function checkMarks() {
        let marks = 0;
        let correctOptionsTemp = {}
        questionData && questionData?.map((x, index) => {
            if (answers[x.id] === x.correctOption) {
                marks += 1;
            }
            correctOptionsTemp[x.id] = x.correctOption;
        })
        setCookie("correctOptions", JSON.stringify(correctOptionsTemp))
        // document.cookie = `correctOptions=${JSON.stringify(correctOptionsTemp)}; path=/;`;
        setTotalMarks(marks);
        setCorrectOptions(correctOptionsTemp);
        return marks;
    }

    console.log("questionData = ", questionData)

    const handleSubmit = () => {
        if (!autoSubmit) {
            Modal.confirm({
                title: null,
                content:
                    <div>
                        <h3>Are you sure you want to submit the test ?</h3>
                        <p>Answered  : <a style={{ color: "green", fontWeight: "bold" }}> {Object.keys(answers)?.length}</a></p>
                        <p>UnAnswered: <a style={{ color: "red", fontWeight: "bold" }}>  {questionData?.length - Object.keys(answers)?.length}</a> </p>
                    </div>,
                onOk: () => {

                    clickedOnSubmit(true)

                    const endTime = new Date(); // Record the end time
                    const durationInMs = endTime - startTime; // Calculate duration in milliseconds

                    const durationFormatted = formatDuration(durationInMs);

                    let requestJsonForAnalysis = []
                    answers && Object.keys(answers).map(x => {
                        let temp = {}
                        let id = parseInt(x);
                        temp.question_id = id
                        temp.option_selected = answers[id]
                        requestJsonForAnalysis.push(temp);
                    })

                    let totalMarks = checkMarks();
                    var requestJSONFORUserPerformance = {};
                    requestJSONFORUserPerformance.user_id = user_id;
                    requestJSONFORUserPerformance.score = totalMarks
                    requestJSONFORUserPerformance.exam_duration_time = durationFormatted;
                    requestJSONFORUserPerformance.dateTime = now();

                    if (!isDemo) {

                        const postRequestForAnalysis = postApi(enums.BASE_URL + enums.ENDPOINTS.ANALYSIS.SAVE + user_id, requestJsonForAnalysis);
                        postRequestForAnalysis.then(data => {
                            if (data) {
                                console.log("response for analysis body ", data);
                                // message.success("Analysis api done")
                            }
                        }).catch(exception => {
                            console.error("exception e ", exception);
                        })

                        const postRequestForUserPerformance = postApi(enums.BASE_URL + enums.ENDPOINTS.USERS_PERFORMANCE.SAVE_DETAILS, requestJSONFORUserPerformance);
                        postRequestForUserPerformance.then(data => {
                            if (data) {
                                console.log("response for postRequestForUserPerformancesis body ", data);
                                // message.success("user performance api done")
                            }
                        }).catch(exception => {
                            console.error("exception e ", exception);
                        })

                        inVallidateUser();

                        message.success("Test submitted Successfully")
                    }
                    setQuizDone(true);
                    setCookie("quizDone", true)
                    setCookie("totalMarks", totalMarks)
                    setCookie("showResults", true)
                    // document.cookie = `quizDone=true; path=/;`;
                    // document.cookie = `totalMarks=${totalMarks}; path=/;`;
                    // document.cookie = `showResults=true; path=/;`;

                    Modal.confirm({
                        title: null,
                        content:
                            <div>
                                <center><h3>Review Results</h3></center>
                                <p> Total correct answers = <a style={{ color: "green", fontWeight: "bold" }}> {totalMarks}</a></p>
                                <p> Total wrong answers = <a style={{ color: "red", fontWeight: "bold" }}> {questionData?.length - totalMarks}</a> </p>
                                <p> Total Marks = <a style={{ color: "green", fontWeight: "bold" }}>{totalMarks}</a></p>
                            </div>,
                         okText: "View Summary", // Change "OK" to "View Summary"
                         cancelText: null, // Remove default Cancel button
                         closable: true, // Enable closing the modal
                         closeIcon: <CloseCircleOutlined />,
                        onOk: () => {
                            setShowResults(true);
                        },
                        onCancel: () => {
                            if (!isDemo) {
                                message.success("Logged Out SuccessFully")
                                navigate("/")
                            } else {
                                clearCookies();
                                navigate("/");
                            }
                        }
                    })

                },
                onCancel: () => {
                    message.info("Exam not submitted")
                }
            })
        } else {
            clickedOnSubmit(true)

            const endTime = new Date(); // Record the end time
            const durationInMs = endTime - startTime; // Calculate duration in milliseconds

            const durationFormatted = formatDuration(durationInMs);

            let requestJsonForAnalysis = []
            answers && Object.keys(answers).map(x => {
                let temp = {}
                let id = parseInt(x);
                temp.question_id = id
                temp.option_selected = answers[id]
                requestJsonForAnalysis.push(temp);
            })

            let totalMarks = checkMarks();
            var requestJSONFORUserPerformance = {};
            requestJSONFORUserPerformance.user_id = user_id;
            requestJSONFORUserPerformance.score = totalMarks
            requestJSONFORUserPerformance.exam_duration_time = durationFormatted;
            requestJSONFORUserPerformance.dateTime = now();
            if (!isDemo) {
                const postRequestForAnalysis = postApi(enums.BASE_URL + enums.ENDPOINTS.ANALYSIS.SAVE + user_id, requestJsonForAnalysis);
                postRequestForAnalysis.then(data => {
                    if (data) {
                        console.log("response for analysis body ", data);
                        // message.success("Analysis api done")
                    }
                }).catch(exception => {
                    console.error("exception e ", exception);
                })

                const postRequestForUserPerformance = postApi(enums.BASE_URL + enums.ENDPOINTS.USERS_PERFORMANCE.SAVE_DETAILS, requestJSONFORUserPerformance);
                postRequestForUserPerformance.then(data => {
                    if (data) {
                        console.log("response for postRequestForUserPerformancesis body ", data);
                        // message.success("user performance api done")
                    }
                }).catch(exception => {
                    console.error("exception e ", exception);
                })
            }
            setQuizDone(true);
            setCookie("quizDone", true)
            setCookie("totalMarks", totalMarks)
            setCookie("showResults", true)
            // document.cookie = `quizDone=true; path=/;`;
            // document.cookie = `totalMarks=${totalMarks}; path=/;`;
            // document.cookie = `showResults=true; path=/;`;

            Modal.confirm({
                title: "Confirmation",
                content:
                    <div>
                        <center><h3>Review Results</h3></center>
                        <p> Total correct answers = <a style={{ color: "green", fontWeight: "bold" }}> {totalMarks}</a></p>
                        <p> Total wrong answers = <a style={{ color: "red", fontWeight: "bold" }}> {questionData?.length - totalMarks}</a> </p>
                        <p> Total Marks = <a style={{ color: "green", fontWeight: "bold" }}>{totalMarks}</a></p>
                    </div>,
                onOk: () => {
                    setShowResults(true);
                },
                onCancel: () => {
                    if (!isDemo) {
                        inVallidateUser();
                        message.success("Logged Out SuccessFully")
                        navigate("/")
                    } else {
                        clearCookies();
                        navigate("/");
                    }
                }
            })
        }
    }

    console.log("showresults", showResults, questionData, correctOptions)

    // console.log("Question Data",questionData[questionSelected].id)
    console.log("questionData length:", questionData, questionSelected);
    console.log("answers", answers)

    return (
        <div style={{ height: "100%" }}>
            {(!quizDone && questionData && questionData.length > 0) &&
                <div
                    key={questionData[questionSelected]?.id}
                    style={{
                        // border: '1px solid #ccc',
                        // borderRadius: '10px',
                        padding: '15px',
                        marginBottom: '20px',
                        // backgroundColor: '#f9f9f9',
                        // boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <div style={{ backgroundColor: '#f9f9f9', border: '1px solid #ccc', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '10px', padding: '15px' }}>
                        <h3 style={{ marginBottom: '10px' }}>
                            {questionSelected + 1}. {questionData[questionSelected]?.question}
                        </h3>
                    </div>
                    <div style={{ marginTop: "3%" }}>
                        <div style={{ display: "flex" }}>
                            <div style={{ width: "30%", backgroundColor: '#f9f9f9', border: '1px solid #ccc', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '10px', padding: '15px', cursor: "pointer" }}
                                onClick={() => handleChange(questionData[questionSelected]?.id, 'A')}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>
                                    <input
                                        type="radio"
                                        name={`question-${questionData[questionSelected]?.id}`}
                                        value="A"
                                        checked={answers[questionData[questionSelected]?.id] === 'A'}
                                        // onChange={() => handleChange(questionData[questionSelected]?.id, 'A')}
                                        style={{ marginRight: '10px' }}
                                    />
                                    A. {questionData[questionSelected]?.optionA}
                                </label>
                            </div>
                            <div style={{ marginLeft: "10%", width: "30%", backgroundColor: '#f9f9f9', border: '1px solid #ccc', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '10px', padding: '15px', cursor: "pointer" }}
                                onClick={() => handleChange(questionData[questionSelected]?.id, 'B')}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>
                                    <input
                                        type="radio"
                                        name={`question-${questionData[questionSelected]?.id}`}
                                        value="B"
                                        checked={answers[questionData[questionSelected]?.id] === 'B'}
                                        // onChange={() => handleChange(questionData[questionSelected]?.id, 'B')}
                                        style={{ marginRight: '10px' }}
                                    />
                                    B. {questionData[questionSelected]?.optionB}
                                </label>
                            </div>
                        </div>

                        <div style={{ display: "flex", marginTop: "3%" }}>
                            <div style={{ width: "30%", backgroundColor: '#f9f9f9', border: '1px solid #ccc', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '10px', padding: '15px', cursor: "pointer" }}
                                onClick={() => handleChange(questionData[questionSelected]?.id, 'C')}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>
                                    <input
                                        type="radio"
                                        name={`question-${questionData[questionSelected]?.id}`}
                                        value="C"
                                        checked={answers[questionData[questionSelected]?.id] === 'C'}
                                        // onChange={() => handleChange(questionData[questionSelected]?.id, 'C')}
                                        style={{ marginRight: '10px' }}
                                    />
                                    C. {questionData[questionSelected]?.optionC}
                                </label>
                            </div>

                            <div style={{ marginLeft: "10%", width: "30%", backgroundColor: '#f9f9f9', border: '1px solid #ccc', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '10px', padding: '15px', cursor: "pointer" }}
                                onClick={() => handleChange(questionData[questionSelected]?.id, 'D')}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>
                                    <input
                                        type="radio"
                                        name={`question-${questionData[questionSelected]?.id}`}
                                        value="D"
                                        checked={answers[questionData[questionSelected]?.id] === 'D'}
                                        // onChange={() => handleChange(questionData[questionSelected]?.id, 'D')}
                                        style={{ marginRight: '10px' }}
                                    />
                                    D. {questionData[questionSelected]?.optionD}
                                </label>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginLeft: "5%", marginTop: "8%" }}>
                        <Button style={{ width: "5cm" }} disabled={questionSelected === 0} onClick={() => handleChangeInPagination('P')}>
                            {"<"} Previous
                        </Button>
                        {/* <Button style={{ marginLeft: "5%", width: "5cm" }}>
                            Clear Response
                        </Button>
                        <Button style={{ marginLeft: "5%", width: "5cm", backgroundColor: "green", color: "white" }}>
                            Submit Response
                        </Button> */}
                        <Button type="primary" style={{ marginLeft: "5%", width: "5cm" }} onClick={() => handleChangeInPagination('N')} disabled={questionSelected === (questionData.length - 1)}>
                            Next {">"}
                        </Button>

                        <Button style={{ marginLeft: "5%", width: "5cm", backgroundColor: "red", color: "white", fontWeight: "bold" }} onClick={() => handleSubmit()}>
                            Submit Test
                        </Button>
                    </div>
                </div>
            }
            {showResults &&
                Array.from({ length: questionData?.length }, (_, index) => (
                    <div
                        key={questionData[index]?.id}
                        style={{
                            // border: '1px solid #ccc',
                            // borderRadius: '10px',
                            padding: '15px',
                            marginBottom: '20px',
                            // backgroundColor: '#f9f9f9',
                            // boxShadow: '0px 4px 6px rgba(83, 76, 76, 0.1)',
                        }}
                    >
                        <div style={{ backgroundColor: '#f9f9f9', border: '1px solid #ccc', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '10px', padding: '15px' }}>
                            <h3 style={{ marginBottom: '10px' }}>
                                {index + 1}. {questionData[index]?.question}
                            </h3>
                        </div>
                        <div style={{ marginTop: "3%" }}>
                            <div style={{ display: "flex" }}>
                                <div style={{ width: "30%", backgroundColor: 'A' === correctOptions[questionData[index]?.id] ? "#99f7a9" : answers[questionData[index]?.id] === 'A' ? "#fc8183" : '#f9f9f9', border: '1px solid #ccc', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '10px', padding: '15px', cursor: "pointer" }}>
                                    <label style={{ display: 'block', marginBottom: '5px' }}>
                                        <input
                                            type="radio"
                                            name={`question-${questionData[index]?.id}`}
                                            value="A"
                                            checked={answers[questionData[index]?.id] === 'A'}
                                            // onChange={() => handleChange(questionData[questionSelected]?.id, 'A')}
                                            style={{ marginRight: '10px' }}
                                        />
                                        A. {questionData[index]?.optionA}
                                    </label>
                                </div>
                                <div style={{ marginLeft: "10%", width: "30%", backgroundColor: 'B' === correctOptions[questionData[index]?.id] ? "#99f7a9" : answers[questionData[index]?.id] === 'B' ? "#fc8183" : '#f9f9f9', border: '1px solid #ccc', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '10px', padding: '15px', cursor: "pointer" }}>
                                    <label style={{ display: 'block', marginBottom: '5px' }}>
                                        <input
                                            type="radio"
                                            name={`question-${questionData[index]?.id}`}
                                            value="B"
                                            checked={answers[questionData[index]?.id] === 'B'}
                                            // onChange={() => handleChange(questionData[questionSelected]?.id, 'B')}
                                            style={{ marginRight: '10px' }}
                                        />
                                        B. {questionData[index]?.optionB}
                                    </label>
                                </div>
                            </div>

                            <div style={{ display: "flex", marginTop: "3%" }}>
                                <div style={{ width: "30%", backgroundColor: 'C' === correctOptions[questionData[index]?.id] ? "#99f7a9" : answers[questionData[index]?.id] === 'C' ? "#fc8183" : '#f9f9f9', border: '1px solid #ccc', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '10px', padding: '15px', cursor: "pointer" }}>
                                    <label style={{ display: 'block', marginBottom: '5px' }}>
                                        <input
                                            type="radio"
                                            name={`question-${questionData[index]?.id}`}
                                            value="C"
                                            checked={answers[questionData[index]?.id] === 'C'}
                                            // onChange={() => handleChange(questionData[questionSelected]?.id, 'C')}
                                            style={{ marginRight: '10px' }}
                                        />
                                        C. {questionData[index]?.optionC}
                                    </label>
                                </div>

                                <div style={{ marginLeft: "10%", width: "30%", backgroundColor: 'D' === correctOptions[questionData[index]?.id] ? "#99f7a9" : answers[questionData[index]?.id] === 'D' ? "#fc8183" : '#f9f9f9', border: '1px solid #ccc', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '10px', padding: '15px', cursor: "pointer" }}>
                                    <label style={{ display: 'block', marginBottom: '5px' }}>
                                        <input
                                            type="radio"
                                            name={`question-${questionData[index]?.id}`}
                                            value="D"
                                            checked={answers[questionData[index]?.id] === 'D'}
                                            // onChange={() => handleChange(questionData[questionSelected]?.id, 'D')}
                                            style={{ marginRight: '10px' }}
                                        />
                                        D. {questionData[index]?.optionD}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default QuizPage;