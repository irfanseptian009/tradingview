import  { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

const Chart = () => {
  const chartContainerRef = useRef(null);

  useEffect(() => {
    // Buat chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 100,
      layout: {
        backgroundColor: "#ffffff",
        textColor: "#000000",
      },
      grid: {
        vertLines: { color: "#e1e1e1" },
        horzLines: { color: "#e1e1e1" },
      },
      crosshair: {
        mode: 2,
      },
    });

    // Tambahkan data ke chart
    const lineSeries = chart.addLineSeries();
    lineSeries.setData([
      { time: "2023-12-01", value: 45 },
      { time: "2023-12-02", value: 46 },
      { time: "2023-12-03", value: 47 },
      { time: "2023-12-04", value: 44 },
      { time: "2023-12-06", value: 45 },
      { time: "2023-12-07", value: 46 },
      { time: "2023-12-08", value: 47 },
      { time: "2023-12-09", value: 44 },
    ]);

    // Cleanup saat komponen dilepas
    return () => {
      chart.remove();
    };
  }, []);

  return <div ref={chartContainerRef} style={{ position: "relative" }} />;
};

export default Chart;
