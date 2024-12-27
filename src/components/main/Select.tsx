// import React, { forwardRef, useId, useState } from "react";
// import { BiChevronDown } from "react-icons/bi";

// interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
//   options: any[];
//   label?: string;
//   parentStyle?: string;
//   arrowStyle?: string;
//   background?: string;
//   DisplayItem?: string;
//   DisplayCode?: string;
//   selectOption?: boolean;
// }

// export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
//   {
//     options = [],
//     label,
//     parentStyle = "white",
//     arrowStyle = "black",
//     background = "transparent",
//     DisplayItem = "title",
//     DisplayCode = "code",
//     selectOption = false,
//     ...props
//   },
//   ref
// ) {
//   const id = useId(); // Generate unique ID for accessibility
//   const [isOpen, setIsOpen] = useState(false); // Manage dropdown state

//   const toggleDropdown = () => setIsOpen(!isOpen);

//   return (
//     <div className="w-full flex flex-col gap-1">
//       {/* Label */}
//       {label && (
//         <label htmlFor={id} className="font-semibold text-md dark:text-gray-400">
//           {label}
//         </label>
//       )}

//       {/* Select dropdown */}
//       <div className={`relative bg-${parentStyle} rounded-md`}>
//         <select
//           {...props}
//           id={id}
//           ref={ref}
//           className={`w-full px-3 py-2 dark:bg-neutral-950 dark:border-gray-300 border border-black bg-${background} rounded-md outline-none`}
//           onClick={toggleDropdown}
//         >
//           {/* Default option */}
//           {!selectOption && <option disabled value="">Select...</option>}

//           {/* Render options */}
//           {options.map((option, index) => (
//             <option key={index} value={option.id}>
//               {option[DisplayCode]
//                 ? `${option[DisplayCode]} - ${option[DisplayItem]}`
//                 : option[DisplayItem]}
//             </option>
//           ))}
//         </select>

//         {/* Dropdown arrow */}
//         {/* <BiChevronDown
//           className={`absolute text-${arrowStyle} right-3 top-1/2 transform -translate-y-1/2`}
//           onClick={toggleDropdown}
//         /> */}
//       </div>
//     </div>
//   );
// });
