import { Card } from "@/components/ui/card";
import SensorReadings from "@/components/SensorReadings";
import SensorGraphs from "@/components/SensorGraphs";
import ExpenseChart from "@/components/ExpenseChart";

const Index = () => {
  return (
    <div className="min-h-screen p-8 bg-background">
      <h1 className="text-3xl font-bold text-primary mb-8">Sensor Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <SensorReadings />
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Flow Sensor History</h2>
          <SensorGraphs type="flow" />
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">temperature Sensor History</h2>
          <SensorGraphs type="temperature" />
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Monthly Expenses</h2>
        <ExpenseChart />
      </Card>
    </div>
  );
};

export default Index;