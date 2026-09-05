import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import api from '../../services/api';

const AgendaForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    paciente_id: '',
    profesional_id: '',
    fecha_hora: '',
    tipo_cita: 'Consulta Especialista',
    motivo: '',
    estado: 'Programada'
  });
  
  const [pacientes, setPacientes] = useState([]);
  const [profesionales, setProfesionales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Formato para el input datetime-local
  const formatDateTimeForInput = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    // Ajustar al timezone local
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 16);
  };

  useEffect(() => {
    const fetchSelectData = async () => {
      try {
        const [pacientesRes, profesionalesRes] = await Promise.all([
          api.get('/patients'),
          api.get('/profesionales')
        ]);
        setPacientes(pacientesRes.data);
        setProfesionales(profesionalesRes.data);
        
        if (isEditing) {
          const citaRes = await api.get(`/citas/${id}`);
          const cita = citaRes.data;
          setFormData({
            paciente_id: cita.paciente_id,
            profesional_id: cita.profesional_id,
            fecha_hora: formatDateTimeForInput(cita.fecha_hora),
            tipo_cita: cita.tipo_cita,
            motivo: cita.motivo || '',
            estado: cita.estado
          });
        }
      } catch (err) {
        console.error(err);
        setError('Error al cargar datos necesarios.');
      }
    };
    fetchSelectData();
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

    // Ajustamos la fecha para MySQL (YYYY-MM-DD HH:MM:SS)
    const formattedData = {
      ...formData,
      fecha_hora: formData.fecha_hora.replace('T', ' ') + ':00'
    };

    // Si no estamos editando, en el dropdown de pacientes el value es su ID de FHIR
    // El backend se encarga de traducirlo a ID real.
    try {
      if (isEditing) {
        await api.put(`/citas/${id}`, formattedData);
      } else {
        await api.post('/citas', formattedData);
      }
      navigate('/agenda');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Error al guardar la cita.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border p-8">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/agenda" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {isEditing ? 'Editar Cita' : 'Agendar Nueva Cita'}
          </h2>
          <p className="text-slate-500 text-sm">Programa la atención clínica del paciente.</p>
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Paciente</label>
            <select 
              name="paciente_id"
              value={formData.paciente_id}
              onChange={handleChange}
              required
              disabled={isEditing}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white disabled:bg-slate-100"
            >
              <option value="">Seleccione un paciente...</option>
              {pacientes.map(p => {
                const nombreCompleto = `${p.name?.[0]?.given?.join(' ')} ${p.name?.[0]?.family}`;
                return (
                  // Usamos el ID FHIR en el front. El backend lo convierte al id real.
                  // Excepto al editar, que viene con el id numérico directamente (lo manejamos).
                  <option key={p.id} value={isEditing ? formData.paciente_id : p.id}>
                    {nombreCompleto} ({p.identifier?.[0]?.value})
                  </option>
                );
              })}
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Médico / Profesional Asignado</label>
            <select 
              name="profesional_id"
              value={formData.profesional_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
            >
              <option value="">Seleccione un profesional...</option>
              {profesionales.map(prof => (
                <option key={prof.id} value={prof.id}>
                  Dr. {prof.nombres} {prof.apellidos} - {prof.especialidad}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Fecha y Hora</label>
            <input 
              type="datetime-local" 
              name="fecha_hora"
              value={formData.fecha_hora}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Cita</label>
            <select 
              name="tipo_cita"
              value={formData.tipo_cita}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
            >
              <option value="Consulta Especialista">Consulta Especialista</option>
              <option value="Estudio Radiologico">Estudio Radiológico</option>
              <option value="Sesion Quimioterapia">Sesión Quimioterapia</option>
              <option value="Comite Oncologico">Comité Oncológico</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Motivo (Opcional)</label>
            <textarea 
              name="motivo"
              value={formData.motivo}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
            ></textarea>
          </div>

          {isEditing && (
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Estado de la Cita</label>
              <select 
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
              >
                <option value="Programada">Programada</option>
                <option value="Completada">Completada</option>
                <option value="Cancelada">Cancelada</option>
                <option value="Ausente">Ausente</option>
              </select>
            </div>
          )}
        </div>

        <div className="pt-4 border-t flex justify-end gap-3">
          <Link 
            to="/agenda"
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
            {loading ? 'Guardando...' : 'Guardar Cita'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgendaForm;
