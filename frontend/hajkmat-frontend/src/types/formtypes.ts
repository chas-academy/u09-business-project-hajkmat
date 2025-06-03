export interface CheckboxProps {
  id: string;
  name?: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  description?: string;
}

export interface TextInputProps {
  id: string;
  name?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'tel' | 'number';
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  helpText?: string;
}

// Is the general button for the project
export interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export interface ImageProps {
  src?: string; // Make src optional by adding ?
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  rounded?: boolean | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  aspectRatio?: '1/1' | '4/3' | '16/9' | '3/2' | 'auto';
  fallbackSrc?: string;
  lazy?: boolean;
}
