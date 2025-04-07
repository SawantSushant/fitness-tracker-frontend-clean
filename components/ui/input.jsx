export function Input({ type = 'text', ...props }) {
  return <input type={type} className="w-full px-3 py-2 border rounded" {...props} />;
}
