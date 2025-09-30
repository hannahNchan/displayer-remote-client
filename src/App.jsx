import { useEffect, useRef, useState } from 'react'
import { supabase } from './lib/supabase'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import './App.css'

function App() {
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const editorRef = useRef(null)

  useEffect(() => {
    if (!editorRef.current) {
      const quill = new Quill('#editor', {
        theme: 'snow',
        placeholder: 'Escribe aquí…',
        modules: {
          toolbar: [
            ['bold', 'italic'],
            [{ color: [] }],
            ['clean']
          ]
        }
      })
      editorRef.current = quill
    }
  }, [])

  const handleSave = async () => {
    setLoading(true)
    const html = editorRef.current.root.innerHTML

    const { data, error } = await supabase
      .from('listener-oled')
      .insert([{ title: title || 'sin título', text: html }])

    if (error) {
      console.error('❌ Error al guardar:', error)
    } else {
      console.log('✅ Nota guardada:', data)
      editorRef.current.root.innerHTML = ''
      setTitle('')
    }

    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-6 bg-white p-6 rounded-2xl border shadow-md w-[400px]">

        <h1 className="text-2xl font-extrabold text-purple-700 flex items-center gap-2">
          🖋️ <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">Escribe algo...</span>
        </h1>

        {/* Input de título */}
        <div className="w-full">
          <input
            type="text"
            maxLength={12}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título (máx. 12)"
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* Editor */}
        <div className="w-full border border-gray-300 rounded-md overflow-hidden">
          <div id="editor" className="max-h-[600px] min-h-[400px] overflow-y-auto px-3 py-2 text-sm"></div>
        </div>

        {/* Botón de guardar */}
        <button
          onClick={handleSave}
          disabled={loading}
          className={`w-full py-3 px-4 rounded-md font-semibold text-white text-sm transition ${
            loading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700 active:scale-95'
          }`}
        >
          {loading ? 'Guardando...' : 'Guardar en Supabase'}
        </button>

      </div>
    </div>
  )
}

export default App
