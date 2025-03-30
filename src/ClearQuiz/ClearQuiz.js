import { Button, Modal } from "antd";
import React, { useState } from "react";
import { getApi } from "../API/AllRequestTypeAPIsLogic";
import enums from "../API/ApiList";
import { openNotification } from '../DataGridTableStructure.js/PopupMessage';

const ClearQuiz = () => {

    const [loading, setLoading] = useState(false);

    const handleClearData = () => {
        Modal.confirm({
            title: "Confirmation",
            content: "Are you sure you want to delete the Quiz Data ?",
            onOk: () => {
                setLoading(true);
                const userperformanceDelete = getApi(enums.BASE_URL + enums.ENDPOINTS.USERS_PERFORMANCE.DELELETALL)
                userperformanceDelete.then(data => {
                    // console.log("data after delete userperformance = ", data);

                    const analysisDataDelete = getApi(enums.BASE_URL + enums.ENDPOINTS.ANALYSIS.DELELETALL)
                    analysisDataDelete.then(data1 => {
                        // console.log("data after delete  analysis = ", data1);

                        const questionsDataDelete = getApi(enums.BASE_URL + enums.ENDPOINTS.Questions.DELELETALL)
                        questionsDataDelete.then(data2 => {
                            // console.log("data after delete  analysis = ", data2);

                            const loginDataDelete = getApi(enums.BASE_URL + enums.ENDPOINTS.LOGIN.DELELETALL)
                            loginDataDelete.then(data3 => {
                                // console.log("data after delete  analysis = ", data3);
                                setLoading(false);
                                openNotification("Quiz Data Cleared Successfully", "top", "success")
                                // message.success("Quiz Data Cleared Successfully")

                            }).catch(exception => {
                                setLoading(false);
                                openNotification("Error while deleteing login data", "top", "error")
                                console.error(exception);
                                // message.error("Error while deleteing login data");
                            })

                        }).catch(exception => {
                            setLoading(false);
                            console.error(exception);
                            openNotification("Error while deleteing questions data", "top", "error")
                            // message.error("Error while deleteing questions data");
                        })

                    }).catch(exception => {
                        setLoading(false);
                        console.error(exception);
                        openNotification("Error while deleteing analysis data", "top", "error")
                        // message.error("Error while deleteing analysis data");
                    })


                }).catch(exception => {
                    setLoading(false);
                    console.error(exception);
                    openNotification("Error while deleteing userperformace data", "top", "error")
                    // message.error("Error while deleteing userperformace data");
                })
            },
            onCancel: () => {
                setLoading(false);
                openNotification("Delete Action has been canceled", "top", "info")
                // message.info("Delete Action has been canceled")
            }
        })
    }


    return (
        <div style={{ marginLeft: "35%" }}>
            <h1 style={{ color: "red", marginTop: "0.2cm" }}>Caution : Clear Quiz</h1>
            <Button onClick={handleClearData} type="primary"
                style={{ marginTop: "5%", marginLeft: "10%" }}
            >
                Clear Quiz
            </Button>

            {loading && (
                <div className="loader-overlay">
                    <div className="loader"></div>
                </div>
            )}
        </div>
    )
}

export default ClearQuiz;