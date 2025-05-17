import React from 'react';
import { Download, Trash2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface ClientActionsProps {
  selectedCount: number;
  onDelete: () => void;
  onExport: () => void;
}

export function ClientActions({ selectedCount, onDelete, onExport }: ClientActionsProps) {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 mb-4">
      <span className="text-sm text-muted-foreground">
        {selectedCount} {selectedCount === 1 ? 'cliente seleccionado' : 'clientes seleccionados'}
      </span>
      
      <Button
        variant="outline"
        size="sm"
        className="h-8"
        onClick={onExport}
      >
        <Download className="mr-2 h-4 w-4" />
        Exportar
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="h-8 text-destructive hover:text-destructive"
        onClick={onDelete}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Eliminar
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuItem>
            <span>Cambiar estado</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>Asignar categoría</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>Enviar correo</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
