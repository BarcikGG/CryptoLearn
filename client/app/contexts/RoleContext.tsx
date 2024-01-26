import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RoleContextProps {
  userRole: string | null;
  setUserRole: React.Dispatch<React.SetStateAction<string | null>>;
}

const RoleContext = createContext<RoleContextProps | undefined>(undefined);

export const RoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const retrieveUserRole = async () => {
      try {
        const storedUserRole = await AsyncStorage.getItem('userRole');
        if (storedUserRole) {
          setUserRole(storedUserRole);
        }
      } catch (error) {
        console.log('Error retrieving userRole from AsyncStorage:', error);
      }
    };

    retrieveUserRole();
  }, []);

  return <RoleContext.Provider value={{ userRole, setUserRole }}>{children}</RoleContext.Provider>;
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within an RoleProvider');
  }
  return context;
};
