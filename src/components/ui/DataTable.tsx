import React from 'react';

interface DataTableProps {
  data: any[];
  columns: Array<{
    id: string;
    label: string;
    sortable?: boolean;
  }>;
  renderCell: (row: any, column: any) => React.ReactNode;
}

export function DataTable({ data, columns, renderCell }: DataTableProps) {
  return (
    <div className="rounded-md border">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th key={column.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {columns.map((column) => (
                <td key={column.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {renderCell(row, column)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
