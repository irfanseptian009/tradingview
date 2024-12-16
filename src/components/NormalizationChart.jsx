import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { createChart } from "lightweight-charts";

const NormalizationChart = ({ dataSets }) => {
  const chartRef = useRef(null);
  const seriesRefs = useRef({});
  const [focusedKey] = useState(null);
  const [overlayModes, setOverlayModes] = useState({});

  // Set the overlay mode initially 
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
        attributionLogo: null,
      },
      grid: {
        vertLines: {
          color: "#8585e0",
         
          
        },
        horzLines: {
          color: "#5d5dd5",
        },
      },

      crosshair: {
        mode: 1,
        vertLine: {
          color: "#4747d1", 
          width: 1,
        },

        horzLine: {
          color: "#ffffff", 
          labelBackgroundColor: "#ffffff", 
          labelFontColor: "#000000",          
          visible: true,
          labelVisible: true,


        },

      },autoSize: true,
      
    });

    // Add datasets as area series
    Object.keys(dataSets).forEach((key, index) => {
      const isOverlay = overlayModes[key] || false;
      const priceScaleId = isOverlay ? `overlay-${index}` : undefined;

      const series = chart.addAreaSeries({
        topColor: dataSets[key].color || `hsl(${index * 60}, 100%, 50%)`,
        bottomColor: "rgba(0, 0, 0, 0.3)",
        lineWidth: 2,
        priceScaleId,
        
        crosshairMarkerVisible: true, 
        lineColor: dataSets[key].color || `hsl(${index * 60}, 100%, 50%)`,
        crosshairMarkerRadius: 1,
        crosshairMarkerBackgroundColor: dataSets[key].color || `hsl(${index * 60}, 100%, 50%)`,
        crosshairMarkerBorderColor: dataSets[key].color || `hsl(${index * 60}, 100%, 50%)`,
       priceLineWidth: 1,
       baseLineColor: "#ffffff",
        
      });

      series.setData(
        dataSets[key].data.map((item) => ({
          time: item.time.split("T")[0], 
          value: item.value,


        }))
      );

      // Configure price scale for overlay mode
      if (isOverlay) {
        chart.priceScale(priceScaleId).applyOptions({
          position: "right",
          
          autoScale: true,
          topColor: dataSets[key].color || `hsl(${index * 60}, 100%, 50%)`,
          
          borderColor: "#ffffff",
          textColor: "#ffffff",
          alignLabels: true,
          ticksVisible: true,
          visible: true,
          minimumWidth: 1000,
          scaleMargins: { top: 0.40, bottom: 0.40 },
        });
      }

      seriesRefs.current[key] = series;
    });

    return () => {
      chart.remove();
    };
  }, [dataSets, overlayModes]);

  useEffect(() => {
    // Update the focused series when focusedKey changes
    if (focusedKey) {
      const series = seriesRefs.current[focusedKey];
      if (series) {
        series.applyOptions({
          topColor: dataSets[focusedKey].color || `hsl(${focusedKey * 60}, 100%, 50%)`,
          bottomColor: "rgba(0, 0, 0, 0.3)",
          lineWidth: 6,
          crosshairMarkerVisible: true,
          
        });
      }
    }
  }, [dataSets, focusedKey]);

  const toggleOverlayMode = (key) => {
    setOverlayModes((prev) => {
      const newOverlayModes = { ...prev };

      // If the dataset is in overlay mode
      if (newOverlayModes[key]) {
        delete newOverlayModes[key];
      } else {
        newOverlayModes[key] = true;
      }

      return newOverlayModes;
    });
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
      <h3 style={{ marginBottom: "10px", color: "#E0E0E0" }}>Normalization Chart</h3> 
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
            onClick={() => toggleOverlayMode(key)}
            style={{
              padding: "10px 20px",
              backgroundColor: overlayModes[key] ? "#7171da" : " #3333ff",
              color: overlayModes[key] ? "#000" : "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {overlayModes[key] ? `${key}` : `${key}`}
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
