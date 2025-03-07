const express = require("express");
const cors = require("cors");
const clusterController = require("./cluster-controller");
const nodeController = require("./node-controller");
const { checkPrereqs } = require("./require"); // 필수 패키지 검사 추가

// 서버 시작 전 필수 패키지 검사
checkPrereqs();

const app = express();
const PORT = process.env.PORT || 5001;

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// 컨트롤러 라우트 설정
app.use("/api/cluster", clusterController);
app.use("/api/node", nodeController);

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
