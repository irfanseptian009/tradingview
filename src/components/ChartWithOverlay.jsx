import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { createChart } from "lightweight-charts";

const ChartWithOverlay = ({
  dataSets,
  title = "Chart with Overlay Price Scales",
}) => {
  const chartRef = useRef(null);
  const seriesRefs = useRef({}); // To store references to all series
  const [focusedKey, setFocusedKey] = useState(null); // Key of the focused series

  useEffect(() => {
    const chart = createChart(chartRef.current, {
      width: 700,
      height: 300,
            timeScale: { timeVisible: true, secondsVisible: true },
      crosshair: {
        mode: 1, 
      },
    });

    // Add datasets as line series with overlay price scales
    Object.keys(dataSets).forEach((key, index) => {
      const priceScaleId = `overlay-${index}`; 

      const series = chart.addLineSeries({
        color: dataSets[key].color || `hsl(${index * 60}, 100%, 50%)`,
        lineWidth: 2,
        priceScaleId, 
      });

      series.setData(
        dataSets[key].data.map((item) => ({
          time: item.time.split("T")[0], 
          value: item.value,
        }))
      );

      // Configure the overlay price scale for this series
      chart.priceScale(priceScaleId).applyOptions({
        position: "overlay", 
        autoScale: true,
        borderColor: "#e1e1e1",
        scaleMargins: { top: 0.40, bottom: 0.40 },
        
      });

      seriesRefs.current[key] = series;
    });

    return () => {
      chart.remove();
    };
  }, [dataSets]);

  useEffect(() => {
    // Update series visibility and styling based on focus
    Object.keys(seriesRefs.current).forEach((key) => {
      seriesRefs.current[key].applyOptions({
        visible: !focusedKey || focusedKey === key,
        lineWidth: focusedKey === key ? 4 : 2, 
      });
    });
  }, [focusedKey]);

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f9f9f9",
        boxShadow: "0px 4px 8px 0px rgba(0,0,0,03.2)",
        borderRadius: "8px",
      }}
    >
      <h3 style={{ marginBottom: "10px", color: "#333" }}>{title}</h3>
      <div
        ref={chartRef}
        style={{
          position: "relative",
          width: "100%",
          height: "300px",
          marginBottom: "10px",
        }}
      ></div>
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        {Object.keys(dataSets).map((key) => (
          <button
            key={key}
            onClick={() => setFocusedKey(focusedKey === key ? null : key)}
            style={{
              padding: "10px 20px",
              backgroundColor: focusedKey === key ? "#4caf50" : "#e0e0e0",
              color: focusedKey === key ? "#fff" : "#000",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {focusedKey === key ? `Unfocus ${key}` : `Focus ${key}`}
          </button>
        ))}
      </div>
    </div>
  );
};

ChartWithOverlay.propTypes = {
  dataSets: PropTypes.object.isRequired, // Object containing datasets for multiple series
  title: PropTypes.string,
};

export default ChartWithOverlay;
