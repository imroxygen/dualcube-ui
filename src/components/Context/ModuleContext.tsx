import React, { createContext, useReducer, useContext, ReactNode } from "react";

// Define the module state type
type ModuleState = string[];

// Define action types
type ModuleAction =
    | { type: "INSERT_MODULE"; payload: string }
    | { type: "DELETE_MODULE"; payload: string };

// Create the context with a default value
const ModuleContext = createContext<{
    modules: ModuleState;
    insertModule: (moduleName: string) => void;
    removeModule: (moduleName: string) => void;
} | null>(null);

// Reducer function to manage modules state
const ModuleReducer = (state: ModuleState, action: ModuleAction): ModuleState => {
    switch (action.type) {
        case "INSERT_MODULE":
            return [...state, action.payload];
        case "DELETE_MODULE":
            return state.filter((module) => module !== action.payload);
        default:
            return state;
    }
};

// Define props for ModuleProvider
interface ModuleProviderProps {
    children: ReactNode;
    modules?: string[]; // Default module list
}

// Provider component
export const ModuleProvider: React.FC<ModuleProviderProps> = ({ children, modules = [] }) => {
    const [state, dispatch] = useReducer(ModuleReducer, modules);

    const insertModule = (moduleName: string) => {
        dispatch({ type: "INSERT_MODULE", payload: moduleName });
    };

    const removeModule = (moduleName: string) => {
        dispatch({ type: "DELETE_MODULE", payload: moduleName });
    };

    return (
        <ModuleContext.Provider value={{ modules: state, insertModule, removeModule }}>
            {children}
        </ModuleContext.Provider>
    );
};

// Custom hook to use the module context
export const useModules = () => {
    const context = useContext(ModuleContext);
    if (!context) {
        throw new Error("useModules must be used within a ModuleProvider");
    }
    return context;
};
