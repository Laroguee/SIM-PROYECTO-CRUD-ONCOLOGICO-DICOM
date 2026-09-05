import React, { useState, useEffect } from 'react';
import api from '../../../services/api';

const TumorEstadiajeTab = ({ pacienteId }) => {
  const [diagnosticos, setDiagnosticos] = useState([]);
  const [selectedDiagId, setSelectedDiagId] = useState('');
  
  const [tumor, setTumor] = useState(null);
  const [estadiaje, setEstadiaje] = useState(null);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiagnosticos = async () => {
      try {
        const res = await api.get(`/diagnosticos/paciente/${pacienteId}`);
        setDiagnosticos(res.data);
        if (res.data.length > 0) {
          setSelectedDiagId(res.data[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDiagnosticos();
  }, [pacienteId]);

  useEffect(() => {
    if (!selectedDiagId) return;
    const fetchDetails = async () => {
      try {
        const [tumRes, estRes] = await Promise.all([
          api.get(`/tumores/diagnostico/${selectedDiagId}`),
          api.get(`/estadiajes/diagnostico/${selectedDiagId}`)
        ]);
        setTumor(tumRes.data || { diagnostico_id: selectedDiagId, localizacion: '', tipo_histologico: '', grado_tumoral: '', receptores: '' });
        setEstadiaje(estRes.data || { diagnostico_id: selectedDiagId, tnm_t: '', tnm_n: '', tnm_m: '', estadio_general: '', metodo_evaluacion: '' });
      } catch (err) {
        console.error(err);
      }
    };
    fetchDetails();
  }, [selectedDiagId]);

  const saveTumor = async () => {
    try {
      if (tumor.id) await api.put(`/tumores/${tumor.id}`, tumor);
      else await api.post('/tumores', { ...tumor, diagnostico_id: selectedDiagId });
      alert('Características guardadas');
    } catch (err) { alert('Error al guardar tumor'); }
  };

  const saveEstadiaje = async () => {
    try {
      if (estadiaje.id) await api.put(`/estadiajes/${estadiaje.id}`, estadiaje);
      else await api.post('/estadiajes', { ...estadiaje, diagnostico_id: selectedDiagId });
      alert('Estadiaje guardado');
    } catch (err) { alert('Error al guardar estadiaje'); }
  };

  if (loading) return <div>Cargando...</div>;
  if (diagnosticos.length === 0) return <div className="text-center text-slate-500 py-8">Debe añadir un diagnóstico primero.</div>;

  return (
    <div>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Seleccionar Diagnóstico Base:</label>
        <select 
          className="w-full max-w-md p-2 border rounded-lg bg-slate-50"
          value={selectedDiagId} 
          onChange={e => setSelectedDiagId(e.target.value)}
        >
          {diagnosticos.map(d => (
            <option key={d.id} value={d.id}>{d.icdo_desc} ({d.codigo}) - {new Date(d.fecha_diagnostico).toLocaleDateString()}</option>
          ))}
        </select>
      </div>

      {tumor && estadiaje && (
        <div className="grid grid-cols-2 gap-8">
          {/* Columna Tumor */}
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 border-b pb-2">Características del Tumor</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Localización Específica</label>
                <input type="text" className="w-full p-2 border rounded text-sm" value={tumor.localizacion} onChange={e => setTumor({...tumor, localizacion: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Tipo Histológico</label>
                <input type="text" className="w-full p-2 border rounded text-sm" value={tumor.tipo_histologico} onChange={e => setTumor({...tumor, tipo_histologico: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Grado Tumoral (G1-G4)</label>
                <input type="text" className="w-full p-2 border rounded text-sm" value={tumor.grado_tumoral} onChange={e => setTumor({...tumor, grado_tumoral: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Receptores (ER/PR/HER2)</label>
                <input type="text" className="w-full p-2 border rounded text-sm" value={tumor.receptores} onChange={e => setTumor({...tumor, receptores: e.target.value})} />
              </div>
              <button onClick={saveTumor} className="w-full bg-blue-600 text-white p-2 rounded font-medium text-sm">Guardar Tumor</button>
            </div>
          </div>

          {/* Columna Estadiaje TNM */}
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 border-b pb-2">Estadiaje (Clasificación TNM)</h4>
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Tumor (T)</label>
                  <input type="text" placeholder="Ej: T2" className="w-full p-2 border rounded text-sm" value={estadiaje.tnm_t} onChange={e => setEstadiaje({...estadiaje, tnm_t: e.target.value})} />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Nódulo (N)</label>
                  <input type="text" placeholder="Ej: N1" className="w-full p-2 border rounded text-sm" value={estadiaje.tnm_n} onChange={e => setEstadiaje({...estadiaje, tnm_n: e.target.value})} />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Metástasis (M)</label>
                  <input type="text" placeholder="Ej: M0" className="w-full p-2 border rounded text-sm" value={estadiaje.tnm_m} onChange={e => setEstadiaje({...estadiaje, tnm_m: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Estadio General (I-IV)</label>
                <input type="text" className="w-full p-2 border rounded text-sm" value={estadiaje.estadio_general} onChange={e => setEstadiaje({...estadiaje, estadio_general: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Método de Evaluación</label>
                <input type="text" placeholder="Ej: Clínico, Patológico" className="w-full p-2 border rounded text-sm" value={estadiaje.metodo_evaluacion} onChange={e => setEstadiaje({...estadiaje, metodo_evaluacion: e.target.value})} />
              </div>
              <button onClick={saveEstadiaje} className="w-full bg-blue-600 text-white p-2 rounded font-medium text-sm">Guardar Estadiaje</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TumorEstadiajeTab;
