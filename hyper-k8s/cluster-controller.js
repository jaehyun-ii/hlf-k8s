const express = require('express');
const { runCommand } = require('./utils');

const router = express.Router();

// 클러스터 초기화
router.post('/init', async (req, res) => {
    try {
        console.log("🔄 Initializing Kubernetes Cluster...");
        await runCommand('sudo kubeadm init --pod-network-cidr=192.168.0.0/16');

        console.log("✅ Cluster initialized. Applying additional configurations...");
        
        // Helm 저장소 업데이트
        await update_helm_repos();

        // Nginx Ingress Controller 배포
        await apply_nginx_ingress();

        // Cert-Manager 설치
        await apply_cert_manager();

        res.json({ success: true, message: "Cluster initialized and Helm charts applied." });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Helm 저장소 업데이트
async function update_helm_repos() {
    console.log("🔄 Updating Helm repositories...");
    await runCommand('helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx');
    await runCommand('helm repo add jetstack https://charts.jetstack.io');
    await runCommand('helm repo update');
    console.log("✅ Helm repositories updated.");
}

// Nginx Ingress Controller 설치 (Helm)
async function apply_nginx_ingress() {
    console.log("🔄 Installing Nginx Ingress Controller using Helm...");
    await runCommand('helm install ingress-nginx ingress-nginx/ingress-nginx -n ingress-nginx --create-namespace');
    console.log("✅ Nginx Ingress Controller installed.");
}

// Cert-Manager 설치 (Helm)
async function apply_cert_manager() {
    console.log("🔄 Installing Cert-Manager using Helm...");
    await runCommand('helm install cert-manager jetstack/cert-manager -n cert-manager --create-namespace --set installCRDs=true');
    console.log("✅ Cert-Manager installed.");
}

router.get('/status', async (req, res) => {
    try {
      // 클러스터 정보
      const clusterInfoOutput = await runCommand('kubectl cluster-info');
  
      // 노드 정보 (JSON)
      const nodesOutput = await runCommand('kubectl get nodes -o json');
      const nodesJson = JSON.parse(nodesOutput);
  
      // 전체 파드 정보 (JSON, 모든 네임스페이스)
      const podsOutput = await runCommand('kubectl get pods --all-namespaces -o json');
      const podsJson = JSON.parse(podsOutput);
  
      // 결과 응답
      res.json({
        success: true,
        clusterInfo: clusterInfoOutput,  // 텍스트 형태
        nodes: nodesJson,                // 오브젝트 형태
        pods: podsJson                   // 오브젝트 형태
      });
    } catch (error) {
      console.error('[ERROR] /api/cluster/status:', error.message);
      res.status(500).json({ success: false, error: error.message });
    }
  });

// 토큰 조회
router.get('/token', (req, res) => {
    const command = 'sudo kubeadm token create --print-join-command';
    runCommand(command, res);
});

// 클러스터 리셋
router.post('/reset', (req, res) => {
    const command = 'sudo kubeadm reset -f';
    runCommand(command, res);
});

module.exports = router;
