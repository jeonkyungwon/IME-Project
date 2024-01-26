/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
import Sidebar from "../components/Sidebar";
import styled from "styled-components";
import React, { useState, useEffect } from "react";
import "./AdminMypage.css";
import SAMPLEFILE from "../assets/sample.xlsx";

import search from "../assets/search.svg";
import downloadCoud from "../assets/download-cloud.svg";
import download from "../assets/download.svg";
import uploadCloud from "../assets/upload-cloud.svg";
import downloadCloudGray from "../assets/download-cloud-gray.svg";
import upArrow from "../assets/up_arrow.svg";
import downArrow from "../assets/down_arrow.svg";
import axios from "axios";
import refreshToken from "../components/refreshToken.js";
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

function AdminMypage() {
	const userObj = JSON.parse(localStorage.getItem("userObj"));
	const studentInfoURL = `admin/api/v2/majors/${userObj.majorId}/users`;
	const fileUploadURL = `http://54.180.70.111:8083/admin/api/v2/users/${userObj.userId}/file`;
	let page = 0;
	const [major, setMajor] = useState(localStorage.getItem("major"));
	const [studentInfo, setStudentInfo] = useState([]);
	const [asc, setasc] = useState(true);
	const [searchId, setSearchId] = useState("");

	async function getStudentInfo() {
		await axios
			.get(studentInfoURL, {
				params: {
					majorId: userObj.majorId,
					page: page,
				},
				headers: {
					AccessToken: userObj.accessToken,
				},
			})
			.then((res) => {
				setStudentInfo((prevInfo) => [...prevInfo, ...res.data.result.adminResponse]);
				page = page + 1;
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
				refreshToken();
			});
	}

	async function searchInfo(e) {
		setLoading(true);
		if (e) {
			await axios
				.get(studentInfoURL, {
					params: {
						majorId: userObj.majorId,
						page: page,
						search: e,
					},
					headers: {
						AccessToken: userObj.accessToken,
					},
				})
				.then((res) => {
					setStudentInfo(res.data.result.adminResponse);
					page = 0;
					setLoading(false);
				})
				.catch((err) => {
					console.log(err);
				});
		} else {
			setStudentInfo([]);
			getStudentInfo();
		}
	}

	useEffect(() => {
		getStudentInfo();
	}, []);

	const [loading, setLoading] = useState(false);

	useEffect(() => {
		// 스크롤 이벤트 리스너 등록
		const tbodyElement = document.getElementById("user-info-div");
		tbodyElement.addEventListener("scroll", handleScroll);
		return () => {
			// 컴포넌트 언마운트 시 스크롤 이벤트 리스너 제거
			tbodyElement.removeEventListener("scroll", handleScroll);
		};
	}, []);

	const handleScroll = (event) => {
		const tbodyElement = event.target;
		// 스크롤 위치와 tbody 요소의 높이, 스크롤 가능한 높이 계산
		const scrollTop = tbodyElement.scrollTop;
		const tbodyHeight = tbodyElement.offsetHeight;
		const scrollHeight = tbodyElement.scrollHeight;

		// 스크롤이 tbody 하단에 위치하고 로딩 중이 아닐 때 추가 데이터 로드
		if (scrollTop + tbodyHeight >= scrollHeight && !loading) {
			if (searchId) {
				searchInfo();
			} else {
				getStudentInfo();
			}
		}
	};

	const uploadFile = async (e) => {
		const file = e.target.files[0];
		e.value = "";
		const formData = new FormData();
		formData.append("membershipFile", file);

		fetch(fileUploadURL, {
			method: "POST",
			headers: {
				AccessToken: userObj.accessToken,
			},
			body: formData,
		})
			.then((res) => {
				console.log(res);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const onChange = (e) => {
		page = 0;
		const {
			target: { name, value },
		} = e;
		setSearchId(value);
	};

	const handleAsc = (e) => {
		if (e === "id") {
			const copyInfo = [...studentInfo].sort((a, b) => {
				if (asc) {
					return a.userInfo.studentNum.localeCompare(b.userInfo.studentNum);
				} else {
					return b.userInfo.studentNum.localeCompare(a.userInfo.tudentNum);
				}
			});
			setStudentInfo(copyInfo);
		} else if (e === "lockerNum") {
			const copyInfo = [...studentInfo].sort((a, b) => {
				if (asc && a.userInfo.lockerNum) {
					return a.userInfo.lockerNum.localeCompare(b.userInfo.lockerNum);
				} else if (a.userInfo.lockerNum) {
					return b.userInfo.lockerNum.localeCompare(a.userInfo.lockerNum);
				}
			});
			setStudentInfo(copyInfo);
		}
	};

	const updateInfo = (e) => {
		const updateURL = "http://54.180.70.111:8083/admin/api/v2/users";
		let modifiedUserInfoList = Object.values(studentInfo).map((item) => ({
			admin: item.userInfo.role === "ROLE_ADMIN",
			lockerDetailId: null,
			membership: item.userInfo.userTier !== "NON_MEMBER",
			studentNum: item.userInfo.studentNum,
		}));

		console.log(modifiedUserInfoList);
		fetch(updateURL, {
			method: "PATCH",
			headers: {
				accessToken: userObj.accessToken,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				modifiedUserInfoList: modifiedUserInfoList,
			}),
		})
			.then((res) => {
				console.log(res);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<MyPageStyled>
			<Sidebar />
			<ContentContainer id="adminMypage">
				<div
					style={{
						marginLeft: "2.5rem",
					}}>
					<p
						className="title"
						onClick={() => {
							console.log(studentInfo);
						}}>
						마이페이지
					</p>
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
						<button className="saveBTN" onClick={updateInfo}>
							저장하기
						</button>
						<div
							style={{
								marginTop: "3rem",
								marginBottom: "1rem",
							}}>
							<div className="search-input">
								<input
									type="text"
									placeholder="학생 검색"
									value={searchId}
									onChange={onChange}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											searchInfo(searchId);
										}
									}}
								/>
								<img className="search-icon" src={search} alt="돋보기 아이콘" />
							</div>
							<div className="dataload">
								{studentInfo ? (
									<>
										<img src={downloadCoud} alt="downloadCloud" />
										<label className="dataBTN" htmlFor="download">
											데이터 내보내기
										</label>
										<input id="download" type="file" name="file " accept=".xlsx .csv"></input>
									</>
								) : (
									<>
										<img src={downloadCloudGray} alt="uploadCloudGray" />
										<label
											className="dataBTN"
											htmlFor="uploadG"
											style={{
												color: "var(--grayscale-300, #A3AED0)",
											}}>
											데이터 내보내기
										</label>
									</>
								)}
							</div>
							<div className="dataload">
								<img src={uploadCloud} alt="uploadCloud" />
								<label className="dataBTN" htmlFor="upload">
									데이터 가져오기
								</label>
								<input
									onChange={(e) => {
										uploadFile(e);
									}}
									id="upload"
									type="file"
									name="file"></input>
							</div>
							<div className="dataload">
								<img src={download} alt="download" />
								<a className="dataBTN" href={SAMPLEFILE} download="sample">
									양식 다운받기
								</a>
							</div>
						</div>
						<table className="infoTable">
							{/* 목록 */}
							<div>
								<thead>
									<tr>
										<th>이름</th>
										<th
											onClick={() => {
												setasc(!asc);
												handleAsc("id");
											}}>
											<span>학번</span>
											<img src={asc ? downArrow : upArrow} alt="arrow" />
										</th>
										<th
											onClick={() => {
												setasc(!asc);
												handleAsc("lockerNum");
											}}>
											<span>사물함 번호</span>
											<img src={asc ? downArrow : upArrow} alt="arrow" />
										</th>
										<th>
											<span>상태</span>
										</th>
										<th>
											<span>학생회비 납부</span>
										</th>
										<th>
											<span>관리자 여부</span>
										</th>
									</tr>
								</thead>
							</div>
							{/* 내용 */}
							<div
								id="user-info-div"
								style={{ overflow: "auto", maxHeight: "36.8rem", width: "100%" }}>
								<tbody>
									{studentInfo ? (
										studentInfo.map(function (info, i) {
											return (
												<tr
													style={{
														borderBottom: "1px solid var(--background, #F4F7FE)",
													}}
													key={i}>
													<td>{info.userInfo.studentName}</td>
													<td>{info.userInfo.studentNum}</td>
													<td>{info.reservationInfo.lockerNum}</td>
													<td>{info.userInfo.status}</td>
													<td>
														<input
															type="checkbox"
															id={`pay${i}`}
															checked={info.userInfo.userTier === "MEMBER"}
															onClick={() => {
																let copyInfo = [...studentInfo];
																copyInfo[i].userInfo.userTier =
																	copyInfo[i].userInfo.userTier === "MEMBER"
																		? "NON_MEMBER"
																		: "MEMBER";
																setStudentInfo(copyInfo);
															}}
														/>
														<label htmlFor={`pay${i}`}></label>
													</td>
													<td>
														<input
															type="checkbox"
															id={`admin${i}`}
															checked={info.userInfo.role === "ROLE_ADMIN"}
															onClick={() => {
																let copyInfo = [...studentInfo];
																copyInfo[i].userInfo.role =
																	copyInfo[i].userInfo.role === "ROLE_ADMIN"
																		? "ROLE_USER"
																		: "ROLE_ADMIN";
																setStudentInfo(copyInfo);
																console.log(copyInfo);
															}}
														/>
														<label htmlFor={`admin${i}`}></label>
													</td>
												</tr>
											);
										})
									) : (
										<></>
									)}
								</tbody>
							</div>
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
