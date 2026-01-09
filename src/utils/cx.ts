import {twMerge} from 'tailwind-merge';
import {clsx, type ClassValue} from 'clsx';

/**
 * Concatenates class names and merges Tailwind utility classes correctly.
 * Uses clsx for conditional classes and tailwind-merge to handle overrides.
 */
export function cx(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
