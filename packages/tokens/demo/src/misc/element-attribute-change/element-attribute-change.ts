import { Observable, share, type Subscriber, type TeardownLogic } from 'rxjs';

export interface ElementAttributeChange {
  readonly element: Element;
  readonly name: string;
  readonly previous: string | null;
  readonly current: string | null;
}

export const ON_ANY_ELEMENT_ATTRIBUTE_CHANGE_OBSERVABLE = new Observable<ElementAttributeChange>(
  (subscriber: Subscriber<ElementAttributeChange>): TeardownLogic => {
    const setAttributeDescriptor: PropertyDescriptor | undefined = Object.getOwnPropertyDescriptor(
      Element.prototype,
      'setAttribute',
    )!;

    Object.defineProperty(Element.prototype, 'setAttribute', {
      ...setAttributeDescriptor,
      value: function (this: Element, name: string, value: string): void {
        const previous: string | null = this.getAttribute(name);
        Reflect.apply(setAttributeDescriptor.value, this, [name, value]);
        // setAttributeDescriptor.value.call(this, name, value);
        subscriber.next({
          element: this,
          name,
          previous,
          current: value,
        });
      },
    });

    const removeAttributeDescriptor: PropertyDescriptor | undefined =
      Object.getOwnPropertyDescriptor(Element.prototype, 'removeAttribute')!;

    Object.defineProperty(Element.prototype, 'removeAttribute', {
      ...removeAttributeDescriptor,
      value: function (this: Element, name: string): void {
        const previous: string | null = this.getAttribute(name);
        Reflect.apply(removeAttributeDescriptor.value, this, [name]);
        // removeAttributeDescriptor.value.call(this, name);
        subscriber.next({
          element: this,
          name,
          previous,
          current: null,
        });
      },
    });

    return (): void => {
      Object.defineProperty(Element.prototype, 'setAttribute', setAttributeDescriptor);
      Object.defineProperty(Element.prototype, 'removeAttribute', removeAttributeDescriptor);
    };
  },
).pipe(share());
