import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Lazy / Safe initialization helper for Gemini
  const getAiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Google OAuth Client Config endpoint
  app.get("/api/auth/google/config", (req, res) => {
    const clientId =
      process.env.GOOGLE_CLIENT_ID ||
      process.env.VITE_GOOGLE_CLIENT_ID ||
      process.env.OAUTH_CLIENT_ID ||
      process.env.CLIENT_ID ||
      "";
    res.json({ clientId });
  });

  // AI Prompt -> Architecture Generator
  app.post("/api/ai/generate-architecture", async (req, res) => {
    try {
      const ai = getAiClient();
      if (!ai) {
        return res.status(400).json({
          error: "GEMINI_API_KEY environment variable is missing. Please configure it in Settings.",
        });
      }

      const { prompt } = req.body;
      if (!prompt || typeof prompt !== "string") {
        return res.status(400).json({ error: "Prompt string is required" });
      }

      const systemInstruction = `You are a Principal Cloud Architect expert in AWS, Azure, GCP, and OCI.
Convert the user's architectural request into a structured cloud diagram payload.
Supported cloud providers: "aws", "azure", "gcp", "oci".
Supported resource categories: "compute", "storage", "database", "networking", "security", "analytics", "ai".

Return a JSON object with:
1. "title": A descriptive title for the architecture diagram.
2. "provider": Primary cloud provider ("aws" | "azure" | "gcp" | "oci").
3. "description": A short executive overview of the design.
4. "containers": Array of logical boundaries (VPCs, VNets, VCNs, Subnets, Compartments, Resource Groups).
   Each container object:
   - "id": string (e.g. "c1")
   - "name": string (e.g. "VPC Public Subnet" or "Azure VNet Primary")
   - "provider": "aws" | "azure" | "gcp" | "oci"
   - "type": "vpc" | "subnet" | "resource_group" | "compartment"
   - "x": number (e.g. 100)
   - "y": number (e.g. 100)
   - "width": number (e.g. 600)
   - "height": number (e.g. 400)
5. "nodes": Array of resource node objects.
   Each node object:
   - "id": string (e.g. "n1")
   - "name": string (e.g. "App Load Balancer" or "App Server 1")
   - "provider": "aws" | "azure" | "gcp" | "oci"
   - "category": "compute" | "storage" | "database" | "networking" | "security" | "analytics" | "ai"
   - "iconKey": string (e.g. "alb", "ec2", "rds", "s3", "cloudfront", "vm", "aks", "blob", "cloud_run", "cloud_sql", "bigquery", "compute_instance", "autonomous_db", "vcn")
   - "resourceType": string (exact Terraform resource type like "aws_lb", "aws_instance", "aws_db_instance", "azurerm_linux_virtual_machine", "google_compute_instance", "oci_core_instance")
   - "containerId": string optional (matches container id)
   - "x": number position
   - "y": number position
   - "specs": object with sizing info like:
     - "instanceType": string (e.g., "t3.medium", "Standard_D2s_v3", "e2-standard-2", "VM.Standard2.1")
     - "count": number (default 1)
     - "storageGb": number (default 100)
     - "region": string (e.g., "us-east-1", "eastus", "us-central1", "us-ashburn-1")
6. "links": Array of connections between nodes.
   Each link object:
   - "id": string (e.g. "l1")
   - "from": string node id
   - "to": string node id
   - "label": string (e.g., "HTTP 80 / HTTPS 443", "SQL Connection", "Internal Peering")
   - "style": "solid" | "dashed"`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              provider: { type: Type.STRING },
              description: { type: Type.STRING },
              containers: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    provider: { type: Type.STRING },
                    type: { type: Type.STRING },
                    x: { type: Type.NUMBER },
                    y: { type: Type.NUMBER },
                    width: { type: Type.NUMBER },
                    height: { type: Type.NUMBER },
                  },
                  required: ["id", "name", "provider", "x", "y", "width", "height"],
                },
              },
              nodes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    provider: { type: Type.STRING },
                    category: { type: Type.STRING },
                    iconKey: { type: Type.STRING },
                    resourceType: { type: Type.STRING },
                    containerId: { type: Type.STRING },
                    x: { type: Type.NUMBER },
                    y: { type: Type.NUMBER },
                    specs: {
                      type: Type.OBJECT,
                      properties: {
                        instanceType: { type: Type.STRING },
                        count: { type: Type.NUMBER },
                        storageGb: { type: Type.NUMBER },
                        region: { type: Type.STRING },
                      },
                    },
                  },
                  required: ["id", "name", "provider", "category", "iconKey", "x", "y"],
                },
              },
              links: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    from: { type: Type.STRING },
                    to: { type: Type.STRING },
                    label: { type: Type.STRING },
                    style: { type: Type.STRING },
                  },
                  required: ["id", "from", "to"],
                },
              },
            },
            required: ["title", "provider", "description", "nodes", "links"],
          },
        },
      });

      const json = JSON.parse(response.text || "{}");
      res.json({ success: true, diagram: json });
    } catch (err: any) {
      console.error("AI Generation Error:", err);
      res.status(500).json({ error: err.message || "Failed to generate architecture" });
    }
  });

  // AI Architecture Security & Optimization Review
  app.post("/api/ai/review-architecture", async (req, res) => {
    try {
      const ai = getAiClient();
      if (!ai) {
        return res.status(400).json({
          error: "GEMINI_API_KEY environment variable is missing.",
        });
      }

      const { diagram } = req.body;
      if (!diagram) {
        return res.status(400).json({ error: "Diagram state is required" });
      }

      const systemInstruction = `You are a Senior Cloud Solutions Architect & Security Auditor.
Analyze the provided cloud architecture JSON. Provide a comprehensive audit report covering:
1. High Availability & Fault Tolerance rating (1-10) and evaluation.
2. Security & Compliance assessment (Public exposure, Encryption, IAM practices).
3. Cost Optimization recommendations.
4. Top 3 actionable improvement items.

Return JSON matching the schema.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: JSON.stringify(diagram),
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              haScore: { type: Type.NUMBER },
              securityScore: { type: Type.NUMBER },
              costScore: { type: Type.NUMBER },
              overallRating: { type: Type.STRING },
              summary: { type: Type.STRING },
              securityFindings: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              haRecommendations: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              costSavingsTips: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              suggestedAdditions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: [
              "haScore",
              "securityScore",
              "costScore",
              "overallRating",
              "summary",
              "securityFindings",
              "haRecommendations",
              "costSavingsTips",
            ],
          },
        },
      });

      const audit = JSON.parse(response.text || "{}");
      res.json({ success: true, audit });
    } catch (err: any) {
      console.error("AI Audit Error:", err);
      res.status(500).json({ error: err.message || "Failed to review architecture" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CloudCraft Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
