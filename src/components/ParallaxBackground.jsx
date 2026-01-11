import { useEffect, useRef } from 'react'

export const ParallaxBackground = () => {
  const canvasRef = useRef(null)
  const mousePos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationFrameId

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Handle mouse movement
    const handleMouseMove = (e) => {
      mousePos.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 30,
      }
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Draw dot grid
    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const spacing = 50
      const dotSize = 2
      const offsetX = mousePos.current.x
      const offsetY = mousePos.current.y

      ctx.fillStyle = 'rgba(51, 51, 51, 0.15)' // Low opacity dots

      for (let x = 0; x < canvas.width; x += spacing) {
        for (let y = 0; y < canvas.height; y += spacing) {
          ctx.beginPath()
          ctx.arc(x + offsetX, y + offsetY, dotSize, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      animationFrameId = requestAnimationFrame(drawGrid)
    }

    drawGrid()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 1 }}
    />
  )
}
