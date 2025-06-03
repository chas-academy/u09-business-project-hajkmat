import React from 'react';
import { TextInputProps } from '../../types/formtypes';

const TextInput = ({
  id,
  name,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  disabled = false,
  required = false,
  error,
  className = '',
  labelClassName = '',
  inputClassName = '',
  helpText,
}: TextInputProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const inputId = `input-${id}`;
  const helpTextId = helpText ? `${inputId}-help` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [helpTextId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`my-4 mx-4 ${className}`}>
      <label
        htmlFor={inputId}
        className={`block text-sm font-medium text-gray-700 mb-1 ${disabled ? 'text-gray-400' : ''} ${labelClassName}`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <input
        id={inputId}
        name={name || id}
        type={type}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        required={required}
        placeholder={placeholder}
        aria-describedby={describedBy}
        aria-invalid={!!error}
        className={`block w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} 
          rounded-md shadow-sm placeholder-gray-400 
          focus:outline-none focus:ring-blue-500 focus:border-blue-500 
          ${disabled ? 'bg-gray-100 text-gray-500' : ''} 
          ${inputClassName}`}
      />

      {helpText && !error && (
        <p id={helpTextId} className="mt-1 text-sm text-gray-500">
          {helpText}
        </p>
      )}

      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default TextInput;
