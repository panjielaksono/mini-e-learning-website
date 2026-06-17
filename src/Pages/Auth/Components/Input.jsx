const Input = ({
  type,
  name,
  id,
  value,
  onChange,
  placeholder,
  required = false,
  readOnly = false,
  className = "",
}) => {
  return (
    <input
      type={type}
      name={name}
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      readOnly={readOnly}
      className={`w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 ${className}`}
    />
  );
};
export default Input;
