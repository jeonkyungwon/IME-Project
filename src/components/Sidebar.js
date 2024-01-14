import React from "react";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import { ReactComponent as SejongBucket } from "../assets/SejongBucket.svg";
import { ReactComponent as MyPage } from "../assets/MyHome.svg";
import { ReactComponent as Reserve } from "../assets/BucketReserve.svg";
import { ReactComponent as FeedBack } from "../assets/FeedBack.svg";
import { ReactComponent as Logout } from "../assets/Logout.svg";
import { ReactComponent as Admin } from "../assets/Admin.svg";

const getColorForSection = (sectionPath, currentPath) => {
  return currentPath.includes(sectionPath)
    ? "var(--primary-500, #E80035)"
    : "var(--grayscale-400, #7883a6)";
};

const SiderBar = () => {
  const { pathname } = useLocation();

  const onClickLentMyHomeBtn = () => {
    window.location.href = "/mypage";
  };

  const onClickReserveBtn = () => {
    window.location.href = "/reserve";
  };

  const onClickFeedBtn = () => {
    window.location.href = "/feedback";
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const onClickAdminBtn = () => {
    window.location.href = "/admin";
  };

  const onClickStudentManagement = () => {
    window.location.href = "/admin/studentManagement";
  };

  const onClickLockerManagement = () => {
    window.location.href = "/admin/lockerManagement";
  };

  const onClickDepartmentManagement = () => {
    window.location.href = "/admin/departmentManagement";
  };

  const onClickMaster = () => {
    window.location.href = "/master";
  };

  return (
    <SiderBarStyled>
      <LinkStyled to="/mypage">
        <TitleStyled>
          <TitleSVG>
            <SejongBucket />
          </TitleSVG>
        </TitleStyled>
      </LinkStyled>
      <SectionWrap>
        <SectionStyled
          active={pathname.includes("/mypage")}
          onClick={onClickLentMyHomeBtn}
          style={{
            color: getColorForSection("/mypage", pathname),
          }}
        >
          <div>
            <MyPage />
          </div>
          마이페이지
        </SectionStyled>

        <SectionStyled
          active={pathname.includes("/reserve")}
          onClick={onClickReserveBtn}
          style={{
            color: getColorForSection("/reserve", pathname),
          }}
        >
          <div>
            <Reserve />
          </div>
          사물함 예약
        </SectionStyled>

        <SectionStyled
          onClick={onClickFeedBtn}
          style={{ color: "var(--grayscale-400, #7883A6)" }}
        >
          <div>
            <FeedBack />
          </div>
          피드백 보내기
        </SectionStyled>

        <SectionStyled
          onClick={handleLogout}
          style={{ color: "var(--grayscale-400, #7883A6)" }}
        >
          <div>
            <Logout />
          </div>
          로그아웃
        </SectionStyled>

        <SectionStyled
          active={pathname.includes("/admin")}
          onClick={onClickStudentManagement}
          style={{
            color: getColorForSection("/admin", pathname),
            marginBottom: "1%",
          }}
        >
          <div>
            <Admin />
          </div>
          어드민
        </SectionStyled>

        {pathname.includes("/admin") && (
          <>
            <SectionStyled
              onClick={onClickStudentManagement}
              style={{
                color: getColorForSection("/admin", pathname),
                marginLeft: "48%",
                marginBottom: "1%",
                marginTop: "1%",
              }}
            >
              학생관리
            </SectionStyled>
            <SectionStyled
              onClick={onClickLockerManagement}
              style={{
                color: getColorForSection("/locker-management", pathname),
                marginLeft: "48%",
                marginBottom: "1%",
              }}
            >
              사물함 관리
            </SectionStyled>
            <SectionStyled
              onClick={onClickDepartmentManagement}
              style={{
                color: getColorForSection(
                  "/admin/department-management",
                  pathname
                ),
                marginLeft: "48%",
                marginBottom: "1%",
              }}
            >
              학과 관리
            </SectionStyled>
          </>
        )}
        <SectionStyled
          active={pathname.includes("/master")}
          onClick={onClickMaster}
          style={{
            color: getColorForSection("/master", pathname),
            marginTop: "5%",
          }}
        >
          <div>
            <Admin />
          </div>
          마스터
        </SectionStyled>
      </SectionWrap>
    </SiderBarStyled>
  );
};

const SiderBarStyled = styled.div`
  width: 300px;
  min-width: 300px;
  background: var(--white, #fff);
`;

const LinkStyled = styled(Link)`
  text-decoration: none;
`;

const TitleStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 300px;
  height: 138px;
  cursor: pointer;
  text-decoration: none;
`;

const TitleSVG = styled.svg`
  width: 110px;
  height: 33px;
  fill: var(--secondary-secondary-600, #233d4e);
`;

const SectionWrap = styled.div`
  height: calc(100% - 138px);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
`;

const SectionStyled = styled.div`
  @font-face {
    font-family: "Pretendard-Regular";
    src: url("https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff")
      format("woff");
    font-weight: 400;
    font-style: normal;
  }
  width: 252px;
  height: 62px;
  background: ${(props) =>
    props.active ? "var(--primary-50, #FDE6EB)" : "var(--white, #fff)"};
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 30px;
  font-size: 18px;
  font-weight: 700;
  font-family: Pretendard-Regular;
  border-radius: 20px;
  cursor: pointer;

  & div {
    width: 24px;
    height: 24px;
    margin-right: 30px;
    margin-left: 20px;
  }
`;

export default SiderBar;
