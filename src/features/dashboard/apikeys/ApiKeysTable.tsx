import React, { useState } from "react"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import { ApiKey, mockApiKeys } from "./mockApiKeys"
import { ApiKeyForm } from "./ApiKeyForm"
import { toast } from "@/components/ui/use-toast"

export const ApiKeysTable: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(mockApiKeys)
  const [editing, setEditing] = useState<ApiKey | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [deleting, setDeleting] = useState<ApiKey | null>(null)

  const handleCreate = () => {
    setEditing(null)
    setShowForm(true)
  }

  const handleEdit = (key: ApiKey) => {
    setEditing(key)
    setShowForm(true)
  }

  const handleDelete = (key: ApiKey) => {
    setDeleting(key)
  }

  const confirmDelete = () => {
    if (deleting) {
      setApiKeys((prev) => prev.filter((k) => k.id !== deleting.id))
      toast({ title: "Clave eliminada correctamente" })
      setDeleting(null)
    }
  }

  const handleFormSubmit = (data: Omit<ApiKey, "id" | "key" | "createdAt">) => {
    if (editing) {
      setApiKeys((prev) =>
        prev.map((k) =>
          k.id === editing.id ? { ...editing, ...data } : k
        )
      )
      toast({ title: "Clave actualizada correctamente" })
    } else {
      setApiKeys((prev) => [
        ...prev,
        {
          ...data,
          id: (Math.random() * 100000).toFixed(0),
          key: Math.random().toString(36).substring(2, 10),
          createdAt: new Date().toISOString().slice(0, 10),
        },
      ])
      toast({ title: "Clave generada correctamente" })
    }
    setShowForm(false)
    setEditing(null)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">API Keys</h2>
        <Button onClick={handleCreate}>Nueva Clave</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Clave</TableHead>
            <TableHead>Fecha de Creación</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {apiKeys.map((key) => (
            <TableRow key={key.id}>
              <TableCell>{key.name}</TableCell>
              <TableCell>
                <span className="font-mono">{key.key}</span>
              </TableCell>
              <TableCell>{key.createdAt}</TableCell>
              <TableCell>
                <span
                  className={
                    key.status === "Activo"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {key.status}
                </span>
              </TableCell>
              <TableCell>
                <Button size="sm" onClick={() => handleEdit(key)}>
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="ml-2"
                  onClick={() => handleDelete(key)}
                >
                  Revocar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={showForm} onOpenChange={setShowForm}>
        {showForm && (
          <ApiKeyForm
            initialData={editing || undefined}
            onSubmit={handleFormSubmit}
            onCancel={() => setShowForm(false)}
          />
        )}
      </Dialog>
      <Dialog open={!!deleting} onOpenChange={() => setDeleting(null)}>
        {deleting && (
          <div className="p-6">
            <h3 className="text-lg font-bold mb-2">
              ¿Revocar clave?
            </h3>
            <p>
              ¿Estás seguro de que deseas revocar la clave{" "}
              <b>{deleting.name}</b>?
            </p>
            <div className="flex gap-2 justify-end mt-4">
              <Button
                variant="secondary"
                onClick={() => setDeleting(null)}
              >
                Cancelar
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Revocar
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  )
} 