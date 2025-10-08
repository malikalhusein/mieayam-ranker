import { PolarAngleAxis, PolarGrid, Radar, RadarChart as RechartsRadarChart, ResponsiveContainer, Legend } from "recharts";

interface RadarChartProps {
  data: {
    kuah: number;
    mie: number;
    ayam: number;
    fasilitas: number;
  };
  size?: "small" | "large";
}

const RadarChart = ({ data, size = "large" }: RadarChartProps) => {
  const chartData = [
    { subject: "kuah", value: data.kuah, icon: "🍜" },
    { subject: "mie", value: data.mie, icon: "🍝" },
    { subject: "ayam", value: data.ayam, icon: "🍗" },
    { subject: "fasilitas", value: data.fasilitas, icon: "🏠" },
  ];

  const height = size === "small" ? 150 : 400;

  const CustomTick = ({ payload, x, y, textAnchor }: any) => {
    return (
      <text 
        x={x} 
        y={y} 
        textAnchor={textAnchor} 
        fill="hsl(var(--foreground))" 
        fontSize={size === "small" ? 16 : 20}
      >
        {payload.value === "kuah" && "🍜"}
        {payload.value === "mie" && "🍝"}
        {payload.value === "ayam" && "🍗"}
        {payload.value === "fasilitas" && "🏠"}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsRadarChart data={chartData}>
        <PolarGrid stroke="hsl(var(--border))" />
        <PolarAngleAxis 
          dataKey="subject" 
          tick={<CustomTick />}
        />
        <Radar
          name="Skor"
          dataKey="value"
          stroke="hsl(var(--primary))"
          fill="hsl(var(--primary))"
          fillOpacity={0.5}
        />
        {size === "large" && <Legend />}
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
};

export default RadarChart;
