export function BranchesBackgroundPattern() {
  return (
    <div
      className="absolute inset-0 -z-10 h-full dark:opacity-10"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(229,231,235,0.8) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(229,231,235,0.8) 1px, transparent 1px),
          radial-gradient(circle 500px at 20% 100%, rgba(255,138,0,0.25), transparent),
          radial-gradient(circle 500px at 100% 80%, rgba(255,102,0,0.25), transparent)
        `,
        backgroundSize: "48px 48px, 48px 48px, 100% 100%, 100% 100%",
      }}
    />
  );
}
