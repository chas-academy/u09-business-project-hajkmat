import React from 'react';
import { CheckboxProps } from '../../types/formtypes';

const Checkbox = ({
  id,
  name,
  label,
  checked,
  onChange,
  disabled = false,
  className = '',
  labelClassName = '',
  description,
}: CheckboxProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  return (
    <div className={`flex items-start ${className}`}>
      <div className="flex items-center h-5">
        <input
          id={id}
          name={name || id}
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 
            transition-colors duration-200 ease-in-out
            disabled:bg-gray-200 disabled:cursor-not-allowed"
          aria-describedby={description ? `${id}-description` : undefined}
        />
      </div>
      <div className="ml-3 text-sm">
        <label
          htmlFor={id}
          className={`font-medium text-gray-700 ${disabled ? 'text-gray-400' : 'cursor-pointer'} ${labelClassName}`}
        >
          {label}
        </label>
        {description && (
          <p id={`${id}-description`} className="text-gray-500 text-xs mt-1">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default Checkbox;
