export function formatNumber(value: string | number): string {
  if (value === '0' || value === 0) return '0'

  // Convert value to number if it's a string
  const num = typeof value === 'string' ? parseInt(value) : value
  if (isNaN(num)) return value.toString()

  if (num < 1000) return num.toString()
  if (num < 10000) return (num / 1000).toFixed(1) + 'k'
  if (num < 1000000) return (num / 1000).toFixed(1) + 'k'
  if (num < 10000000) return (num / 1000000).toFixed(1) + 'M'
  if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M'
  if (num < 10000000000) return (num / 1000000000).toFixed(1) + 'B'
  return (num / 1000000000).toFixed(0) + 'B'
}

export function formatTime(time: number): string {
  const timeElapsed = Date.now() - time * 1000 // time elapsed in milliseconds
  const minutes = Math.floor(timeElapsed / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days}d ${hours % 24}h`
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`
  } else {
    return `${minutes}m`
  }
}
