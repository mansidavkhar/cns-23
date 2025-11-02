import { useState } from "react";

export default function useForm(initial = {}) {
  const [values, setValues] = useState(initial);
  const handleChange = (e) => {
    setValues({...values, [e.target.name]: e.target.value });
  };
  const reset = () => setValues(initial);
  return { values, handleChange, reset };
}
