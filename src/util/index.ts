export const clearCache = () => {
  window.localStorage.removeItem('server')
  window.localStorage.removeItem('routing')
  window.localStorage.removeItem('setting')
}

export const normalizeByte = (val: string): string => {
  let size = parseInt(val)
  const unit = 1024
  if (size < unit) {
    return `${size}B`
  }
  if (size < Math.pow(unit, 2)) return (size / unit).toFixed(2) + 'KB'
  if (size < Math.pow(unit, 3))
    return (size / Math.pow(unit, 2)).toFixed(2) + 'MB'
  if (size < Math.pow(unit, 4))
    return (size / Math.pow(unit, 3)).toFixed(2) + 'G'
  return (size / Math.pow(unit, 4)).toFixed(2) + 'T'
}
