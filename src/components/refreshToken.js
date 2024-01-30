async function RefreshToken() {
  const userObj = JSON.parse(localStorage.getItem("userObj"));
  const URL = "http://54.180.70.111:8083/api/v2/auth/reissue";
  console.log("토큰 재 발행 중 ");
  await fetch(URL, {
    method: "post",
    headers: {
      RefreshToken: userObj.refreshToken,
    },
  })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.error(err);
    });
}

export default RefreshToken;
