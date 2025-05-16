import React, { useState } from "react";
import { Sale } from "./mockSales";

interface Props {
  initialData?: Sale;
  onSubmit: (data: Omit<Sale, "id">) => void;
  onCancel: () => void;
}

export const SaleForm: React.FC<Props> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [form, setForm] = useState<Omit<Sale, "id">>({
    cliente: initialData?.cliente || "",
    poliza: initialData?.poliza || "",
    monto: initialData?.monto || 0,
    fecha: initialData?.fecha || "",
    estado: initialData?.estado || "Pendiente",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "monto" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="cliente"
        value={form.cliente}
        onChange={handleChange}
        placeholder="Cliente"
        required
        className="input"
      />
      <input
        name="poliza"
        value={form.poliza}
        onChange={handleChange}
        placeholder="Póliza"
        required
        className="input"
      />
      <input
        name="monto"
        type="number"
        value={form.monto}
        onChange={handleChange}
        placeholder="Monto"
        required
        className="input"
      />
      <input
        name="fecha"
        type="date"
        value={form.fecha}
        onChange={handleChange}
        required
        className="input"
      />
      <select
        name="estado"
        value={form.estado}
        onChange={handleChange}
        className="input"
      >
        <option value="Pendiente">Pendiente</option>
        <option value="Pagada">Pagada</option>
        <option value="Cancelada">Cancelada</option>
      </select>
      <div className="flex gap-2">
        <button type="submit" className="btn btn-primary">
          Guardar
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
};
