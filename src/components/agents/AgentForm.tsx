import React, { useState } from "react";
import { AgentFormData } from "@/features/agents/types";

interface Props {
  initialData?: AgentFormData;
  onSubmit: (data: AgentFormData) => void;
  loading?: boolean;
}

const AgentForm: React.FC<Props> = ({ initialData, onSubmit, loading }) => {
  const [form, setForm] = useState<AgentFormData>(
    initialData || {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      license_number: "",
      status: "ACTIVE",
    },
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Nombre</label>
        <input
          name="first_name"
          value={form.first_name}
          onChange={handleChange}
          className="input"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Apellido</label>
        <input
          name="last_name"
          value={form.last_name}
          onChange={handleChange}
          className="input"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className="input"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Teléfono</label>
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="input"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Licencia</label>
        <input
          name="license_number"
          value={form.license_number}
          onChange={handleChange}
          className="input"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Estado</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="input"
        >
          <option value="ACTIVE">Activo</option>
          <option value="INACTIVE">Inactivo</option>
          <option value="PENDING">Pendiente</option>
        </select>
      </div>
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
};

export default AgentForm;
