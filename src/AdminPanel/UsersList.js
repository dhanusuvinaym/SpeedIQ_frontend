import { DeleteFilled, EditFilled, PlusCircleFilled } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, message, Modal } from 'antd';
import React, { useEffect, useState } from "react";
import { deleteApi, getApi, postApi, putApi } from '../API/AllRequestTypeAPIsLogic';
import enums from '../API/ApiList';
import DataGridTable from "../DataGridTableStructure.js/DataGridTable";
import { now } from '../DateTime'
import { openNotification } from '../DataGridTableStructure.js/PopupMessage'

const UsersList = () => {

    const [loginDetails, setLoginDetails] = useState([]);
    const [IdSelected, setIdSelected] = useState(0);
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const [requestDone, setRequestDone] = useState(0);
    const [loading, setLoading] = useState(false)
    const [loadingLayOut, setLoadingLayOut] = useState(false)

    useEffect(() => {
        setLoading(true)
        const temp = getApi(enums.BASE_URL + enums.ENDPOINTS.LOGIN.GET_ALL_LOGIN_DETAILS);
        temp.then(data => {
            var loginTemp = []
            data.map((x, index) => {
                x.sno = index + 1;
                x.actionId = x.id;
                loginTemp.push(x);
            })
            // console.log("loginTemp ",loginTemp)
            setLoading(false)
            setLoginDetails(loginTemp)
        }).catch(error => {
            setLoading(false)
            console.error("Error fetching data:", error);
        });
    }, [requestDone])

    const handleDelete = (id) => {
        Modal.confirm({
            title: "Are you sure?",
            content: "Do you want to proceed with this action?",
            onOk: () => {
                setLoadingLayOut(true)
                const deleteAction = deleteApi(enums.BASE_URL + enums.ENDPOINTS.LOGIN.DELETE + id);
                deleteAction.then(data => {
                    // console.log("data for deleted user ", data);
                    if (data) {
                        openNotification("User Deleted Successfully", "top", "success")
                        // message.success("User Deleted Successfully")
                        setLoadingLayOut(false)
                        setRequestDone(requestDone + 1)
                    }
                }).catch(exception => {
                    setLoadingLayOut(false)
                    openNotification("Exception while Delete the users", "top", "error")
                    console.error("exception while deleting the user Details ", exception)
                })

            },
            onCancel: () => {
                openNotification("Action canceled", "top", "info")
                // message.info("Action canceled")
                // console.log("Action canceled"); // Handle cancel action here
            },
        });
    }

    const handleActionButton = (id) => {
        form.resetFields();
        setOpen(true);
        setIdSelected(id);
    }

    const UserDetailsColums = [
        { headerName: "Sr.NO", description: "Sr.NO", field: "sno", width: "100", align: "center", headerAlign: "center", headerClassName: "headerCellColor" },
        { headerName: "User Name", description: "User Name", field: "username", width: "150", align: "center", headerAlign: "center", headerClassName: "headerCellColor" },
        { headerName: "Mobile Number", description: "Mobile Number", field: "mobileNumber", width: "150", align: "center", headerAlign: "center", headerClassName: "headerCellColor" },
        { headerName: "Token Id", description: "Token Id", field: "tokenId", width: "150", align: "center", headerAlign: "center", headerClassName: "headerCellColor" },
        // { headerName: "Is Admin", description: "Is Admin", field: "isadmin", width: "160", align: "center", headerAlign: "center", headerClassName: "headerCellColor" },
        { headerName: "Valid", description: "Is Valid", field: "isvalid", width: "150", align: "center", headerAlign: "center", headerClassName: "headerCellColor" },
        {
            headerName: "Activity Date", description: "Activity Date", field: "activity_date", align: "center", width: "200", align: "center", headerAlign: "center", headerClassName: "headerCellColor", valueFormatter: (value, row, column, apiRef) => {
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
                        <PlusCircleFilled style={{ fontSize: "16px", color: "#1677ff", cursor: "pointer" }} onClick={() => handleActionButton(params.value)} />
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
            id: null,
            tokenId: form.getFieldValue(['tokenId']),
            activity_date: null,
            username: null,
            isvalid: true
        }

        // console.log("requestBody for creating the user ", requestBody);

        if (requestBody?.tokenId) {
            setLoadingLayOut(true)
            const postUserDetails = postApi(enums.BASE_URL + enums.ENDPOINTS.LOGIN.REGISTER, requestBody)
            postUserDetails.then(data => {
                // console.log("data for posting data ", data)
                openNotification("User added Successfully", "top", "success")
                // message.success("User added successfully")
                setRequestDone(requestDone + 1)
                setOpen(false)
                setLoadingLayOut(false)
            }).catch(exception => {
                console.error("Error in posting the user details", exception?.response.data)
                openNotification(exception?.response.data, "top", "error")
                setLoadingLayOut(false)
                // message.error(exception?.response.data)
            })
        } else {
            openNotification("Please enter the token Id and username", "top", "info")
            // message.info("Please enter the token Id and username")
        }
    }

    const handleOk = () => {
        Modal.confirm({
            title: "Are you sure?",
            content: "Do you want to proceed with this action?",
            onOk: () => {
                postDetails(); // Pass postDetails as a callback
            },
            onCancel: () => {
                openNotification("Action canceled", "top", "info")
                // message.info("Action canceled")
                // console.log("Action canceled"); // Handle cancel action here
            },
        });
    }

    const handleCancel = () => {
        setOpen(false)
    }

    const handleFinishFailed = () => {
        openNotification("Please ensure the required fields are filled!", "top", "info")
        // message.info("Please ensure the required fields are filled!")
    }

    return (
        <div>
            <DataGridTable columns={UserDetailsColums} rows={loginDetails} height={495} initialSortingField={null} initialSortingType={null} loading={loading} />
            <Modal
                open={open}
                title={<a style={{ color: "#1677ff", fontSize: "large" }}>Add User</a>}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleOk}
                    onFinishFailed={handleFinishFailed}
                >
                    {/* <Form.Item
                        name="username"
                        label={<a style={{ fontSize: "small", fontFamily: "sans-serif", color: "black" }}>User Name</a>}
                        rules={[{ required: true, message: "Please enter your username!" }]}
                    >
                        <Input />
                    </Form.Item> */}
                    <Form.Item
                        name="tokenId"
                        label={<a style={{ fontSize: "small", fontFamily: "sans-serif", color: "black" }}>Token Id</a>}
                        rules={[{ required: true, message: "Please enter your username!" }]}
                    >
                        <Input />
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
            {loadingLayOut && (
                <div className="loader-overlay">
                    <div className="loader"></div>
                </div>
            )}
        </div>
    )

}

export default UsersList;
