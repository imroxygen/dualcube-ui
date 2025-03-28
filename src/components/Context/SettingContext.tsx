import React, { createContext, useReducer, useContext, ReactNode } from "react";

// Define the type for the settings state.
interface SettingState {
    settingName: string;
    setting: Record<string, any>;
}

// Define action types.
type SettingAction =
    | { type: "SET_SETTINGS"; payload: { settingName: string; setting: Record<string, any> } }
    | { type: "UPDATE_SETTINGS"; payload: { key: string; value: any } }
    | { type: "CLEAR_SETTINGS" };

// Create the context with a default value.
const SettingContext = createContext<SettingState & {
    setSetting: (settingName: string, setting: Record<string, any>) => void;
    updateSetting: (key: string, value: any) => void;
    clearSetting: () => void;
} | null>(null);

// Reducer function to manage settings state.
const settingReducer = (state: SettingState, action: SettingAction): SettingState => {
    switch (action.type) {
        case "SET_SETTINGS":
            return { ...action.payload };
        case "UPDATE_SETTINGS":
            return { ...state, setting: { ...state.setting, [action.payload.key]: action.payload.value } };
        case "CLEAR_SETTINGS":
            return { settingName: "", setting: {} };
        default:
            return state;
    }
};

// Define props for SettingProvider.
interface SettingProviderProps {
    children: ReactNode;
}

// Provider component.
export const SettingProvider: React.FC<SettingProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(settingReducer, { settingName: "", setting: {} });

    const setSetting = (settingName: string, setting: Record<string, any>) => {
        dispatch({ type: "SET_SETTINGS", payload: { settingName, setting } });
    };

    const updateSetting = (key: string, value: any) => {
        dispatch({ type: "UPDATE_SETTINGS", payload: { key, value } });
    };

    const clearSetting = () => {
        dispatch({ type: "CLEAR_SETTINGS" });
    };

    return (
        <SettingContext.Provider value={{ ...state, setSetting, updateSetting, clearSetting }}>
            {children}
        </SettingContext.Provider>
    );
};

// Custom hook to use the settings context.
export const useSetting = () => {
    const context = useContext(SettingContext);
    if (!context) {
        throw new Error("useSetting must be used within a SettingProvider");
    }
    return context;
};
