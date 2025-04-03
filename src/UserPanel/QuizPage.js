import { CloseCircleOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { getApi, inVallidateUser, postApi } from "../API/AllRequestTypeAPIsLogic";
import enums from "../API/ApiList";
import { clearCookies, getCookie, setCookie } from "../Cookies/GetCookies";
import { openNotification } from '../DataGridTableStructure.js/PopupMessage';
import { formatDuration, now } from '../DateTime';
import { CheckCircleFilled } from '@ant-design/icons'

const QuizPage = (props) => {

    let tokenId = sessionStorage.getItem('tokenId')
    const [questionData, setQuestionsData] = useState(getCookie(`${tokenId}-questions`) ? JSON.parse(getCookie(`${tokenId}-questions`)) : null);
    const { updateQuestionsCount } = props;
    const { handleprevNextAction } = props;
    const { finalOutput } = props;
    const { clickedOnSubmit } = props;
    const { questionSelectedFromChild } = props;
    const [questionSelected, setQuestionSelected] = useState((props.selectedQuestion) - 1);
    let answersTemp = getCookie(`${tokenId}-answers`);
    const [answers, setAnswers] = useState(answersTemp ? JSON.parse(answersTemp) : {});
    const user_id = parseInt(getCookie(`${tokenId}-id`));
    const [quizDone, setQuizDone] = useState(getCookie(`${tokenId}-quizDone`) === 'true' ? true : false);
    const [showResults, setShowResults] = useState(getCookie(`${tokenId}-showResults`) === 'true' ? true : false);
    const [correctOptions, setCorrectOptions] = useState(getCookie(`${tokenId}-correctOptions`) ? JSON.parse(getCookie(`${tokenId}-correctOptions`)) : {})
    const [totalMarks, setTotalMarks] = useState(getCookie(`${tokenId}-totalMarks`) ? parseInt(getCookie(`${tokenId}-totalMarks`)) : null);
    const navigate = useNavigate();
    const [startTime] = useState(getCookie(`${tokenId}-startTime`) ? new Date(getCookie(`${tokenId}-startTime`)) : new Date());
    const autoSubmit = props.autoSubmit
    const isDemo = getCookie(`${tokenId}-isdemo`) === 'true'
    const screenWidth = props.screenWidth
    const [testSubmitted, setTestSubmitted] = useState(false);
    const [loadingLayOut, setLoadingLayout] = useState(false);
    const [modalOpened, setModalOpened] = useState(false);
    

    useEffect(() => {
        if (showResults) {
            finalOutput(totalMarks);
        }
    }, [showResults]);

    useEffect(() => {
        const alreadySubmitted = sessionStorage.getItem('handleSubmitCalled') === 'true';
        // console.log("alreadySubmitted == ", alreadySubmitted)
        if (autoSubmit) {
            if (!alreadySubmitted) {
                Modal.destroyAll();
                handleSubmit();
            }
        }
    }, [autoSubmit])

    useEffect(() => {
        if (Object.keys(answers).length !== 0) {
            const alreadySubmitted = sessionStorage.getItem('handleSubmitCalled') === 'true';
            if (Object.keys(answers).length === 10 && !alreadySubmitted && !modalOpened) {
                handleSubmit();
            }
            setTimeout(() => {
                handleprevNextAction('N')
            }, 500)
        }
    }, [answers])

    useEffect(() => {
        // console.log("props.selectedQuestion", props.selectedQuestion, questionSelected)
        // if ((props.selectedQuestion) !== questionSelected-1) {
        setQuestionSelected(parseInt(props.selectedQuestion) - 1)
        // }
    }, [props.selectedQuestion])

    useEffect(() => {
        // console.log("questionDataquestionData",questionData)
        if (!questionData) {
            setLoadingLayout(true);
            // alert("Api is fetching")
            const questionsTemp = getApi(enums.BASE_URL + enums.ENDPOINTS.Questions.GET_RANDOM_QUESTIONS, null);
            questionsTemp.then(data => {
                if (data?.length > 0) {
                    // console.log("questionsData", data)
                    setCookie(`${tokenId}-questions`, JSON.stringify(data))
                    setCookie(`${tokenId}-questionsLength`, data?.length)
                    setQuestionsData(data);
                    setLoadingLayout(false);
                    updateQuestionsCount(data?.length);
                }
            }).catch(exception => {
                setLoadingLayout(false);
                console.error("Exception in getting the random questions ", exception);
            })
        }
    }, [])

    // console.log("questionData", questionData)

    const handleChange = (questionId, selectedOption) => {
        setAnswers((prevAnswers) => {
            const updatedAnswers = { ...prevAnswers, [questionId]: selectedOption };

            // Update the cookie
            setCookie(`${tokenId}-answers`, JSON.stringify(updatedAnswers))
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
        setCookie(`${tokenId}-correctOptions`, JSON.stringify(correctOptionsTemp))
        setTotalMarks(marks);
        setCorrectOptions(correctOptionsTemp);
        return marks;
    }

    // console.log("questionData = ", questionData)

    const handleSubmit =() => {
        if (!testSubmitted) {
            if (!autoSubmit && !modalOpened) {
                setModalOpened(true);
                Modal.confirm({
                    title: null,
                    content:
                        <div>
                            <h3>Are you sure you want to submit the test ?</h3>
                            <p>Answered  : <a style={{ color: "green", fontWeight: "bold" }}> {Object.keys(answers)?.length}</a></p>
                            <p>UnAnswered: <a style={{ color: "red", fontWeight: "bold" }}>  {questionData?.length - Object.keys(answers)?.length}</a> </p>
                        </div>,
                    onOk: () => {
                        setLoadingLayout(true);
                        sessionStorage.setItem('handleSubmitCalled', 'true');
                        clickedOnSubmit(true)
                        setTestSubmitted(true);

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
                        requestJSONFORUserPerformance.status = "Successfully submitted Test"
                        requestJSONFORUserPerformance.dateTime = now();

                        if (!isDemo) {
                            const getUserDetailsByTokenId = getApi(enums.BASE_URL + enums.ENDPOINTS.LOGIN.GETBYTOKENID + tokenId)
                            getUserDetailsByTokenId.then(data => {
                                if (data?.isvalid === true) {
                                    const postRequestForAnalysis = postApi(enums.BASE_URL + enums.ENDPOINTS.ANALYSIS.SAVE + user_id, requestJsonForAnalysis);
                                    postRequestForAnalysis.then(data => {
                                        const postRequestForUserPerformance = postApi(enums.BASE_URL + enums.ENDPOINTS.USERS_PERFORMANCE.SAVE_DETAILS, requestJSONFORUserPerformance);
                                        postRequestForUserPerformance.then(async data => {
                                            if (data) {
                                                const userInvalidate =await inVallidateUser();
                                                // console.log("userInvalidate-----",userInvalidate)
                                                if (userInvalidate === 200) {
                                                    setLoadingLayout(false);
                                                    openNotification("Test submitted Successfully", "top", "success")
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
                                                            Modal.destroyAll();
                                                        },
                                                        onCancel: () => {
                                                            clearCookies(tokenId);
                                                            openNotification("Logged Out SuccessFully", "top", "success")
                                                            navigate("/")
                                                            Modal.destroyAll();
                                                        }
                                                    })
                                                } else {
                                                    openNotification("Test not submitted. Please network connectivity and try again", "top", "info")
                                                }
                                            }
                                        }).catch(exception => {
                                            setLoadingLayout(false);
                                            console.error("exception e ", exception);
                                        })

                                    }).catch(exception => {
                                        setLoadingLayout(false);
                                        console.error("exception e ", exception);
                                    })
                                } else {
                                    openNotification("You already submitted the test. Thankyou", "top", "info")
                                    clearCookies(tokenId)
                                    navigate("/")
                                    Modal.destroyAll();
                                }
                            }).catch(exception => {
                                openNotification("Exception while getting the user details"+exception,"top","info")
                            })

                        } else {
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
                                    Modal.destroyAll();
                                },
                                onCancel: () => {
                                    clearCookies(tokenId);
                                    openNotification("Logged Out SuccessFully", "top", "success")
                                    navigate("/")
                                    Modal.destroyAll();
                                }
                            })
                            setLoadingLayout(false)
                        }
                        setQuizDone(true);
                        setCookie(`${tokenId}-quizDone`, true)
                        setCookie(`${tokenId}-totalMarks`, totalMarks)
                        setCookie(`${tokenId}-showResults`, true)
                        // document.cookie = `quizDone=true; path=/;`;
                        // document.cookie = `totalMarks=${totalMarks}; path=/;`;
                        // document.cookie = `showResults=true; path=/;`;
                    },
                    onCancel: () => {
                        Modal.destroyAll();
                        openNotification("Exam not submitted", "top", "info")
                        sessionStorage.setItem('handleSubmitCalled', 'false');
                        setModalOpened(false);
                        // sessionStorage.clear()
                        // message.info("Exam not submitted")
                    }
                })
            } else if (!modalOpened) {
                const getUserDetailsByTokenId = getApi(enums.BASE_URL + enums.ENDPOINTS.LOGIN.GETBYTOKENID + tokenId)
                getUserDetailsByTokenId.then(data => {
                    if (data?.isvalid === true) {
                        setModalOpened(true);
                        setLoadingLayout(true);
                        sessionStorage.setItem('handleSubmitCalled', 'true');
                        clickedOnSubmit(true)
                        setTestSubmitted(true);
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
                        requestJSONFORUserPerformance.status = "Session Expired";
                        requestJSONFORUserPerformance.dateTime = now();
                        if (!isDemo) {
                            const postRequestForAnalysis = postApi(enums.BASE_URL + enums.ENDPOINTS.ANALYSIS.SAVE + user_id, requestJsonForAnalysis);
                            postRequestForAnalysis.then(data => {
                                if (data) {
                                    const postRequestForUserPerformance = postApi(enums.BASE_URL + enums.ENDPOINTS.USERS_PERFORMANCE.SAVE_DETAILS, requestJSONFORUserPerformance);
                                    postRequestForUserPerformance.then(async data => {
                                        if (data) {
                                            const userInvalidate = await inVallidateUser();
                                            if (userInvalidate === 200) {
                                                setLoadingLayout(false);
                                                openNotification("Test Submitted Successfully", "top", "success")
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
                                                        Modal.destroyAll();
                                                    },
                                                    onCancel: () => {
                                                        clearCookies(tokenId);
                                                        openNotification("Logged Out SuccessFully", "top", "success")
                                                        navigate("/")
                                                        Modal.destroyAll();
                                                    }
                                                })
                                            } else {
                                                openNotification("Test Not submitted. Please check internet connection and check again", "top", "info")
                                            }
                                        }
                                    }).catch(exception => {
                                        setLoadingLayout(false);
                                        console.error("exception e ", exception);
                                    })
                                }
                            }).catch(exception => {
                                setLoadingLayout(false);
                                console.error("exception e ", exception);
                            })
                        } else {
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
                                    Modal.destroyAll();
                                },
                                onCancel: () => {
                                    clearCookies(tokenId);
                                    navigate("/");
                                    openNotification("Logged Out SuccessFully", "top", "success")
                                    Modal.destroyAll();
                                }
                            })
                            setLoadingLayout(false)
                        }
                        setQuizDone(true);
                        setCookie(`${tokenId}-quizDone`, true)
                        setCookie(`${tokenId}-totalMarks`, totalMarks)
                        setCookie(`${tokenId}-showResults`, true)
                    }else{
                        openNotification("You already submitted the test. Thankyou","top","info");
                        clearCookies(tokenId)
                        navigate("/")
                        Modal.destroyAll();
                    }
                })
            } else {
                openNotification("Test Already submitted", "top", "info")
            }
        }
    }

    const handleQuestionChange = (index) => {
        setQuestionSelected(index);
        questionSelectedFromChild(index)
    }

    const sampleData = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `${i + 1}`,
        icon: "🔷", // Replace with any icon or image
    }));

    // console.log("sampleData",sampleData)

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

                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", marginTop: "5%" }}>
                        <Button
                            // key={item.id}
                            style={{
                                border: "1px solid #000",
                                padding: "1px",
                                margin: "1px",
                                width: "50px",
                                borderRadius: "8px",
                                textAlign: "center",
                                cursor: "pointer"
                            }}
                            disabled={questionSelected === 0}
                            onClick={() => handleChangeInPagination('P')}
                        >
                            {"<"}
                        </Button>
                        {sampleData.map((item, index) => (
                            <Button
                                key={item.id}
                                type={index === questionSelected ? "primary" : ""}
                                style={{
                                    border: "1px solid #000",
                                    padding: "1px",
                                    margin: "1px",
                                    width: "50px",
                                    borderRadius: "8px",
                                    textAlign: "center",
                                    cursor: "pointer"
                                }}
                                onClick={() => handleQuestionChange(index)}
                            >
                                {item.name} {answers[questionData[index].id] ? <CheckCircleFilled style={{ color: "green" }} /> : ""}
                            </Button>
                        ))}
                        <Button
                            // key={item.id}
                            style={{
                                border: "1px solid #000",
                                padding: "1px",
                                margin: "1px",
                                width: "50px",
                                borderRadius: "8px",
                                textAlign: "center",
                                cursor: "pointer"
                            }}
                            onClick={() => handleChangeInPagination('N')}
                            disabled={questionSelected === questionData.length - 1}
                        >
                            {">"}
                        </Button>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: screenWidth > 500 ? "row" : "column", // Default direction for larger screens
                            flexWrap: "wrap", // Allows wrapping when necessary
                            justifyContent: "center",
                            alignItems: "center",
                            // marginLeft: "5%",
                            marginTop: "8%"
                        }}
                        className="responsive-buttons-container"
                    >
                        {/* <Button
                            style={{ width: "5cm", margin: "5px" }}
                            disabled={questionSelected === 0}
                            onClick={() => handleChangeInPagination('P')}
                        >
                            {"<"} Previous
                        </Button>
                        <Button
                            // type="primary"
                            style={{ width: "5cm", margin: "5px" }}
                            onClick={() => handleChangeInPagination('N')}
                            disabled={questionSelected === questionData.length - 1}
                        >
                            Next {">"}
                        </Button> */}
                        <Button
                            style={{
                                width: "5cm",
                                margin: "5px",
                                backgroundColor: "red",
                                color: "white",
                                fontWeight: "bold"
                            }}
                            onClick={() => handleSubmit()}
                        >
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
            {loadingLayOut && (
                <div className="loader-overlay">
                    <h2>{modalOpened ? "Please wait while submitting the test. Don't refresh or close the window":""}</h2>
                    <div className="loader"></div>
                </div>
            )}
        </div>
    )
}

export default QuizPage;