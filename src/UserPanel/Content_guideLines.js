import { Button } from 'antd';
import React from 'react';
import { getCookie, setCookie } from '../Cookies/GetCookies';

const ContentAndGuidelines = (props) => {
    const { timerDone } = props
    const isdemo = getCookie('isdemo') == 'true'

    const handleStartTest = () => {
        setCookie("guideLinesDone", true);
        timerDone(true);
    }

    return (
        <div style={{ width: "10cm", backgroundColor: "#d5e4ed", marginTop: '5%', marginLeft: "35%", borderRadius: "0.2cm" }}>
            <center>
                <h2 style={{ color: "#1677ff", marginTop: "0.2cm" }}>Welcome to Speed IQ</h2>
            </center>
            <div style={{ marginLeft: "0.5cm", margin: "1cm" }}>
                {!isdemo &&
                    <>
                        <center><h3>User Details</h3></center>
                        <p style={{ fontFamily: "bold", fontSize: "large", marginTop: "0.2cm" }}> Mobile No : {getCookie('username')}</p>
                        <p style={{ fontFamily: "bold", fontSize: "large" }}> Token Id : {getCookie('tokenId')}</p>
                    </>
                }
                <center>
                    <Button type='primary' onClick={handleStartTest}>Start Test</Button>
                </center>
            </div>
        </div>
    );
};

export default ContentAndGuidelines;
