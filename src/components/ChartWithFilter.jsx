import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { createChart } from "lightweight-charts";

const ChartWithOverlayPriceScale = ({
  dataSets,
  title = "Chart with Overlay Price Scales",
}) => {
  const chartRef = useRef(null);
  const seriesRefs = useRef({});
  const [focusedKey, setFocusedKey] = useState(null); // Key of the focused series

  useEffect(() => {
    const chart = createChart(chartRef.current, {
      width: 700,
      height: 300,
      layout: {
        backgroundColor: "#FFFFFF",
        textColor: "#000000",
      },
      grid: {
        vertLines: { color: "#e1e1e1" },
        horzLines: { color: "#e1e1e1" },
      },
      timeScale: { timeVisible: true, secondsVisible: false },
      crosshair: {
        mode: 1, // Crosshair displays values of all series
      },
    });

    // Add datasets as line series
    Object.keys(dataSets).forEach((key, index) => {
      const series = chart.addLineSeries({
        color: dataSets[key].color || `hsl(${index * 60}, 70%, 50%)`,
        lineWidth: 2,
      });

      series.setData(
        dataSets[key].data.map((item) => ({
          time: item.time.split("T")[0],
          value: item.value,
        }))
      );

      seriesRefs.current[key] = series;
    });

    // Listen for crosshair move event
    chart.subscribeCrosshairMove((param) => {
      if (!param || !param.time || param.seriesPrices.size === 0) {
        setFocusedKey(null); // Reset focus if outside data range
        return;
      }

      // Determine which series is closest to the crosshair
      const closestSeriesKey = Object.keys(seriesRefs.current).find((key) =>
        param.seriesPrices.has(seriesRefs.current[key])
      );

      setFocusedKey(closestSeriesKey || null);
    });

    return () => {
      chart.remove();
    };
  }, [dataSets]);

  useEffect(() => {
    // Update series visibility based on focus
    Object.keys(seriesRefs.current).forEach((key) => {
      seriesRefs.current[key].applyOptions({
        visible: !focusedKey || focusedKey === key, // Show only focused series, or all if none is focused
        lineWidth: focusedKey === key ? 3 : 2, // Highlight focused series with thicker line
      });
    });
  }, [focusedKey]);

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f9f9f9",
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

ChartWithOverlayPriceScale.propTypes = {
  dataSets: PropTypes.object.isRequired,
  title: PropTypes.string,
};

export default ChartWithOverlayPriceScale;
