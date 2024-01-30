import React, { useEffect, useState } from "react";
import {
  faUser,
  faClock,
  faListCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

function Main() {
  const [startTime, setStartTime] = useState("로딩 중...");
  const [endTime, setEndTime] = useState("로딩 중...");
  const [lockers, setLockers] = useState([]);

  useEffect(() => {
    getLiveTime();
    getNextReservationTime();
    initializeLockers();
    checkAuthorizationAndShowTimeSettingIcon();
  }, []);

  const getLiveTime = () => {
    // AJAX 요청 대신에 현재 시간을 설정
    // 이 부분을 실제로 구현해야 합니다.
    const currentDate = new Date();
    printClock(currentDate);
  };

  const printClock = (currentDate) => {
    // 시계를 업데이트
    // 이 부분을 나중에 업데이트해야 합니다.
  };

  const getNextReservationTime = () => {
    // AJAX 요청을 통해 다음 예약 시간을 가져옴
    // 이 부분을 나중에 업데이트해야 합니다.
  };

  const initializeLockers = () => {
    // AJAX 요청을 통해 사물함 초기화
    // 이 부분을 나중에 업데이트해야 합니다.
  };

  const checkAuthorizationAndShowTimeSettingIcon = () => {
    // 사용자 권한 확인 및 시간 설정 아이콘 표시
    // 이 부분을 나중에 업데이트해야 합니다.
  };

  const cellClick = (cell) => {
    // 셀 클릭 이벤트 핸들러
    // 이 부분을 나중에 업데이트해야 합니다.
  };

  return (
    <div>
      <div style={{ fontSize: "30px", margin: "2%" }}>
        <a id="userIconLink" href="/mypage" style={{ marginRight: "1%" }}>
          <FontAwesomeIcon icon={faUser} />
        </a>
        <a id="timeSettingLink" href="/setting" style={{ marginRight: "1%" }}>
          <FontAwesomeIcon icon={faClock} />
        </a>
        <a id="modifiiedUser" href="/user">
          <FontAwesomeIcon icon={faListCheck} />
        </a>
      </div>
      <div>
        <h1 align="center" id="indextitle">
          지능기전공학과 사물함 예약
        </h1>
      </div>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h2 id="startTime">예약시작시간: {startTime}</h2>
        <h2 id="endTime">예약마감시간: {endTime}</h2>
      </div>
      <table style={{ width: "100%" }}>
        <tbody>
          {/* 사물함 테이블 생성 */}
          {Array.from({ length: 6 }, (_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: 25 }, (_, colIndex) => {
                const cellNum = colIndex * 6 + rowIndex + 1;
                const cellText = `사물함 ${cellNum}`;
                return (
                  <td
                    key={cellNum}
                    id={cellNum.toString()}
                    onClick={() => cellClick(cellNum)}
                    style={{
                      width: "4%", // 셀 크기 조절
                      textAlign: "center",
                      border: "1px solid black",
                      transition: "background-color 0.3s",
                      cursor: "pointer",
                      height: "70px",
                      backgroundColor: "white",
                    }}
                  >
                    {cellText}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Main;
