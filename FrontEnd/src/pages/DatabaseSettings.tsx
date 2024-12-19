import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";

const DatabaseSettings = () => {
  const [connectionString, setConnectionString] = useState("../../data/sensor.db");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (connectionString.trim()) {
      // Store SQLite database path
      localStorage.setItem("dbPath", connectionString);
      toast({
        title: "Success",
        description: "SQLite database path saved",
      });
      navigate("/dashboard");
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid database path",
      });
    }
  };

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-2xl mx-auto">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-6">Database Settings</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="connectionString">Database Path</Label>
              <Input
                id="connectionString"
                placeholder="/path/to/your/database.sqlite"
                value={connectionString}
                onChange={(e) => setConnectionString(e.target.value)}
                className="font-mono"
              />
              <p className="text-sm text-muted-foreground">
                Enter the path to your SQLite database file
              </p>
            </div>
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </Button>
              <Button type="submit">Save Connection</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default DatabaseSettings;