export interface EffectStyleInfo {
  readonly id: string;
  readonly name: string;
  /** False for styles local to the file, true for styles from a published library. */
  readonly remote: boolean;
}
