export function omit<T extends object, U extends (keyof T)[]>(
  obj: T,
  ...keys: U
): Omit<T, U[number]> {
  const ret: any = { ...obj };
  keys.forEach((key) => delete ret[key]);
  return ret;
}

export function pick<T extends object, U extends (keyof T)[]>(
  obj: T,
  ...keys: U
): Pick<T, U[number]> {
  const ret: any = {};
  keys.forEach((key) => (ret[key] = obj[key]));
  return ret;
}
