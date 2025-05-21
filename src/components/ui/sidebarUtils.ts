
// Corregir: importar el tipo correcto MenuSection
import { MenuSection } from './types';

export const handleColumnToggle = (columnId: string, isClient: boolean) => {
  return (prevConfig: MenuSection[]) =>
    prevConfig.map((col) =>
      col.id === columnId ? { ...col, visible: !col.visible } : col
    );
};

export const handleColumnReset = (isClient: boolean) => {
  const defaultConfig = isClient
    ? [
        { id: 'nombres', label: 'Nombres / Razón social', visible: true, sortable: true, isClient: true },
        { id: 'apellidos', label: 'Apellidos', visible: true, sortable: true, isClient: true },
        { id: 'documento', label: 'N. documento / NIT', visible: true, isClient: true },
        { id: 'fechaNacimiento', label: 'F. nacimiento', visible: true, sortable: true, isClient: true },
        { id: 'fechaConstitucion', label: 'F. constitución', visible: true, sortable: true, isClient: true },
        { id: 'celular', label: 'Celular', visible: true, isClient: true },
        { id: 'email', label: 'Email', visible: true, isClient: true },
        { id: 'estadoCliente', label: 'Estado cliente', visible: true, sortable: true, isClient: true },
        { id: 'usuarioCreado', label: 'Usuario creado', visible: true, sortable: true, isClient: true },
        { id: 'recordatoriosPolizasCobros', label: 'Recordatorios – Pólizas / Cobros', visible: true, isClient: true },
        { id: 'sede', label: 'Sede', visible: true, sortable: true, isClient: true },
        { id: 'categorias', label: 'Categorías', visible: true, isClient: true },
      ]
    : [
        { id: 'nombre', label: 'Nombre', visible: true, sortable: true, isClient: false },
        { id: 'apellido', label: 'Apellido', visible: true, sortable: true, isClient: false },
        { id: 'telefono', label: 'Teléfono', visible: true, isClient: false },
        { id: 'email', label: 'Email', visible: true, sortable: true, isClient: false },
        { id: 'tipoPoliza', label: 'Tipo de Póliza', visible: true, sortable: true, isClient: false },
      ];

  return defaultConfig as MenuSection[];
};
