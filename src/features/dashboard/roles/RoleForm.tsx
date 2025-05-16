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
import { Role, allPermissions } from "./mockRoles";

type RoleFormProps = {
  initialData?: Role;
  onSubmit: (data: Omit<Role, "id">) => void;
  onCancel: () => void;
};

export const RoleForm: React.FC<RoleFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const form = useForm<Omit<Role, "id">>({
    defaultValues: initialData || { name: "", permissions: [] },
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
              <FormLabel>Nombre del Rol</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="permissions"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Permisos</FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-2">
                  {allPermissions.map((perm) => (
                    <label key={perm} className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        value={perm}
                        checked={field.value.includes(perm)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            field.onChange([...field.value, perm]);
                          } else {
                            field.onChange(
                              field.value.filter((p: string) => p !== perm),
                            );
                          }
                        }}
                      />
                      {perm}
                    </label>
                  ))}
                </div>
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
