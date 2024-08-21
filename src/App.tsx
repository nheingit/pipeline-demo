import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Button } from "./components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Textarea } from "./components/ui/textarea";
import RunDashboard from "./RunDashboard";
import "./App.css";

type Pipeline = {
  id: string;
  created_at: string;
  updated_at: string;
  pipeline_name: string;
  data_fetch_end_time: string;
  data_fetch_duration_hours: number;
  fetch_count_limit: number | null;
  list_id: number;
  models: string[];
  messages: string[];
  system_prompt: string;
  overrides: Record<string, any> | null;
};

type Run = {
  run_id: string;
  oban_job_id: number | null;
  run_status: string | null;
  result: Record<string, any> | null;
  created_at: string;
  updated_at: string;
};

// Mock data
const mockPipelines: Pipeline[] = [
  {
    id: "1",
    created_at: "2023-07-01T00:00:00Z",
    updated_at: "2023-07-01T00:00:00Z",
    pipeline_name: "Tech News",
    data_fetch_end_time: "2023-07-02T00:00:00Z",
    data_fetch_duration_hours: 24,
    fetch_count_limit: 1000,
    list_id: 1234,
    models: ["gpt-3.5-turbo"],
    messages: ["Summarize the latest tech news"],
    system_prompt: "You are a tech news summarizer",
    overrides: null,
  },
];

const mockRuns: Run[] = [
  {
    run_id: "1",
    oban_job_id: 5678,
    run_status: "completed",
    result: { summary: "Tech news summary..." },
    created_at: "2023-07-01T12:00:00Z",
    updated_at: "2023-07-01T12:30:00Z",
  },
];

export default function Component() {
  const [pipelines, setPipelines] = useState<Pipeline[]>(mockPipelines);
  const [runs, setRuns] = useState<Run[]>(mockRuns);
  const [selectedPipelineId, setSelectedPipelineId] = useState<string>("");

  const [newPipeline, setNewPipeline] = useState<
    Omit<Pipeline, "id" | "created_at" | "updated_at">
  >({
    pipeline_name: "",
    data_fetch_end_time: "",
    data_fetch_duration_hours: 24,
    fetch_count_limit: null,
    list_id: 0,
    models: [],
    messages: [],
    system_prompt: "",
    overrides: null,
  });

  const handleCreatePipeline = () => {
    const pipeline: Pipeline = {
      ...newPipeline,
      id: (pipelines.length + 1).toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setPipelines([...pipelines, pipeline]);
    setNewPipeline({
      pipeline_name: "",
      data_fetch_end_time: "",
      data_fetch_duration_hours: 24,
      fetch_count_limit: null,
      list_id: 0,
      models: [],
      messages: [],
      system_prompt: "",
      overrides: null,
    });
  };

  const handleCreateRun = () => {
    if (selectedPipelineId) {
      const newRun: Run = {
        run_id: (runs.length + 1).toString(),
        oban_job_id: null,
        run_status: "queued",
        result: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setRuns([...runs, newRun]);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="create-pipeline">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="create-pipeline">Create Pipeline</TabsTrigger>
          <TabsTrigger value="create-run">Create Run</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="schedules">Schedules</TabsTrigger>
        </TabsList>
        <TabsContent value="create-pipeline">
          <Card>
            <CardHeader>
              <CardTitle>Create New Pipeline</CardTitle>
              <CardDescription>
                Set up a new pipeline for Twitter list scraping and
                summarization.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pipeline-name">Pipeline Name</Label>
                <Input
                  id="pipeline-name"
                  value={newPipeline.pipeline_name}
                  onChange={(e) =>
                    setNewPipeline({
                      ...newPipeline,
                      pipeline_name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="data-fetch-end-time">Data Fetch End Time</Label>
                <Input
                  id="data-fetch-end-time"
                  type="datetime-local"
                  value={newPipeline.data_fetch_end_time}
                  onChange={(e) =>
                    setNewPipeline({
                      ...newPipeline,
                      data_fetch_end_time: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="data-fetch-duration">
                  Data Fetch Duration (hours)
                </Label>
                <Input
                  id="data-fetch-duration"
                  type="number"
                  value={newPipeline.data_fetch_duration_hours}
                  onChange={(e) =>
                    setNewPipeline({
                      ...newPipeline,
                      data_fetch_duration_hours: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fetch-count-limit">Fetch Count Limit</Label>
                <Input
                  id="fetch-count-limit"
                  type="number"
                  value={newPipeline.fetch_count_limit || ""}
                  onChange={(e) =>
                    setNewPipeline({
                      ...newPipeline,
                      fetch_count_limit: e.target.value
                        ? parseInt(e.target.value)
                        : null,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="list-id">Twitter List ID</Label>
                <Input
                  id="list-id"
                  type="number"
                  value={newPipeline.list_id}
                  onChange={(e) =>
                    setNewPipeline({
                      ...newPipeline,
                      list_id: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="models">Models (comma-separated)</Label>
                <Input
                  id="models"
                  value={newPipeline.models.join(",")}
                  onChange={(e) =>
                    setNewPipeline({
                      ...newPipeline,
                      models: e.target.value.split(","),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="messages">Messages (comma-separated)</Label>
                <Input
                  id="messages"
                  value={newPipeline.messages.join(",")}
                  onChange={(e) =>
                    setNewPipeline({
                      ...newPipeline,
                      messages: e.target.value.split(","),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="system-prompt">System Prompt</Label>
                <Textarea
                  id="system-prompt"
                  value={newPipeline.system_prompt}
                  onChange={(e) =>
                    setNewPipeline({
                      ...newPipeline,
                      system_prompt: e.target.value,
                    })
                  }
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleCreatePipeline}>Create Pipeline</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="create-run">
          <Card>
            <CardHeader>
              <CardTitle>Create New Run</CardTitle>
              <CardDescription>
                Start a new run based on an existing pipeline.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pipeline-select">Select Pipeline</Label>
                <Select onValueChange={setSelectedPipelineId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a pipeline" />
                  </SelectTrigger>
                  <SelectContent>
                    {pipelines.map((pipeline) => (
                      <SelectItem key={pipeline.id} value={pipeline.id}>
                        {pipeline.pipeline_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleCreateRun} disabled={!selectedPipelineId}>
                Start Run
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="dashboard">
          <RunDashboard />
        </TabsContent>
        <TabsContent value="schedules">
          <Card>
            <CardHeader>
              <CardTitle>Pipeline Schedules</CardTitle>
              <CardDescription>
                Manage schedules for your pipelines.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Schedule management functionality to be implemented.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
