import Sidebar from "../components/Sidebar";
import styled from "styled-components";
import React, { useState, useEffect } from "react";
import "./AdminMypage.css";

import search from "../assets/search.svg";
import downloadCoud from "../assets/download-cloud.svg";
import download from "../assets/download.svg";
import uploadCloud from "../assets/upload-cloud.svg";
import downloadCloudGray from "../assets/download-cloud-gray.svg";
import upArrow from "../assets/up_arrow.svg";
import downArrow from "../assets/down_arrow.svg";
import axios from "axios";
import { getSuggestedQuery } from "@testing-library/react";

function AdminMypage() {
	const userObj = JSON.parse(localStorage.getItem("userObj"));
	const studentInfoURL = "http://54.180.70.111:8081/admin/api/v2/users/?page=1";

	async function getStudentInfo() {
		await axios
			.get(studentInfoURL, {
				headers: {
					AccessToken: userObj.accessToken,
					RefreshToken: userObj.refreshToken,
				},
			})
			.then((res) => {
				console.log(res);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	useEffect(() => {
		getStudentInfo();
	}, []);
	const [major, setMajor] = useState("시각디자인학과");
	const [studentInfo, setStudentInfo] = useState([
		{ name: "조예린", id: "19011721", num: "12", state: "재학", pay: true, admin: false },
		{ name: "조예린", id: "19011722", num: "12", state: "재학", pay: false, admin: true },
		{ name: "조예린", id: "19011723", num: "12", state: "재학", pay: true, admin: false },
		{ name: "조예린", id: "19011724", num: "12", state: "재학", pay: true, admin: true },
		{ name: "조예린", id: "19011725", num: "12", state: "재학", pay: true, admin: false },
	]);
	const [idAsc, setIdAsc] = useState(true);
	const [searchId, setSearchId] = useState("");

	const handleAsc = () => {
		const copyInfo = [...studentInfo].sort((a, b) => {
			if (idAsc) {
				return a.id.localeCompare(b.id);
			} else {
				return b.id.localeCompare(a.id);
			}
		});
		setStudentInfo(copyInfo);
	};

	return (
		<MyPageStyled>
			<Sidebar />
			<ContentContainer id="adminMypage">
				<div
					style={{
						marginLeft: "2.5rem",
					}}>
					<p className="title">마이페이지</p>
					<div className="infoDiv">
						<p
							style={{
								color: "var(--primary-400, #ED335D)",
								fontFamily: "Pretendard",
								fontSize: "1.5rem",
								fontStyle: "normal",
								fontWeight: "700",
								letterSpacing: "-0.03rem",
								display: "inline",
							}}>
							{major} 학생 관리
						</p>
						<button className="saveBTN">저장하기</button>
						<div
							style={{
								marginTop: "3rem",
								marginBottom: "1rem",
							}}>
							<div class="search-input">
								<input
									type="text"
									placeholder="학생 검색"
									value={searchId}
									onChange={(e) => {
										setSearchId(e.value);
									}}
								/>
								<img class="search-icon" src={search} alt="돋보기 아이콘" />
							</div>
							<div className="dataload">
								{studentInfo ? (
									<>
										<img src={downloadCoud} alt="downloadCloud" />
										<span>데이터 내보내기</span>
									</>
								) : (
									<>
										<img src={downloadCloudGray} alt="uploadCloudGray" />
										<span
											style={{
												color: "var(--grayscale-300, #A3AED0)",
											}}>
											데이터 내보내기
										</span>
									</>
								)}
							</div>
							<div className="dataload">
								<img src={uploadCloud} alt="uploadCloud" />
								<span>데이터 가져오기</span>
							</div>
							<div className="dataload">
								<img src={download} alt="download" />
								<span>양식 다운받기</span>
							</div>
						</div>
						<table className="infoTable">
							{/* 목록 */}
							<th>이름</th>
							<th>
								<span
									onClick={() => {
										setIdAsc(!idAsc);
										handleAsc();
									}}>
									학번
								</span>
								<img src={idAsc ? upArrow : downArrow} alt="arrow" />
							</th>
							<th>사물함 번호</th>
							<th>상태</th>
							<th>학생회비 납부</th>
							<th>관리자 여부</th>
							{/* 내용 */}
							{studentInfo ? (
								studentInfo.map(function (info, i) {
									return (
										<tr
											style={{
												borderBottom: "1px solid var(--background, #F4F7FE)",
											}}
											key={i}>
											<td>{info.name}</td>
											<td>{info.id}</td>
											<td>{info.num}</td>
											<td>{info.state}</td>
											<td>
												<input
													type="checkbox"
													id={`pay${i}`}
													checked={info.pay}
													onClick={() => {
														let copyInfo = [...studentInfo];
														copyInfo[i].pay = !copyInfo[i].pay;
														setStudentInfo(copyInfo);
													}}
												/>
												<label for={`pay${i}`}></label>
											</td>
											<td>
												<input
													type="checkbox"
													id={`admin${i}`}
													checked={info.admin}
													onClick={() => {
														let copyInfo = [...studentInfo];
														copyInfo[i].admin = !copyInfo[i].admin;
														setStudentInfo(copyInfo);
													}}
												/>
												<label for={`admin${i}`}></label>
											</td>
										</tr>
									);
								})
							) : (
								<></>
							)}
						</table>
						{studentInfo ? (
							<></>
						) : (
							<div className="noneInfo">
								<p>학생 정보가 없습니다.</p> <br />
								<p>상단의 '양식 다운로드'에서 학생 정보를 입력 후, '양식 업로드'를 해주세요</p>
							</div>
						)}
					</div>
				</div>
			</ContentContainer>
		</MyPageStyled>
	);
}

export default AdminMypage;

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
