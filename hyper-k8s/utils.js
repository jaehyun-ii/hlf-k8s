const { exec } = require("child_process");

function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Command failed: ${command}`);
        console.error(stderr);
        reject(new Error(stderr || error.message));
        return;
      }
      resolve(stdout);
    });
  });
}

module.exports = { runCommand };
