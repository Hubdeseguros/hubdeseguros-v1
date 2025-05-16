import React from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ApiKey } from "./mockApiKeys";

type ApiKeyFormProps = {
  initialData?: ApiKey;
  onSubmit: (data: Omit<ApiKey, "id" | "key" | "createdAt">) => void;
  onCancel: () => void;
};

export const ApiKeyForm: React.FC<ApiKeyFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const form = useForm<Omit<ApiKey, "id" | "key" | "createdAt">>({
    defaultValues: initialData || { name: "", status: "Activo" },
  });

  const handleSubmit = form.handleSubmit((data) => onSubmit(data));

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          name="name"
          control={form.control}
          rules={{ required: "El nombre es obligatorio" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="status"
          control={form.control}
          rules={{ required: "El estado es obligatorio" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <FormControl>
                <select {...field} className="rounded-md border shadow-sm">
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Guardar</Button>
        </div>
      </form>
    </Form>
  );
};
