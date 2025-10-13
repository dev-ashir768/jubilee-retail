import { StylesConfig } from "react-select";

interface SelectOption {
  label: string;
  value: number | string;
}

export const singleSelectStyle: StylesConfig<SelectOption, false> = {
  control: (provided, state) => ({
    ...provided,
    border: state.isFocused ? "1px solid #c93f52" : "1px solid #e5e5e5",
    borderRadius: "8px",
    padding: "2px",
    boxShadow: state.isFocused ? "0 0 0 3px rgba(201, 63, 82, 0.5)" : "none",
    "&:hover": {
      border: state.isFocused ? "1px solid #c93f52" : "1px solid #e5e5e5",
    },
    fontSize: "14px",
    color: "#0a0a0a",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#0a0a0a",
    textTransform: "capitalize",
    cursor: "pointer",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#737373",
    textTransform: "capitalize",
    cursor: "pointer",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#f5f5f5"
      : state.isFocused
      ? "#f5f5f5"
      : "white",
    color: state.isSelected ? "#0a0a0a" : "#0a0a0a",
    fontSize: "14px",
    textTransform: "capitalize",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#f5f5f5",
      color: "#0a0a0a",
    },
  }),
};

export const multiSelectStyle: StylesConfig<SelectOption, true> = {
  control: (provided, state) => ({
    ...provided,
    border: state.isFocused ? "1px solid #c93f52" : "1px solid #e5e5e5",
    borderRadius: "8px",
    padding: "2px",
    boxShadow: state.isFocused ? "0 0 0 3px rgba(201, 63, 82, 0.5)" : "none",
    "&:hover": {
      border: state.isFocused ? "1px solid #c93f52" : "1px solid #e5e5e5",
    },
    fontSize: "14px",
    color: "#0a0a0a",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#0a0a0a",
    textTransform: "capitalize",
    cursor: "pointer",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#737373",
    textTransform: "capitalize",
    cursor: "pointer",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#f5f5f5"
      : state.isFocused
      ? "#f5f5f5"
      : "white",
    color: state.isSelected ? "#0a0a0a" : "#0a0a0a",
    fontSize: "14px",
    textTransform: "capitalize",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#f5f5f5",
      color: "#0a0a0a",
    },
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "#f5f5f5",
    borderRadius: "4px",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "#0a0a0a",
    fontSize: "14px",
    textTransform: "capitalize",
    cursor: "pointer",
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: "#0a0a0a",
    cursor: "pointer",
    ":hover": {
      backgroundColor: "var(--primary)",
      color: "white",
    },
  }),
  clearIndicator: (provided) => ({
    ...provided,
    color: "#0a0a0a",
    cursor: "pointer",
  }),
};
