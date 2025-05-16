import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { SettingsForm } from "./SettingsForm";
import { mockSettings, GlobalSettings } from "./mockSettings";
import { toast } from "@/components/ui/use-toast";

export const SettingsDashboard: React.FC = () => {
  const [settings, setSettings] = useState<GlobalSettings>(mockSettings);

  const handleSave = (data: GlobalSettings) => {
    setSettings(data);
    toast({ title: "Configuración actualizada correctamente" });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Moneda</div>
          <div className="text-2xl font-bold">{settings.currency}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Idioma</div>
          <div className="text-2xl font-bold">
            {settings.language === "es" ? "Español" : "Inglés"}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Tiempo de sesión</div>
          <div className="text-2xl font-bold">
            {settings.sessionTimeout} min
          </div>
        </Card>
      </div>
      <SettingsForm initialData={settings} onSubmit={handleSave} />
    </div>
  );
};
