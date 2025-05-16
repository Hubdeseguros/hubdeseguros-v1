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
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { usePolicies, Policy } from "./usePolicies";

type PolicyFormProps = {
  initialData?: Policy;
  onSubmit: (data: Omit<Policy, "id">) => void;
  onCancel: () => void;
};

export const PolicyForm: React.FC<PolicyFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const { addPolicy, updatePolicy, error } = usePolicies();
  const form = useForm<Omit<Policy, "id">>({
    defaultValues: initialData || {
      number: "",
      client: "",
      type: "",
      status: "Activa",
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    if (initialData) {
      await updatePolicy(initialData.id, data);
    } else {
      await addPolicy(data);
    }
    onSubmit(data);
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          name="number"
          control={form.control}
          rules={{ required: "El número de póliza es obligatorio" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de Póliza</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="client"
          control={form.control}
          rules={{ required: "El cliente es obligatorio" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cliente</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="type"
          control={form.control}
          rules={{ required: "El tipo de póliza es obligatorio" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Póliza</FormLabel>
              <FormControl>
                <Select {...field}>
                  <option value="">Selecciona...</option>
                  <option value="Auto">Auto</option>
                  <option value="Vida">Vida</option>
                  <option value="Hogar">Hogar</option>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="status"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <FormControl>
                <Select {...field}>
                  <option value="Activa">Activa</option>
                  <option value="Vencida">Vencida</option>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <div className="text-red-500">{error}</div>}
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
