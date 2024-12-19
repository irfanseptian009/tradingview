import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { createChart } from "lightweight-charts";

const NormalizationChart = ({ dataSets }) => {
  const chartRef = useRef(null);
  const seriesRefs = useRef({});
  const [focusedKey, setFocusedKey] = useState(null);
  const [overlayModes, setOverlayModes] = useState({});

  // Set initial overlay modes
  useEffect(() => {
    const initialOverlayModes = {};
    Object.keys(dataSets).forEach((key) => {
      initialOverlayModes[key] = true;
    });
    setOverlayModes(initialOverlayModes);
  }, [dataSets]);

  useEffect(() => {
    const chart = createChart(chartRef.current, {
      width: 700,
      height: 300,
      timeScale: { timeVisible: true, secondsVisible: true },
      layout: {
        background: "#121212",
        textColor: "#ffff",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        fontSize: 10,
      },
      grid: {
        vertLines: { color: "#000066" },
        horzLines: { color: "#003300" },
      },
      crosshair: {
        mode: 1,
        vertLine: { color: "#4747d1", width: 1 },
        horzLine: {
          color: "#ffffff",
          labelBackgroundColor: "#ffffff",
          labelFontColor: "#000000",
          visible: true,
          labelVisible: true,
        },
      },
      autoSize: true,
    });

    Object.keys(dataSets).forEach((key, index) => {
      const isOverlay = overlayModes[key] || false;
      const priceScaleId = isOverlay ? `overlay-${index}` : undefined;

      const series = chart.addAreaSeries({
        topColor: dataSets[key].color || `hsl(${index * 60}, 100%, 50%)`,
        bottomColor: "rgba(0, 0, 0, 0.3)",
        lineWidth: 2,
        priceScaleId,
        lineColor: dataSets[key].color || `hsl(${index * 60}, 100%, 50%)`,
      });

      series.setData(
        dataSets[key].data.map((item) => ({
          time: item.time.split("T")[0],
          value: item.value,
        }))
      );

      if (isOverlay) {
        chart.priceScale(priceScaleId).applyOptions({
          position: "right",
          autoScale: true,
          borderColor: "#ffffff",
          textColor: "#ffffff",
          alignLabels: true,
          ticksVisible: true,
        });
      }

      seriesRefs.current[key] = series;
    });

    return () => {
      chart.remove();
    };
  }, [dataSets, overlayModes]);

  useEffect(() => {
    Object.keys(seriesRefs.current).forEach((key) => {
      const series = seriesRefs.current[key];
      if (series) {
        series.applyOptions({
          topColor:
            focusedKey === key
              ? dataSets[key].color || "rgba(255,255,255,0.9)"
              : "rgba(255,255,255,0.2)",
        
          lineWidth: focusedKey === key ? 4 : 1,
        });
      }
    });
  }, [focusedKey, dataSets]);

  const toggleOverlayMode = (key) => {
    setOverlayModes((prevModes) => {
      const newModes = Object.keys(prevModes).reduce((acc, currentKey) => {
        acc[currentKey] = true;
        return acc;
      }, {});
      newModes[key] = prevModes[key] === false; 
      return newModes;
    });
  };

  const handleFocus = (key) => {
    setFocusedKey((prevKey) => (prevKey === key ? null : key));
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#1c1c1c",
        boxShadow: "0px 4px 8px 0px rgba(0,0,0,0.3)",
        borderRadius: "8px",
      }}
    >
      <h3 style={{ marginBottom: "10px", color: "#E0E0E0" }}>
        Normalization Chart
      </h3>
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
        {Object.keys(dataSets).map((key, index) => (
         <button
         key={key}
         onClick={() => {
           toggleOverlayMode(key);
           handleFocus(key);
         }}
         style={{
           padding: "6px 16px",

           backgroundColor: overlayModes[key]
             ? dataSets[key].color || `hsl(${index * 60}, 100%, 50%)`
             : "#333",
           color: "#fff",
           border: "none",
           borderRadius: "4px",
           marginTop: "10px",
           cursor: "pointer",
           boxShadow: overlayModes[key]
             ?  "none"
             : `0 0 18px 5px ${dataSets[key].color || `hsl(${index * 60}, 100%, 50%)`}`, 
           transition: "all 0.5s ease", 
         }}
       >
         {key}
       </button>
        ))}
      </div>
    </div>
  );
};

NormalizationChart.propTypes = {
  dataSets: PropTypes.object.isRequired,
};

export default NormalizationChart;
