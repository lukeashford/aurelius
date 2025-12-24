/**
 * Concatenates class names, filtering out falsy values.
 * A lightweight alternative to clsx/classnames for internal use.
 */
export function cx(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}
