import React, { useState } from 'react';
import { ClientFormData } from '@/features/clients/types';

interface Props {
  initialData?: ClientFormData;
  onSubmit: (data: ClientFormData) => void;
  loading?: boolean;
}

const ClientForm: React.FC<Props> = ({ initialData, onSubmit, loading }) => {
  const [form, setForm] = useState<ClientFormData>(initialData || {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    mobile: '',
    documentNumber: '',
    documentType: 'DNI',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    },
    isBusiness: false,
    status: 'ACTIVE'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        <input name="firstName" value={form.firstName} onChange={handleChange} className="input" required />
      </div>
      <div>
        <label className="block text-sm font-medium">Apellido</label>
        <input name="lastName" value={form.lastName} onChange={handleChange} className="input" required />
      </div>
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} className="input" required />
      </div>
      <div>
        <label className="block text-sm font-medium">Teléfono</label>
        <input name="phone" value={form.phone} onChange={handleChange} className="input" />
      </div>
      <div>
        <label className="block text-sm font-medium">Celular</label>
        <input name="mobile" value={form.mobile} onChange={handleChange} className="input" />
      </div>
      <div>
        <label className="block text-sm font-medium">Número de Documento</label>
        <input name="documentNumber" value={form.documentNumber} onChange={handleChange} className="input" required />
      </div>
      <div>
        <label className="block text-sm font-medium">Tipo de Documento</label>
        <select name="documentType" value={form.documentType} onChange={handleChange} className="input">
          <option value="DNI">DNI</option>
          <option value="PASAPORTE">Pasaporte</option>
          <option value="RUC">RUC</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium">Dirección</label>
        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium">Calle</label>
            <input name="address.street" value={form.address.street} onChange={handleChange} className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium">Ciudad</label>
            <input name="address.city" value={form.address.city} onChange={handleChange} className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium">Estado</label>
            <input name="address.state" value={form.address.state} onChange={handleChange} className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium">Código Postal</label>
            <input name="address.postalCode" value={form.address.postalCode} onChange={handleChange} className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium">País</label>
            <input name="address.country" value={form.address.country} onChange={handleChange} className="input" />
          </div>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium">Estado</label>
        <select name="status" value={form.status} onChange={handleChange} className="input">
          <option value="ACTIVE">Activo</option>
          <option value="INACTIVE">Inactivo</option>
          <option value="POTENTIAL">Potencial</option>
          <option value="IN_PROCESS">En proceso</option>
          <option value="REJECTED">Rechazado</option>
        </select>
      </div>
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  );
};

export default ClientForm; 