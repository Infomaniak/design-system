import { signal } from '@lit-labs/signals';
import type { ReactiveController, ReactiveControllerHost } from 'lit';
import { batch, batchedEffect } from 'signal-utils/subtle/batched-effect';
import type { SignalOptions } from './signal-options.ts';
import type { WritableSignal } from './writable-signal.ts';

class SignalPropertyController<
  GThis extends ReactiveControllerHost,
  GKey extends keyof GThis,
> implements ReactiveController {
  readonly #host: GThis;
  readonly #key: GKey;
  readonly #equals: (a: GThis[GKey], b: GThis[GKey]) => boolean;
  readonly #signal: WritableSignal<GThis[GKey]>;
  #unwatch: (() => void) | undefined;

  constructor(
    host: GThis,
    key: GKey,
    { equals = Object.is, ...options }: SignalOptions<GThis[GKey]> = {},
  ) {
    this.#host = host;
    this.#key = key;
    this.#equals = equals;
    this.#signal = signal<GThis[GKey]>(host[key], {
      ...options,
      equals,
    });
    host.addController(this);
  }

  get signal(): WritableSignal<GThis[GKey]> {
    return this.#signal;
  }

  #requiresUpdate(): boolean {
    return !this.#equals(this.#host[this.#key], this.#signal.get());
  }

  hostUpdate(): void {
    console.log(
      'hostUpdate',
      this.#host,
      this.#key,
      this.#signal.get(),
      this.#equals(this.#host[this.#key], this.#signal.get()),
    );
    // TODO continue here -> default value erase setted attribute
    if (this.#requiresUpdate()) {
      batch((): void => {
        this.#signal.set(this.#host[this.#key]);
      });
    }
  }

  hostConnected(): void {
    this.#unwatch = batchedEffect((): void => {
      if (this.#requiresUpdate()) {
        this.#host[this.#key] = this.#signal.get();
      }
    });
  }

  hostDisconnected(): void {
    this.#unwatch!();
    this.#unwatch = undefined;
  }
}

export function signalProperty<GThis extends ReactiveControllerHost, GKey extends keyof GThis>(
  host: GThis,
  key: GKey,
  options?: SignalOptions<GThis[GKey]>,
): WritableSignal<GThis[GKey]> {
  return new SignalPropertyController<GThis, GKey>(host, key, options).signal;
}
