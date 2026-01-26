import { filter } from 'rxjs';
import { ON_ANY_ELEMENT_ATTRIBUTE_CHANGE_OBSERVABLE } from './misc/element-attribute-change/element-attribute-change.ts';

/*---*/

window.onload = () => {
  ON_ANY_ELEMENT_ATTRIBUTE_CHANGE_OBSERVABLE.pipe(
    filter(({ name }): boolean => {
      return name === 'data-color-mode';
    }),
  ).subscribe(console.log);

  // setTimeout(() => {
  //   document.querySelector('div')!.setAttribute('data-color-mode', 'light');
  // }, 300);
};
