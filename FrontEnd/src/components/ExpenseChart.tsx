import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useToast } from "@/hooks/use-toast";

const fetchExpenseData = async () => {
  const response = await fetch('http://localhost:3001/api/monthly-expenses');
  if (!response.ok) {
    throw new Error('Failed to fetch expense data');
  }
  return response.json();
};

const ExpenseChart = () => {
  const { toast } = useToast();
  const { data, isLoading } = useQuery({
    queryKey: ['expenses'],
    queryFn: fetchExpenseData,
    refetchInterval: 5000, // Refresh hourly
    meta: {
      onError: () => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch expense data. Please check your connection.",
        });
      }
    }
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip 
            formatter={(value: number) => [`€${value}`, 'Cost']}
          />
          <Bar dataKey="cost" name="Monthly Cost" fill="#1d4ed8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseChart;