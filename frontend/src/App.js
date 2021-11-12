import "./App.css";
import { useState } from "react";
import JSONPretty from "react-json-pretty";

function App() {
  const [data, setData] = useState("");

  const getData = () => {
    (async () => {
      try {
        const response = await fetch("http://192.168.178.21:8000/", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
        const content = await response.json();
        console.log("RESULT", content);
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
        const response = await fetch("http://192.168.178.21:8000/", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        const content = await response.json();
        console.log("RESULT", content);
        setData(content);
        return;
      } catch (error) {
        console.error(error);
      }
    })();
  };

  return (
    <div className="App">
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
      <JSONPretty id="json-pretty" data={data}></JSONPretty>
    </div>
  );
}

export default App;
