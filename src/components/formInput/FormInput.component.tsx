import React from 'react';

interface FormInputProps {
  label: string;
  id: string;
  type?: string;
  required?: boolean;
  register: any;
  error?: string;
  onBlur?: () => void;
  className?: string;
  loading?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  id,
  type = 'text',
  required = false,
  register,
  error,
  onBlur,
  className = '',
  loading = false,
}) => {
  const registerProps = register(id);
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (registerProps.onBlur) registerProps.onBlur(e);
    if (onBlur) onBlur();
  };
  return (
    <div className="relative mb-6">
      <label htmlFor={id} className="block text-base mb-1">
        {label}
      </label>
      <input
        type={type}
        id={id}
        {...registerProps}
        required={required}
        onBlur={handleBlur}
        className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black bg-white ${className}`}
      />
      {loading && (
        <div className="absolute right-2 top-1/2 h-5 w-5 border-2 rounded-full border-gray-200 border-t-gray-400 my-2 animate-spin">
          <span id="loading-indicator" className="sr-only">
            Loading...
          </span>
        </div>
      )}
      {error && (
        <span className="text-red-500 text-sm mt-1 block">{error}</span>
      )}
    </div>
  );
};

export default FormInput;
