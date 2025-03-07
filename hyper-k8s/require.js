const { execSync } = require("child_process");

const requiredPackages = [
  { name: "docker", command: "docker --version" },
  { name: "kubectl", command: "kubectl version --client=true" },
  { name: "jq", command: "jq --version" },
  { name: "envsubst", command: "echo test | envsubst" },
];

// 필수 패키지 검사 함수
function checkPrereqs() {
  console.log("🔍 Checking required packages...\n");

  let allPackagesAvailable = true;

  requiredPackages.forEach((pkg) => {
    try {
      execSync(pkg.command, { stdio: "ignore" });
      console.log(`✅ ${pkg.name} is installed.`);
    } catch (error) {
      console.error(`❌ ERROR: ${pkg.name} is not installed.`);
      allPackagesAvailable = false;
    }
  });

  if (!allPackagesAvailable) {
    console.error(
      "\n❗ Some required packages are missing. Please install them before proceeding."
    );
    process.exit(1);
  }

  console.log("\n✅ All required packages are installed.");
}

// 모듈 내보내기
module.exports = { checkPrereqs };
