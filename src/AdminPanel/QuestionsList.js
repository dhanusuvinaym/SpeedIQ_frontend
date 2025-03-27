import { DeleteFilled, EditFilled, PlusCircleFilled } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, message, Modal, Select } from 'antd';
import React, { useEffect, useState } from "react";
import { deleteApi, getApi, postApi, putApi } from '../API/AllRequestTypeAPIsLogic';
import enums from '../API/ApiList';
import DataGridTable from "../DataGridTableStructure.js/DataGridTable";
import { now } from '../DateTime'
import {openNotification} from "../DataGridTableStructure.js/PopupMessage"

const QuestionsList = () => {

    const [questionsList, setQuestionsList] = useState([]);
    const [Action, setAction] = useState(null);
    const [IdSelected, setIdSelected] = useState(0);
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const [requestDone, setRequestDone] = useState(0);


    useEffect(() => {
        const temp = getApi(enums.BASE_URL + enums.ENDPOINTS.Questions.GET_ALL_QUESTIONS)
        temp.then(data => {
            var questionsTemp = []
            data.map((x, index) => {
                x.sno = index + 1;
                x.actionId = x.id;
                questionsTemp.push(x);
            })
            setQuestionsList(questionsTemp);
        }).catch(exception => {
            console.error("Error in getting the Questions List ", exception);
        })
    }, [requestDone])

    const handleDelete = (id) => {
        Modal.confirm({
            title: "Are you sure?",
            content: "Do you want to proceed with this action?",
            onOk: () => {
                const deleteAction = deleteApi(enums.BASE_URL + enums.ENDPOINTS.Questions.DELETE_QUESTION + id);
                deleteAction.then(data => {
                    // console.log("data for deleted user ", data);
                    if (data) {
                        openNotification("User Deleted Successfully","top","success")
                        // message.success("User Deleted Successfully")
                        setRequestDone(requestDone + 1)
                    }
                }).catch(exception => {
                    console.error("exception while deleting the user Details ", exception)
                })
            },
            onCancel: () => {
                openNotification("Action canceled","top","info")
                // message.info("Action canceled")
                console.log("Action canceled"); // Handle cancel action here
            },
        });
    }

    const handleActionButton = (ActionType, id) => {
        if (ActionType === "edit") {
            questionsList && questionsList.map((x) => {
                if (id === x.id) {
                    // console.log("editing user detail ", x);
                    form.setFieldsValue({ "question": x.question, "optionA": x.optionA, "optionB": x.optionB, "optionC": x.optionC, "optionD": x.optionD, "correctoption": x.correctOption, "marks": x.marks, "created_date": x.created_date, "updated_date": x.updated_date });
                }
            })
            setAction('edit')
        } else if (ActionType === "add") {
            form.resetFields();
            setAction('add')
        }
        setOpen(true);
        setIdSelected(id);
    }

    const QuestionsColums = [
        { headerName: "Sr.NO", description: "Sr.NO", field: "sno", width: "100", align: "center", headerAlign: "center", headerClassName: "headerCellColor" },
        { headerName: "Question", description: "Question", field: "question", width: "120", align: "center", headerAlign: "center", headerClassName: "headerCellColor" },
        { headerName: "Option A", description: "Option A", field: "optionA", width: "120", align: "center", headerAlign: "center", headerClassName: "headerCellColor" },
        { headerName: "Option B", description: "Option B", field: "optionB", width: "120", align: "center", headerAlign: "center", headerClassName: "headerCellColor" },
        { headerName: "Option C", description: "Option C", field: "optionC", width: "120", align: "center", headerAlign: "center", headerClassName: "headerCellColor" },
        { headerName: "Option D", description: "Option D", field: "optionD", width: "120", align: "center", headerAlign: "center", headerClassName: "headerCellColor" },
        { headerName: "Correct Option", description: "Correct Option", field: "correctOption", width: "120", align: "center", headerAlign: "center", headerClassName: "headerCellColor" },
        {
            headerName: "Created Date", description: "Activity Date", field: "created_date", align: "center", width: "220", align: "center", headerAlign: "center", headerClassName: "headerCellColor", valueFormatter: (value, row, column, apiRef) => {
                if (value) {
                    const timestamp = Date.parse(value); // Parse the formatted date string into a timestamp

                    if (!isNaN(timestamp)) {
                        return formatDateTime(timestamp);
                    }
                }

                // Handle the case where value is not a valid timestamp or is undefined/null
                return ' '; // or some default value
            }
            , sortComparator: DateSorting
        },
        {
            headerName: "Updated Date", description: "Activity Date", field: "updated_date", align: "center", width: "214", align: "center", headerAlign: "center", headerClassName: "headerCellColor", valueFormatter: (value, row, column, apiRef) => {
                if (value) {
                    const timestamp = Date.parse(value); // Parse the formatted date string into a timestamp

                    if (!isNaN(timestamp)) {
                        return formatDateTime(timestamp);
                    }
                }

                // Handle the case where value is not a valid timestamp or is undefined/null
                return ' '; // or some default value
            }
            , sortComparator: DateSorting
        },
        {
            headerName: "Action", description: "Perform Action", field: "actionId", width: "200", align: "center", headerAlign: "center", headerClassName: "headerCellColor", renderCell: (params) => {
                return (
                    <div>
                        <PlusCircleFilled style={{ fontSize: "16px", color: "#1677ff", cursor: "pointer" }} onClick={() => handleActionButton('add', params.value)} />
                        &nbsp;&nbsp; &nbsp;&nbsp;
                        <EditFilled style={{ fontSize: "16px", color: "#1677ff", cursor: "pointer" }} onClick={() => handleActionButton('edit', params.value)} />
                        &nbsp;&nbsp; &nbsp;&nbsp;
                        <DeleteFilled style={{ fontSize: "16px", color: "#1677ff", cursor: "pointer" }} onClick={() => handleDelete(params.value)} />
                    </div>
                )
            }
        },
    ]

    function DateSorting(a, b) {
        if (a === null && b === null) {
            return 0;
        } else if (a === null) {
            return 1; // Place null values at the end
        } else if (b === null) {
            return -1; // Place null values at the end
        }
        // Compare non-null dates
        const timeDiff = new Date(a).getTime() - new Date(b).getTime();
        // Adjust the order for descending sorting
        return timeDiff > 0 ? 1 : timeDiff < 0 ? -1 : 0;
    }

    const formatDateTime = (timestamp) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };

        if (typeof Intl.DateTimeFormat === 'function') {
            try {
                // Try to use Intl.DateTimeFormat
                return new Intl.DateTimeFormat('en-US', options).format(new Date(timestamp));
            } catch (error) {
                // Handle any potential errors when using Intl.DateTimeFormat

            }
        }

        // Fallback to a custom formatting function
        return customFormatFunction(new Date(timestamp));
    };

    const customFormatFunction = (date) => {
        // Implement your custom date formatting logic here
        // This is just a placeholder; you may use a library like moment.js or another method
        return date.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });
    };

    const postDetails = () => {

        let requestBody = {
            id: Action === "edit" ? IdSelected : null,
            question: form.getFieldValue(['question']),
            optionA: form.getFieldValue(['optionA']),
            optionB: form.getFieldValue(['optionB']),
            optionC: form.getFieldValue(['optionC']),
            optionD: form.getFieldValue(['optionD']),
            correctOption: form.getFieldValue(['correctoption']),
            marks: form.getFieldValue(['marks']),
            created_date: Action === 'add' ? now() : form.getFieldValue(['created_date']),
            updated_date: now(),
        }

        // console.log("requestBody for creating the user ", requestBody);

        if (Action === 'add') {
            const postQuestionDetails = postApi(enums.BASE_URL + enums.ENDPOINTS.Questions.ADD_QUESTION, requestBody)
            postQuestionDetails.then(data => {
                // console.log("data ", data)
                openNotification("User added successfully","top","success")
                // message.success("User added successfully")
                setRequestDone(requestDone + 1)
                setOpen(false)
            }).catch(exception => {
                console.error("Error in posting the user details", exception)
            })
        } else {
            const postQuestionDetails = putApi(enums.BASE_URL + enums.ENDPOINTS.Questions.UPDATE_QUESTION + IdSelected, requestBody)
            postQuestionDetails.then(data => {
                // console.log("data ", data)
                openNotification("User edited successfully","top","success")
                // message.success("User edited successfully")
                setRequestDone(requestDone + 1)
                setOpen(false)
            }).catch(exception => {
                console.error("Error in posting the user details", exception)
            })
        }
    }

    const handleFinish = () => {
        Modal.confirm({
            title: "Are you sure?",
            content: "Do you want to proceed with this action?",
            onOk: () => {
                postDetails(); // Pass postDetails as a callback
            },
            onCancel: () => {
                openNotification("Action canceled","top","info")
                // message.info("Action canceled")
                console.log("Action canceled"); // Handle cancel action here
            },
        });
    }

    const handleFinishFailed = () => {
        openNotification("please ensure the requied fields are filled!","top","info")
        // message.info("please ensure the requied fields are filled!")
    }

    const handleCancel = () => {
        setOpen(false)
    }

    return (
        <div>
            <DataGridTable columns={QuestionsColums} rows={questionsList} height={495} initialSortingField={null} initialSortingType={null} />
            <Modal
                open={open}
                title={<a style={{ color: "#1677ff", fontSize: "large" }}>{Action === "add" ? "Add Question" : "Edit Question"}</a>}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFinish}
                    onFinishFailed={handleFinishFailed}
                >
                    <Form.Item
                        name="question"
                        label={<a style={{ fontSize: "small", fontFamily: "sans-serif", color: "black" }}>Question</a>}
                        rules={[{ required: true, message: "Please enter the Question!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div style={{ width: "24%" }}>
                            <Form.Item
                                name="optionA"
                                label={<a style={{ fontSize: "small", fontFamily: "sans-serif", color: "black" }}>Option A</a>}
                                rules={[{ required: true, message: "Please select the Option A!" }]}
                            >
                                <Input />
                            </Form.Item>
                        </div>
                        <div style={{ width: "24%" }}>
                            <Form.Item
                                name="optionB"
                                label={<a style={{ fontSize: "small", fontFamily: "sans-serif", color: "black" }}>Option B</a>}
                                rules={[{ required: true, message: "Please select the Option B!" }]}
                            >
                                <Input />
                            </Form.Item>
                        </div>
                        <div style={{ width: "24%" }}>
                            <Form.Item
                                name="optionC"
                                label={<a style={{ fontSize: "small", fontFamily: "sans-serif", color: "black" }}>Option C</a>}
                                rules={[{ required: true, message: "Please select the Option C!" }]}
                            >
                                <Input />
                            </Form.Item>
                        </div>
                        <div style={{ width: "24%" }}>
                            <Form.Item
                                name="optionD"
                                label={<a style={{ fontSize: "small", fontFamily: "sans-serif", color: "black" }}>Option D</a>}
                                rules={[{ required: true, message: "Please select the Option D!" }]}
                            >
                                <Input />
                            </Form.Item>
                        </div>
                    </div>


                    <Form.Item
                        name="correctoption"
                        label={<a style={{ fontSize: "small", fontFamily: "sans-serif", color: "black" }}>Correct Option</a>}
                        rules={[{ required: true, message: "Please select the Correct Option!" }]}
                    >
                        <Select
                            options={[
                                { label: "A", value: "A" },
                                { label: "B", value: "B" },
                                { label: "C", value: "C" },
                                { label: "D", value: "D" },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        name="marks"
                        label={<a style={{ fontSize: "small", fontFamily: "sans-serif", color: "black" }}>Marks</a>}
                        rules={[{ required: true, message: "Please enter the marks!" }]}
                    >
                        <Input type="number" />
                    </Form.Item>

                    <div style={{ display: "flex", marginTop: "0.5cm" }}>
                        <Button style={{ marginLeft: "30%" }} onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button type='primary' htmlType="submit" style={{ marginLeft: "5%" }}>
                            Submit
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    )
}

export default QuestionsList;