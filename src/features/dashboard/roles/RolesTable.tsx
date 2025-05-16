import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Role, mockRoles } from "./mockRoles";
import { RoleForm } from "./RoleForm";
import { toast } from "@/components/ui/use-toast";

export const RolesTable: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [editing, setEditing] = useState<Role | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleting, setDeleting] = useState<Role | null>(null);

  const handleCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleEdit = (role: Role) => {
    setEditing(role);
    setShowForm(true);
  };

  const handleDelete = (role: Role) => {
    setDeleting(role);
  };

  const confirmDelete = () => {
    if (deleting) {
      setRoles((prev) => prev.filter((r) => r.id !== deleting.id));
      toast({ title: "Rol eliminado correctamente" });
      setDeleting(null);
    }
  };

  const handleFormSubmit = (data: Omit<Role, "id">) => {
    if (editing) {
      setRoles((prev) =>
        prev.map((r) => (r.id === editing.id ? { ...editing, ...data } : r)),
      );
      toast({ title: "Rol actualizado correctamente" });
    } else {
      setRoles((prev) => [
        ...prev,
        { ...data, id: (Math.random() * 100000).toFixed(0) },
      ]);
      toast({ title: "Rol creado correctamente" });
    }
    setShowForm(false);
    setEditing(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Roles</h2>
        <Button onClick={handleCreate}>Nuevo Rol</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Permisos</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => (
            <TableRow key={role.id}>
              <TableCell>{role.name}</TableCell>
              <TableCell>{role.permissions.join(", ")}</TableCell>
              <TableCell>
                <Button size="sm" onClick={() => handleEdit(role)}>
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="ml-2"
                  onClick={() => handleDelete(role)}
                >
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={showForm} onOpenChange={setShowForm}>
        {showForm && (
          <RoleForm
            initialData={editing || undefined}
            onSubmit={handleFormSubmit}
            onCancel={() => setShowForm(false)}
          />
        )}
      </Dialog>
      <Dialog open={!!deleting} onOpenChange={() => setDeleting(null)}>
        {deleting && (
          <div className="p-6">
            <h3 className="text-lg font-bold mb-2">¿Eliminar rol?</h3>
            <p>
              ¿Estás seguro de que deseas eliminar el rol <b>{deleting.name}</b>
              ?
            </p>
            <div className="flex gap-2 justify-end mt-4">
              <Button variant="secondary" onClick={() => setDeleting(null)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Eliminar
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};
