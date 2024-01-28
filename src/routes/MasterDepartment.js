import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import SiderBar from "../components/Sidebar";

function Master() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // 뒤로가기
  };

  return (
    <MasterStyled>
      <TextStyled>
        <h1>추후 업데이트 예정입니다.</h1>
        <BackButton onClick={handleGoBack}>뒤로가기</BackButton>
      </TextStyled>
    </MasterStyled>
  );
}

export default Master;

const MasterStyled = styled.div`
  width: 100vw;
  height: 100vh;
  background: var(--background, #f4f7fe);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const TextStyled = styled.div`
  h1 {
    color: var(--grayscale-600, #2b3674);
    text-align: center;
    font-family: Pretendard;
    font-size: 54px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    letter-spacing: -0.48px;
  }
`;

const BackButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background: var(--primary-400, #ed335d);
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;
