import { useEffect, useState } from 'react'

export function useAnimatedNumber(targetValue: number, duration = 100) {
  const [animatedValue, setAnimatedValue] = useState(0)
  const [fixed, setFixed] = useState(0) // Define o número de casas decimais

  useEffect(() => {
    // Descobre o número de casas decimais do targetValue
    const decimalPlaces = targetValue.toString().split('.')[1]?.length || 0
    setFixed(decimalPlaces)

    const startValue = animatedValue
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime
      const progress = Math.min(elapsedTime / duration, 1) // Limita o progresso a 1
      const newValue = startValue + (targetValue - startValue) * progress

      setAnimatedValue(newValue)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [targetValue, duration])

  // Retorna o valor animado com o número de casas decimais correto
  return Number(animatedValue.toFixed(fixed))
}
