import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Activity, Droplet, Thermometer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const fetchLatestReadings = async () => {
  const response = await fetch('http://localhost:3001/api/latest-reading');
  if (!response.ok) {
    throw new Error('Failed to fetch sensor readings');
  }
  return response.json();
};

const SensorReadings = () => {
  const { toast } = useToast();
  const { data, isLoading } = useQuery({
    queryKey: ['latestReadings'],
    queryFn: fetchLatestReadings,
    refetchInterval: 5000,
    meta: {
      onError: () => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch sensor readings. Please check your database connection.",
        });
      }
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const readings = [
    {
      title: "Flow Rate",
      value: `${data?.flow_rate?.toFixed(2) || '0.00'} L/min`,
      icon: <Droplet className="h-6 w-6 text-blue-500" />,
    },
    {
      title: "Temperature",
      value: `${data?.temperature?.toFixed(2) || '0.00'} °C`,
      icon: <Thermometer className="h-6 w-6 text-red-500" />,
    },
    {
      title: "Last Updated",
      value: data?.timestamp ? new Date(data.timestamp).toLocaleTimeString() : '-',
      icon: <Activity className="h-6 w-6 text-purple-500" />,
    },
  ];

  return (
    <>
      {readings.map((reading, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-center space-x-4">
            {reading.icon}
            <div>
              <p className="text-sm text-muted-foreground">{reading.title}</p>
              <p className="text-2xl font-bold">{reading.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </>
  );
};

export default SensorReadings;