interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  text: string;
  className?: string;
  preChild?: React.ReactNode;
  postChild?: React.ReactNode;
  onClick?: () => void;
}

const Button = ({
  type,
  text,
  className,
  preChild,
  postChild,
  onClick,
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`w-full bg-black text-white py-4 rounded-xl text-lg flex items-center justify-center gap-2 hover:bg-gray-900 transition ${className}`}
      onClick={onClick}
    >
      {preChild}
      {text}
      {postChild}
    </button>
  );
};

export default Button;
