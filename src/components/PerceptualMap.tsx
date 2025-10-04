import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";

interface DataPoint {
  name: string;
  complexity: number;
  sweetness: number;
  type: "kuah" | "goreng";
}

interface PerceptualMapProps {
  data: DataPoint[];
}

const PerceptualMap = ({ data }: PerceptualMapProps) => {
  return (
    <div className="w-full">
      <h3 className="text-2xl font-bold mb-4 text-center">Perceptual Mapping</h3>
      <p className="text-center text-muted-foreground mb-6">
        Visualisasi kompleksitas rasa vs tingkat kemanisan
      </p>
      
      <ResponsiveContainer width="100%" height={500}>
        <ScatterChart margin={{ top: 30, right: 30, bottom: 60, left: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            type="number" 
            dataKey="complexity" 
            name="Complexity" 
            domain={[-5, 5]}
            ticks={[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]}
            label={{ value: 'Complexity', position: 'insideBottom', offset: -15, fill: "hsl(var(--foreground))", fontSize: 14 }}
            tick={{ fill: "hsl(var(--foreground))" }}
          />
          <YAxis 
            type="number" 
            dataKey="sweetness" 
            name="Sweetness" 
            domain={[-5, 5]}
            ticks={[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]}
            label={{ value: 'Sweetness', angle: -90, position: 'insideLeft', offset: -10, fill: "hsl(var(--foreground))", fontSize: 14 }}
            tick={{ fill: "hsl(var(--foreground))" }}
          />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-card p-3 border rounded-lg shadow-lg">
                    <p className="font-semibold">{data.name}</p>
                    <p className="text-sm">Complexity: {data.complexity}</p>
                    <p className="text-sm">Sweetness: {data.sweetness}</p>
                    <p className="text-sm capitalize">Type: {data.type}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend 
            verticalAlign="top" 
            height={36}
            wrapperStyle={{ paddingBottom: '20px' }}
          />
          <Scatter name="Kuah" data={data.filter(d => d.type === "kuah")} fill="hsl(var(--primary))">
            {data.filter(d => d.type === "kuah").map((entry, index) => (
              <Cell key={`kuah-${index}`} fill="hsl(var(--primary))" />
            ))}
          </Scatter>
          <Scatter name="Goreng" data={data.filter(d => d.type === "goreng")} fill="hsl(var(--secondary))">
            {data.filter(d => d.type === "goreng").map((entry, index) => (
              <Cell key={`goreng-${index}`} fill="hsl(var(--secondary))" />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerceptualMap;
