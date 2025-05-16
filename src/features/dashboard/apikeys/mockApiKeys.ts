export type ApiKey = {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  status: "Activo" | "Inactivo";
};

export const mockApiKeys: ApiKey[] = [
  {
    id: "1",
    name: "Integración CRM",
    key: "abc123",
    createdAt: "2024-06-01",
    status: "Activo",
  },
  {
    id: "2",
    name: "Webhook",
    key: "def456",
    createdAt: "2024-06-02",
    status: "Inactivo",
  },
];
