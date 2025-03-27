import { Button } from 'antd';
import React from 'react';
import { getCookie, setCookie } from '../Cookies/GetCookies';

const ContentAndGuidelines = (props) => {
    const { timerDone } = props
    const isdemo = getCookie('isdemo') == 'true'
    const screenWidth = props.screenWidth

    const handleStartTest = () => {
        setCookie("guideLinesDone", true);
        timerDone(true);
    }

    return (
        <center>
            <div style={{ width: screenWidth > 500 ? "10cm" : "70%", backgroundColor: "#d5e4ed", marginTop: '5%', borderRadius: "0.2cm", padding: "2%" }}>
                <center>
                    <h2 style={{ color: "#1677ff", marginTop: "0.2cm" }}>Welcome to Speed IQ</h2>
                </center>
                <div style={{ marginLeft: "0.5cm", margin: "1cm" }}>
                    {!isdemo &&
                        <>
                            <center><h3>User Details</h3></center>
                            <p style={{ fontFamily: "bold", fontSize: "large", marginTop: "0.2cm" }}> User Name : {getCookie('username')}</p>
                            <p style={{ fontFamily: "bold", fontSize: "large", marginTop: "0.2cm" }}> Mobile No : {getCookie('mobilenumber')}</p>
                            <p style={{ fontFamily: "bold", fontSize: "large" }}> Token Id : {getCookie('tokenId')}</p>
                        </>
                    }
                    <center>
                        <Button type='primary' onClick={handleStartTest}>Start Test</Button>
                    </center>
                </div>
            </div>
        </center>
    );
};

export default ContentAndGuidelines;
