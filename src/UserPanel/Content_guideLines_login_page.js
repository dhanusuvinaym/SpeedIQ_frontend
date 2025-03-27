
import { message, Modal } from "antd";
import React from "react";
import {openNotification} from "../DataGridTableStructure.js/PopupMessage"

const Content_guideLines_Login_page = () => {

    const showModal = () => {
        Modal.info({
            width: "60%",
            height:"50%",
            title: "Quiz Guidelines and Terms",
            content: (
                <div style={{ textAlign: "left" }}>
                    <h3>I. Eligibility and Registration:</h3>
                    <ul>
                        <li> Age: 18.</li>
                        <li> Location: India.</li>
                        <li> Registration: User needs to provide a valid mobile number and name. For one registration, the quiz can be taken only once.</li>
                        <li> Multiple Registrations: Multiple registrations from the same participant are allowed as every registration will generate a different question paper.</li>
                        <li> Disqualification: Test can be submitted within 30 minutes after starting the quiz. If time expires, the quiz will be submitted automatically.</li>
                    </ul>

                    <h3>II. Quiz Format and Rules:</h3>
                    <ul>
                        <li> Quiz Type: Multiple choice, open-ended.</li>
                        <li> Number of Questions: 10 questions for 30 minutes.</li>
                        <li> Question Topics: General aptitude, logic reasoning, general awareness, sports and games, helpful for interview/competitive exams.</li>
                        <li> Scoring: Each correct answer gets 1 mark. No penalties for incorrect answers. Unanswered questions will receive 0 marks after 30 minutes.</li>
                        <li> Allowed Devices: Computers, mobile phones.</li>
                        <li> Communication: Participants may communicate with each other or use external resources.</li>
                        <li> Disqualification: Cheating or violating rules may result in disqualification.</li>
                    </ul>

                    <h3>III. Prizes and Awards:</h3>
                    <ul>
                        <li> Prizes: Winner will receive a certificate from SpeedIQ (soft copy) and Rs. 5000.</li>
                        <li> Winner Selection: Based on the highest score with the least time taken.</li>
                        <li> Prize Distribution: Certificates will be sent to the winner's mobile via WhatsApp and prize money will be paid through UPI.</li>
                    </ul>

                    <h3>IV. Disclaimers and Legal:</h3>
                    <ul>
                        <li> Organizers' Responsibility: Organizers will resolve technical issues during the quiz.</li>
                        <li> Data Privacy: Participant data will be stored only until the quiz context period. Once winners are announced, data will be erased after a week.</li>
                        <li> Organizer's Right to Change: Organizers can change terms and conditions with reasonable notice.</li>
                        <li> Contact Information: Mobile Number: XXXXXXX, Mail ID: XXXXXXXXX@gmail.com.</li>
                    </ul>
                </div>
            ),
            onOk() {
                openNotification("Closed Content and guidelines","top","info")
                // message.info("Modal Closed")
                // console.log("Modal Closed");
            },
            closable: true, // Optional: Adds a close button to the top-right corner
        });
    };

    return (
        <div style={{marginTop:"0.5cm"}}>
            <a style={{color:"#1677ff",cursor:"pointer"}} onClick={showModal}>Terms & Condtions</a>
        </div>
    )
};

export default Content_guideLines_Login_page;
