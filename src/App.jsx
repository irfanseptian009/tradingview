import { useState } from "react";
import ChartFillter from "./components/ChartFillter";
import ChartWithOverlay from "./components/ChartWithOverlay";
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
            backgroundColor: chartType === "overlay" ? "#4caf50" : "#f5f5f5",
            color: chartType === "overlay" ? "#fff" : "#333",
            border: "2px solid #4caf50",
            borderRadius: "8px",
            cursor: "pointer",
          
            boxShadow: chartType === "overlay" ? "0px 4px 8px rgba(0, 0, 0, 0.2)" : "none",
            transition: "all 0.3s ease-in-out",
          }}
        >
          Overlay Chart
        </button>
        <button
          onClick={() => handleChartTypeChange("filter")}
          style={{
            padding: "12px 20px",
            
            boxSizing: "border-box",
            fontSize: "16px",
            fontWeight: "bold",
            backgroundColor: chartType === "filter" ? "#4caf50" : "#f5f5f5",
            color: chartType === "filter" ? "#fff" : "#333",
            border: "2px solid #4caf50",
            borderRadius: "8px",
            cursor: "pointer",
            boxShadow: chartType === "filter" ? "0px 4px 8px rgba(0, 0, 0, 0.2)" : "none",
            transition: "all 0.3s ease-in-out",
          }}
        >
          Series Compare
        </button>
        <button
          onClick={() => handleChartTypeChange("Normalization")}
          style={{
            padding: "12px 20px",
            
            boxSizing: "border-box",
            fontSize: "16px",
            fontWeight: "bold",
            backgroundColor: chartType === "Normalization" ? "#4caf50" : "#f5f5f5",
            color: chartType === "Normalization" ? "#fff" : "#333",
            border: "2px solid #4caf50",
            borderRadius: "8px",
            cursor: "pointer",
            boxShadow: chartType === "Normalization" ? "0px 4px 8px rgba(0, 0, 0, 0.2)" : "none",
            transition: "all 0.3s ease-in-out",
          }}
        >
          Normalization Chart
        </button>
      </div>
      <div
        style={{
          border: "4px solid #dddddddd",
          borderRadius: "10px",
          padding: "10px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        {chartType === "overlay" && <ChartWithOverlay dataSets={dataSets} />}
        {chartType === "filter" && <ChartFillter dataSets={dataSets} />}
        {chartType === "Normalization" && <NormalizationChart dataSets={dataSets} />}
      </div>
    </div>
  );
}
