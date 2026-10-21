/** Höhenänderungen darunter (Adressleiste mobiler Browser) lösen keinen Refresh aus. */
export const RESIZE_HEIGHT_THRESHOLD = 120

export interface Size {
  w: number
  h: number
}

export function shouldRefresh(prev: Size, next: Size): boolean {
  return prev.w !== next.w || Math.abs(prev.h - next.h) >= RESIZE_HEIGHT_THRESHOLD
}
