import { useState } from "react";

const useInput = (initialValue: string) => {
  const [state, setState] = useState(initialValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(e.target.value);
  };

  const clear = () => {
    setState("");
  };

  return { state, handleChange, clear };
};

export default useInput;
