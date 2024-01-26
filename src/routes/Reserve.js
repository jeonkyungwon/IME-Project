import Sidebar from "../components/Sidebar";
import styled from "styled-components";
import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import "./Reserve.css";
import alert from "../assets/alert-circle.svg";
import axios from "axios";
import refreshToken from "../components/refreshToken.js";
import { EventSourcePolyfill, NativeEventSource } from "event-source-polyfill";
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

function Reserve() {
	const userObj = JSON.parse(localStorage.getItem("userObj"));
	const lockerURL = `api/v2/users/${userObj.userId}/majors/lockers`;

	const [major, setMajor] = useState(localStorage.getItem("major"));
	const [lockerInfo, setLockerInfo] = useState();
	const [lockerName, setLockerName] = useState();
	const [changeLockerModal, setChangeLockerModal] = useState(false);
	const [alertReserveModal, setAlertReserveModal] = useState(false);
	const [prevReserveModal, setPrevReserveModal] = useState(false);
	const [nonetargetModal, setNonetargetModal] = useState(false);
	const [colArr, setColArr] = useState();
	const [rowArr, setRowArr] = useState();
	const [showLocker, setShowLocker] = useState(0);
	const [showCol, setShowCol] = useState(1);
	const [showRow, setShowRow] = useState(1);
	const [startTime, setStartTime] = useState(0);
	const [endTime, setEndTime] = useState(2505474850088);
	const [reservedLockerId, setReservedLockerId] = useState();
	const [reserveNum, setReserveNum] = useState(0);
	const [reserveName, setReserveName] = useState("");
	const [reserveId, setReserveId] = useState(0);

	// 현재 시간 측정
	const [currentTime, setCurrentTime] = useState(new Date());
	const [isBlocked, setIsBlocked] = useState(false);

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date());
			checkTime();
		}, 1000);
		return () => {
			clearInterval(timer);
		};
	}, []);

	const checkTime = () => {
		// 정해진 시간 (예: 9시 0분부터 17시 30분까지) 설정
		const start = new Date(startTime);
		const end = new Date(endTime);
		if (currentTime.getTime() >= start.getTime() && currentTime.getTime() < end.getTime()) {
			setIsBlocked(false); // 예약 가능 시간인 경우
		} else {
			setIsBlocked(true); // 예약 가능 시간이 아닌 경우
		}
	};

	async function getLockerInfo() {
		await axios
			.get(lockerURL, {
				headers: {
					AccessToken: userObj.accessToken,
				},
			})
			.then((res) => {
				console.log(res.data);
				setLockerInfo(res.data.result.lockersInfo);
				setLockerName(
					res.data.result.lockersInfo.map((i) => {
						return {
							name: i.locker.name,
							img: i.locker.image,
							isHovered: false,
						};
					})
				);
				setReserveName(res.data.result.lockersInfo[0].locker.name);
				setStartTime(res.data.result.lockersInfo[0].locker.startReservationTime);
				setEndTime(res.data.result.lockersInfo[0].locker.endReservationTime);
				setShowCol(res.data.result.lockersInfo[0].locker.totalColumn);
				setShowRow(res.data.result.lockersInfo[0].locker.totalRow);
			})
			.catch((err) => {
				console.log(err);
				refreshToken();
			});
	}

	async function getUserInfo() {
		const URL = `api/v2/users/${userObj.userId}`;
		axios
			.get(URL, {
				headers: {
					AccessToken: userObj.accessToken,
				},
			})
			.then((res) => {
				console.log(res.data.result.reservedLockerDetailId);
				setReservedLockerId(res.data.result.reservedLockerDetailId);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	useEffect(() => {
		getLockerInfo();
		getUserInfo();
		// refreshToken();
	}, []);

	useEffect(() => {
		connectSSE();
	}, []);

	// 서버 SSE 연결
	const connectSSE = () => {
		const url =
			"http://54.180.70.111:8083/api/v2/sse/connect/lockers?majorId=" + encodeURI(userObj.majorId);
		const eventSource = EventSourcePolyfill || NativeEventSource;

		eventSource.current = new EventSourcePolyfill(url, {
			headers: {
				accessToken: userObj.accessToken,
			},
		});
		console.log(eventSource);
		eventSource.current.onopen = (event) => {
			console.log("SSE 연결이 열렸습니다.");
			console.log(event);
		};

		eventSource.current.onmessage = (event) => {
			console.log(event);
		};

		eventSource.current.onerror = (error) => {
			console.error(error);
		};
	};

	// 보여지는 locker index 변경
	function changeShowLocker(e) {
		setShowLocker(e);
		setReserveName(lockerName[e].name);
		setShowCol(lockerInfo[e].locker.totalColumn);
		setShowRow(lockerInfo[e].locker.totalRow);
		setStartTime(lockerInfo[e].locker.startReservationTime);
		setEndTime(lockerInfo[e].locker.endReservationTime);
	}

	const reserveURL = `http://54.180.70.111:8083/api/v2/users/${userObj.userId}/majors/${userObj.majorId}/lockerDetail/`;

	function selectLocker(e) {
		if (!reservedLockerId) {
			console.log("first");
			reserve(e);
		} else {
			console.log("change");
			setChangeLockerModal(true);
		}
	}
	// 사물함 예약 함수
	async function reserve(e) {
		let lockerDetailId = e;
		const URL = reserveURL + lockerDetailId + "/reservations";

		fetch(URL, {
			method: "POST",
			headers: {
				accessToken: userObj.accessToken,
			},
		})
			.then((res) => {
				// console.log(res);
				if (res.status === 200) {
					setReservedLockerId(e);
					let copyInfo = [...lockerInfo];
					copyInfo.forEach((i) => {
						i.lockerDetail.forEach((detail) => {
							if (detail.id === e) {
								detail.status = "RESERVED";
							}
						});
					});
					setLockerInfo(copyInfo);
					setAlertReserveModal(true);
					setNonetargetModal(true);
				} else {
					setPrevReserveModal(true);
				}
			})
			.catch((err) => {
				console.log(err);
				setPrevReserveModal(true);
			});
	}
	// 사물함 변경 시 함수
	async function changeReserve(e) {
		const lockerDetailId = e;
		cancelReserve(reservedLockerId, lockerDetailId);
	}

	// 예약 취소 함수
	async function cancelReserve(e, id) {
		const cancelURL = reserveURL + reservedLockerId + "/reservations";
		fetch(cancelURL, {
			method: "PATCH",
			headers: {
				accessToken: userObj.accessToken,
			},
		})
			.then((res) => {
				setReservedLockerId(null);
				let copyInfo = [...lockerInfo];
				copyInfo.forEach((i) => {
					i.lockerDetail.forEach((detail) => {
						if (detail.id === e) {
							detail.status = "NON_RESERVED";
						}
					});
				});
				setLockerInfo(copyInfo);
				// reserve(id);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	useEffect(() => {
		setColArr(Array.from({ length: showCol }, (_, index) => index));
		setRowArr(Array.from({ length: showRow }, (_, index) => index));
	}, [showRow, showCol]);

	function formatDateTime(dateTimeString) {
		const date = new Date(dateTimeString);
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		const hours = String(date.getHours()).padStart(2, "0");
		const minutes = String(date.getMinutes()).padStart(2, "0");

		return `${year}.${month}.${day} (${hours}:${minutes})`;
	}

	return (
		<MyPageStyled>
			<Sidebar />
			<ContentContainer id="reservePage">
				<div
					style={{
						marginLeft: "2.5rem",
					}}>
					<p className="title">사물함 예약</p>
					<div className="reserveDiv">
						{/* 학과 및 사물함 이름  */}
						<div
							className="classLockerNameDiv"
							style={{
								marginBottom: "3rem",
							}}>
							<p
								style={{
									color: "var(--primary-400, #ED335D)",
									fontFamily: "Pretendard",
									fontSize: "1.5rem",
									fontStyle: "normal",
									fontWeight: "700",
									letterSpacing: "-0.03rem",
									display: "inline",
									marginLeft: "1.5rem",
								}}>
								{major}
							</p>
							{/* 사물함 이름 리스트 출력 */}
							{lockerName ? (
								lockerName.map(function (info, i) {
									return (
										<div
											style={{
												display: "inline",
											}}
											key={i}>
											<p
												className="lockerName"
												style={{
													color: showLocker === i ? "#2B3674" : "#C9D2EB",
													userSelect: "none",
												}}
												onClick={() => {
													changeShowLocker(i);
												}}>
												{info.name}
											</p>
											<div
												className="alertIMG"
												onMouseEnter={() => {
													let copyName = [...lockerName];
													copyName[i].isHovered = true;
													setLockerName(copyName);
												}}
												onMouseLeave={() => {
													let copyName = [...lockerName];
													copyName[i].isHovered = false;
													setLockerName(copyName);
												}}>
												<img src={alert} alt="alert" />
												{info.isHovered && (
													<div>
														<img
															src={info.img}
															alt="lockerImg"
															style={{
																position: "absolute",
																top: "50%",
																left: "50%",
																transform: "translate(-50%, 10%)",
																zIndex: 1,
																borderRadius: "1.25rem",
															}}
														/>
													</div>
												)}
											</div>
										</div>
									);
								})
							) : (
								<></>
							)}
							<div
								style={{
									float: "right",
									display: "flex",
									alignItems: "center",
									height: "100%",
								}}>
								<p
									style={{
										marginTop: "5px",
										color: "var(--grayscale-400, #7883A6)",
										marginBottom: "0",
										fontFamily: "Pretendard",
										fontSize: "1rem",
										fontWeight: "700",
										lineHeight: "normal",
										letterSpacing: "-0.02rem",
									}}>
									예약 가능 시간 : {formatDateTime(startTime)} ~ {formatDateTime(endTime)}
								</p>
							</div>
						</div>
						{/* 사물함 배치 및 예약  */}
						<div>
							<div className="lockerBoxDiv">
								{lockerInfo ? (
									colArr.map(function (info, col) {
										return (
											<div key={col}>
												{rowArr.map(function (info, row) {
													const locker = lockerInfo[showLocker].lockerDetail.find(
														(item) =>
															item.row_num === String(row + 1) &&
															item.column_num === String(col + 1)
													);
													let num = locker ? locker.locker_num : 0;
													return (
														<div key={row}>
															{locker ? (
																<div
																	className="lockerBox"
																	style={{
																		background:
																			locker.status === "NON_RESERVED"
																				? "var(--background, #f4f7fe)"
																				: "var(--primary-400, #ED335D)",
																	}}
																	key={row}
																	onClick={() => {
																		setReserveNum(num);
																		setReserveId(locker.id);
																		selectLocker(locker.id);
																		// changeReserve(locker.id);
																		// setChangeLockerModal(true);
																	}}>
																	<span
																		style={{
																			color:
																				locker.status === "NON_RESERVED"
																					? "var(--grayscale-300, #a3aed0)"
																					: "white",
																		}}
																		className="lockerBoxNum">
																		{num}
																	</span>
																</div>
															) : (
																<></>
															)}
														</div>
													);
												})}
											</div>
										);
									})
								) : (
									<div
										style={{
											display: "flex",
											height: "40rem",
											/* title4 */
											fontFamily: "Pretendard",
											fontSize: "1.125rem",
											fontWeight: "800",
											lineHeight: "normal",
											textAlign: "center",
											alignItems: "center",
											justifyContent: "center",
										}}>
										<p style={{ color: "var(--grayscale-600, #2b3674)" }}>
											사물함 정보가 없습니다.
										</p>
									</div>
								)}
								{isBlocked && (
									<div
										className="overlay"
										style={{
											position: "absolute",
											top: 0,
											left: 0,
											width: "100%",
											height: "100%",
											backdropFilter: "blur(0.5px)",
											borderRadius: "0.75rem",
											zIndex: 9999,
											display: "flex",
											alignItems: "center",
											textAlign: "center",
											justifyContent: "center",
										}}>
										<div>
											<p
												style={{
													color: "var(--grayscale-600, #2B3674)",
													textAlign: "center",
													/* title4 */
													fontFamily: "Pretendard",
													fontSize: "1.125rem",
													fontStyle: "normal",
													fontWeight: "700",
													lineHeight: "normal",
												}}>
												예약 가능 시간이 아닙니다. <br /> {formatDateTime(startTime)} ~{" "}
												{formatDateTime(endTime)}
											</p>
											<button
												style={{
													display: "inline-block",
													height: "3.75rem",
													padding: "0.625rem 2.5rem",
													justifyContent: "center",
													gap: "0.625rem",
													borderRadius: "1.25rem",
													color: "white",
													border: "none",
													backgroundColor: "var(--primary-400, #ED335D)",
													fontFamily: "Pretendard",
													fontSize: "1rem",
													fontStyle: "normal",
													fontWeight: "700",
													lineHeight: "normal",
												}}>
												다시 조회하기
											</button>
										</div>
									</div>
								)}
							</div>
						</div>
						<ChangeLockerModal
							setChangeLockerModal={setChangeLockerModal}
							place={reserveName}
							num={reserveNum}
							id={reserveId}
							changeReserve={changeReserve}
							changeLockerModal={changeLockerModal}></ChangeLockerModal>
						<AlertReserveModal
							setAlertReserveModal={setAlertReserveModal}
							place={reserveName}
							num={reserveNum}
							alertReserveModal={alertReserveModal}></AlertReserveModal>
						<PrevReserveModal
							setPrevReserveModal={setPrevReserveModal}
							prevReserveModal={prevReserveModal}></PrevReserveModal>
						<NonetargetModal
							setNonetargetModal={setNonetargetModal}
							nonetargetModal={nonetargetModal}></NonetargetModal>
					</div>
				</div>
			</ContentContainer>
		</MyPageStyled>
	);
}

export default Reserve;

function ChangeLockerModal(props) {
	const handleClose = () => props.setChangeLockerModal(false);

	return (
		<Modal
			show={props.changeLockerModal}
			onHide={handleClose}
			backdrop="static"
			keyboard={false}
			centered>
			<Modal.Body>
				<p className="modalTitle">
					{props.place} 사물함 {props.num}번으로 변경하시겠어요?
				</p>
				<p className="modalDetail">기존의 사물함 예약 내역은 사라져요</p>
				<div className="">
					<button className="modalWhiteBTN" onClick={handleClose}>
						취소
					</button>
					<button
						className="modalRedBTN"
						style={{ width: "11.875rem" }}
						onClick={() => {
							props.changeReserve(props.id);
							handleClose();
						}}>
						변경할게요
					</button>
				</div>
			</Modal.Body>
		</Modal>
	);
}

function AlertReserveModal(props) {
	const handleClose = () => props.setAlertReserveModal(false);

	return (
		<Modal
			show={props.alertReserveModal}
			onHide={handleClose}
			backdrop="static"
			keyboard={false}
			centered>
			<Modal.Body>
				<p className="modalTitle">
					{props.place} 사물함 {props.num}번 예약이 완료되었어요.
				</p>
				<p className="modalDetail">언제든 남아있는 사물함으로 변경이 가능해요.</p>
				<button
					variant="secondary"
					onClick={handleClose}
					className="modalRedBTN"
					style={{ width: "25rem" }}>
					확인
				</button>
			</Modal.Body>
		</Modal>
	);
}

function PrevReserveModal(props) {
	const handleClose = () => props.setPrevReserveModal(false);

	return (
		<Modal
			show={props.prevReserveModal}
			onHide={handleClose}
			backdrop="static"
			keyboard={false}
			centered>
			<Modal.Body>
				<p className="modalTitle">이미 예약된 사물함이에요.</p>
				<p className="modalDetail">다른 사물함을 선택해주세요</p>
				<button
					variant="secondary"
					onClick={handleClose}
					className="modalRedBTN"
					style={{ width: "25rem" }}>
					확인
				</button>
			</Modal.Body>
		</Modal>
	);
}

function NonetargetModal(props) {
	const handleClose = () => props.setNonetargetModal(false);

	return (
		<Modal
			show={props.nonetargetModal}
			onHide={handleClose}
			backdrop="static"
			keyboard={false}
			centered>
			<Modal.Body>
				<p className="modalTitle">사물함 예약 대상이 아니에요</p>
				<p className="modalDetail">다른 사물함을 선택해주세요</p>
				<button
					variant="secondary"
					onClick={handleClose}
					className="modalRedBTN"
					style={{ width: "25rem" }}>
					확인
				</button>
			</Modal.Body>
		</Modal>
	);
}

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
	padding-bottom: 5rem;
`;
