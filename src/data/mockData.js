// Classification options
export const classes = ["Class A", "Class B", "Class C", "Class D"];

// Latest projects data for /classifymaterials
export const latestProjectsData = [
  {
    projectNumber: "7048011111",
    projectName: "Sie Project 1",
    materials: [
      "A653KJDHAX9Q",
      "B91XK7QDH2LM",
      "C4Z8A9QWERTY",
      "D77MNBVCXZ12",
      "E8Q2L9KJHGF",
      "F0A9S8D7F6GH",
      "G6H5J4K3L2Q9",
      "H1Z9X8C7V6BN",
      "JQ8W7E6R5T4Y",
      "K9L8M7N6B5V",
      "LQ2W3E4R5T6Y",
      "M7N8B9V0C1XZ",
      "N5M4B3V2C1X9",
      "P0O9I8U7Y6T",
      "QW9E8R7T6Y5U",
      "R5T6Y7U8I9O",
      "S8D7F6G5H4J",
      "T6Y7U8I9O0P",
      "U9I8O7P6L5K",
      "V5B6N7M8Q9W",
      "WERTY9U8I7O",
      "X9C8V7B6N5M",
      "Y7T6R5E4W3Q",
      "Z1X2C3V4B5N",
      "A9S8D7F6G5H",
      "B4N5M6Q7W8E",
      "C7V6B5N4M3Q",
      "D8F7G6H5J4K",
      "E6R5T4Y3U2I",
      "F9G8H7J6K5L",
    ],
  },
  {
    projectNumber: "7048022222",
    projectName: "Sie Project 2",
    materials: [
      "A653KJDHAX9Q",
      "B91XK7QDH2LM",
      "C4Z8A9QWERTY",
      "D77MNBVCXZ12",
      "E8Q2L9KJHGF",
      "F0A9S8D7F6GH",
      "G6H5J4K3L2Q9",
      "H1Z9X8C7V6BN",
      "JQ8W7E6R5T4Y",
    ],
  },
  {
    projectNumber: "7048033333",
    projectName: "Abc Project",
    materials: ["A653KJDHAX9Q", "B91XK7QDH2LM", "C4Z8A9QWERTY"],
  },
  {
    projectNumber: "7048044444",
    projectName: "Def Project",
    materials: [
      "D1F2G3H4J5K6",
      "D2L3M4N5B6V7",
      "D3Q4W5E6R7T8",
      "D4Y9U8I7O6P5",
      "D5A6S7D8F9G0",
    ],
  },
  {
    projectNumber: "7048055555",
    projectName: "Sample Project 1",
    materials: [
      "S1P2L3M4N5B6",
      "S2V7C8X9Z0A1",
      "S3Q4W5E6R7T8",
      "S4Y9U8I7O6P5",
      "S5K6L7M8N9B0",
      "S6Q1W2E3R4T5",
    ],
  },
  {
    projectNumber: "7048066666",
    projectName: "Sample Project 2",
    materials: [
      "S2A1B2C3D4E5",
      "S2F6G7H8J9K0",
      "S2L1M2N3B4V5",
      "S2C6X7Z8Q9W0",
    ],
  },
  {
    projectNumber: "7048077777",
    projectName: "Test Project Alpha",
    materials: ["T1A2B3C4D5E6", "T2B3C4D5E6F7", "T3C4D5E6F7G8"],
  },
  {
    projectNumber: "7048088888",
    projectName: "Test Project Beta",
    materials: ["B1X2Y3Z4W5V6", "B2Y3Z4W5V6U7"],
  },
];

// Classified materials data for /viewclassifications (example for project 7048022222)
export const classifiedMaterialsDataOfProject = {
  7048022222: [
    {
      materialNumber: "A653KJDHAX9Q",
      classification: "Class D",
      classifiedBy: "John Doe",
      classificationDate: "10.09.2025 10:30:21",
    },
    {
      materialNumber: "B91XK7QDH2LM",
      classification: "Class C",
      classifiedBy: "John Doe",
      classificationDate: "10.09.2025 12:30:22",
    },
    {
      materialNumber: "C4Z8A9QWERTY",
      classification: "Class B",
      classifiedBy: "John Doe",
      classificationDate: "10.09.2025 12:30:24",
    },
    {
      materialNumber: "D77MNBVCXZ12",
      classification: "Class A",
      classifiedBy: "John Doe",
      classificationDate: "10.09.2025 12:30:25",
    },
    {
      materialNumber: "E8Q2L9KJHGF",
      classification: "Class A",
      classifiedBy: "John Doe",
      classificationDate: "10.09.2025 12:30:20",
    },
    {
      materialNumber: "F0A9S8D7F6GH",
      classification: "Class C",
      classifiedBy: "John Doe",
      classificationDate: "10.09.2025 10:30:20",
    },
    {
      materialNumber: "G6H5J4K3L2Q9",
      classification: "Class C",
      classifiedBy: "John Doe",
      classificationDate: "10.09.2025 12:32:20",
    },
    {
      materialNumber: "H1Z9X8C7V6BN",
      classification: "Class D",
      classifiedBy: "John Doe",
      classificationDate: "10.09.2025 12:31:20",
    },
    {
      materialNumber: "JQ8W7E6R5T4Y",
      classification: "Class D",
      classifiedBy: "John Doe",
      classificationDate: "10.09.2025 11:30:20",
    },
  ],
  7048011111: [
    {
      materialNumber: "A653KJDHAX9Q",
      classification: "Class A",
      classifiedBy: "Jane Smith",
      classificationDate: "15.09.2025 09:15:00",
    },
    {
      materialNumber: "B91XK7QDH2LM",
      classification: "Class B",
      classifiedBy: "Jane Smith",
      classificationDate: "15.09.2025 09:16:00",
    },
    {
      materialNumber: "C4Z8A9QWERTY",
      classification: "Class A",
      classifiedBy: "Jane Smith",
      classificationDate: "15.09.2025 09:17:00",
    },
  ],
};

// Search results for project selector - dynamically generated from latestProjectsData
export const foundProjectsOptionsAfterSearch = latestProjectsData.map((project) => ({
  projectNumber: project.projectNumber,
  projectName: project.projectName,
}));
