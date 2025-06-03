import { ButtonProps } from '../../types/formtypes';

const Button = ({
  type = 'button',
  variant = 'primary',
  children,
  onClick,
  disabled = false,
  className = '',
  fullWidth = false,
  size = 'medium',
}: ButtonProps) => {
  // Determine button styles based on variant
  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    outline: 'border border-gray-300 hover:bg-gray-100 text-gray-800',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  }[variant];

  // Determine button size with responsive behavior
  const sizeStyles = {
    small: 'py-0.5 px-2 text-xs md:py-1 md:px-3 md:text-sm',
    medium: 'py-1 px-3 text-sm md:py-2 md:px-4 md:text-base',
    large: 'py-2 px-4 text-base md:py-3 md:px-5 md:text-lg',
  }[size];

  // Full width class
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variantStyles}
        ${sizeStyles}
        ${widthClass}
        rounded-xl font-medium
        transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed
        my-2 mx-2 md:my-4 md:mx-4
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
