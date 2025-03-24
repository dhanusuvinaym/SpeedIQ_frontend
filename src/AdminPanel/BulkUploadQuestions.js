import { InboxOutlined, DeleteFilled } from "@ant-design/icons";
import { Button, message, Upload } from 'antd';
import React, { useState } from "react";
import { postApi } from "../API/AllRequestTypeAPIsLogic";
import enums from "../API/ApiList";
import axios from "axios";
import { getCookie } from "../Cookies/GetCookies";

const { Dragger } = Upload;

function BulkUploadOfQuestions(props) {
  const flag = props.flag;
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  const handleFileUpload = (info) => {
    const fileList = info.fileList;
    if (fileList.length > 1) {
      message.error("You can't upload more than one file");
      setFileList([]);
    } else {
      const uploadedFile = info.file.originFileObj;
      console.log("uploadedFile", uploadedFile)
      if (uploadedFile) {
        console.log("Uploaded File:", uploadedFile);
        setFile(uploadedFile);
        setFileList([info.file])
      } else {
        console.error("No file found.");
      }
    }
  };

  const handleSubmit = () => {
    if (!file) {
      message.info("Please upload a file")
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    axios.post(enums.BASE_URL + (flag === 'questions' ? enums.ENDPOINTS.Questions.BULKUPLOAD : enums.ENDPOINTS.LOGIN.BULKUPLOAD), formData, { headers: { "Content-Type": "multipart/form-data" ,"Authorization":`Bearer ${getCookie('jwtToken')}`,"Demo":String(getCookie('isdemo') === 'true')} })
      .then(data => {
        if (data) {
          console.log("Questions bulk data", data)
          setLoading(false);
          message.success("Bulk upload of Questions operation was success")
          setFile(null);
          setFileList([]);
        }
      }).catch(exception => {
        message.error(exception?.response?.data?.message);
        setLoading(false);
        console.error("Error in uploading the bulk questions ", exception)
      })
  };

  const handleDelete=()=>{
    setFile(null);
    setFileList([])
  }

  return (
    <div style={{ padding: "20px" }}>
      <center><h2 style={{ color: "#1677ff" }}>{flag === 'questions' ? "Bulk Upload For Questions" : "Bulk Upload For User Tokens"}</h2></center>
      <Dragger
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        multiple={false} // Prevent multiple file uploads
        style={{ marginBottom: "10px" }}
        fileList={fileList}
        showUploadList={false}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
        <p className="ant-upload-hint">
          Support for a single file upload. Strictly prohibited from uploading company data or other
          banned files.
        </p>
      </Dragger>
      {file &&
        <div style={{ display: 'flex' }}>
          <h4>Uploaded File : </h4><a style={{ color: "#1677ff", fontSize: "medium" }}>{file?.name}</a> <DeleteFilled style={{ color: "red", cursor: 'pointer', marginRight: "0.2cm" }} onClick={handleDelete}/>
        </div>
      }
      <center>
        <Button type="primary" onClick={handleSubmit} style={{ marginBottom: "6%" }}>
          Start Processing
        </Button>
      </center>
      {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
}

export default BulkUploadOfQuestions;
