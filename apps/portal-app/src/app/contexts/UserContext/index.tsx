import React, { createContext, useContext, ReactNode } from 'react';
import { useGetIdentity, usePermissions } from '@refinedev/core';

interface User {
  userId?: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  userTypeName?: string;
  roleName?: string;
  avatar?: string;
  [key: string]: any;
}

interface UserContextType {
  user: User | null;
  permissions: any[];
  isLoading: boolean;
  isUserLoading: boolean;
  isPermissionsLoading: boolean;
  error: string | null;
  refetchUser: () => void;
  refetchPermissions: () => void;
  hasPermission: (permission: string) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  // Use Refine's useGetIdentity for user data with caching
  const { 
    data: user, 
    isLoading: userLoading, 
    error: userError,
    refetch: refetchIdentity 
  } = useGetIdentity({
    queryOptions: {
      staleTime: 5 * 60 * 1000, // 5 minutes cache
      gcTime: 10 * 60 * 1000, // 10 minutes in memory (renamed from cacheTime)
      retry: 2,
      refetchOnWindowFocus: false,
    }
  });

  // Use Refine's usePermissions for permissions data
  const { 
    data: permissions, 
    isLoading: permissionsLoading,
    error: permissionsError,
    refetch: refetchPermissions 
  } = usePermissions({});

  // Check if user has a specific permission using actionName and roleName structure
  const hasPermission = (actionName: string): boolean => {
    if (!permissions || permissions.length === 0) return false;
    
    const userRole = user?.roleName || user?.userTypeName;
    
    // Check if user has the specific action permission
    return permissions?.data?.some((permission: any) => {
      return permission.actionName === actionName && 
             (permission.roleName === userRole || !permission.roleName);
    });
  };

  const refetchUser = () => {
    refetchIdentity();
  };

  const contextValue: UserContextType = {
    user: user || null,
    permissions: permissions || [],
    isLoading: userLoading, // Only block on user loading, not permissions
    isUserLoading: userLoading,
    isPermissionsLoading: permissionsLoading,
    error: (userError as any)?.message || (permissionsError as any)?.message || null,
    refetchUser,
    refetchPermissions,
    hasPermission,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Export the context for advanced usage
export { UserContext };