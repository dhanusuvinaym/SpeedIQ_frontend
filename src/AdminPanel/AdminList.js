import React, { useEffect, useState } from "react";
import { getApi, patchApi, postApi } from "../API/AllRequestTypeAPIsLogic";
import enums from "../API/ApiList";
import { message, Form, Button, Input, Modal } from "antd";
import { DeleteFilled, PlusCircleFilled, EditFilled } from "@ant-design/icons";
import DataGridTable from "../DataGridTableStructure.js/DataGridTable";
import { deleteApi } from "../API/AllRequestTypeAPIsLogic";

const AdminList = () => {

    const [adminDetails, setAdminDetails] = useState([]);
    const [open, setIsOpen] = useState(false)
    const [form] = Form.useForm();
    const [selectId, setSelectedId] = useState(0);
    const [action, setAction] = useState(null)
    const [requestDone, setRequestDone] = useState(0);

    useEffect(() => {
        const adminDetailsFetch = getApi(enums.BASE_URL + enums.ENDPOINTS.ADMIN.GETALL);
        adminDetailsFetch.then(data => {
            if (data) {
                // console.log("data admin", data);
                let temp = []
                data && data.map((x, index) => {
                    let tempdata = x
                    tempdata.actionId = x?.id
                    // tempdata.id = index + 1
                    tempdata.sno = index + 1
                    temp.push(tempdata);
                })

                setAdminDetails(temp);
            } else {
                message.error("Exception while fetching the details")
            }
        }).catch(Exception => {
            message.error("Exception while fetching the details ", Exception)
            console.error("Exception while fetching the admin details ", Exception);
        })
    }, [requestDone])

    const handleActionButton = (id, actionType) => {
        if (actionType === 'edit') {
            adminDetails && adminDetails.map((x) => {
                if (id === x?.id) {
                    form.setFieldsValue({ "username": x?.username, "password": x?.password })
                }
            })
        } else {
            form.resetFields();
        }

        setIsOpen(true);
        setSelectedId(parseInt(id));
        setAction(actionType)
    }


    const handleDelete = (id) => {
        Modal.confirm({
            title: "Are you sure?",
            content: "Do you want to proceed with this action?",
            onOk: () => {
                const deleteAction = deleteApi(enums.BASE_URL + enums.ENDPOINTS.ADMIN.DELETE + id);
                deleteAction.then(data => {
                    // console.log("data for deleted user ", data);
                    if (data) {
                        message.success("Admin Deleted Successfully")
                        setRequestDone(requestDone + 1)
                    }
                }).catch(exception => {
                    console.error("exception while deleting the user Details ", exception)
                })

            },
            onCancel: () => {
                // console.log("Action canceled"); // Handle cancel action here
                message.info("Action Cancelled")
            },
        });
    }

    const adminDetailsColumns = [
        { headerName: "Sr.NO", description: "Sr.NO", field: "sno", width: "100", align: "center", headerAlign: "center", headerClassName: "headerCellColor" },
        { headerName: "User Name", description: "username", field: "username", width: "150", align: "center", headerAlign: "center", headerClassName: "headerCellColor" },
        { headerName: "Password", description: "password", field: "password", width: "160", align: "center", headerAlign: "center", headerClassName: "headerCellColor" },
        {
            headerName: "Create Date", description: "Create Date", field: "createdate", align: "center", width: "250", align: "center", headerAlign: "center", headerClassName: "headerCellColor", valueFormatter: (value, row, column, apiRef) => {
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
            headerName: "Update Date", description: "Update Date", field: "updatedate", align: "center", width: "240", align: "center", headerAlign: "center", headerClassName: "headerCellColor", valueFormatter: (value, row, column, apiRef) => {
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
                        <PlusCircleFilled style={{ fontSize: "16px", color: "#1677ff", cursor: "pointer" }} onClick={() => handleActionButton(params.value, "add")} />
                        &nbsp;&nbsp; &nbsp;&nbsp;
                        <EditFilled style={{ fontSize: "16px", color: "#1677ff", cursor: "pointer" }} onClick={() => handleActionButton(params.value, "edit")} />
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

    const handleCancel = () => {
        setIsOpen(false)
    }

    const handleOk = () => {
        let requestJson = {
            username: form.getFieldValue("username"),
            password: form.getFieldValue("password")
        }
        if (action === 'add') {
            Modal.confirm({
                title: "Are you sure?",
                content: "Do you want to proceed with this action?",
                onOk: () => {
                    const createAdmin = postApi(enums.BASE_URL + enums.ENDPOINTS.ADMIN.CREATE, requestJson)
                    createAdmin.then(data => {
                        if (data) {
                            setRequestDone(requestDone + 1);
                            setIsOpen(false);
                            message.success("Admin created successfully");
                        } else {
                            message.error("Exception while fetching the details")
                        }
                    }).catch(exception => {
                        message.error(exception?.response?.data?.error);
                        console.error("exception while getting the error ", exception);
                    })
                },
                onCancel: () => {
                    message.info("Admin is not created")
                }
            })
        } else {
            Modal.confirm({
                title: "Are you sure?",
                content: "Do you want to proceed with this action?",
                onOk: () => {
                    const createAdmin = patchApi(enums.BASE_URL + enums.ENDPOINTS.ADMIN.UPDATE + selectId, requestJson)
                    createAdmin.then(data => {
                        if (data) {
                            setRequestDone(requestDone + 1);
                            setIsOpen(false);
                            message.success("Admin edited successfully");
                        } else {
                            message.error("Exception while fetching the details")
                        }
                    }).catch(exception => {
                        message.error(exception?.response?.data?.error);
                        console.error("exception while getting the error ", exception);
                    })
                },
                onCancel: () => {
                    message.info("Admin is not created")
                }
            })
        }
    }

    const handleFinishFailed = () => {

    }


    return (
        <div>
            <DataGridTable columns={adminDetailsColumns} rows={adminDetails} height={495} initialSortingField={null} initialSortingType={null} />
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
                    <Form.Item
                        name="username"
                        label={<a style={{ fontSize: "small", fontFamily: "sans-serif", color: "black" }}>User Name</a>}
                        rules={[{ required: true, message: "Please enter your username!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label={<a style={{ fontSize: "small", fontFamily: "sans-serif", color: "black" }}>password</a>}
                        rules={[{ required: true, message: "Please enter your password!" }]}
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
        </div>
    )


}

export default AdminList;