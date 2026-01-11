import { useRef } from 'react'
import { X, Download, Check, Trophy } from 'lucide-react'
import html2canvas from 'html2canvas'
import { format } from 'date-fns'

export const ShareCardModal = ({ type, data, onClose }) => {
  const cardRef = useRef(null)

  const handleDownload = async () => {
    if (!cardRef.current) return

    const canvas = await html2canvas(cardRef.current, {
      scale: 2,
      backgroundColor: null,
      useCORS: true,
    })

    const link = document.createElement('a')
    link.download = `prediction-tracker-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-dark-card border border-dark-border rounded-lg p-6 max-w-lg w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Share to Instagram</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-dark-border rounded transition-fast"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Preview */}
        <div className="flex justify-center mb-6">
          <div ref={cardRef}>
            {type === 'prediction' ? (
              <PredictionCard data={data} />
            ) : (
              <StatsCard data={data} />
            )}
          </div>
        </div>

        <button
          onClick={handleDownload}
          className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-bold rounded-lg px-4 py-3 transition-fast hover:opacity-90 flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          Download Image
        </button>

        <p className="text-center text-gray-500 text-xs mt-3">
          Save to your camera roll, then share to Instagram
        </p>
      </div>
    </div>
  )
}

const PredictionCard = ({ data }) => {
  const { prediction, displayName, isCorrect } = data

  return (
    <div
      className="w-[340px] p-6 rounded-2xl"
      style={{
        background: isCorrect
          ? 'linear-gradient(135deg, #00C853 0%, #00E676 50%, #69F0AE 100%)'
          : 'linear-gradient(135deg, #FF5252 0%, #FF1744 50%, #FF8A80 100%)',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
          style={{ background: 'rgba(255,255,255,0.2)' }}
        >
          {displayName?.charAt(0)?.toUpperCase() || '?'}
        </div>
        <div>
          <div className="font-bold text-white">{displayName}</div>
          <div className="text-white/70 text-xs">made a prediction</div>
        </div>
      </div>

      {/* Prediction Text */}
      <div
        className="rounded-xl p-4 mb-4"
        style={{ background: 'rgba(0,0,0,0.2)' }}
      >
        <p className="text-white font-medium text-lg leading-snug">
          "{prediction.text}"
        </p>
      </div>

      {/* Result */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <div
          className="px-4 py-2 rounded-full font-bold text-lg flex items-center gap-2"
          style={{ background: 'rgba(255,255,255,0.2)' }}
        >
          {isCorrect ? (
            <>
              <Check className="w-6 h-6" />
              CORRECT
            </>
          ) : (
            <>
              <X className="w-6 h-6" />
              INCORRECT
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center">
        <div className="font-bold text-white/90 text-sm">Prediction Tracker</div>
        <div className="text-white/60 text-xs">its all about fun!</div>
      </div>
    </div>
  )
}

const StatsCard = ({ data }) => {
  const { displayName, rank, accuracy, correct, resolved, streak } = data

  const getRankGradient = () => {
    if (rank === 1) return 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)'
    if (rank === 2) return 'linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 50%, #808080 100%)'
    if (rank === 3) return 'linear-gradient(135deg, #CD7F32 0%, #B8860B 50%, #8B4513 100%)'
    return 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A855F7 100%)'
  }

  return (
    <div
      className="w-[340px] p-6 rounded-2xl text-white"
      style={{ background: getRankGradient() }}
    >
      {/* Header */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <Trophy className="w-8 h-8" />
        <div className="text-center">
          <div className="font-bold text-2xl">{displayName}</div>
          <div className="text-white/70 text-sm">Prediction Stats</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div
        className="grid grid-cols-2 gap-3 mb-6"
        style={{ background: 'rgba(0,0,0,0.15)', borderRadius: '16px', padding: '16px' }}
      >
        <div className="text-center">
          <div className="text-4xl font-black">{rank ? `#${rank}` : '-'}</div>
          <div className="text-white/70 text-xs uppercase tracking-wide">Rank</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-black">{resolved > 0 ? `${accuracy}%` : '-'}</div>
          <div className="text-white/70 text-xs uppercase tracking-wide">Accuracy</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-black">{correct}/{resolved}</div>
          <div className="text-white/70 text-xs uppercase tracking-wide">Correct</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-black">{streak > 0 ? streak : '-'}</div>
          <div className="text-white/70 text-xs uppercase tracking-wide">Streak</div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center">
        <div className="font-bold text-white/90 text-sm">Prediction Tracker</div>
        <div className="text-white/60 text-xs">its all about fun!</div>
      </div>
    </div>
  )
}
