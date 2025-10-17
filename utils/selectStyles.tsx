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

// import React from "react";
// import {
//   StylesConfig,
//   components,
//   ValueContainerProps,
//   GroupBase,
//   PlaceholderProps,
// } from "react-select";

// interface SelectOption {
//   label: string;
//   value: number | string;
// }

// const { ValueContainer, Placeholder } = components;

// export const FloatingValueContainer = (
//   props: ValueContainerProps<any, boolean, GroupBase<any>>
// ) => {
//   const { children, ...valueContainerProps } = props;
//   const placeholderProps: PlaceholderProps<any, boolean, GroupBase<any>> = {
//     ...valueContainerProps,
//     children: valueContainerProps.selectProps.placeholder,
//     isFocused: (valueContainerProps.selectProps as any).isFocused,
//     innerProps: {},
//     isDisabled: valueContainerProps.isDisabled,
//   };
//   return (
//     <ValueContainer {...props}>
//       <Placeholder {...placeholderProps} />
//       {React.Children.map(children, (child) =>
//         child && (child as any).type !== Placeholder ? child : null
//       )}
//     </ValueContainer>
//   );
// };

// export const singleSelectStyle: StylesConfig<SelectOption, false> = {
//   control: (provided, state) => ({
//     ...provided,
//     border: state.isFocused ? "1px solid #c93f52" : "1px solid #e5e5e5",
//     borderRadius: "8px",
//     padding: "2px",
//     boxShadow: state.isFocused ? "0 0 0 3px rgba(201, 63, 82, 0.5)" : "none",
//     "&:hover": {
//       border: state.isFocused ? "1px solid #c93f52" : "1px solid #e5e5e5",
//     },
//     fontSize: "14px",
//     color: "#0a0a0a",
//   }),
//   singleValue: (provided) => ({
//     ...provided,
//     color: "#0a0a0a",
//     textTransform: "capitalize",
//     cursor: "pointer",
//   }),
//   valueContainer: (provided) => ({
//     ...provided,
//     overflow: "visible",
//   }),
//   placeholder: (provided, state) => ({
//     ...provided,
//     position: "absolute",
//     color: "#737373",
//     textTransform: "capitalize",
//     cursor: "pointer",
//     transform: "translateY(-50%)",
//     top: state.hasValue || state.selectProps.inputValue ? -5 : "50%",
//     backgroundColor:
//       state.hasValue || state.selectProps.inputValue ? "white" : "transparent",
//     transition: "top 0.1s, font-size 0.1s",
//   }),
//   option: (provided, state) => ({
//     ...provided,
//     backgroundColor: state.isSelected
//       ? "#f5f5f5"
//       : state.isFocused
//       ? "#f5f5f5"
//       : "white",
//     color: state.isSelected ? "#0a0a0a" : "#0a0a0a",
//     fontSize: "14px",
//     textTransform: "capitalize",
//     cursor: "pointer",
//     "&:hover": {
//       backgroundColor: "#f5f5f5",
//       color: "#0a0a0a",
//     },
//   }),
// };