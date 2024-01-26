import styled from "styled-components";
import Sidebar from "../components/Sidebar";
import React, { useState, useEffect } from "react";
import { ReactComponent as PlusBtn } from "../assets/PlusBtn.svg";
import { ReactComponent as ImageUploadIcon } from "../assets/ImageUpload.svg";
import { ReactComponent as CalendarIcon } from "../assets/Calendar.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from "react-time-picker";
import axios from "axios";
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

function MyPage() {
  const [isCreateVisible, setCreateVisible] = useState(false);
  const [newBoxName, setNewBoxName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [reservationStart, setReservationStart] = useState(new Date());
  const [reservationEnd, setReservationEnd] = useState(new Date());
  const [usageEnd, setUsageEnd] = useState(new Date());

  const handlePlusBtnClick = () => {
    setCreateVisible(true);
  };

  const handleInputChange = (event) => {
    setNewBoxName(event.target.value);
  };

  const handleCreateBox = () => {
    // TODO: 새로운 사물함 생성 로직 추가
    console.log("새로운 사물함 생성:", newBoxName);
    console.log("예약 시작 시각:", reservationStart);
    console.log("예약 종료 시각:", reservationEnd);
    console.log("사용 종료 시각:", usageEnd);
    setCreateVisible(false); // 입력이 완료되면 입력 창을 닫음
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  const [userId, setUserId] = useState("");
  const [majorDetail, setMajorDetail] = useState("");

  useEffect(() => {
    const storedUserObj = localStorage.getItem("userObj");

    if (storedUserObj) {
      const parsedUserObj = JSON.parse(storedUserObj);
      setUserId(parsedUserObj.userId);
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
            setMajorDetail(data.result.majorDetail);
            console.log(
              "UserName from Axios GET request:",
              data.result.majorDetail
            );
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

  const [availabilityOptions, setAvailabilityOptions] = useState({
    paidMember: false,
    unpaidMember: false,
    currentStudent: false,
    leaveOfAbsence: false,
    graduate: false,
  });

  const handleAvailabilityChange = (option) => {
    setAvailabilityOptions((prevOptions) => ({
      ...prevOptions,
      [option]: !prevOptions[option],
    }));
  };

  const [tableSize, setTableSize] = useState({ rows: 0, columns: 0 });

  // 각 셀의 숫자를 저장하는 상태
  const [tableData, setTableData] = useState(createEmptyTable(tableSize));

  // 빈 표를 생성하는 함수
  function createEmptyTable(size) {
    const { rows, columns } = size;
    const emptyTable = [];

    let counter = 1; // 셀의 값을 1부터 시작하기 위한 카운터 변수

    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < columns; j++) {
        row.push(counter);
        counter++;
      }
      emptyTable.push(row);
    }

    return emptyTable;
  }

  // 표의 크기를 변경할 때 호출되는 함수
  const handleTableSizeChange = (rows, columns) => {
    setTableSize({ rows, columns });
    setTableData(createEmptyTable({ rows, columns }));
  };

  // 표의 크기 입력을 받는 입력창
  // 표의 크기 입력을 받는 입력창
  const renderSizeInput = () => (
    <div>
      <input
        type="text"
        value={tableSize.rows}
        onChange={(e) =>
          handleTableSizeChange(Number(e.target.value), tableSize.columns)
        }
        style={{
          width: "54px",
          height: "74px",
          marginRight: "15px",
          marginTop: "50px",
          borderRadius: "16px",
          border: "2px solid transparent", // 초기에는 투명한(border가 없는) 상태로 설정
          textAlign: "center",
          transition: "border 0.3s ease", // transition 추가
        }}
        onMouseOver={(e) => {
          e.target.style.border = "2px solid var(--primary-400, #ED335D)"; // 호버 시 border 적용
        }}
        onMouseOut={(e) => {
          e.target.style.border = "2px solid transparent"; // 마우스 아웃 시 다시 투명한(border가 없는) 상태로 설정
        }}
      />
      X
      <input
        type="text"
        value={tableSize.columns}
        onChange={(e) =>
          handleTableSizeChange(tableSize.rows, Number(e.target.value))
        }
        style={{
          width: "54px",
          height: "74px",
          marginLeft: "15px",
          marginTop: "50px",
          borderRadius: "16px",
          border: "2px solid transparent", // 초기에는 투명한(border가 없는) 상태로 설정
          textAlign: "center",
          transition: "border 0.3s ease", // transition 추가
        }}
        onMouseOver={(e) => {
          e.target.style.border = "2px solid var(--primary-400, #ED335D)"; // 호버 시 border 적용
        }}
        onMouseOut={(e) => {
          e.target.style.border = "2px solid transparent"; // 마우스 아웃 시 다시 투명한(border가 없는) 상태로 설정
        }}
      />
    </div>
  );

  // 표를 렌더링하는 함수
  const renderTable = () => (
    <TableContainer>
      <Table>
        <tbody>
          {tableData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, columnIndex) => (
                <td key={columnIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );

  const [isResetModalVisible, setResetModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false); // 새로운 state 변수 추가
  const [isSaveModalVisible, setSaveModalVisible] = useState(false);

  const handleResetModalOpen = () => {
    setResetModalVisible(true);
  };

  const handleResetModalCancel = () => {
    setResetModalVisible(false);
  };

  const handleResetModalConfirm = () => {
    // TODO: 초기화 로직 추가
    console.log("사물함 초기화 확인");
    setResetModalVisible(false);
  };

  const handleDeleteBox = () => {
    // TODO: 사물함 삭제 로직 추가
    console.log("사물함 삭제 버튼 클릭");
    setDeleteModalVisible(true); // 삭제하기 버튼 클릭 시 모달 표시
  };

  const handleDeleteModalCancel = () => {
    setDeleteModalVisible(false);
  };

  const handleDeleteModalConfirm = () => {
    // TODO: 삭제 로직 추가
    console.log("사물함 삭제 확인");
    setDeleteModalVisible(false);
  };

  const handleSaveBox = () => {
    // TODO: 사물함 저장 로직 추가
    console.log("사물함 저장 버튼 클릭");
    setSaveModalVisible(true);
  };

  const handleSaveModalCancel = () => {
    setSaveModalVisible(false);
  };

  const handleSaveModalConfirm = () => {
    // TODO: 저장 확인 로직 추가
    console.log("사물함 저장 확인");
    setSaveModalVisible(false);
  };

  return (
    <MyPageStyled>
      <Sidebar />
      <ContentContainer>
        <PageText>사물함 관리</PageText>
        <DivStyled>
          {isCreateVisible ? (
            <CreateStyled>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "84vw",
                  marginTop: "40px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  {majorDetail} 사물함
                  <SmallPlusBtnStyled onClick={handleCreateBox} />
                </div>
                <ButtonContainer>
                  <ButtonStyled onClick={handleDeleteBox}>
                    삭제하기
                  </ButtonStyled>
                  <ButtonStyled onClick={handleResetModalOpen}>
                    초기화
                  </ButtonStyled>
                  <ButtonStyled onClick={handleSaveBox}>저장하기</ButtonStyled>

                  <ResetModal
                    visible={isResetModalVisible}
                    onCancel={handleResetModalCancel}
                    onConfirm={handleResetModalConfirm}
                  />
                  <DeleteModal
                    visible={isDeleteModalVisible}
                    onCancel={handleDeleteModalCancel}
                    onConfirm={handleDeleteModalConfirm}
                  />
                  <SaveModal
                    visible={isSaveModalVisible}
                    onCancel={handleSaveModalCancel}
                    onConfirm={handleSaveModalConfirm}
                  />
                </ButtonContainer>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  color: "var(--grayscale-300, #A3AED0)",
                  fontFamily: "Pretendard",
                  fontSize: "14px",
                  fontWeight: "500",
                  fontStyle: "normal",
                  lineHeight: "normal",
                  letterSpacing: "-0.28px",
                  width: "84vw",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <InputStyled
                    type="text"
                    placeholder="사물함 이름을 입력하세요"
                    value={newBoxName}
                    onChange={handleInputChange}
                  />
                  <div style={{ marginTop: "2px", marginBottom: "50px" }}>
                    사물함명을 클릭해 이름을 바꿀 수 있어요. 사물함의 위치, 사용
                    가능 학년 등 사물함의 이름을 설정해주세요.
                  </div>
                </div>
                <ImageUploadContainer>
                  <label htmlFor="imageUpload">
                    <ImageUploadIconStyled /> 사물함 위치 이미지 업로드
                  </label>
                  <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </ImageUploadContainer>
              </div>
              <DateAndTimeContainer>
                <DateAndTimePickerContainer>
                  <label>예약 시작 시각</label>
                  <DateTimePicker
                    selected={reservationStart}
                    onChange={(date) => setReservationStart(date)}
                    showTimeSelect
                    dateFormat="yyyy-MM-dd HH:mm"
                  />
                </DateAndTimePickerContainer>

                <DateAndTimePickerContainer>
                  <label>예약 종료 시각</label>
                  <DateTimePicker
                    selected={reservationEnd}
                    onChange={(date) => setReservationEnd(date)}
                    showTimeSelect
                    dateFormat="yyyy-MM-dd HH:mm"
                  />
                </DateAndTimePickerContainer>

                <DateAndTimePickerContainer>
                  <label>사용 종료 시각</label>
                  <DateTimePicker
                    selected={usageEnd}
                    onChange={(date) => setUsageEnd(date)}
                    showTimeSelect
                    dateFormat="yyyy-MM-dd HH:mm"
                  />
                </DateAndTimePickerContainer>
                <DateAndTimePickerContainer>
                  <label>사물함 예약 가능 여부</label>
                  <AvailabilityOptionsContainer>
                    <AvailabilityOptionCheckbox
                      type="checkbox"
                      id="paidMember"
                      checked={availabilityOptions.paidMember}
                      onChange={() => handleAvailabilityChange("paidMember")}
                    />
                    <label htmlFor="paidMember">학생회비 납부자</label>

                    <AvailabilityOptionCheckbox
                      type="checkbox"
                      id="unpaidMember"
                      checked={availabilityOptions.unpaidMember}
                      onChange={() => handleAvailabilityChange("unpaidMember")}
                    />
                    <label htmlFor="unpaidMember">학생회비 미납부자</label>

                    <AvailabilityOptionCheckbox
                      type="checkbox"
                      id="currentStudent"
                      checked={availabilityOptions.currentStudent}
                      onChange={() =>
                        handleAvailabilityChange("currentStudent")
                      }
                    />
                    <label htmlFor="currentStudent">재학생</label>

                    <AvailabilityOptionCheckbox
                      type="checkbox"
                      id="leaveOfAbsence"
                      checked={availabilityOptions.leaveOfAbsence}
                      onChange={() =>
                        handleAvailabilityChange("leaveOfAbsence")
                      }
                    />
                    <label htmlFor="leaveOfAbsence">휴학생</label>

                    <AvailabilityOptionCheckbox
                      type="checkbox"
                      id="graduate"
                      checked={availabilityOptions.graduate}
                      onChange={() => handleAvailabilityChange("graduate")}
                    />
                    <label htmlFor="graduate">졸업생</label>
                  </AvailabilityOptionsContainer>
                </DateAndTimePickerContainer>
              </DateAndTimeContainer>
              {renderSizeInput()}
              {renderTable()}
            </CreateStyled>
          ) : (
            <>
              <PlusBtnStyled onClick={handlePlusBtnClick} />
              첫번째 사물함을 만들어주세요!
            </>
          )}
        </DivStyled>
      </ContentContainer>
    </MyPageStyled>
  );
}
const DeleteModal = ({ visible, onCancel, onConfirm }) => {
  return (
    visible && (
      <ModalContainer>
        <ModalContent>
          <div style={{ marginTop: "10%" }}>사물함을 삭제하시겠어요?</div>
          <p>해당 사물함은 복구할 수 없습니다.</p>
          <ModalButtons>
            <CancelButton onClick={onCancel}>취소</CancelButton>
            <ConfirmButton onClick={onConfirm}>삭제</ConfirmButton>
          </ModalButtons>
        </ModalContent>
      </ModalContainer>
    )
  );
};

const ResetModal = ({ visible, onCancel, onConfirm }) => {
  return (
    visible && (
      <ModalContainer>
        <ModalContent>
          <div style={{ marginTop: "10%" }}>
            사물함 정보를 초기화 하시겠어요?
          </div>
          <p>해당 사물함의 등록된 정보가 모두 초기화됩니다.</p>
          <ModalButtons>
            <CancelButton onClick={onCancel}>취소</CancelButton>
            <ConfirmButton onClick={onConfirm}>초기화</ConfirmButton>
          </ModalButtons>
        </ModalContent>
      </ModalContainer>
    )
  );
};
const SaveModal = ({ visible, onCancel, onConfirm }) => {
  return (
    visible && (
      <ModalContainer>
        <ModalContent>
          <div style={{ marginTop: "10%" }}>사물함 정보를 저장하시겠어요?</div>
          <p>변경된 정보가 적용됩니다.</p>
          <ModalButtons>
            <CancelButton onClick={onCancel}>취소</CancelButton>
            <ConfirmButton onClick={onConfirm}>저장</ConfirmButton>
          </ModalButtons>
        </ModalContent>
      </ModalContainer>
    )
  );
};
export default MyPage;

const MyPageStyled = styled.div`
  background: var(--background, #f4f7fe);
  display: flex;
  width: 116vw;
`;

const ContentContainer = styled.div`
  padding-right: 2.5rem;
  display: flex;
  flex-direction: column;
  background: var(--background, #f4f7fe);
  overflow: hidden;
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
  @font-face {
    font-family: "Pretendard-Regular";
    src: url("https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff")
      format("woff");
    font-weight: 400;
    font-style: normal;
  }
  width: 90vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-left: 3%;
  background: var(--white, #fff);
  border-radius: 20px;
  color: var(--grayscale-600, #2b3674);
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: -0.48px;
  overflow-x: auto; /* DivStyled의 내용이 넘칠 때 가로 스크롤 추가 */
`;

const CreateStyled = styled.div`
  color: var(--grayscale-600, #2b3674);
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: -0.48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const PlusBtnStyled = styled(PlusBtn)`
  margin-bottom: 30px;
  cursor: pointer;
`;

const SmallPlusBtnStyled = styled(PlusBtn)`
  cursor: pointer;
  width: 24px;
  height: 24px;
  margin-left: 15px;
`;

const InputStyled = styled.input`
  width: 383px;
  height: 74px;
  flex-shrink: 0;
  border-radius: 16px;
  background: var(--white, #fff);
  margin-top: 30px;
  transition: background 0.3s ease, border 0.3s ease;
  color: var(--grayscale-600, #2b3674);
  font-family: "DM Sans";
  font-size: 30px;
  font-style: normal;
  font-weight: 700;
  line-height: 42px;
  letter-spacing: -0.68px;
  margin-bottom: 5px;

  &:hover {
    background: var(--background, #f4f7fe);
  }

  &:focus {
    border: 2px solid var(--primary-400, #ed335d);
    background: var(--white, #fff);
    outline: none;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const ButtonStyled = styled.button`
  cursor: pointer;
  padding: 10px 20px;
  background: var(--white, #fff);
  color: var(--grayscale-200, #c9d2eb);
  border: none;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 600;

  &:hover {
    background: var(--primary-50, #fde6eb);
    color: var(--primary-500, #e80035);
  }
`;

const ImageUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  label {
    cursor: pointer;
    background-color: #ffffff;
    color: var(--grayscale-600, #2b3674);
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 10px;
  }

  input {
    display: none;
  }
`;

const ImageUploadIconStyled = styled(ImageUploadIcon)`
  margin-right: 5px;
`;

const DateAndTimeContainer = styled.div`
  display: flex;
  gap: 30px;
`;

const DateAndTimePickerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative; // 상대적 위치 지정
  z-index: 100; // 모달보다 위에 표시되도록 설정
  label {
    margin-bottom: 10px;
    color: var(--grayscale-600, #2b3674);
    font-family: Pretendard;
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }
`;

const DateTimePicker = styled(DatePicker)`
  width: 200px;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid var(--grayscale-50, #e0e5f2);
  color: var(--grayscale-600, #2b3674);
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.28px;
`;

const AvailabilityOptionsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-top: 10px;

  label {
    margin-right: 10px;
    color: var(--grayscale-600, #2b3674);
    font-family: Pretendard;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    letter-spacing: -0.28px;
  }
`;

const AvailabilityOptionCheckbox = styled.input`
  margin-right: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 5px;
  accent-color: #ed335d;
`;
const TableContainer = styled.div`
  margin-top: 50px;
  overflow: auto;
`;

const Table = styled.table`
  border-collapse: separate;
  border-spacing: 5px;

  td {
    width: 80px;
    height: 80px;
    padding: 29px 35px;
    gap: 18px;
    flex-shrink: 0;
    border-radius: 12px;
    background: var(--background, #f4f7fe);
    color: var(--grayscale-300, #a3aed0);
    text-align: center;
    font-family: Pretendard;
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  z-index: 1000; // 모달이 다른 요소 위에 나타나도록 설정
`;

const ModalContent = styled.div`
  padding: 20px;
  text-align: center;
  width: 520px;
  height: 264px;
  flex-shrink: 0;
  border-radius: 40px;
  background: #fff;
  z-index: 1001; // 모달 내용도 모달보다 위에 나타나도록 설정

  p {
    color: var(--grayscale-300, #a3aed0);
    text-align: center;
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    letter-spacing: -0.32px;
  }
`;

const ModalButtons = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 5%;
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
  color: var(--grayscale-600, #2b3674);
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
