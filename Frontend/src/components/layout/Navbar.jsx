// import React from "react";
// import { Sun, Moon } from "lucide-react";
// import { useTheme } from "../ThemeContext";
// import "./Navbar.css";

// export default function Navbar({ active, setActive, mobile = false }) {
//   const { theme, toggleTheme } = useTheme();

//   const navItems = [
//     { key: "overview", label: "Overview" },
//     { key: "goals", label: "Goals" },
//     { key: "create", label: "Create" },
//   ];

//   return (
//     <nav className={`navbar ${theme} ${mobile ? 'mobile' : ''}`}>
//       <div className="nav-items">
//         {navItems.map((item) => (
//           <button
//             key={item.key}
//             className={`nav-item ${active === item.key ? "active" : ""}`}
//             onClick={() => setActive(item.key)}
//             style={{
//               height: '100%',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center'
//             }}
//           >
//             {item.label}
//           </button>
//         ))}
//       </div>

//       {!mobile && (
//         <>
//           <div className="nav-divider" />
//           <button
//             className="theme-toggle"
//             onClick={toggleTheme}
//             aria-label="Toggle theme"
//           >
//             {theme === "dark" ? (
//               <Sun size={18} className="theme-icon" />
//             ) : (
//               <Moon size={18} className="theme-icon" />
//             )}
//           </button>
//         </>
//       )}
//     </nav>
//   );
// }