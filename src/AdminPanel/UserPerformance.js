import { DeleteFilled, EditFilled, PlusCircleFilled } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, message, Modal } from 'antd';
import React, { useEffect, useState } from "react";
import { deleteApi, getApi, postApi, putApi } from '../API/AllRequestTypeAPIsLogic';
import enums from '../API/ApiList';
import DataGridTable from "../DataGridTableStructure.js/DataGridTable";
import { now } from '../DateTime'
import { openNotification } from '../DataGridTableStructure.js/PopupMessage'

const UserPerformance = () => {

    const [usersDetails, setUserDetails] = useState([]);
    const [questionsAttenedByUser, setQuestionsAttenedByUser] = useState([])
    const [isOpen, setIsOpen] = useState(false);
    const [tokenId, setTokenId] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        const temp = getApi(enums.BASE_URL + enums.ENDPOINTS.USERS_PERFORMANCE.GET_ALL_USERS);
        temp.then(data => {
            var userTemp = []
            data.map((x, index) => {
                x.sno = index + 1;
                x.actionId = x.id;
                x.rank = index + 1;
                userTemp.push(x);
            })
            setUserDetails(userTemp)
            setLoading(false)
        }).catch(error => {
            setLoading(false)
            console.error("Error fetching data:", error);
        });
    }, [])


    const handleTokenClick = (tokenId) => {
        // message.info(tokenId)
        setTokenId(tokenId);
        setIsOpen(true);
        setLoading(true)
        const tempQuestionsData = getApi(enums.BASE_URL + enums.ENDPOINTS.USERS_PERFORMANCE.GET_ALL_QUESTIONS_BY_TOKEN_ID + tokenId)
        tempQuestionsData.then(data => {
            if (data) {
                var temp = []
                data && data.map((x, index) => {
                    var t = x;
                    t.id = index + 1;
                    t.sno = index + 1;
                    temp.push(t);
                })
                // console.log("Data by Token Id",temp);
                setQuestionsAttenedByUser(temp);
                setLoading(false)
            }
        }).catch(exception => {
            setLoading(false)
            openNotification("Questions fetching by token id is failed", "top", "error")
            // message.error("Questions fetching by token id is failed")
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
        { headerName: "User Name", description: "User Name", field: "username", width: "100", align: "center", headerAlign: "center", align: "center", headerClassName: "headerCellColor", sortable: false },
        { headerName: "Mobile Number", description: "Mobile Number", field: "mobilenumber", width: "100", align: "center", headerAlign: "center", align: "center", headerClassName: "headerCellColor", sortable: false },
        {
            headerName: "Token Id", description: "Token Id", field: "tokenid", width: "100", headerAlign: "center", align: "center", headerClassName: "headerCellColor", sortable: false, renderCell: (params) => {
                return (
                    <div>
                        <a style={{ fontFamily: "bold", color: "#1677ff", fontSize: "medium", fontStyle: "sans-sirf" }} onClick={() => handleTokenClick(params.value)}>{params.value}</a>
                    </div>
                )
            }
        },
        {
            headerName: "Score", description: "Score", field: "score", width: "100", align: "center", headerAlign: "center", headerClassName: "headerCellColor", sortable: false
            //  renderCell: (params) => {
            //     return (
            //         <HistoryStatusStickers processId={params.value} />
            //     )
            // }
        },
        {
            headerName: "Status", description: "Status", field: "status", width: "100", align: "center", headerAlign: "center", align: "center", headerClassName: "headerCellColor", sortable: false, valueFormatter: (value, row, column, apiRef) => {
                if(value!==null){
                    return value;
                }else{
                    return "Network Issue"
                }
            }
        },
        {
            headerName: "Exam Duration", description: "Exam Duration", field: "examDurationTime", width: "150", align: "center", headerAlign: "center", headerClassName: "headerCellColor", sortable: false, valueFormatter: (value, row, column, apiRef) => {
                // console.log("Value = ", value)
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
        { headerName: "Rank", description: "Rank", field: "rank", width: "100", headerAlign: "center", align: "center", headerClassName: "headerCellColor", sortable: false },
        {
            headerName: "Activity Date", description: "Activity Date", field: "dateTime", width: "250", align: "center", headerAlign: "center", headerClassName: "headerCellColor", sortable: false, valueFormatter: (value, row, column, apiRef) => {
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

    const handleCancel = () => {
        setIsOpen(false);
    }

    return (
        <div>
            <DataGridTable columns={UserDetailsColums} rows={usersDetails} height={495} initialSortingField={null} initialSortingType={null} loading={loading}/>
            <Modal
                open={isOpen}
                title={<h4>Questions Attened By User with Token Id : <a style={{ fontFamily: "bold", fontSize: "large", color: "#1677ff" }}>{tokenId}</a></h4>}
                footer={null}
                onCancel={handleCancel}
                width={950}
            >
                <DataGridTable columns={questionsColumns} rows={questionsAttenedByUser} height={495} initialSortingField={null} initialSortingType={null} loading={loading}/>

            </Modal>
        </div>
    )



}

export default UserPerformance;