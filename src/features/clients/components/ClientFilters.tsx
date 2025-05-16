import React, { useState, useEffect } from 'react';
import { X, Filter, Search } from 'lucide-react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { ClientFilters as ClientFiltersType, ClientStatus, ClientCategory } from '../types/client.types';
import { clientService } from '../services/clientService';

interface ClientFiltersProps {
  filters: ClientFiltersType;
  onChange: (filters: ClientFiltersType) => void;
  onReset: () => void;
}

export function ClientFilters({ filters, onChange, onReset }: ClientFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [statusOptions, setStatusOptions] = useState<ClientStatus[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<ClientCategory[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    filters.createdAt
      ? {
          from: new Date(filters.createdAt.from),
          to: new Date(filters.createdAt.to),
        }
      : undefined
  );

  useEffect(() => {
    const loadOptions = async () => {
      const [statuses, categories] = await Promise.all([
        clientService.getStatusOptions(),
        clientService.getCategoryOptions(),
      ]);
      setStatusOptions(statuses);
      setCategoryOptions(categories);
    };

    loadOptions();
  }, []);

  const handleStatusChange = (statusId: string, checked: boolean) => {
    const newStatuses = checked
      ? [...(filters.status || []), statusId]
      : (filters.status || []).filter((id) => id !== statusId);

    onChange({
      ...filters,
      status: newStatuses.length > 0 ? newStatuses : undefined,
    });
  };

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newCategories = checked
      ? [...(filters.categories || []), categoryId]
      : (filters.categories || []).filter((id) => id !== categoryId);

    onChange({
      ...filters,
      categories: newCategories.length > 0 ? newCategories : undefined,
    });
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    
    if (range?.from && range?.to) {
      onChange({
        ...filters,
        createdAt: {
          from: range.from.toISOString(),
          to: range.to.toISOString(),
        },
      });
    } else {
      const { createdAt, ...rest } = filters;
      onChange(rest);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...filters,
      search: e.target.value || undefined,
    });
  };

  const handleDocumentNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...filters,
      documentNumber: e.target.value || undefined,
    });
  };

  const handleIsBusinessChange = (value: string) => {
    const isBusiness = value === 'true' ? true : value === 'false' ? false : undefined;
    onChange({
      ...filters,
      isBusiness,
    });
  };

  const resetFilters = () => {
    setDateRange(undefined);
    onReset();
  };

  return (
    <div className="flex items-center space-x-4 mb-6">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar clientes..."
          className="pl-10"
          value={filters.search || ''}
          onChange={handleSearchChange}
        />
      </div>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filtros</span>
            {(filters.status?.length || filters.categories?.length || filters.createdAt) && (
              <span className="h-2 w-2 rounded-full bg-primary"></span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="end">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Filtros avanzados</h4>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-muted-foreground"
                onClick={resetFilters}
              >
                Limpiar
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="documentNumber">Número de documento</Label>
                <Input
                  id="documentNumber"
                  placeholder="Ej: 12345678"
                  className="mt-1"
                  value={filters.documentNumber || ''}
                  onChange={handleDocumentNumberChange}
                />
              </div>

              <div>
                <Label>Tipo de cliente</Label>
                <Select
                  value={filters.isBusiness === undefined ? '' : String(filters.isBusiness)}
                  onValueChange={handleIsBusinessChange}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="false">Persona natural</SelectItem>
                    <SelectItem value="true">Empresa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Estado</Label>
                <div className="mt-2 space-y-2">
                  {statusOptions.map((status) => (
                    <div key={status.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`status-${status.id}`}
                        checked={filters.status?.includes(status.id) || false}
                        onCheckedChange={(checked) => handleStatusChange(status.id, checked === true)}
                      />
                      <Label
                        htmlFor={`status-${status.id}`}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: status.color }}
                        />
                        <span>{status.name}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Categorías</Label>
                <div className="mt-2 space-y-2">
                  {categoryOptions.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={filters.categories?.includes(category.id) || false}
                        onCheckedChange={(checked) => handleCategoryChange(category.id, checked === true)}
                      />
                      <Label
                        htmlFor={`category-${category.id}`}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span>{category.name}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Fecha de creación</Label>
                <div className="mt-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date"
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, 'LLL dd, y')} -{' '}
                              {format(dateRange.to, 'LLL dd, y')}
                            </>
                          ) : (
                            format(dateRange.from, 'LLL dd, y')
                          )
                        ) : (
                          <span>Seleccionar rango</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={handleDateRangeChange}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
