import { useState } from "react";

interface IUseSelect {
  select: string;
  handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const useSelect = (initialValue: string): IUseSelect => {
  const [select, setSelect] = useState(initialValue);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelect(e.target.value);
  };

  return { select, handleSelectChange };
};
