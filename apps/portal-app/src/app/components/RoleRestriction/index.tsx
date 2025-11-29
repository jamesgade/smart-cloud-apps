import { useLocation, Navigate, Outlet } from "react-router";
import { useAppContext } from "../../contexts/AppContext";

const RoleRestriction = ({ allowedRoles }: { allowedRoles: string[] }) => {
    const { companyRoles, currentUser } = useAppContext();
    const location = useLocation();

    if (!currentUser) {
        return null;
    }

    return allowedRoles.includes(currentUser?.roleName) ? (
        <Outlet />
    ) : (
        <Navigate to={companyRoles ? "/unauthorized" : "/"} state={{ from: location }} replace />
    );
}
export default RoleRestriction;
