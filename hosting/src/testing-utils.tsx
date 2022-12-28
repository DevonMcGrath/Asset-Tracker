import React from 'react';
import {render} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';

/**
 * Wraps content that may need to be rendered as a descendant of a router.
 * @param content the content that may need to be in a router.
 * @returns the content, wrapped in a {@link BrowserRouter}.
 */
export function wrapInRouter(content: any): JSX.Element {
  return <BrowserRouter>{content}</BrowserRouter>;
}

/**
 * Tests that a page renders with the header and body of the page.
 * @param page the page element to check.
 * @returns the container element of the rendered page.
 */
export function testForCorePageElements(page: JSX.Element): HTMLElement {
  const {container} = render(wrapInRouter(page));
  expect(container.getElementsByClassName('app-header').length).toEqual(1);
  expect(container.getElementsByClassName('app-body').length).toEqual(1);
  return container;
}
