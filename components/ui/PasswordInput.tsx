import clsx from "clsx";
import { useState } from "react";
import { basicInputClass, basicInputErrorClass } from "./Input";
import { HiEye, HiEyeOff } from "react-icons/hi";

export default function PasswordInput({
  id,
  placeholder,
  newPassword = false,
  error,
  errorText = false,
  ...props
}: Readonly<{
  id: string;
  placeholder?: string;
  newPassword?: boolean;
  errorText?: boolean;
  error?: string | boolean | undefined;
}>) {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // 📌 TODO - ONBLUR ERROR CHECK

  const inputClass = clsx(basicInputClass, {
    [basicInputErrorClass]: error,
  });

  const hideButtonClass = clsx("w-5 h-5 text-grey30");
  console.log(error);
  return (
    <>
      {/* <label>{placeholder}</label> */}
      <div className="relative">
        <input
          // onChange={(e) => handleChange(e)}
          type={showPassword ? "text" : "password"}
          autoComplete={newPassword ? "new-password" : "current-password"}
          id={id}
          name={id}
          placeholder={placeholder}
          className={inputClass}
          {...props}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1"
        >
          {showPassword ? (
            <HiEyeOff className={hideButtonClass} />
          ) : (
            <HiEye className={hideButtonClass} />
          )}
        </button>
      </div>
      {error && errorText && <span className="text-darkred">{error}</span>}
    </>
  );
}
