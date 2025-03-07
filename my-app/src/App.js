import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [clusters, setClusters] = useState([]);
  const [message, setMessage] = useState("");

  // 클러스터 목록 가져오기
  const fetchClusters = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/cluster");
      setClusters(response.data);
    } catch (error) {
      console.error("Error fetching clusters:", error);
      setMessage("클러스터 목록을 불러오는 데 실패했습니다.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5001/api/cluster/init"
      );

      if (response.status === 201) {
        setMessage(
          `클러스터 '${response.data.name}'가 성공적으로 생성되었습니다.`
        );
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setMessage(error.response.data.message);
      } else {
        setMessage(error.response.data.message);
      }
    }
  };

  useEffect(() => {
    fetchClusters();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <form onSubmit={handleSubmit}>
          <button type="submit">생성</button>
        </form>
        {message && <p>{message}</p>}
        <h2>클러스터 목록</h2>
        <ul>
          {clusters.map((cluster) => (
            <li key={cluster.id}>{cluster.name}</li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
