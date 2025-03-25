import {
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined,
  ShopOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { faBrain } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Layout, Menu, message, theme } from 'antd';
import React, { useEffect, useState } from 'react';
import QuestionsList from '../AdminPanel/QuestionsList';
import UsersList from '../AdminPanel/UsersList';
import UserPerformance from '../AdminPanel/UserPerformance';
import BulkUploadOfQuestions from '../AdminPanel/BulkUploadQuestions';
import { clearCookies, getCookie, setCookie } from '../Cookies/GetCookies';
import enums from '../API/ApiList';
import { putApi, inVallidateUser } from '../API/AllRequestTypeAPIsLogic';
import { now } from '../DateTime';
import Content_guideLines from '../UserPanel/Content_guideLines';
import QuizPage from '../UserPanel/QuizPage';
import AdminDetailsPage from '../AdminPanel/AdminList';
import ClearQuiz from '../ClearQuiz/ClearQuiz'


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
  TeamOutlined,
  ShopOutlined,
]
// .map((icon, index) => ({
//   key: String(index + 1),
//   icon: React.createElement(icon),
//   label: `nav ${index + 1}`,
// }));

const admin_side_nav_options = ["Admin", "Users", "Questions", "User Performance", "Bulk Upload Users", "Bulk Upload Questions","Clear Quiz"].map((icon, index) => ({
  key: String(index + 1),
  icon: React.createElement(items[index]),
  label: icon,
}));


const Timer = (props) => {
  let time = getCookie('timeLeft')
  const [timeLeft, setTimeLeft] = useState(time ? parseInt(time) : (30 * 60));
  const { setAutoSubmit } = props;

  useEffect(() => {

    if (!getCookie('startTime')) {
      setCookie("startTime", new Date())
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
          setCookie("timeLeft", updatedTime)
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
      {props.totalMarks === null ? `Time Left: ${formatTime(timeLeft)}` : `Total Marks : ${props.totalMarks}`}
    </div>
  )
}


const App = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const isAdmin = getCookie('isadmin') === "true";
  const isDemo = getCookie('isdemo') === "true";
  const isvalid = getCookie('isvalid') === "true";
  const [userGuideLinesDone, setUserGuiderLinesDone] = useState(getCookie('guideLinesDone') ? getCookie('guideLinesDone') === 'true' : false);
  const [QuestionNavOptions, setQuestionNavOptions] = useState([]);
  const [selectedSideNavOption, setSelectedSideNavOption] = useState();
  const [questionSelected, setQuestionSelected] = useState(1);
  const [selectedKey, setSelectedkey] = useState("1");
  const [marks, setMarks] = useState(null);
  const [clickedOnSubmit, setClickedOnSubmit] = useState(false)
  const [autoSubmit, setAutoSubmit] = useState(false);


  useEffect(() => {
    if (!isvalid && !isDemo) {
      message.error("Please login!");
      navigate("/")
    }
  })


  // console.log("isAdmin = ", isAdmin)

  useEffect(() => {
    if (isAdmin) {
      setSelectedSideNavOption("Admin");
    } else {
      if (getCookie('guideLinesDone') !== 'true') {
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
      handleUpdateQuestionsCount(parseInt(getCookie('questionsLength')))
    }
  }, [userGuideLinesDone])

  const handleMenuClick = (key) => {
    setSelectedkey(key.key)
    setSelectedSideNavOption(admin_side_nav_options[parseInt(key.key) - 1].label);
  }

  // console.log("key value ", selectedSideNavOption)

  const handleLogout = () => {
    if (!isAdmin) {
      inVallidateUser();
    } 
    clearCookies();
    navigate('/')
    message.success("Logout Successfully")
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
    clearCookies()
    navigate('/')
  }

  return (
    <div>
      {selectedSideNavOption !== 'Content Guide Lines' && selectedSideNavOption !== 'Results' &&
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


      <div style={{ marginLeft: selectedSideNavOption === 'Content Guide Lines' || selectedSideNavOption === 'Results' ? "0" : collapsed ? "7.5%" : "16%" }}>
        <Header style={{ display: 'flex', alignItems: 'center', margin: "0.5%", marginTop: "0.9%", borderRadius: "0.2cm" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="demo-logo" />
            <h2 style={{ color: "white", margin: 0 }}>
              <FontAwesomeIcon icon={faBrain} style={{ marginRight: "8px" }} />
              SpeedIQ
            </h2>
          </div>

          {!isAdmin && userGuideLinesDone &&
            <div style={{ marginLeft: "30%" }}>
              <Timer totalMarks={marks} clickedOnSubmit={clickedOnSubmit} setAutoSubmit={(value) => setAutoSubmit(value)} />
            </div>
          }

          {!isDemo ?
            <Button type="primary" onClick={handleLogout} style={{ marginLeft: isAdmin || !userGuideLinesDone ? "80%" : "35%" }}>
              Logout
            </Button>
            :
            <Button type="primary" onClick={handleHomePage} style={{ marginLeft: isAdmin || !userGuideLinesDone ? "80%" : "35%" }}>
              Home
            </Button>

          }
          {/* <div className="demo-logo" />
          <h2 style={{ color: "white" }}><FontAwesomeIcon icon={faBrain} style={{ color: "white" }} />SpeedIQ</h2>
          <Menu
            theme="dark"
            mode="horizontal"
            // defaultSelectedKeys={['1']}
            // items={[<Timer/>]}
            style={{ flex: "1", marginLeft: "60%" }}
          />
          <Timer/>
          <Button type='primary' onClick={handleLogout}>Logout</Button> */}
        </Header>

        <Layout style={{ margin: "0.5%", marginTop: "0.8%", height: "83vh", borderRadius: "0.2cm", overflow: "scroll" }}>
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
                return <Content_guideLines timerDone={handleUserguideLinesDone} />
              case "Clear Quiz":
                return <ClearQuiz/>
              case "Quiz":
              case "Results":
                return <QuizPage
                  updateQuestionsCount={handleUpdateQuestionsCount}
                  selectedQuestion={questionSelected}
                  handleprevNextAction={handleprevNextActionInParent}
                  finalOutput={handleFinalOutPutFromQuizPage}
                  clickedOnSubmit={(value) => setClickedOnSubmit(value)}
                  autoSubmit={autoSubmit}
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
