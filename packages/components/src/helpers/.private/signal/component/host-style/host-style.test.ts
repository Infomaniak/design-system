import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  setStylePropertyValueLike,
  stringToStylePropertyValue,
  type StylePropertyValue,
} from './host-style.ts';

describe('stringToStylePropertyValue', () => {
  it('parses plain string without priority', () => {
    const result: StylePropertyValue = stringToStylePropertyValue('red');
    expect(result).toEqual({ value: 'red' });
  });

  it('parses string with priority', () => {
    const result: StylePropertyValue = stringToStylePropertyValue('red !important');
    expect(result).toEqual({ value: 'red', priority: 'important' });
  });
});

describe('setStylePropertyValueLike', () => {
  let element: HTMLElement;
  let removePropertySpy: ReturnType<typeof vi.spyOn>;
  let setPropertySpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    element = document.createElement('div');
    removePropertySpy = vi.spyOn(element.style, 'removeProperty');
    setPropertySpy = vi.spyOn(element.style, 'setProperty');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('removes property when value is null', () => {
    setStylePropertyValueLike(element, 'color', null);
    expect(removePropertySpy).toHaveBeenCalledWith('color');
    expect(setPropertySpy).not.toHaveBeenCalled();
  });

  it('removes property when value is undefined', () => {
    setStylePropertyValueLike(element, 'color', undefined);
    expect(removePropertySpy).toHaveBeenCalledWith('color');
    expect(setPropertySpy).not.toHaveBeenCalled();
  });

  it('removes property when value is empty string', () => {
    setStylePropertyValueLike(element, 'color', '');
    expect(removePropertySpy).toHaveBeenCalledWith('color');
    expect(setPropertySpy).not.toHaveBeenCalled();
  });

  it('sets property with plain string value', () => {
    setStylePropertyValueLike(element, 'color', 'red');
    expect(setPropertySpy).toHaveBeenCalledWith('color', 'red', undefined);
    expect(removePropertySpy).not.toHaveBeenCalled();
  });

  it('sets property with string value including priority', () => {
    setStylePropertyValueLike(element, 'color', 'red !important');
    expect(setPropertySpy).toHaveBeenCalledWith('color', 'red', 'important');
    expect(removePropertySpy).not.toHaveBeenCalled();
  });

  it('sets property with object value without priority', () => {
    setStylePropertyValueLike(element, 'color', { value: 'red' });
    expect(setPropertySpy).toHaveBeenCalledWith('color', 'red', undefined);
    expect(removePropertySpy).not.toHaveBeenCalled();
  });

  it('sets property with object value with priority', () => {
    setStylePropertyValueLike(element, 'color', { value: 'red', priority: 'important' });
    expect(setPropertySpy).toHaveBeenCalledWith('color', 'red', 'important');
    expect(removePropertySpy).not.toHaveBeenCalled();
  });

  it('sets property without priority when object priority is empty string', () => {
    setStylePropertyValueLike(element, 'color', { value: 'red', priority: '' });
    expect(setPropertySpy).toHaveBeenCalledWith('color', 'red', undefined);
    expect(removePropertySpy).not.toHaveBeenCalled();
  });
});
