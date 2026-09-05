import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import api from '../../services/api';

const PatientForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    documento_identidad: '',
    nombres: '',
    apellidos: '',
    fecha_nacimiento: '',
    genero: 'unknown'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      // Como no creamos un endpoint GET por ID específico, 
      // traeremos todos y filtraremos en frontend para llenar el formulario.
      const fetchPatient = async () => {
        try {
          const response = await api.get('/patients');
          const patient = response.data.find(p => p.id === id);
          if (patient) {
            setFormData({
              documento_identidad: patient.identifier?.[0]?.value || '',
              nombres: patient.name?.[0]?.given?.join(' ') || '',
              apellidos: patient.name?.[0]?.family || '',
              fecha_nacimiento: patient.birthDate || '',
              genero: patient.gender || 'unknown'
            });
          }
        } catch (err) {
          console.error(err);
          setError('Error al cargar datos del paciente.');
        }
      };
      fetchPatient();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEditing) {
        await api.put(`/patients/${id}`, formData);
      } else {
        await api.post('/patients', formData);
      }
      navigate('/pacientes');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Error al guardar el paciente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border p-8">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/pacientes" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {isEditing ? 'Editar Paciente' : 'Registrar Nuevo Paciente'}
          </h2>
          <p className="text-slate-500 text-sm">Completa la información básica requerida por el estándar FHIR.</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Documento de Identidad (DUI / Carné)</label>
            <input 
              type="text" 
              name="documento_identidad"
              value={formData.documento_identidad}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              placeholder="Ej: 01234567-8"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombres</label>
            <input 
              type="text" 
              name="nombres"
              value={formData.nombres}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Apellidos</label>
            <input 
              type="text" 
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de Nacimiento</label>
            <input 
              type="date" 
              name="fecha_nacimiento"
              value={formData.fecha_nacimiento}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Género</label>
            <select 
              name="genero"
              value={formData.genero}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white"
            >
              <option value="unknown">Desconocido (Unknown)</option>
              <option value="male">Masculino (Male)</option>
              <option value="female">Femenino (Female)</option>
              <option value="other">Otro (Other)</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t flex justify-end gap-3">
          <Link 
            to="/pacientes"
            className="px-6 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
          >
            Cancelar
          </Link>
          <button 
            type="submit"
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <Save size={18} />
            {loading ? 'Guardando...' : 'Guardar Paciente'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;
