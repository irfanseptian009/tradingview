import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { createChart } from "lightweight-charts";

/**
 * Fungsi untuk menormalisasi data ke rentang 0 - 1
 * @param {Array} data 
 * @returns {Array} 
 */
const normalizeData = (data) => {
  if (data.length === 0) return data;

  const values = data.map(item => item.value);
  const min = Math.min(...values);
  const max = Math.max(...values);

  
  if (max === min) {
    return data.map(item => ({ ...item, value: 0.5 }));
  }

  return data.map(item => ({
    time: item.time.split("T")[0],
    value: (item.value - min) / (max - min),
  }));
};

const NormalizationChart = ({
  dataSets,
  title = "Normalization Chart",
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
      priceScale: {
        // Sumbu Y dari 0 hingga 1
        minValue: 0,
        maxValue: 1,
        borderColor: "#D1D4DC",
      },
      crosshair: {
        mode: 1, 
      },
    });

    // Tambahkan datasets 
    Object.keys(dataSets).forEach((key, index) => {
      const normalizedData = normalizeData(dataSets[key].data);

      const series = chart.addLineSeries({
        color: dataSets[key].color || `hsl(${index * 60}, 70%, 50%)`,
        lineWidth: 2,
      });

      series.setData(normalizedData);
      seriesRefs.current[key] = series;
    });

    // Mendengarkan event pergerakan crosshair
    chart.subscribeCrosshairMove((param) => {
      if (!param || !param.time || param.seriesPrices.size === 0) {
        setFocusedKey(null);
        return;
      }

      // Menentukan seri yang paling dekat dengan crosshair
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
    // Perbarui visibilitas seri berdasarkan fokus
    Object.keys(seriesRefs.current).forEach((key) => {
      seriesRefs.current[key].applyOptions({
        visible: !focusedKey || focusedKey === key, 
        lineWidth: focusedKey === key ? 3 : 2,
      });
    });
  }, [focusedKey]);

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: "0px 4px 8px 0px rgba(0,0,0,0.32)",
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

NormalizationChart.propTypes = {
  dataSets: PropTypes.object.isRequired,
  title: PropTypes.string,
};

export default NormalizationChart;
