import styled from "styled-components";
import Sidebar from "../components/Sidebar";
import InfoImg from "../assets/MyInfo.png";
import React, { useState, useEffect } from "react";
import axios from "axios";
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

function MyPage() {
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [majorDetail, setMajorDetail] = useState("");
  const [studentNum, setStudentNum] = useState("");
  const [reservedLockerName, setReservedLockerName] = useState("");
  const [reservedLockerNum, setReservedLockerNum] = useState("");
  const [time, setTime] = useState("");
  const [userTier, setUserTier] = useState("");
  const [role, setRole] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accountNum, setAccountNum] = useState("");
  const [bank, setBank] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [majorId, setMajorId] = useState("");

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const storedUserObj = localStorage.getItem("userObj");
    if (storedUserObj) {
      const parsedUserObj = JSON.parse(storedUserObj);
      setUserId(parsedUserObj.userId);
      setRole(parsedUserObj.role);
      setMajorId(parsedUserObj.majorId);
      axios
        .get(`api/v2/users/${parsedUserObj.userId}`, {
          headers: {
            accessToken: parsedUserObj.accessToken,
          },
        })
        .then((response) => {
          console.log("Axios response:", response);
          const data = response.data;
          if (data.result.userName) {
            setUserName(data.result.userName);
            setMajorDetail(data.result.majorDetail);
            setStudentNum(data.result.studentNum);
            localStorage.setItem("major", data.result.majorDetail);
            setReservedLockerName(data.result.reservedLockerName);
            setReservedLockerNum(data.result.reservedLockerDetailNum);
            setTime(data.time);
            setUserTier(data.result.userTier);
            console.log(role);
            console.log("UserName from Axios GET request:");
          } else {
            console.error(
              "Invalid data structure in Axios GET response:",
              data
            );
          }
        })
        .catch((error) => {
          console.error("Error during Axios GET request:", error);
        });
    }
  }, []);

  useEffect(() => {
    const storedUserObj = localStorage.getItem("userObj");
    if (storedUserObj) {
      const parsedUserObj = JSON.parse(storedUserObj);
      setMajorId(parsedUserObj.majorId);
      console.log(parsedUserObj.majorId);
      axios
        .get(`/api/v2/majors/${parsedUserObj.majorId}/accounts`, {
          headers: {
            accessToken: parsedUserObj.accessToken,
          },
        })
        .then((response) => {
          console.log(response);
          console.log("Axios response:", response);
          const data = response.data;
          if (data.result.accountNum) {
            setAccountNum(data.result.accountNum);
            setBank(data.result.bank);
            setOwnerName(data.result.ownerName);
            console.log("UserName from Axios GET request:");
          } else {
            console.error(
              "Invalid data structure in Axios GET response:",
              data
            );
          }
        })
        .catch((error) => {
          console.error("Error during Axios GET request:", error);
        });
    }
  }, []);

  const handlePostRequest = () => {
    const postURL = `api/v2/users/${userId}/membership`;
    axios
      .post(postURL, {
        headers: {
          accessToken: JSON.parse(localStorage.getItem("userObj")).accessToken,
        },
      })
      .then((res) => {
        console.log("POST 요청 성공:", res);
      })
      .catch((err) => {
        console.error("POST 요청 실패:", err);
      });
  };

  return (
    <MyPageStyled>
      <Sidebar role={role} />
      <ContentContainer>
        <PageText>마이페이지</PageText>
        <DivStyled>
          <InfoBox>
            <InfoText>
              내 정보
              <div
                style={{
                  marginTop: "5px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <InfoImage src={InfoImg} alt="내 정보 이미지" />
                <div style={{ width: "60%" }}>
                  <Info>
                    이름
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "left",
                        width: "155px",
                      }}
                    >
                      <h2>{userName}</h2>
                    </div>
                  </Info>
                  <Info>
                    학과
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "left",
                        width: "155px",
                      }}
                    >
                      <h2>{majorDetail}</h2>
                    </div>
                  </Info>
                  <Info>
                    학번
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "left",
                        width: "155px",
                      }}
                    >
                      <h2>{studentNum}</h2>
                    </div>
                  </Info>
                  <Info>
                    학생회비
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "left",
                        width: "155px",
                      }}
                    >
                      <h2 style={{ color: "var(--primary-300, #F16686)" }}>
                        {userTier === "NON_MEMBER"
                          ? "미납"
                          : userTier === "MEMBER"
                          ? "납부"
                          : userTier === "APPLICANT"
                          ? "납부신청 승인대기중"
                          : ""}
                      </h2>
                    </div>
                  </Info>
                </div>
              </div>
            </InfoText>
          </InfoBox>
          <InfoBox>
            <InfoText>
              사물함 정보
              {reservedLockerNum !== null && reservedLockerName !== null ? (
                <div
                  style={{
                    marginTop: "35px",
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "column",
                  }}
                >
                  <Info>
                    위치
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "left",
                        width: "295px",
                      }}
                    >
                      <h2>{reservedLockerName}</h2>
                    </div>
                  </Info>
                  <Info>
                    번호
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "left",
                        width: "295px",
                      }}
                    >
                      <h2>{reservedLockerNum}</h2>
                    </div>
                  </Info>
                  <Info>
                    사용기간
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "left",
                        width: "295px",
                      }}
                    >
                      <h2>{time}</h2>
                    </div>
                  </Info>
                </div>
              ) : (
                <div
                  style={{
                    marginTop: "35px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <h2
                    style={{
                      color: "var(--grayscale-300, #A3AED0)",
                      fontFamily: "Pretendard",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: "700",
                      lineHeight: "normal",
                    }}
                  >
                    예약된 사물함 정보가 없습니다.
                  </h2>
                </div>
              )}
            </InfoText>
          </InfoBox>
        </DivStyled>
        <DivStyled>
          <InfoBoxWithButton>
            <InfoText>학생회비 납부</InfoText>
            {bank && accountNum && ownerName && (
              <InfoButton
                userTier={userTier}
                disabled={userTier === "MEMBER" || userTier === "APPLICANT"}
                onClick={() => {
                  openModal();

                  // 기존 GET 요청
                  const getURL = `api/v2/users/${userId}/membership`;
                  axios
                    .get(getURL, {
                      headers: {
                        accessToken: JSON.parse(localStorage.getItem("userObj"))
                          .accessToken,
                      },
                    })
                    .then((res) => {
                      console.log("GET 요청 성공:", res);
                      // GET 요청이 성공했을 때 추가적인 로직을 이곳에 추가
                    })
                    .catch((err) => {
                      console.error("GET 요청 실패:", err);
                    });

                  // 새로운 POST 요청
                }}
              >
                {userTier === "NON_MEMBER"
                  ? "납부 확인 요청"
                  : userTier === "MEMBER"
                  ? "납부 완료"
                  : userTier === "APPLICANT"
                  ? "납부 확인중"
                  : ""}
              </InfoButton>
            )}
            {bank && accountNum && ownerName ? (
              <div style={{ marginBottom: "20%", marginLeft: "8%" }}>
                <h1>
                  {bank} {accountNum} ({ownerName})
                </h1>
                <p style={{ marginBottom: "70px" }}>
                  학생회비를 납부하셨다면 ‘납부 확인 요청'을 눌러주세요. 요청
                  건에 대하여 확인 후 승인됩니다.
                </p>
              </div>
            ) : (
              <div style={{ marginBottom: "30%", marginLeft: "8%" }}>
                <p
                  style={{
                    color: "var(--grayscale-300, #A3AED0)",
                    fontFamily: "Pretendard",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: "700",
                    lineHeight: "normal",
                  }}
                >
                  등록된 학생회 계좌가 없습니다. 학생회에 문의해주세요.
                </p>
              </div>
            )}
          </InfoBoxWithButton>
          <InfoBox
            style={{ background: "var(--background, #f4f7fe)" }}
          ></InfoBox>
        </DivStyled>
      </ContentContainer>
      {isModalOpen && (
        <ModalOverlay>
          <ModalContainer>
            <ModalContent>
              <h2>학생회비 납부를 완료하셨나요?</h2>
              학생회에 학생회비 납부 확인 요청 알림을 보낼게요.
              <ButtonContainer>
                <CancelButton onClick={closeModal}>취소</CancelButton>
                <ConfirmButton onClick={handlePostRequest()}>
                  납부했어요
                </ConfirmButton>
              </ButtonContainer>
            </ModalContent>
          </ModalContainer>
        </ModalOverlay>
      )}
    </MyPageStyled>
  );
}

export default MyPage;

const MyPageStyled = styled.div`
  background: var(--background, #f4f7fe);
  display: flex;
  width: 100%;
`;

const ContentContainer = styled.div`
  padding-right: 2.5rem;
  display: flex;
  flex-direction: column;
  background: var(--background, #f4f7fe);
`;

const PageText = styled.div`
  @font-face {
    font-family: "Pretendard-Regular";
    src: url("https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff")
      format("woff");
    font-weight: 400;
    font-style: normal;
  }
  color: var(--grayscale-600, #2b3674);
  font-family: Pretendard-Regular;
  font-size: 34px;
  font-style: normal;
  font-weight: 700;
  line-height: 42px;
  letter-spacing: -0.68px;
  padding: 40px;
  height: 130px;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const DivStyled = styled.div`
  height: 35vh;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5%;
  margin-left: 15%;
  margin-bottom: 7%;
`;

const InfoBox = styled.div`
  width: 480px;
  height: 280px;
  flex-shrink: 0;
  border-radius: 20px;
  background: var(--white, #fff);
  margin-top: 2%;
`;

const InfoText = styled.div`
  color: var(--primary-400, #ed335d);
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: -0.48px;
  padding: 40px;
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  color: var(--grayscale-400, #7883a6);
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: -0.32px;
  justify-content: space-between;

  h2 {
    color: var(--grayscale-600, #2b3674);
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    letter-spacing: -0.32px;
    margin-top: 7px;
  }
`;

const InfoImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 2px solid var(--primary-200, #f699ae);
  background: var(--primary-50, #fde6eb);
  mix-blend-mode: multiply;
  margin-top: 18px;
`;

const InfoBoxWithButton = styled(InfoBox)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  h1 {
    color: var(--grayscale-600, #2b3674);
    font-family: Pretendard;
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }
  p {
    color: var(--grayscale-300, #a3aed0);
    font-family: Pretendard;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px; /* 142.857% */
    letter-spacing: -0.28px;
  }
`;

const InfoButton = styled.button`
  padding: 10px;
  height: 60px;
  width: 169px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  border: none;
  background: ${(props) =>
    props.userTier === "MEMBER" || props.userTier === "APPLICANT"
      ? "var(--background, #F4F7FE)"
      : "var(--primary-50, #FDE6EB)"};
  color: ${(props) =>
    props.userTier === "MEMBER" || props.userTier === "APPLICANT"
      ? "var(--grayscale-300, #A3AED0)"
      : "var(--primary-500, #E80035)"};
  font-family: "Pretendard";
  font-weight: 700;
  cursor: ${(props) =>
    props.userTier === "MEMBER" || props.userTier === "APPLICANT"
      ? "not-allowed"
      : "pointer"};
  position: absolute;
  top: 10%;
  right: 10%;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

InfoButton.displayName = "InfoButton";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  padding: 20px;
  width: 520px;
  height: 264px;
  flex-shrink: 0;
  border-radius: 40px;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--grayscale-300, #a3aed0);
  text-align: center;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: -0.32px;
`;

const ModalContent = styled.div`
  text-align: center;
  h2 {
    color: var(--grayscale-600, #2b3674);
    text-align: center;
    font-family: Pretendard;
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    letter-spacing: -0.48px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  gap: 30px;
`;

const CancelButton = styled.button`
  display: flex;
  width: 190px;
  height: 60px;
  padding: 10px 8px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  border-radius: 20px;
  background: var(--background, #f4f7fe);
  border: none;
  color: var(--grayscale-500, #596686);
  text-align: center;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: -0.32px;
`;

const ConfirmButton = styled.button`
  display: flex;
  width: 190px;
  height: 60px;
  padding: 10px 8px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  border-radius: 20px;
  background: var(--primary-400, #ed335d);
  border: none;
  color: #fff;
  text-align: center;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: -0.32px;
`;
