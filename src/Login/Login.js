import { faBrain } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'antd';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postApi } from '../API/AllRequestTypeAPIsLogic';
import enums from '../API/ApiList';
import { clearCookies, setCookie } from "../Cookies/GetCookies";
import { openNotification } from '../DataGridTableStructure.js/PopupMessage';
import Content_guideLines_Login_page from '../UserPanel/Content_guideLines_login_page';
import axios from 'axios';

function LoginPage() {
  const [username, setUsername] = useState(null);
  const [mobilenumber, setMobileNumber] = useState(null);
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const [action, setAction] = useState(null);
  const [adminUsername, setAdminUserName] = useState(null);
  const [password, setPassword] = useState(null);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [count, setCount] = useState(0);
  const [loadingLayOut, setLoadingLayOut] = useState(false)

  useEffect(() => {
    if (count == 0) {
      sessionStorage.clear();
      setCount(count + 1);
    }
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // console.log("Width", screenWidth);


  const handleLogin = (e) => {
    e.preventDefault();

    if (!token && !username) {
      openNotification("Please input the credentials properly!", "top", "error")
      // message.error("Please input the credentials properly!");
      return;
    }

    if (!token) {
      openNotification("Token is required!", "top", "error")
      // message.error("Token is required!");
      return;
    }

    if (!username) {
      openNotification("Please insert the user name properly!", "top", "error")
      // message.error("Please insert the mobile number properly!");
      return;
    }

    if (!mobilenumber) {
      openNotification("Please insert the mobile number properly!", "top", "error")
      // message.error("Please insert the mobile number properly!");
      return;
    }

    if (token.length !== 6) {
      openNotification("Token must be 6 characters!", "top", "error")
      // message.error("Token must be 6 characters!");
      return;
    }

    if (mobilenumber.length !== 10) {
      openNotification("Mobile number should be 10 Characters!", "top", "error")
      return;
    }

    var data = {
      id: null,
      username: username,
      mobilenumber: mobilenumber,
      tokenId: token,
      isadmin: null,
      isvalid: null,
      activity_data: null,
      jwtToken: null
    }

    // console.log("Data sending for login ", data)
    setLoadingLayOut(true)
    let loginRequest = axios.post(enums.BASE_URL + enums.ENDPOINTS.LOGIN.VALIDATE, data)
    loginRequest.then(data => {
      // console.log("data at login", data);
      if (data?.status === 200) {
        setLoadingLayOut(false)
        data = data?.data
        if (data.isvalid) {
          const tokenId = data?.tokenId
          navigate("/nav");
          sessionStorage.setItem("tokenId", tokenId)
          setCookie(`${tokenId}-isadmin`, false)
          setCookie(`${tokenId}-isvalid`, true)
          setCookie(`${tokenId}-id`, data.id)
          setCookie(`${tokenId}-jwtToken`, data?.jwtToken)
          setCookie(`${tokenId}-isdemo`, false)
          setCookie(`${tokenId}-username`, username)
          setCookie(`${tokenId}-mobilenumber`, mobilenumber)
        } else {
          setLoadingLayOut(false)
          openNotification("The credentials has been expired! Please Contact administrator..", "top", "error")
          // message.error("The credentials has been expired! Please Contact administrator..");
        }
      } else {
        setLoadingLayOut(false)
        openNotification("Please Check the credentials!", "top", "error")
      }
    })
      .catch(err => {
        setLoadingLayOut(false)
        openNotification("Exception while logging in" + err?.response?.data, "top", "error")
        // message.error("Exception while logging in", err?.response?.data);
      });

    // console.log("Token ID:", token);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    const data = {
      username: adminUsername,
      password: password
    }
    setLoadingLayOut(true)
    const validateAdmin = axios.post(enums.BASE_URL + enums.ENDPOINTS.ADMIN.VALIDATE + `?username=${data?.username}&password=${data?.password}`, null)
    validateAdmin.then(data => {
      if (data?.status === 200) {
        data = data?.data;
        setLoadingLayOut(false)
        openNotification("Logined Successfully!", "top", "success")
        navigate("/nav");
        sessionStorage.setItem("tokenId", adminUsername)
        setCookie(`${adminUsername}-password`, data?.password)
        setCookie(`${adminUsername}-isadmin`, true)
        setCookie(`${adminUsername}-isvalid`, true)
        setCookie(`${adminUsername}-id`, data?.id)
        setCookie(`${adminUsername}-jwtToken`, data?.jwtToken)
        setCookie(`${adminUsername}-isdemo`, false)
        setCookie(`${adminUsername}-username`, adminUsername)
      } else {
        setLoadingLayOut(false)
        openNotification("Please check the credentials!", "top", "error")
      }
    }).catch(exception => {
      setLoadingLayOut(false)
      openNotification("Please check the credentials!", "top", "error")
      console.error("exception = ", exception)
    })

  }

  const handleAction = (item) => {
    setAction(item)
  }

  const handleClickOnDemo = () => {
    sessionStorage.setItem("tokenId", "demo")
    setCookie(`demo-isdemo`, true)
    setCookie(`demo-isvalid`, true)
    navigate("/nav");
  }

  const handleBack = () => {
    setAction(null);
  }


  return (
    <div style={{ textAlign: "center", padding: screenWidth > 500 ? "5%" : "1%" }}>
      <center>
        <div style={{ width: screenWidth > 500 ? "50%" : "100%", backgroundColor: "black", height: "100%", borderRadius: "0.5cm", padding: "2%", marginTop: screenWidth > 500 ? "0" : "15%" }}>
          <h2 style={{ color: "white", fontFamily: "inherit", marginBottom: "10%", fontSize: "30px" }}>
            <span> <FontAwesomeIcon icon={faBrain} /> SpeedIQ</span>
          </h2>
          {action === null &&
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "30px" }}>
              <Button
                onClick={() => handleAction('admin')}
                style={{
                  width: screenWidth > 500 ? "5cm" : "70%",
                }}
                type="primary"
              >
                Login as Admin
              </Button>

              <Button
                onClick={() => handleAction('user')}
                style={{ width: screenWidth > 500 ? "5cm" : "70%" }}
                type="primary"
              >
                Take a Quiz
              </Button>

              <Button
                onClick={handleClickOnDemo}
                style={{ width: screenWidth > 500 ? "5cm" : "70%" }}
                type="primary"
              >
                Take a Demo
              </Button>
            </div>
          }


          {action === 'admin' &&
            <form onSubmit={handleAdminLogin}>
              <div style={{ marginBottom: "20px", marginTop: "5%", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                <input
                  type="text"
                  placeholder="Username"
                  value={adminUsername}
                  onChange={(e) => setAdminUserName(e.target.value)}
                  style={{
                    padding: "10px",
                    width: screenWidth > 500 ? "5cm" : "70%",
                    boxSizing: "border-box",
                  }}
                />
                <input
                  type="password"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    padding: "10px",
                    width: screenWidth > 500 ? "5cm" : "70%",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ marginBottom: "20px", marginTop: "5%", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                <Button
                  onClick={handleAdminLogin}
                  style={{ marginTop: "1%", width: screenWidth > 500 ? "5cm" : "70%" }}
                  htmlType="submit"
                  type="primary"
                >
                  Login
                </Button>
                <Button
                  onClick={handleBack}
                  style={{ marginTop: "1%", width: screenWidth > 500 ? "5cm" : "70%" }}
                // type="primary"
                >
                  back
                </Button>
              </div>
            </form>
          }

          {action === 'user' &&
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: "20px", marginTop: "5%", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                <input
                  type="text"
                  placeholder="User Name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{
                    padding: "10px",
                    width: screenWidth > 500 ? "5cm" : "70%",
                    boxSizing: "border-box",
                  }}
                />
                <input
                  type="number"
                  placeholder="Mobile Number"
                  value={mobilenumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  style={{
                    padding: "10px",
                    width: screenWidth > 500 ? "5cm" : "70%",
                    boxSizing: "border-box",
                  }}
                />
                <input
                  type="password"
                  placeholder="6-digit Token ID"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  style={{
                    padding: "10px",
                    width: screenWidth > 500 ? "5cm" : "70%",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ marginBottom: "20px", marginTop: "5%", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                <Button
                  onClick={handleLogin}
                  style={{ marginTop: "1%", width: screenWidth > 500 ? "5cm" : "70%" }}
                  htmlType="submit"
                  type="primary"
                >
                  Start Test
                </Button>
                <Button
                  onClick={handleBack}
                  style={{ marginTop: "1%", width: screenWidth > 500 ? "5cm" : "70%" }}
                // type="primary"
                >
                  back
                </Button>
              </div>
            </form>
          }

          <Content_guideLines_Login_page />

        </div>
      </center>

      {loadingLayOut && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}

      {/* <Button onClick={handleDummy}>Dummy</Button> */}
    </div>
  );
}

export default LoginPage;
