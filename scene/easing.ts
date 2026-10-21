/** Ohne three-Import, damit eager geladener Code (Stationstexte) three nicht in den Start-Chunk zieht. */
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
}
