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
import { GlobalSettings } from "./mockSettings";

type SettingsFormProps = {
  initialData: GlobalSettings;
  onSubmit: (data: GlobalSettings) => void;
};

export const SettingsForm: React.FC<SettingsFormProps> = ({
  initialData,
  onSubmit,
}) => {
  const form = useForm<GlobalSettings>({ defaultValues: initialData });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-md"
      >
        <FormField
          name="currency"
          control={form.control}
          rules={{ required: "La moneda es obligatoria" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Moneda</FormLabel>
              <FormControl>
                <Select {...field}>
                  <option value="MXN">MXN</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="language"
          control={form.control}
          rules={{ required: "El idioma es obligatorio" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Idioma</FormLabel>
              <FormControl>
                <Select {...field}>
                  <option value="es">Español</option>
                  <option value="en">Inglés</option>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="sessionTimeout"
          control={form.control}
          rules={{
            required: "El tiempo de sesión es obligatorio",
            min: { value: 5, message: "Mínimo 5 minutos" },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiempo de sesión (minutos)</FormLabel>
              <FormControl>
                <Input type="number" {...field} min={5} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Guardar Cambios</Button>
      </form>
    </Form>
  );
};
