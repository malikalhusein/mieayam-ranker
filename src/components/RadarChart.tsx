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
    { subject: "Kuah", value: data.kuah },
    { subject: "Mie", value: data.mie },
    { subject: "Ayam", value: data.ayam },
    { subject: "Fasilitas", value: data.fasilitas },
  ];

  const height = size === "small" ? 200 : 400;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsRadarChart data={chartData}>
        <PolarGrid stroke="hsl(var(--border))" />
        <PolarAngleAxis 
          dataKey="subject" 
          tick={{ fill: "hsl(var(--foreground))", fontSize: size === "small" ? 12 : 14 }}
        />
        <Radar
          name="Skor"
          dataKey="value"
          stroke="hsl(var(--primary))"
          fill="hsl(var(--primary))"
          fillOpacity={0.6}
        />
        {size === "large" && <Legend />}
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
};

export default RadarChart;
