import {
    createContext,
    PropsWithChildren,
    SetStateAction,
    useContext,
    useState,
    Dispatch,
} from 'react';

type AppContext = {
    companyName: string;
    setCompanyName: Dispatch<SetStateAction<string>>;
    companyId: number | undefined;
    setCompanyId: Dispatch<SetStateAction<number | undefined>>;
    authToken?: string | null;
    setAuthToken: Dispatch<SetStateAction<string | null | undefined>>;
    currentUser?: any | null;
    setCurrentUser: Dispatch<SetStateAction<any | null | undefined>>;
    companyRoles?: any | null;
    setCompanyRoles: Dispatch<SetStateAction<any | null | undefined>>;
};

const AppContext = createContext<AppContext | undefined>(undefined);

type AppContextProviderProps = PropsWithChildren;

export default function AppContextProvider({ children }: AppContextProviderProps) {
    const [authToken, setAuthToken] = useState<string | null>();
    const [currentUser, setCurrentUser] = useState<any | null>();
    const [companyRoles, setCompanyRoles] = useState<any[] | null>();
    const [companyName, setCompanyName] = useState<string>("");
    const [companyId, setCompanyId] = useState<number>();

    return (
        <AppContext.Provider
            value={{
                companyName,
                setCompanyName,
                companyId,
                setCompanyId,
                authToken,
                setAuthToken,
                currentUser,
                setCurrentUser,
                companyRoles,
                setCompanyRoles,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const context = useContext(AppContext);

    if (context === undefined) {
        throw new Error('useAppContext must be used inside of a AppContextProvider');
    }

    return context;
}
