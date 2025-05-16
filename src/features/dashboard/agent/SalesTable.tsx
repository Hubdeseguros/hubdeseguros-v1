import React, { useState } from "react";
import { Sale, mockSales as initialSales } from "./mockSales";
import { SaleForm } from "./SaleForm";

export const SalesTable: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>(initialSales);
  const [editing, setEditing] = useState<Sale | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleEdit = (sale: Sale) => {
    setEditing(sale);
    setShowForm(true);
  };

  const handleDelete = (sale: Sale) => {
    if (window.confirm("¿Eliminar venta?")) {
      setSales(sales.filter((s) => s.id !== sale.id));
    }
  };

  const handleFormSubmit = (data: Omit<Sale, "id">) => {
    if (editing) {
      setSales(
        sales.map((s) => (s.id === editing.id ? { ...editing, ...data } : s)),
      );
    } else {
      setSales([...sales, { ...data, id: Date.now() }]);
    }
    setShowForm(false);
    setEditing(null);
  };

  return (
    <div>
      <div className="flex justify-between mb-2">
        <h2 className="text-xl font-bold">Ventas</h2>
        <button className="btn btn-primary" onClick={handleCreate}>
          Nueva Venta
        </button>
      </div>
      {showForm && (
        <SaleForm
          initialData={editing || undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      )}
      <table className="table-auto w-full mt-4">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Póliza</th>
            <th>Monto</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <tr key={sale.id}>
              <td>{sale.cliente}</td>
              <td>{sale.poliza}</td>
              <td>${sale.monto}</td>
              <td>{sale.fecha}</td>
              <td>{sale.estado}</td>
              <td>
                <button
                  className="btn btn-sm btn-secondary mr-2"
                  onClick={() => handleEdit(sale)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(sale)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
