export function getInitials(name: string):string {
 return name
      .split(" ")
      .map((w: string) => w[0]?.toUpperCase())
      .join("")
      .slice(0, 2);
}