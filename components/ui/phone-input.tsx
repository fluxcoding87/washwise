"use client";

import PhoneInputComponent from "react-phone-number-input";

import "react-phone-number-input/style.css";

interface PhoneInputProps {
  onChange: (value: string | undefined) => void;
  value: string | undefined;
}

export const PhoneInput = ({ onChange, value }: PhoneInputProps) => {
  return (
    <div>
      <PhoneInputComponent
        value={value}
        onChange={onChange}
        placeholder="Mobile Number"
        defaultCountry="IN"
        international
        className="rounded-md pl-2 border shadow-sm"
      />
    </div>
  );
};
