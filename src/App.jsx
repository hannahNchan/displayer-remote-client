import { useState } from 'react'
import { supabase } from './lib/supabase'
import './App.css'

function App() {
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const camposLlenos = title.trim() !== '' && notes.trim() !== ''

  const handleSave = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('listener-oled')
      .insert([{ title, text: notes }]) // CAMBIO AQUI

    if (error) {
      console.error('❌ Error al guardar:', error)
    } else {
      console.log('✅ Nota guardada:', data)
      setTitle('')
      setNotes('')
    }

    setLoading(false)
  }

  const handleGet = async () => {
    const { data, error } = await supabase
      .from('listener-oled') // CAMBIO AQUI
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Error al obtener:', error)
    } else {
      console.log('📋 Notas en base de datos:', data)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-full max-w-xl bg-white shadow-2xl rounded-2xl p-8 space-y-8 border border-purple-100 transform transition duration-500 hover:shadow-purple-500/30">

        <h1 className="text-4xl font-extrabold text-gray-900 text-center tracking-tight">
          ✍️ <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Escribe</span>
        </h1>

        <div className="flex flex-col space-y-2">
          <label htmlFor="title" className="text-base font-semibold text-gray-700">
            Título
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Escribe el título aquí..."
            className="w-full rounded-lg border border-gray-300 px-5 py-3 text-gray-900 placeholder-gray-500 focus:ring-4 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition duration-300 shadow-sm"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="notes" className="text-base font-semibold text-gray-700">
            Contenido
          </label>
          <textarea
            id="notes"
            rows="6"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Escribe tu contenido aquí..."
            className="w-full rounded-lg border border-gray-300 px-5 py-3 text-gray-900 placeholder-gray-500 resize-y focus:ring-4 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition duration-300 shadow-sm"
          ></textarea>
        </div>

        <div className="flex flex-col gap-4 pt-2">
          <button
            onClick={handleSave}
            disabled={!camposLlenos || loading}
            className={`w-full py-3 rounded-xl font-bold text-lg shadow-lg transform transition duration-300 ${
              camposLlenos && !loading
                ? 'bg-gradient-to-r from-blue-500 to-purple-300 text-white hover:shadow-xl active:scale-95'
                : 'bg-purple-100 text-gray-500 cursor-not-allowed shadow-inner'
            }`}
          >
            {loading ? 'Guardando...' : 'Guardar nota'}
          </button>

          <button
            onClick={handleGet}
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg transition duration-300 active:scale-95 shadow-md"
          >
            Consultar notas (consola)
          </button>
        </div>

        <div className="bg-purple-50 p-6 rounded-xl border-l-4 border-purple-400 shadow-inner">
          <h2 className="text-sm font-bold text-purple-600 mb-2 uppercase tracking-wider">
            Vista previa
          </h2>
          <h3 className="text-xl font-extrabold text-gray-900 mb-1">
            {title || 'Sin título'}
          </h3>
          <p className="text-gray-700 whitespace-pre-wrap italic">
            {notes || 'Sin contenido'}
          </p>
        </div>

      </div>
    </div>
  )
}

export default App
