
import { Modal, Button, Input } from "antd";
import React, { useState, useEffect } from "react";
import { openNotification } from "../DataGridTableStructure.js/PopupMessage"
import { getApi, putApi } from '../API/AllRequestTypeAPIsLogic'
import enums from "../API/ApiList";
import { QuestionOutlined, CopyrightOutlined } from '@ant-design/icons'


const Content_guideLines_Login_page = (props) => {
    const selectedKey = props.selectedKey
    const [contentData, setContentData] = useState("");
    const [helpData, setHelpData] = useState("");
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedContent, setEditedContent] = useState("");
    const [selectedButton, setSelectedButton] = useState("C")

    useEffect(() => {
        const tempData = getApi(enums.BASE_URL + enums.ENDPOINTS.CONTENTGUIDELINES.GETALL)
        tempData.then(data => {
            // console.log("Content Data ", data)
            if (data[0].id == 1) {
                setContentData(data[0]);
                setHelpData(data[1])
            } else {
                setContentData(data[1]);
                setHelpData(data[0])
            }
        }).catch(exception => {
            console.error("Getting exception while getting the content and guidelines", exception)
        })
    }, [])

    const showModal = () => {
        Modal.info({
            title: "Quiz Guidelines and Terms",
            content: <div style={{ textAlign: "left" }} dangerouslySetInnerHTML={{ __html: contentData?.content?.replace(/\n/g, '<br>') }} />,
            width: "60%",
            closable: true,
        });
    };

    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
        if (selectedButton === 'C') {
            setEditedContent(contentData?.content);
        } else {
            setEditedContent(helpData?.content)
        }
    };

    const handleSave = () => {

        const requestJson = {
            content: editedContent
        }

        const tempData = putApi(enums.BASE_URL + enums.ENDPOINTS.CONTENTGUIDELINES.UPDATE + contentData.id, JSON.stringify(requestJson))
        tempData.then(data => {
            openNotification("Content Updated Successfully", "top", "success")
        }).catch(exception => {
            openNotification("Exception while updating content data", "top", "error")
            console.error("Getting exception while getting the content and guidelines", exception)
        })

        var temp = {
            id: 1,
            content: editedContent
        }
        if (selectedButton === 'C') {
            setContentData(temp);
        } else {
            setHelpData(temp)
        }
        setIsEditMode(false);
    };


    return (
        <div style={{ marginTop: "0.5cm", padding: "1%" }}>
            {selectedKey ?
                <>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div style={{ display: "flex" }}>
                            <Button style={{}} type={selectedButton === 'C' ? "primary" : ""} onClick={() => setSelectedButton('C')}  disabled={selectedButton === 'H' && isEditMode}>Content And Guide Lines</Button>
                            <Button style={{ marginLeft: "3%" }} type={selectedButton === 'H' ? "primary" : ""} disabled={selectedButton === 'C' && isEditMode} onClick={() => setSelectedButton('H')}>Help</Button>
                        </div>

                        <div style={{}}>
                            {!isEditMode ?
                                <Button onClick={toggleEditMode} type="primary">Edit</Button>
                                :
                                <div style={{ display: "flex", gap: "3%" }}>
                                    <Button style={{ marginLeft: "-5%" }} onClick={toggleEditMode}>Cancel</Button>
                                    <Button type="primary" onClick={handleSave}>Save</Button>
                                </div>
                            }
                        </div>
                    </div>
                    <div style={{ backgroundColor: "white", height: "90%", marginLeft: "", marginTop: "0.1cm", borderRadius: "0.5cm" }}>
                        {selectedButton === 'C' ?
                            !isEditMode ?
                                <div
                                    style={{ textAlign: "left", height: "100%", overflow: "scroll", padding: "1%" }}
                                    dangerouslySetInnerHTML={{
                                        __html: contentData?.content?.replace(/\n/g, "<br>"),
                                    }}
                                /> :
                                <Input.TextArea
                                    rows={18}
                                    value={editedContent}
                                    onChange={(e) => setEditedContent(e.target.value)}
                                    style={{ width: "100%" }}
                                />
                            :
                            <div style={{ textAlign: "left", height: "100%", padding: "1%" }}>
                                {!isEditMode ?
                                    <div style={{ marginTop: "0.5cm" }}>
                                        <span>Help Link = <a href={helpData?.content} target="_blank">{helpData?.content}</a></span>
                                    </div>
                                    :
                                    <Input value={editedContent} onChange={(e) => setEditedContent(e.target.value)} disabled={!isEditMode} />
                                }
                            </div>
                        }
                    </div>
                </>
                :
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                        <a style={{ color: "#1677ff", cursor: "pointer" }} onClick={showModal}><CopyrightOutlined style={{ fontSize: "15px" }} /> Terms & Condtions</a>
                    </div>

                    <div>
                        <a style={{ color: "#1677ff", cursor: "pointer" }} href={helpData?.content} target="_blank">Help<QuestionOutlined style={{ fontSize: "15px" }} /></a>
                    </div>
                </div>
            }


        </div>
    )
};

export default Content_guideLines_Login_page;
