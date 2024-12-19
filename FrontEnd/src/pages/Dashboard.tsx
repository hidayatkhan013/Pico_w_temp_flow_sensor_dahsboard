import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import SensorReadings from "@/components/SensorReadings";
import SensorGraphs from "@/components/SensorGraphs";
import ExpenseChart from "@/components/ExpenseChart";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
          <div className="space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate("/database-settings")}
            >
              Database Settings
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/")}
            >
              Logout
            </Button>
          </div>
        </div>
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
    </div>
  );
};

export default Dashboard;