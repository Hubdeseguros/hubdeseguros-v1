
import React from 'react';
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ShoppingCart, Users, CheckCircle, Clock } from 'lucide-react';
import { cn } from "@/lib/utils"

const blue = "text-[#2563eb]"; // Azul del diseño

const DashboardCRM = () => {
    const handleCardClick = (title: string) => {
        // Aquí puedes agregar la lógica para navegar a la sección correspondiente
        alert(`Clic en tarjeta: ${title}`);
    };

    return (
        <div className="bg-[#f7f8fa] min-h-screen p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Asistente Comercial / CRM</h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                <Button
                    variant="ghost"
                    className={cn(
                        "shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02]",
                        "w-full flex flex-col items-start p-0"
                    )}
                    onClick={() => handleCardClick("Prospectos")}
                >
                    <Card className="w-full cursor-pointer">
                        <CardHeader>
                            <CardTitle className="text-gray-700">Prospectos</CardTitle>
                            <div className={`text-4xl font-semibold ${blue}`}>24</div>
                            <CardDescription className="text-gray-500">Potenciales clientes</CardDescription>
                        </CardHeader>
                    </Card>
                </Button>

                <Button
                    variant="ghost"
                    className="shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] w-full flex flex-col items-start p-0"
                    onClick={() => handleCardClick("Seguimientos")}
                >
                    <Card className="w-full cursor-pointer">
                        <CardHeader>
                            <CardTitle className="text-gray-700">Seguimientos</CardTitle>
                            <div className={`text-4xl font-semibold ${blue}`}>18</div>
                            <CardDescription className="text-gray-500">Pendientes hoy</CardDescription>
                        </CardHeader>
                    </Card>
                </Button>

                <Button
                    variant="ghost"
                    className="shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] w-full flex flex-col items-start p-0"
                    onClick={() => handleCardClick("Cotizaciones")}
                >
                    <Card className="w-full cursor-pointer">
                        <CardHeader>
                            <CardTitle className="text-gray-700">Cotizaciones</CardTitle>
                            <div className={`text-4xl font-semibold ${blue}`}>12</div>
                            <CardDescription className="text-gray-500">Esperando respuesta</CardDescription>
                        </CardHeader>
                    </Card>
                </Button>

                <Button
                    variant="ghost"
                    className="shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] w-full flex flex-col items-start p-0"
                    onClick={() => handleCardClick("Vencimientos")}
                >
                    <Card className="w-full cursor-pointer">
                        <CardHeader>
                            <CardTitle className="text-gray-700">Vencimientos</CardTitle>
                            <div className={`text-4xl font-semibold ${blue}`}>5</div>
                            <CardDescription className="text-gray-500">Próximos a vencer</CardDescription>
                        </CardHeader>
                    </Card>
                </Button>

                <Button
                    variant="ghost"
                    className="shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] w-full flex flex-col items-start p-0"
                    onClick={() => handleCardClick("Oportunidades")}
                >
                    <Card className="w-full cursor-pointer">
                        <CardHeader>
                            <CardTitle className="text-gray-700">Oportunidades</CardTitle>
                            <div className={`text-4xl font-semibold ${blue}`}>8</div>
                            <CardDescription className="text-gray-500">Nuevas oportunidades</CardDescription>
                        </CardHeader>
                    </Card>
                </Button>
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Seguimientos para hoy</h2>
                <Card className="shadow-md">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead>Producto</TableHead>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Carlos Rodríguez</TableCell>
                                    <TableCell>Llamada</TableCell>
                                    <TableCell>Seguro Auto</TableCell>
                                    <TableCell>Hoy 10:30</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                                            Pendiente
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="link" className="text-blue-500 p-0">Completar</Button>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>María González</TableCell>
                                    <TableCell>Cotización</TableCell>
                                    <TableCell>Seguro Hogar</TableCell>
                                    <TableCell>Hoy 14:00</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-300">
                                            En proceso
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="link" className="text-blue-500 p-0">Ver</Button>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DashboardCRM;
