import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { ScrollArea } from "./components/ui/scroll-area";
import { Button } from "./components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { CopyIcon, CheckIcon } from "lucide-react";
import "./App.css";

// Mock data based on the provided example
const mockRunData = {
  id: "run_123456",
  status: "completed",
  created_at: "2024-08-13T15:55:08.000Z",
  metadata: {
    total_tokens: 3500,
    prompt_tokens: 1200,
    completion_tokens: 2300,
    total_cost: 0.07,
  },
  chat_history: [
    {
      role: "system",
      content: "you are an expert summarizer",
    },
    {
      role: "user",
      content:
        "Here's a collection of tweets from the Twitter list 'Mentors 50k+':\n\nTweet by ItsKieranDrew (2024-08-13 15:55:08.000000Z):\nWhy?\n\nBecause social media is focused on cold outreach and content. Both are a low-leverage treadmill.\n\nEmail you're creating inbound. You can automate the emails too so that you can build 90% of your business to operate without you.\n\nSocial is good for attention. But please, email is the end game.\n 22, url: https://twitter.com/ItsKieranDrew/status/1823387823078085059\n\n[... truncated for brevity ...]",
    },
    {
      role: "user",
      content: "return me the top 50 tweets",
    },
    {
      role: "assistant",
      content:
        "Here are the top 50 tweets from the collection:\n\n1. **ItsKieranDrew**: Why? Because social media is focused on cold outreach and content. Email is the end game. [View Tweet](https://twitter.com/ItsKieranDrew/status/1823387823078085059)\n   \n2. **Codie_Sanchez**: The wealthy often benefit from how confusing finance and business is. But I believe we should get rich together. [View Tweet](https://twitter.com/Codie_Sanchez/status/1823389130048295070)\n\n[... truncated for brevity ...]",
    },
  ],
};

export default function App() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const lastAssistantMessage = mockRunData.chat_history
    .filter((msg) => msg.role === "assistant")
    .pop();

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Run Details</CardTitle>
          <CardDescription>ID: {mockRunData.id}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Status</p>
              <p className="text-lg">{mockRunData.status}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Created At</p>
              <p className="text-lg">
                {new Date(mockRunData.created_at).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Total Tokens</p>
              <p className="text-lg">{mockRunData.metadata.total_tokens}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Prompt Tokens</p>
              <p className="text-lg">{mockRunData.metadata.prompt_tokens}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Completion Tokens</p>
              <p className="text-lg">
                {mockRunData.metadata.completion_tokens}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Total Cost</p>
              <p className="text-lg">
                ${mockRunData.metadata.total_cost.toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="final-output">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="final-output">Final Output</TabsTrigger>
          <TabsTrigger value="chat-history">Chat History</TabsTrigger>
        </TabsList>
        <TabsContent value="final-output">
          <Card>
            <CardHeader>
              <CardTitle>Final Output</CardTitle>
              <CardDescription>Last assistant message</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                <pre className="whitespace-pre-wrap">
                  {lastAssistantMessage?.content}
                </pre>
              </ScrollArea>
              <Button
                className="mt-4"
                onClick={() =>
                  copyToClipboard(lastAssistantMessage?.content || "")
                }
              >
                {copied ? (
                  <CheckIcon className="mr-2 h-4 w-4" />
                ) : (
                  <CopyIcon className="mr-2 h-4 w-4" />
                )}
                {copied ? "Copied!" : "Copy to Clipboard"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="chat-history">
          <Card>
            <CardHeader>
              <CardTitle>Chat History</CardTitle>
              <CardDescription>Full conversation</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                {mockRunData.chat_history.map((message, index) => (
                  <div key={index} className="mb-4">
                    <p className="font-semibold capitalize">{message.role}:</p>
                    <pre className="whitespace-pre-wrap text-sm">
                      {message.content}
                    </pre>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
