import ar from './ar';
import en from './en';

export type Dictionary<A, B> = {
  [K in keyof A | keyof B]: K extends keyof A & keyof B
    ? A[K] | B[K]
    : K extends keyof B
      ? B[K]
      : K extends keyof A
        ? A[K]
        : never;
};

let isArabic = $state(false);

export function getIsArabic() {
  return isArabic;
}

export function setIsArabic(v: boolean) {
  isArabic = v;
}

let dictionary: Dictionary<typeof ar, typeof en> = $derived(isArabic ? ar : en);

export function t(
  key: keyof typeof dictionary,
  params?: Record<string, unknown>,
): string {
  let msg = dictionary[key] ?? key;

  if (params) {
    for (const [k, v] of Object.entries(params))
      msg = msg.replaceAll(`{${k}}`, String(v));
  }

  return msg;
}
