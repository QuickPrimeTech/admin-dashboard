import slugify from "slugify";

/**
 * Generates a URL-friendly slug from a string
 * @param text The text to convert into a slug
 * @returns The slug string
 */
export function createSlug(text: string): string {
  return slugify(text, {
    lower: true, // convert to lowercase
    strict: true, // remove special characters
    remove: /[*+~.()'"!:@–]/g, // remove extra punctuation including the en dash
  });
}

// Example usage
const title = "Happy Hour – Drinks 20% Off";
const slug = createSlug(title);

console.log(slug);
// Output: happy-hour-drinks-20-off
