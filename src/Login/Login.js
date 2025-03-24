import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postApi } from '../API/AllRequestTypeAPIsLogic';
import enums from '../API/ApiList';
import { message, Button } from 'antd';
import { setCookie } from "../Cookies/GetCookies";
import { faBrain } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Content_guideLines_Login_page from '../UserPanel/Content_guideLines_login_page'

function LoginPage() {
  const [username, setUsername] = useState(null);
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const [action, setAction] = useState(null);
  const [adminUsername, setAdminUserName] = useState(null);
  const [password, setPassword] = useState(null);


  const handleLogin = (e) => {
    e.preventDefault();

    if (!token && !username) {
      message.error("Please input the credentials properly!");
      return;
    }

    if (!token) {
      message.error("Token is required!");
      return;
    }

    if (!username) {
      message.error("Please insert the mobile number properly!");
      return;
    }

    if (token.length !== 6) {
      message.error("Token must be 6 characters!");
      return;
    }

    if (username.length !== 10) {
      message.error("Mobile number should be 10 Characters!");
      return;
    }

    var data = {
      id: null,
      username: username,
      tokenId: token,
      isadmin: null,
      isvalid: null,
      activity_data: null,
      jwtToken: null
    }

    let loginRequest = postApi(enums.BASE_URL + enums.ENDPOINTS.LOGIN.VALIDATE, data)
    loginRequest.then(data => {
      console.log("data", data);
      if (data.isvalid) {
        navigate("/nav");
        setCookie("tokenId", data?.tokenId)
        setCookie("isadmin", false)
        setCookie("isvalid", true)
        setCookie("id", data.id)
        setCookie("jwtToken", data?.jwtToken)
        setCookie("isdemo", false)
        setCookie("username", username)
        // document.cookie = `tokenId=${data.tokenId}; path=/;`;
        // document.cookie = `isadmin=${data.isadmin}; path=/;`;
        // document.cookie = `id=${data.id}; path=/;`;
      } else {
        message.error("The credentials has been expired! Please Contact administrator..");
      }
    })
      .catch(err => {
        message.error("Exception while logging in", err?.response?.data);
      });

    console.log("Token ID:", token);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    const data = {
      username: adminUsername,
      password: password
    }
    const validateAdmin = postApi(enums.BASE_URL + enums.ENDPOINTS.ADMIN.VALIDATE + `?username=${data?.username}&password=${data?.password}`, null)
    validateAdmin.then(data => {
      if (data) {
        console.log("Data from the admin ", data);
        message.success("Logined Successfully!")
        navigate("/nav");
        setCookie("password", data?.password)
        setCookie("isadmin", true)
        setCookie("isvalid", true)
        setCookie("id", data?.id)
        setCookie("jwtToken", data?.jwtToken)
        setCookie("isdemo", false)
        setCookie("username", adminUsername)

      } else {
        message.error("Please check the credentials!")
      }
    }).catch(exception => {
      message.error("Please check the credentials!")
      console.error("exception = ", exception)
    })

  }

  const handleAction = (item) => {
    setAction(item)
  }

  const handleClickOnDemo = () => {
    alert("function invoked");
    setCookie("isdemo", true)
    navigate("/nav");
  }

  return (
    <div style={{ textAlign: "center", height: "12cm", padding: "5%" }}>
      <div style={{ width: "50%", backgroundColor: "black", height: "100%", marginLeft: "25%", borderRadius: "1cm", padding: "2%" }}>
        <h2 style={{ color: "white", fontFamily: "inherit" }}>
          <FontAwesomeIcon icon={faBrain} style={{ marginRight: "8px", color: "#1677ff" }} />
          SpeedIQ
        </h2>
        {action === null &&
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
            <Button
              onClick={() => handleAction('admin')}
              style={{ marginTop: "5%", width: "5cm" }}
              type="primary"
            >
              Login as Admin
            </Button>

            <Button
              onClick={() => handleAction('user')}
              style={{ marginTop: "5%", width: "5cm" }}
              type="primary"
            >
              Take a Quiz
            </Button>

            <Button
              onClick={handleClickOnDemo}
              style={{ marginTop: "5%", width: "5cm" }}
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
                  width: "5cm",
                  boxSizing: "border-box",
                }}
              />
              <input
                type="text"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  padding: "10px",
                  width: "5cm",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <Button
              onClick={handleAdminLogin}
              style={{ marginTop: "1%", width: "5cm" }}
              htmlType="submit"
              type="primary"
            >
              Login
            </Button>
          </form>
        }

        {action === 'user' &&
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "20px", marginTop: "5%", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
              <input
                type="number"
                placeholder="Mobile Number"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  padding: "10px",
                  width: "5cm",
                  boxSizing: "border-box",
                }}
              />
              <input
                type="text"
                placeholder="6-digit Token ID"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                style={{
                  padding: "10px",
                  width: "5cm",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <Button
              onClick={handleLogin}
              style={{ marginTop: "1%", width: "5cm" }}
              htmlType="submit"
              type="primary"
            >
              Start Test
            </Button>
          </form>
        }

        <Content_guideLines_Login_page />

      </div>
    </div>
  );
}

export default LoginPage;
