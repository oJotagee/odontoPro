
/**
 * Verificar se a data é hoje
 */
export function isToday(date: Date) {
  const now = new Date()

  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  )
}

/**
 * Verificar se o horário já passou
 */
export function isSlotInThePast(slotTime: string) {
  const [slotHour, slotMinute] = slotTime.split(":").map(Number)

  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()

  if(slotHour < currentHour) {
    return true
  } else if(slotHour === currentHour && slotMinute <= currentMinute) {
    return true
  }

  return false
}

/**
 * Verificar se a sequência de horários está disponível
 */
export function isSlotSequenceAvailable(
  startSlot: string, 
  requiredSlot: number, 
  allSlot: string[], 
  blockedSlots: string[]
) {
  const startIndex = allSlot.indexOf(startSlot)

  if (startIndex === -1 || startIndex + requiredSlot > allSlot.length) {
    return false
  }

  for (let i = startIndex; i < startIndex + requiredSlot; i++) {
    const slot = allSlot[i]

    if (blockedSlots.includes(slot)) {
      return false
    }
  }

  return true
}