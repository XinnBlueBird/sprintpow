import { NextRequest, NextResponse } from "next/server";

const MIMO_ENDPOINT = "https://token-plan-sgp.xiaomimimo.com/v1/chat/completions";
const MIMO_MODEL = "mimo-v2.5-pro";

interface RequestBody {
  backlog: string;
  capacity: {
    developers: number;
    sprintDays: number;
    hoursPerDay: number;
    velocityFactor: number;
  };
  capacityPoints: number;
}

function buildSystemPrompt(capacityPoints: number): string {
  return `You are an AI sprint planning assistant. Analyze the backlog items provided and return a structured JSON response.

INSTRUCTIONS:
1. Parse each backlog item / user story provided by the user.
2. Estimate story points for each item using Fibonacci scale: 1, 2, 3, 5, 8, 13, 21.
3. Identify dependencies between items (which items must be completed before others).
4. Flag potential blockers or risks for each item.
5. Based on the sprint capacity of ${capacityPoints} story points, suggest optimal sprint allocation.
6. Assign priority levels: low, medium, high, critical.

OUTPUT FORMAT:
You MUST output a single JSON object with this exact structure:
{
  "tasks": [
    {
      "id": "task-1",
      "name": "Task name",
      "description": "Brief description",
      "storyPoints": 5,
      "priority": "high",
      "status": "sprint",
      "dependencies": ["task-2"],
      "blockers": ["Requires API access"]
    }
  ],
  "totalStoryPoints": 20,
  "sprintCapacity": ${capacityPoints},
  "overCapacity": false,
  "warnings": ["Warning about any risks"],
  "recommendations": ["Optimization suggestions"],
  "dependencies": [
    {"from": "task-1", "to": "task-2", "type": "blocks"}
  ]
}

Rules for status assignment:
- If the task fits within the sprint capacity and has no blocking dependencies, assign "sprint"
- If the task cannot fit or has unresolved dependencies, assign "backlog"
- Always try to fill the sprint up to capacity

Output ONLY the JSON object. No additional text before or after.`;
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.MIMO_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "MIMO_API_KEY is not configured" },
      { status: 500 }
    );
  }

  let body: RequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { backlog, capacityPoints } = body;

  if (!backlog || typeof backlog !== "string") {
    return NextResponse.json({ error: "Missing backlog text" }, { status: 400 });
  }

  const systemPrompt = buildSystemPrompt(capacityPoints);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      try {
        const mimoResponse = await fetch(MIMO_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key": apiKey,
          },
          body: JSON.stringify({
            model: MIMO_MODEL,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: backlog },
            ],
            stream: true,
            temperature: 0.3,
            max_tokens: 8192,
          }),
        });

        if (!mimoResponse.ok) {
          const errText = await mimoResponse.text();
          send({ type: "error", text: `MiMo API error (${mimoResponse.status}): ${errText}` });
          controller.close();
          return;
        }

        const reader = mimoResponse.body?.getReader();
        if (!reader) {
          send({ type: "error", text: "No response stream from MiMo" });
          controller.close();
          return;
        }

        const decoder = new TextDecoder();
        let buffer = "";
        let totalContent = "";
        let totalReasoning = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data: ")) continue;
            const data = trimmed.slice(6);
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta;
              if (!delta) continue;

              // CRITICAL: reasoning_content is the primary field
              if (delta.reasoning_content) {
                totalReasoning += delta.reasoning_content;
                send({ type: "thinking", text: delta.reasoning_content });
              }

              // content may be empty/null but check anyway
              if (delta.content) {
                totalContent += delta.content;
                send({ type: "content", text: delta.content });
              }
            } catch {
              // skip unparseable SSE lines
            }
          }
        }

        // If we got reasoning but no content, the reasoning IS the analysis
        if (totalReasoning && !totalContent) {
          send({ type: "content", text: totalReasoning });
        }

        send({ type: "done", text: "" });
      } catch (err) {
        send({
          type: "error",
          text: err instanceof Error ? err.message : "Unknown streaming error",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
