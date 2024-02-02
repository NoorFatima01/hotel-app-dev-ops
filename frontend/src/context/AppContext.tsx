import React from "react";
import { useQuery } from "react-query";
import * as apiClient from "../utils/api-clients";


type AppContext = {
    isLogged: boolean;
}

const AppContext = React.createContext<AppContext | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
    
    const {isError} = useQuery("validateToken",apiClient.validateToken, {})
    
    return (
        <AppContext.Provider value={{isLogged:!isError}}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = React.useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within AppContextProvider");
    }
    return context as AppContext;
};






