// 'use client'
// import { createContext, useState } from 'react';

// interface User {
//   // Define the properties of a user object
//   id: number;
//   name: string;
//   email: string;
//   // ... other properties
// }

// const AuthContext = createContext<{
//   user: User | null;
//   login: (user: User) => void;
//   logout: () => void;
// }>({
//   user: null,
//   login: () => {},
//   logout: () => {},
// });

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);

//   const login = (userData: User) => {
//     setUser(userData);
//   };

//   const logout = () => {
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>

//   );
// };

// export default
//  AuthContext;
