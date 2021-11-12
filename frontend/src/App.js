import "./App.css";
import { useState } from "react";
import JSONPretty from "react-json-pretty";

function App() {
  const [data, setData] = useState("Nothing here yet!");

  const getData = () => {
    (async () => {
      try {
        const response = await fetch(process.env.REACT_APP_BACKEND_URL, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
        const content = await response.json();
        setData(content);
        return;
      } catch (error) {
        console.error(error);
      }
    })();
  };

  const postData = () => {
    (async () => {
      try {
        const response = await fetch(
          "https://candidate.hubteam.com/candidateTest/v3/problem/result?userKey=" +
            process.env.REACT_APP_API_KEY,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
        const content = await response.json();
        setData(content);

        return;
      } catch (error) {
        console.error(error);
      }
    })();
  };

  return (
    <div className="App">
      <div style={{ height: "5vh" }}>
        <button
          onClick={() => {
            getData();
          }}
        >
          Get Data
        </button>
        <button
          onClick={() => {
            postData();
          }}
        >
          Post Data
        </button>
      </div>
      <div style={{ height: "95vh", overflowY: "scroll" }}>
        <JSONPretty id="json-pretty" data={data}></JSONPretty>
      </div>
    </div>
  );
}

export default App;
