import React, { useState, useCallback } from 'react';
import {
    Users,
    Briefcase,
    TrendingDown,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    Clock,
    ShoppingCart,
    Phone,
    FileText,
    UserPlus,
    Calendar,
    BarChart4,
    PieChart,
    ListChecks,
    ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
    ResponsiveContainer,
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
} from 'recharts';

const AdminCrmDashboard = () => {
    const [leadsSinContactar, setLeadsSinContactar] = useState(12);
    const [renovacionesProximas, setRenovacionesProximas] = useState(5);
    const [tareasList, setTareasList] = useState([
        { id: '1', prioridad: 'alta', detalle: 'Llamar a cliente potencial', fecha: 'Hoy, 17:00', completada: false },
        { id: '2', prioridad: 'media', detalle: 'Enviar propuesta de renovación', fecha: 'Mañana, 10:00', completada: false },
        { id: '3', prioridad: 'baja', detalle: 'Revisar estado de póliza', fecha: '25/07, 14:00', completada: false },
        { id: '4', prioridad: 'alta', detalle: 'Agendar cita con cliente', fecha: '26/07, 11:30', completada: false },
    ]);

    const [actividadReciente, setActividadReciente] = useState([
        { tipo: 'poliza', detalle: 'Póliza #12345 creada', responsable: 'Juan Pérez', tiempo: 'Hace 2 horas' },
        { tipo: 'siniestro', detalle: 'Siniestro #67890 reportado', responsable: 'María García', tiempo: 'Hace 4 horas' },
        { tipo: 'cliente', detalle: 'Nuevo cliente registrado', responsable: 'Carlos Rodríguez', tiempo: 'Ayer' },
        { tipo: 'recordatorio', detalle: 'Recordatorio de pago', responsable: 'Sistema', tiempo: 'Ayer' },
        { tipo: 'cobro', detalle: 'Cobro realizado', responsable: 'Ana López', tiempo: '23/07' },
    ]);

    const [polizasPorRamoData, setPolizasPorRamoData] = useState([
        { name: 'Hogar', value: 35, color: '#6ee7b7' },
        { name: 'Vida', value: 25, color: '#fcd34d' },
        { name: 'Salud', value: 20, color: '#fca5a5' },
        { name: 'Responsabilidad Civil', value: 15, color: '#60a5fa' },
        { name: 'Otro', value: 5, color: '#d8b4fe' },
    ]);

    const handleCardClick = (tipo: string) => {
        console.log(`Clic en tarjeta: ${tipo}`);
        // Implementar lógica de navegación aquí
    };

    const handleVerPolizasClick = () => {
        console.log('Navegando a la sección de Pólizas...');
        // Implementar lógica de navegación aquí
    };

    const handleTareaCompletion = useCallback((id: string) => {
        setTareasList(prevTareas =>
            prevTareas.map(tarea =>
                tarea.id === id ? { ...tarea, completada: !tarea.completada } : tarea
            )
        );
    }, []);

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
    };

    return (
        <div className="bg-[#f7f8fa] min-h-screen p-6">
            {/* Tarjetas de métricas principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <motion.div variants={cardVariants} initial="hidden" animate="visible">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleCardClick("Prospectos")}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Prospectos</CardTitle>
                            <Users className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-[#2563eb]">24</div>
                            <p className="text-xs text-gray-500">Potenciales clientes</p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleCardClick("Seguimientos")}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Seguimientos</CardTitle>
                            <CheckCircle className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-[#2563eb]">18</div>
                            <p className="text-xs text-gray-500">Pendientes hoy</p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleCardClick("Cotizaciones")}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Cotizaciones</CardTitle>
                            <FileText className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-[#2563eb]">12</div>
                            <p className="text-xs text-gray-500">Esperando respuesta</p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleCardClick("Total Clientes")}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
                            <Users className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-500">1,450</div>
                            <p className="text-xs text-green-500">+20% este mes</p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Gráfico de "Pólizas por Ramo" y Lista de Tareas/Seguimientos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <Card className="flex flex-col items-center justify-center">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Pólizas por Ramo</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                        <div className="w-full max-w-md h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <RechartsPieChart>
                                    <Pie
                                        data={polizasPorRamoData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ cx, cy, midAngle, innerRadius, outerRadius, value, index }) => {
                                            const RADIAN = Math.PI / 180;
                                            const radius = 25 + innerRadius + (outerRadius - innerRadius);
                                            const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                            const y = cy + radius * Math.sin(-midAngle * RADIAN);

                                            return (
                                                <text
                                                    x={x}
                                                    y={y}
                                                    fill={polizasPorRamoData[index].color}
                                                    textAnchor={x > cx ? "start" : "end"}
                                                    dominantBaseline="central"
                                                >
                                                    {polizasPorRamoData[index].name} ({value})
                                                </text>
                                            );
                                        }}
                                    >
                                        {polizasPorRamoData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </RechartsPieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex flex-wrap justify-center mt-4 gap-2">
                            {polizasPorRamoData.map((item) => (
                                <div key={item.name} className="flex items-center gap-1">
                                    <span
                                        className="block w-3 h-3 rounded-full"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <span className="text-sm">{item.name}</span>
                                </div>
                            ))}
                        </div>
                        <Button className="mt-4" onClick={handleVerPolizasClick}>Ver todas las pólizas</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Tareas/Seguimientos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            {tareasList.map((tarea) => (
                                <li key={tarea.id} className="flex items-start justify-between">
                                    <div className="flex items-start gap-4">
                                        <input
                                            type="checkbox"
                                            className="mt-1"
                                            checked={tarea.completada}
                                            onChange={() => handleTareaCompletion(tarea.id)}
                                        />
                                        <div>
                                            {tarea.prioridad === 'alta' && (
                                                <Badge variant="destructive">Alta</Badge>
                                            )}
                                            {tarea.prioridad === 'media' && (
                                                <Badge variant="secondary">Media</Badge>
                                            )}
                                            {tarea.prioridad === 'baja' && (
                                                <Badge variant="outline">Baja</Badge>
                                            )}
                                            <p className={cn("text-sm", tarea.completada && "line-through text-gray-400")}>{tarea.detalle}</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500">{tarea.fecha}</p>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>

            {/* Actividad Reciente, Leads sin contactar y Próximas renovaciones */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-lg font-semibold mb-4">Actividad Reciente</h3>
                    <ul className="space-y-4">
                        {actividadReciente.map((actividad, index) => (
                            <li key={index} className="flex items-center justify-between border-b pb-2">
                                <div className="flex items-center gap-4">
                                    {actividad.tipo === 'poliza' && <FileText className="h-4 w-4 text-blue-500" />}
                                    {actividad.tipo === 'siniestro' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                                    {actividad.tipo === 'cliente' && <UserPlus className="h-4 w-4 text-green-500" />}
                                    {actividad.tipo === 'recordatorio' && <Clock className="h-4 w-4 text-yellow-500" />}
                                    {actividad.tipo === 'cobro' && <ShoppingCart className="h-4 w-4 text-purple-500" />}
                                    <div>
                                        <p className="text-sm">{actividad.detalle}</p>
                                        <p className="text-xs text-gray-500">{actividad.responsable}</p>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500">{actividad.tiempo}</p>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold">Leads sin contactar</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-blue-500">{leadsSinContactar}</div>
                            <p className="text-sm text-gray-500">Han pasado más de 24 horas</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold">Próximas renovaciones</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-blue-500">{renovacionesProximas}</div>
                            <p className="text-sm text-gray-500">En los próximos 30 días</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Botón flotante/fijo */}
            <div className="fixed bottom-6 right-6">
                <Button className="bg-blue-500 text-white hover:bg-blue-600 shadow-lg">
                    Gestionar Pólizas
                </Button>
            </div>
        </div>
    );
};

export default AdminCrmDashboard;
