import { useState } from "react";
import NormalizationChart from "./components/NormalizationChart";
import { dataSets } from "./data/dummyData";

export default function App() {
  const [chartType, setChartType] = useState("overlay"); 
  const handleChartTypeChange = (type) => {
    setChartType(type);
  };

  return (
    <div className="App" style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <div
        style={{
          display: "flex",
         
       marginLeft: "10px",
          gap: "10px",
          marginBottom: "4px",
        }}
      >
        <button
          onClick={() => handleChartTypeChange("overlay")}
          style={{
            padding: "12px 20px",
            backgroundColor: chartType === "overlay" ? "#7171da" : "#f5f5f5",
            color: chartType === "overlay" ? "#fff" : "#333",
            border: "2px solid #7171da",
            borderRadius: "8px",
            cursor: "pointer",
          
            boxShadow: chartType === "overlay" ? "0px 4px 8px rgba(0, 0, 0, 0.2)" : "none",
            transition: "all 0.3s ease-in-out",
          }}
        >
          Normalization
        </button>
       
      </div>
      <div
        style={{
          border: "4px solid #7171da",
          borderRadius: "10px",
          padding: "10px",
          boxShadow: "#f2f2f2",
        }}
      >
        {chartType === "overlay" && <NormalizationChart dataSets={dataSets} />}
    
      </div>
    </div>
  );
}
