
import React, { useState } from 'react';
import { ClientFormData } from '@/features/clients/types';

interface Props {
  initialData?: ClientFormData;
  onSubmit: (data: ClientFormData) => void;
  loading?: boolean;
}

const ClientForm: React.FC<Props> = ({ initialData, onSubmit, loading }) => {
  const [form, setForm] = useState<ClientFormData>(initialData || {
    first_name: '',
    email: '',
    promotor_id: '',
    creado_por: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Nombre</label>
        <input name="first_name" value={form.first_name} onChange={handleChange} className="input" required />
      </div>
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} className="input" required />
      </div>
      <div>
        <label className="block text-sm font-medium">Promotor ID</label>
        <input name="promotor_id" value={form.promotor_id || ''} onChange={handleChange} className="input" />
      </div>
      <div>
        <label className="block text-sm font-medium">Creado por</label>
        <input name="creado_por" value={form.creado_por || ''} onChange={handleChange} className="input" />
      </div>
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  );
};

export default ClientForm;
