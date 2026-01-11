import { Check, X } from 'lucide-react'

export const ResolvePredictionModal = ({ prediction, onResolve, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-dark-card border border-dark-border rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-bold mb-2">Resolve Prediction</h3>
        <p className="text-gray-400 text-sm mb-6">
          Was this prediction correct or incorrect?
        </p>

        <div className="bg-dark-bg border border-dark-border rounded p-4 mb-6">
          <p className="text-white">{prediction.text}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onResolve(true)}
            className="flex-1 bg-success text-white font-medium rounded px-4 py-2.5 transition-fast hover:bg-success/90 flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            Correct
          </button>
          <button
            onClick={() => onResolve(false)}
            className="flex-1 bg-error text-white font-medium rounded px-4 py-2.5 transition-fast hover:bg-error/90 flex items-center justify-center gap-2"
          >
            <X className="w-5 h-5" />
            Incorrect
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-3 text-sm text-gray-400 hover:text-white transition-fast py-2"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
