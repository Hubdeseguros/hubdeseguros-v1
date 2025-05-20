'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RegisterPromoterForm } from '@/components/promoters/RegisterPromoterForm';
import { PromotersList } from '@/components/promoters/PromotersList';

export default function PromotersManagementPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Promotores</h1>
        <p className="text-muted-foreground">
          Administra los promotores de tu agencia
        </p>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Lista de Promotores</TabsTrigger>
          <TabsTrigger value="register">Registrar Nuevo Promotor</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Promotores Registrados</CardTitle>
              <CardDescription>
                Lista de todos los promotores registrados en tu agencia
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PromotersList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="register" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Registrar Nuevo Promotor</CardTitle>
              <CardDescription>
                Completa el formulario para registrar un nuevo promotor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RegisterPromoterForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
