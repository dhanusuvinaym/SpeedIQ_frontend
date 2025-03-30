import {
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined,
  ShopOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  MenuOutlined,
  EditOutlined
} from '@ant-design/icons';
import { faBrain } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Layout, Menu, message, theme, Drawer } from 'antd';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDetailsPage from '../AdminPanel/AdminList';
import BulkUploadOfQuestions from '../AdminPanel/BulkUploadQuestions';
import QuestionsList from '../AdminPanel/QuestionsList';
import UserPerformance from '../AdminPanel/UserPerformance';
import UsersList from '../AdminPanel/UsersList';
import { inVallidateUser } from '../API/AllRequestTypeAPIsLogic';
import ClearQuiz from '../ClearQuiz/ClearQuiz';
import { clearCookies, getCookie, setCookie } from '../Cookies/GetCookies';
import Content_guideLines from '../UserPanel/Content_guideLines';
import QuizPage from '../UserPanel/QuizPage';
import { openNotification } from '../DataGridTableStructure.js/PopupMessage';
import Content_guideLines_Login_page from '../UserPanel/Content_guideLines_login_page';


const { Header, Content, Footer, Sider } = Layout;

const siderStyle = {
  overflow: 'auto',
  height: '95vh',
  position: 'fixed',
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: 'thin',
  scrollbarGutter: 'stable',
  margin: "0.3cm",
  borderRadius: "0.2cm",
};


const items1 = ['1', '2', '3'].map((key) => ({
  key,
  label: `nav ${key}`,
}));


const items = [
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  BarChartOutlined,
  CloudOutlined,
  AppstoreOutlined,
  EditOutlined,
  TeamOutlined,
  ShopOutlined,
]
// .map((icon, index) => ({
//   key: String(index + 1),
//   icon: React.createElement(icon),
//   label: `nav ${index + 1}`,
// }));



const Timer = (props) => {
  let tokenId =sessionStorage.getItem("tokenId")
  let time = getCookie(`${tokenId}-timeLeft`)
  const [timeLeft, setTimeLeft] = useState(time ? parseInt(time) : (30 * 60));
  const { setAutoSubmit } = props;

  useEffect(() => {

    if (!getCookie('startTime')) {
      setCookie(`${tokenId}-startTime`, new Date())
      // document.cookie = `startTime=${new Date()}; path=/;`;
    }

    if (timeLeft <= 0) {
      setAutoSubmit(true);
      // handleSubmit(); // Auto-submit when time is up
      return;
    }

    if (!(props.clickedOnSubmit)) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          const updatedTime = prevTime - 1; // Calculate the new time
          setCookie(`${tokenId}-timeLeft`, updatedTime)
          // document.cookie = `timeLeft=${updatedTime}; path=/;`; // Update cookie with the correct value
          return updatedTime;
        });
      }, 1000);

      return () => clearInterval(timer); // Cleanup timer on component unmount
    }

  }, [timeLeft]);

  // Format time for display
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <div style={{ color: "white", fontWeight: "bold" }}>
      <span style={{ color: "white", backgroundColor: "red", padding: "5px", borderRadius: "0.2cm" }}>
        {props.totalMarks === null ? `Time Left: ${formatTime(timeLeft)}` : `Total Marks : ${props.totalMarks}`}
      </span>
    </div>
  )
}


const App = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  
  let tokenId = sessionStorage.getItem("tokenId");
  let isAdmin = getCookie(`${tokenId}-isadmin`) === "true";
  let isDemo = getCookie(`${tokenId}-isdemo`) === "true";
  let isvalid = getCookie(`${tokenId}-isvalid`) === "true";
  const [userGuideLinesDone, setUserGuiderLinesDone] = useState(getCookie(`${tokenId}-guideLinesDone`) ? getCookie(`${tokenId}-guideLinesDone`) === 'true' : false);
  const [QuestionNavOptions, setQuestionNavOptions] = useState([]);
  const [selectedSideNavOption, setSelectedSideNavOption] = useState();
  const [questionSelected, setQuestionSelected] = useState(1);
  const [selectedKey, setSelectedkey] = useState("1");
  const [marks, setMarks] = useState(null);
  const [clickedOnSubmit, setClickedOnSubmit] = useState(false)
  const [autoSubmit, setAutoSubmit] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  const admin_side_nav_options = ["Admin", "Users", "Questions", "User Performance", "Bulk Upload Users", "Bulk Upload Questions", "Edit Content and Guidelines", "Clear Quiz", "Logout"].map((icon, index) => ({
    key: String(index + 1),
    icon: React.createElement(items[index]),
    label: icon,
  }));

  

  const showDrawer = () => {
    setIsDrawerVisible(true);
  };

  const closeDrawer = () => {
    setIsDrawerVisible(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if(tokenId===null || tokenId===undefined){
      openNotification("Credentials Missing Please login again!", "top", "error")
      navigate("/")
    }
    // console.log("isvalid ",isvalid,isDemo)
    if (!isvalid && !isDemo) {
      openNotification("Credentials Missing Please login again!", "top", "error")
      navigate("/")
    }
  },[])

  useEffect(() => {
    if (isAdmin) {
      setSelectedSideNavOption("Admin");
    } else {
      if (getCookie(`${tokenId}-guideLinesDone`) !== 'true') {
        setSelectedSideNavOption("Content Guide Lines");
      } else {
        setSelectedSideNavOption("Quiz");
      }
    }
  }, [])


  useEffect(() => {
    // console.log("userGuideLinesDone = ", userGuideLinesDone, "questions count ", parseInt(getCookie('questionsLength')))
    if (userGuideLinesDone) {
      setSelectedSideNavOption("Quiz");
      handleUpdateQuestionsCount(parseInt(getCookie(`${tokenId}-questionsLength`)))
    }
  }, [userGuideLinesDone])

  useEffect(() => {
    if (selectedSideNavOption === "Logout") {
      handleLogout();
    }
  }, [selectedSideNavOption])

  const handleMenuClick = (key) => {
    setSelectedkey(key.key)
    setSelectedSideNavOption(admin_side_nav_options[parseInt(key.key) - 1].label);
    setIsDrawerVisible(false);
  }

  const handleLogout = () => {
    if (!isAdmin) {
      inVallidateUser();
    }
    clearCookies(tokenId);
    navigate('/')
    openNotification("Logout Successfully", "top", "success")
  }

  const handleUserguideLinesDone = (flag) => {
    setUserGuiderLinesDone(flag);
  }

  const handleUpdateQuestionsCount = (count) => {
    let tempList = [];
    for (let i = 0; i < count; i++) {
      tempList.push(i + 1);
    }

    const question_side_nav_options = tempList.map((icon, index) => ({
      key: String(index + 1),
      // icon: React.createElement(items[index]),
      label: icon,
    }));
    setQuestionNavOptions(question_side_nav_options);
  }

  const handleQuestionNoClick = (key) => {
    // console.log("Key from side bar ", key)
    setSelectedkey(key.key)
    setQuestionSelected(QuestionNavOptions[parseInt(key.key) - 1].label)
  }

  const handleprevNextActionInParent = (flag) => {
    if (flag === 'P') {
      setQuestionSelected(questionSelected - 1);
      setSelectedkey("" + (questionSelected - 1));
    } else {
      if (questionSelected + 1 <= QuestionNavOptions.length) {
        setQuestionSelected(questionSelected + 1);
        setSelectedkey("" + (questionSelected + 1));
      }
    }
  }

  const handleFinalOutPutFromQuizPage = (totalMarks) => {
    setMarks(totalMarks);
    setSelectedSideNavOption('Results')
  }

  const handleHomePage = () => {
    clearCookies(tokenId)
    navigate('/')
  }

  const handleQuestionChangeFromChild=(questionSelectedFromChild)=>{
    setSelectedkey(String(questionSelectedFromChild+1))
    setQuestionSelected(questionSelectedFromChild+1)
  }

  return (
    <div>
      {screenWidth > 1000 && selectedSideNavOption !== 'Content Guide Lines' && selectedSideNavOption !== 'Results' &&
        <Sider collapsible style={siderStyle} collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
          <div className="demo-logo-vertical" />
          <Menu theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
            selectedKeys={[selectedKey]}
            items={isAdmin ? admin_side_nav_options : QuestionNavOptions}
            onClick={isAdmin ? handleMenuClick : handleQuestionNoClick}
          />
        </Sider>
      }


      <div style={{ marginLeft: screenWidth <= 1000 ? "0" : selectedSideNavOption === 'Content Guide Lines' || selectedSideNavOption === 'Results' ? "0" : collapsed ? "2.5cm" : "5.8cm" }}>
        <Header style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap', // Allows items to wrap to the next line if needed
          margin: "0.5%",
          marginTop: "0.9%",
          borderRadius: "0.2cm",
          padding: "10px", // Adds spacing for better appearance on smaller screens
          paddingTop: "0"
        }}>
          <div style={{ display: "flex", alignItems: "center", flex: "1" }}>
            <h2 style={{ color: "white", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              <FontAwesomeIcon icon={faBrain} style={{ marginRight: "8px" }} />SpeedIQ
            </h2>
          </div>

          {!isAdmin && userGuideLinesDone && QuestionNavOptions?.length > 0 && screenWidth > 400 &&
            <div style={{ flex: "1", display: "flex", justifyContent: "center", marginLeft: "-70%" }}>
              <Timer
                totalMarks={marks}
                clickedOnSubmit={clickedOnSubmit}
                setAutoSubmit={(value) => setAutoSubmit(value)}
              />
            </div>
          }

          {isAdmin ?
            <Button
              icon={<MenuOutlined style={{ fontSize: "15px" }} />}
              onClick={showDrawer}
              type='primary'
              style={{ display: "flex" }}
            /> :
            isDemo ?
              <Button
                onClick={handleHomePage}
                type='primary'
                style={{ display: "flex" }}
              >
                Home
              </Button> :
              <Button
                onClick={handleLogout}
                type='primary'
                style={{ display: "flex" }}
              >
                Logout
              </Button>
          }

          <Drawer
            title="Menu"
            placement="right"
            onClose={closeDrawer}
            open={isDrawerVisible}
            style={{ padding: 0 }}
          >
            <Menu mode="vertical" theme='dark' onClick={handleMenuClick} items={admin_side_nav_options} />
          </Drawer>

        </Header>


        <Layout style={{ margin: "0.5%", marginTop: "0.8%", height: "83vh", borderRadius: "0.2cm", overflow: "scroll" }}>

          {!isAdmin && userGuideLinesDone && QuestionNavOptions?.length > 0 && screenWidth < 400 &&
            <div style={{ textAlign: "center", marginTop: "0.3cm" }}>
              <Timer
                totalMarks={marks}
                clickedOnSubmit={clickedOnSubmit}
                setAutoSubmit={(value) => setAutoSubmit(value)}
              />
            </div>
          }

          {(() => {
            switch (selectedSideNavOption) {
              case "Admin":
                return <AdminDetailsPage />
              case "Users":
                return <UsersList />;
              case "Questions":
                return <QuestionsList />;
              case "User Performance":
                return <UserPerformance />;
              case "Bulk Upload Questions":
                return <BulkUploadOfQuestions flag="questions" />
              case "Bulk Upload Users":
                return <BulkUploadOfQuestions flag="login" />
              case "Content Guide Lines":
                return <Content_guideLines screenWidth={screenWidth} timerDone={handleUserguideLinesDone} />
              case "Edit Content and Guidelines":
                return <Content_guideLines_Login_page selectedKey={selectedSideNavOption} />
              case "Clear Quiz":
                return <ClearQuiz />
              case "Quiz":
              case "Results":
                return <QuizPage
                  updateQuestionsCount={handleUpdateQuestionsCount}
                  selectedQuestion={questionSelected}
                  handleprevNextAction={handleprevNextActionInParent}
                  finalOutput={handleFinalOutPutFromQuizPage}
                  clickedOnSubmit={(value) => setClickedOnSubmit(value)}
                  autoSubmit={autoSubmit}
                  screenWidth={screenWidth}
                  questionSelectedFromChild={handleQuestionChangeFromChild}
                />
              default:
                return null;
            }
          })()}
        </Layout>
      </div>
    </div>
  );
};

export default App;
