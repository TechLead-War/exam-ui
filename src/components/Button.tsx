import React, { ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  onClick?: (event: any) => void;
}

const Button: React.FC<Props> = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
    >
      {children}
    </button>
  );
};

export default Button;
