import {twMerge} from 'tailwind-merge';
import {type ClassValue, clsx} from 'clsx';

/**
 * Concatenates class names and merges Tailwind utility classes correctly.
 * Uses clsx for conditional classes and tailwind-merge to handle overrides.
 */
export function cx(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
