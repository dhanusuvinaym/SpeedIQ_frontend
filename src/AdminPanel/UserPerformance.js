import { DeleteFilled, EditFilled, PlusCircleFilled } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, message, Modal } from 'antd';
import React, { useEffect, useState } from "react";
import { deleteApi, getApi, postApi, putApi } from '../API/AllRequestTypeAPIsLogic';
import enums from '../API/ApiList';
import DataGridTable from "../DataGridTableStructure.js/DataGridTable";
import { now } from '../DateTime'

const UserPerformance = () => {

    const [usersDetails, setUserDetails] = useState([]);
    const [questionsAttenedByUser, setQuestionsAttenedByUser] = useState([])
    const [isOpen, setIsOpen] = useState(false);
    const [tokenId, setTokenId] = useState(null)
    const [Action, setAction] = useState(null);
    const [IdSelected, setIdSelected] = useState(0);
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const [requestDone, setRequestDone] = useState(0);

    useEffect(() => {
        const temp = getApi(enums.BASE_URL + enums.ENDPOINTS.USERS_PERFORMANCE.GET_ALL_USERS);
        temp.then(data => {
            var userTemp = []
            data.map((x, index) => {
                x.sno = index + 1;
                x.actionId = x.id;
                x.rank = index + 1;
                userTemp.push(x);
            })
            console.log("userTemp ", userTemp)
            setUserDetails(userTemp)
        }).catch(error => {
            console.error("Error fetching data:", error);
        });
    }, [])

    // const handleDelete = (id) => {
    //     Modal.confirm({
    //         title: "Are you sure?",
    //         content: "Do you want to proceed with this action?",
    //         onOk: () => {
    //             const deleteAction = deleteApi(enums.BASE_URL + enums.ENDPOINTS.USERS_PERFORMANCE.DELETE_DETAILS + id);
    //             deleteAction.then(data => {
    //                 console.log("data for deleted user ", data);
    //                 if (data) {
    //                     message.success("User Deleted Successfully")
    //                     setRequestDone(requestDone + 1)
    //                 }
    //             }).catch(exception => {
    //                 console.error("exception while deleting the user Details ", exception)
    //             })

    //         },
    //         onCancel: () => {
    //             console.log("Action canceled"); // Handle cancel action here
    //         },
    //     });
    // }

    // const handleActionButton = (ActionType, id) => {
    //     if (ActionType === "edit") {
    //         usersDetails && usersDetails.map((x) => {
    //             if (id === x.id) {
    //                 console.log("editing user detail ", x);
    //                 form.setFieldsValue({ 'username': x.username, "tokenId": x.tokenId, "Admin": x.isadmin, "created_date": x.created_date });
    //             }
    //         })
    //         setAction('edit')
    //     } else if (ActionType === "add") {
    //         setAction('add')
    //     }
    //     setOpen(true);
    //     setIdSelected(id);
    // }

    const handleTokenClick = (tokenId) => {
        // message.info(tokenId)
        setTokenId(tokenId);
        const tempQuestionsData = getApi(enums.BASE_URL + enums.ENDPOINTS.USERS_PERFORMANCE.GET_ALL_QUESTIONS_BY_TOKEN_ID + tokenId)
        tempQuestionsData.then(data => {
            if (data) {
                var temp=[]
                data && data.map((x,index)=>{
                    var t=x;
                    t.id=index+1;
                    t.sno=index+1;
                    temp.push(t);
                })
                console.log("Data by Token Id",temp);
                setQuestionsAttenedByUser(temp);    
                setIsOpen(true);
            }
        }).catch(exception => {
            message.error("Questions fetching by token id is failed")
            console.error("Exception in getting questions by tokenid", exception)
        })

    }

    const questionsColumns = [
        { headerName: "Sr.No", description: "Sr.No", field: "sno", width: "100", align: "center", headerAlign: "center", align: "center", headerClassName: "headerCellColor", sortable: false },
        { headerName: "Question", description: "Question", field: "question", width: "100", align: "center", headerAlign: "center", align: "center", headerClassName: "headerCellColor", sortable: false },
        { headerName: "Option A", description: "Sr.NO", field: "optionA", width: "100", align: "center", headerAlign: "center", align: "center", headerClassName: "headerCellColor", sortable: false },
        { headerName: "Option B", description: "Sr.NO", field: "optionB", width: "100", align: "center", headerAlign: "center", align: "center", headerClassName: "headerCellColor", sortable: false },
        { headerName: "Option C", description: "Sr.NO", field: "optionC", width: "100", align: "center", headerAlign: "center", align: "center", headerClassName: "headerCellColor", sortable: false },
        { headerName: "Option D", description: "Sr.NO", field: "optionD", width: "100", align: "center", headerAlign: "center", align: "center", headerClassName: "headerCellColor", sortable: false },
        { headerName: "Correct Option", description: "Sr.NO", field: "correctOption", width: "100", align: "center", headerAlign: "center", align: "center", headerClassName: "headerCellColor", sortable: false },
        { headerName: "Option Selected", description: "Sr.NO", field: "optionSelected", width: "100", align: "center", headerAlign: "center", align: "center", headerClassName: "headerCellColor", sortable: false },
        { headerName: "Final Output", description: "Sr.NO", field: "finalOutput", width: "100", align: "center", headerAlign: "center", align: "center", headerClassName: "headerCellColor", sortable: false },
    ]


    const UserDetailsColums = [
        { headerName: "Sr.NO", description: "Sr.NO", field: "sno", width: "100", align: "center", headerAlign: "center", align: "center", headerClassName: "headerCellColor", sortable: false },
        {
            headerName: "Token Id", description: "Token Id", field: "tokenid", width: "200", headerAlign: "center", align: "center", headerClassName: "headerCellColor", sortable: false, renderCell: (params) => {
                return (
                    <div>
                        <a style={{ fontFamily: "bold", color: "#1677ff", fontSize: "medium", fontStyle: "sans-sirf" }} onClick={() => handleTokenClick(params.value)}>{params.value}</a>
                    </div>
                )
            }
        },
        {
            headerName: "Score", description: "Score", field: "score", width: "150", align: "center", headerAlign: "center", headerClassName: "headerCellColor", sortable: false
            //  renderCell: (params) => {
            //     return (
            //         <HistoryStatusStickers processId={params.value} />
            //     )
            // }
        },
        {
            headerName: "Exam Duration", description: "Exam Duration", field: "examDurationTime", width: "220", align: "center", headerAlign: "center", headerClassName: "headerCellColor", sortable: false, valueFormatter: (value, row, column, apiRef) => {
                console.log("Value = ", value)
                if (value) {
                    return value; // Return the formatted duration string (e.g., "01:23:45.678")
                }
                return ' '; // Handle undefined or null values
            },
            sortComparator: (v1, v2) => {
                if (!v1) return -1; // If v1 is null or undefined, it goes first
                if (!v2) return 1; // If v2 is null or undefined, v1 goes after v2

                // Parse durations into milliseconds for comparison
                const parseToMilliseconds = (timeString) => {
                    const [hours, minutes, secondsAndMillis] = timeString.split(':');
                    const [seconds, millis = '0'] = secondsAndMillis.split('.');

                    return (
                        parseInt(hours) * 3600000 + // Hours to milliseconds
                        parseInt(minutes) * 60000 + // Minutes to milliseconds
                        parseInt(seconds) * 1000 + // Seconds to milliseconds
                        parseInt(millis) // Milliseconds
                    );
                };

                const duration1 = parseToMilliseconds(v1);
                const duration2 = parseToMilliseconds(v2);

                return duration1 - duration2; // Ascending order
            }
        },
        { headerName: "Rank", description: "Rank", field: "rank", width: "150", headerAlign: "center", align: "center", headerClassName: "headerCellColor", sortable: false },
        {
            headerName: "Activity Date", description: "Activity Date", field: "dateTime", width: "300", align: "center", headerAlign: "center", headerClassName: "headerCellColor", sortable: false, valueFormatter: (value, row, column, apiRef) => {
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

    // const postDetails = () => {

    //     let requestBody = {
    //         id: Action === "edit" ? IdSelected : null,
    //         tokenId: form.getFieldValue(['tokenId']),
    //         username: form.getFieldValue(['username']),
    //         created_date: Action === 'add' ? now() : form.getFieldValue(['created_date']),
    //         updated_date: now(),
    //         isadmin: form.getFieldValue(['Admin']) ? true : false
    //     }

    //     console.log("requestBody for creating the user ", requestBody);

    //     if (requestBody?.tokenId && requestBody?.username) {
    //         if (Action === 'add') {
    //             const postUserDetails = postApi(enums.BASE_URL + enums.ENDPOINTS.LOGIN.REGISTER, requestBody)
    //             postUserDetails.then(data => {
    //                 console.log("data ", data)
    //                 message.success("User added successfully")
    //                 setRequestDone(requestDone + 1)
    //                 setOpen(false)
    //             }).catch(exception => {
    //                 console.error("Error in posting the user details", exception)
    //             })
    //         } else {
    //             const postUserDetails = putApi(enums.BASE_URL + enums.ENDPOINTS.LOGIN.UPDATE + IdSelected, requestBody)
    //             postUserDetails.then(data => {
    //                 console.log("data ", data)
    //                 message.success("User edited successfully")
    //                 setRequestDone(requestDone + 1)
    //                 setOpen(false)
    //             }).catch(exception => {
    //                 console.error("Error in posting the user details", exception)
    //             })
    //         }
    //     } else if (!requestBody?.tokenId && !requestBody?.username) {
    //         message.info("Please enter the token Id and username")
    //     } else if (!requestBody?.tokenId) {
    //         message.info("Please enter the token Id")
    //     } else {
    //         message.info("Please enter the username")
    //     }
    // }

    // const handleOk = () => {
    //     Modal.confirm({
    //         title: "Are you sure?",
    //         content: "Do you want to proceed with this action?",
    //         onOk: () => {
    //             postDetails(); // Pass postDetails as a callback
    //         },
    //         onCancel: () => {
    //             console.log("Action canceled"); // Handle cancel action here
    //         },
    //     });
    // }

    // const handleCancel = () => {
    //     setOpen(false)
    // }

    // const handleFinishFailed = () => {
    //     message.info("Please ensure the required fields are filled!")
    // }

    const handleCancel = () => {
        setIsOpen(false);
    }

    return (
        <div>
            <DataGridTable columns={UserDetailsColums} rows={usersDetails} height={495} initialSortingField={null} initialSortingType={null} />
            <Modal
                open={isOpen}
                title={<h4>Questions Attened By User with Token Id : <a style={{fontFamily:"bold",fontSize:"large",color:"#1677ff"}}>{tokenId}</a></h4>}
                footer={null}
                onCancel={handleCancel}
                width={950}
            >
                <DataGridTable columns={questionsColumns} rows={questionsAttenedByUser} height={495} initialSortingField={null} initialSortingType={null} />

            </Modal>
        </div>
    )



}

export default UserPerformance;