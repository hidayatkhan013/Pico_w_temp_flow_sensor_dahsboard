import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface SensorGraphsProps {
  type: "flow" | "temperature";
}

const fetchSensorHistory = async (type: string) => {
  const response = await fetch(`http://localhost:3001/api/sensor-history/${type}`);
  if (!response.ok) {
    throw new Error('Failed to fetch sensor history');
  }
  return response.json();
};

const SensorGraphs = ({ type }: SensorGraphsProps) => {
  const { toast } = useToast();
  const { data, isLoading } = useQuery({
    queryKey: ['sensorHistory', type],
    queryFn: () => fetchSensorHistory(type),
    refetchInterval: 1000, // Refresh every 5 seconds
    meta: {
      onError: () => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch sensor history. Please check your connection.",
        });
      }
    }
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            tickFormatter={(time) => format(new Date(time), "HH:mm")}
          />
          <YAxis />
          <Tooltip
            labelFormatter={(label) => format(new Date(label), "HH:mm")}
            formatter={(value: number) => [
              `${value.toFixed(2)} ${type === "flow" ? "L/min" : "°C"}`,
              type === "flow" ? "Flow Rate" : "Temperature",
            ]}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={type === "flow" ? "#1d4ed8" : "#059669"}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SensorGraphs;