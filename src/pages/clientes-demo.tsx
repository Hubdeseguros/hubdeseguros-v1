
import React from "react";

// Mock de clientes demo
interface ClienteDemo {
  id: number;
  nombre: string;
  correo: string;
  fechaCreacion: Date | string;
  estado: string;
}

const clientesDemo: ClienteDemo[] = [
  {
    id: 1,
    nombre: "Juan Pérez",
    correo: "juan.perez@example.com",
    fechaCreacion: new Date("2024-01-10"),
    estado: "Activo",
  },
  {
    id: 2,
    nombre: "Ana López",
    correo: "ana.lopez@example.com",
    fechaCreacion: "2023-11-24",
    estado: "Inactivo",
  },
  {
    id: 3,
    nombre: "Carlos Gómez",
    correo: "carlos.gomez@example.com",
    fechaCreacion: new Date("2024-04-02"),
    estado: "Activo",
  },
];

const formatFecha = (fecha: Date | string) => {
  if (typeof fecha === "string") return fecha;
  if (fecha instanceof Date && !isNaN(fecha.getTime())) {
    return fecha.toLocaleDateString();
  }
  return "";
};

const ClientesDemoPage: React.FC = () => (
  <div className="p-6 max-w-3xl mx-auto">
    <h1 className="text-2xl font-bold mb-6">Clientes Demo</h1>
    <table className="min-w-full border border-gray-200 rounded shadow bg-white">
      <thead className="bg-gray-50">
        <tr>
          <th className="py-2 px-3 border-b text-left">ID</th>
          <th className="py-2 px-3 border-b text-left">Nombre</th>
          <th className="py-2 px-3 border-b text-left">Correo</th>
          <th className="py-2 px-3 border-b text-left">Fecha de creación</th>
          <th className="py-2 px-3 border-b text-left">Estado</th>
        </tr>
      </thead>
      <tbody>
        {clientesDemo.map((cli) => (
          <tr key={cli.id} className="hover:bg-gray-100">
            <td className="py-2 px-3 border-b">{cli.id}</td>
            <td className="py-2 px-3 border-b">{cli.nombre}</td>
            <td className="py-2 px-3 border-b">{cli.correo}</td>
            <td className="py-2 px-3 border-b">{formatFecha(cli.fechaCreacion)}</td>
            <td className="py-2 px-3 border-b">{cli.estado}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className="mt-4 text-gray-400 text-sm">
      Esta página es una demostración. Aquí puedes visualizar y adaptar la tabla con datos ficticios.
    </div>
  </div>
);

export default ClientesDemoPage;
