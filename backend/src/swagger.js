// src/swagger.js
import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "EV Charging Station API",
      version: "1.0.0",
      description: "API documentation for EV Charging project",
    },
    servers: [{ url: "http://localhost:5000" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

// ---- Extend Swagger paths ----
swaggerSpec.paths = {
  ...swaggerSpec.paths,

  // ---------------- STATIONS ----------------
  "/stations": {
    get: {
      summary: "Get all stations with slot availability",
      tags: ["Stations"],
      responses: { 200: { description: "List of stations" } },
    },
    post: {
      summary: "Add a new station (Admin only)",
      tags: ["Stations"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            example: {
              name: "New Station",
              location: "MG Road",
              latitude: 12.97,
              longitude: 77.59,
              totalSlots: 5,
            },
          },
        },
      },
      responses: { 201: { description: "Station created" } },
    },
  },

  "/stations/{id}": {
    get: {
      summary: "Get a station by ID",
      tags: ["Stations"],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      responses: { 200: { description: "Station details" }, 404: { description: "Not found" } },
    },
    patch: {
      summary: "Update station (Admin only)",
      tags: ["Stations"],
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      requestBody: {
        content: { "application/json": { example: { name: "Updated Station", totalSlots: 8 } } },
      },
      responses: { 200: { description: "Station updated" } },
    },
    delete: {
      summary: "Delete station (Admin only)",
      tags: ["Stations"],
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      responses: { 200: { description: "Station deleted" } },
    },
  },

  "/stations/{id}/slots": {
    get: {
      summary: "Get slots of a station",
      tags: ["Stations"],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      responses: { 200: { description: "List of slots for the station" } },
    },
  },

  "/stations/nearest": {
    get: {
      summary: "Smart recommendation: nearest stations with ETA, traffic, load & AI prediction",
      tags: ["Stations"],
      parameters: [
        { name: "lat", in: "query", required: true, schema: { type: "number" }, description: "User latitude" },
        { name: "lng", in: "query", required: true, schema: { type: "number" }, description: "User longitude" },
        { name: "urgent", in: "query", required: false, schema: { type: "boolean" }, description: "Prioritize fastest ETA (for emergency cases)" },
      ],
      responses: {
        200: {
          description: "Recommended stations with smart AI-enhanced scoring",
          content: {
            "application/json": {
              example: {
                urgentMode: true,
                recommendations: [
                  {
                    id: 1,
                    name: "Tech Park Hub",
                    latitude: 12.91,
                    longitude: 77.65,
                    availableSlots: 2,
                    etaMinutes: 12,
                    distanceKm: "5.40",
                    loadFactor: "0.40",
                    predictedAvailability: 0.75, // 🔮 ML prediction
                    score: 15.6,
                  },
                  {
                    id: 2,
                    name: "Airport Hub",
                    latitude: 12.95,
                    longitude: 77.70,
                    availableSlots: 1,
                    etaMinutes: 18,
                    distanceKm: "8.10",
                    loadFactor: "0.70",
                    predictedAvailability: 0.30,
                    score: 25.8,
                  },
                ],
              },
            },
          },
        },
        400: { description: "Missing coordinates" },
        500: { description: "Failed to recommend stations" },
      },
    },
  },

  "/stations/recommend": {
    get: {
      summary: "Get one best recommended station (AI + ETA + Load balance)",
      tags: ["Stations"],
      parameters: [
        { name: "lat", in: "query", required: true, schema: { type: "number" } },
        { name: "lng", in: "query", required: true, schema: { type: "number" } },
        { name: "urgent", in: "query", required: false, schema: { type: "boolean" } },
      ],
      responses: {
        200: {
          description: "Best single station recommendation",
          content: {
            "application/json": {
              example: {
                urgentMode: false,
                recommended: {
                  id: 1,
                  name: "Tech Park Hub",
                  latitude: 12.91,
                  longitude: 77.65,
                  availableSlots: 3,
                  etaMinutes: 10,
                  distanceKm: "4.90",
                  loadFactor: "0.35",
                  predictedAvailability: 0.82, // 🔮 predicted free slots probability
                  score: 12.4,
                },
              },
            },
          },
        },
      },
    },
  },

  // ---------------- ETA ----------------
  "/eta": {
    get: {
      summary: "Get real-time ETA between two points",
      tags: ["ETA"],
      parameters: [
        { name: "fromLat", in: "query", required: true, schema: { type: "number" } },
        { name: "fromLng", in: "query", required: true, schema: { type: "number" } },
        { name: "toLat", in: "query", required: true, schema: { type: "number" } },
        { name: "toLng", in: "query", required: true, schema: { type: "number" } },
      ],
      responses: {
        200: {
          description: "ETA result",
          content: { "application/json": { example: { etaMinutes: 12, distanceKm: "5.6" } } },
        },
        400: { description: "Missing coordinates" },
        500: { description: "Failed to calculate ETA" },
      },
    },
  },
};

export default swaggerSpec;
