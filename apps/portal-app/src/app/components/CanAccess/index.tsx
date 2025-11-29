import { useAppContext } from "../../contexts/AppContext";
import { ReactNode } from "react";

interface CanAccessProps {
  roles: string[];
  children: ReactNode;
  fallback?: ReactNode;
}

export const CanAccess = ({ roles, children, fallback = null }: CanAccessProps) => {
  const { companyRoles } = useAppContext();

  const hasAccess = companyRoles ?
    roles.some(role => companyRoles.includes(role)) :
    false;

  if (hasAccess) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};