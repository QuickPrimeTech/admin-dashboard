import { ImageSection } from "./image-section";

export function FormContent() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <ImageSection />
      </div>
    </div>
  );
}
