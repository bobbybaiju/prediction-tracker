import { useState } from 'react'
import { Plus } from 'lucide-react'
import { DatePickerModal } from './DatePickerModal'

export const PredictionForm = ({ onCreatePrediction }) => {
  const [text, setText] = useState('')
  const [resolutionDate, setResolutionDate] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim() || !resolutionDate) return

    setLoading(true)
    const { error } = await onCreatePrediction(text.trim(), resolutionDate)

    if (!error) {
      setText('')
      setResolutionDate('')
    }

    setLoading(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-dark-card border border-dark-border rounded-lg p-6"
    >
      <h2 className="text-xl font-bold mb-4">Create Prediction</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">
            Prediction
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            rows={3}
            className="w-full bg-dark-bg border border-dark-border rounded px-4 py-2.5 text-white transition-fast focus:outline-none focus:border-gray-600 resize-none"
            placeholder="I predict that..."
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1.5">
            Resolution Date
          </label>
          <DatePickerModal
            value={resolutionDate}
            onChange={setResolutionDate}
            minDate={new Date().toISOString().split('T')[0]}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !text.trim() || !resolutionDate}
          className="w-full bg-white text-black font-medium rounded px-4 py-2.5 transition-fast hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          {loading ? 'Creating...' : 'Create Prediction'}
        </button>
      </div>
    </form>
  )
}
