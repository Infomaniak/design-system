import type { CleanUpFunction } from '../../misc/clean-up-function.ts';

export type EffectFunction = () => void | CleanUpFunction;
