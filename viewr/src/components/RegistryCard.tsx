type Registry = {
  name: string;
  // Add other properties as needed
};

export default function RegistryCard({ registry }: { registry: Registry }) {
  return (
    <div>
      <h3>{registry.name}</h3>
      {/* TODO: Implement RegistryCard */}
    </div>
  );
}
