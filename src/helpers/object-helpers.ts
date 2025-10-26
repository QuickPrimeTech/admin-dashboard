// This is a function to remove certain keys
//Example usage:
// const formData = { image: "file.jpg", lqip: "blurhash", name: "Pizza" };
// const cleaned = removeKeys(formData, ["image", "lqip"]);
//
// Output:
// cleaned = { name: "Pizza" }
//
export function removeKeys<T extends object>(
  obj: T,
  keys: (keyof T)[]
): Partial<T> {
  const newObj = { ...obj };
  for (const key of keys) {
    delete newObj[key];
  }
  return newObj;
}
