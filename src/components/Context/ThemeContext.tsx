import React, { createContext, useReducer, useContext, ReactNode } from 'react';

// Define the shape of the theme state
interface ThemeState {
    theme: 'light' | 'dark';
}

// Define the action type
interface ThemeAction {
    type: 'TOGGLE_THEME';
}

// Define the context value shape
interface ThemeContextType extends ThemeState {
    toggleTheme: () => void;
}

// Theme context object.
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Dispatch function for theme-related operations.
 * @param {ThemeState} state - State variable.
 * @param {ThemeAction} action - Name of action for state variable.
 * @returns Updated theme state.
 */
const themeReducer = (state: ThemeState, action: ThemeAction): ThemeState => {
    switch (action.type) {
        case 'TOGGLE_THEME':
            return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
        default:
            return state;
    }
};

/**
 * Context provider component.
 * @param {ReactNode} children - Child components wrapped by ThemeProvider.
 * @returns ThemeContext.Provider component.
 */
const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(themeReducer, { theme: 'light' });

    /**
     * Toggle the theme. If dark, switch to light; if light, switch to dark.
     */
    const toggleTheme = () => {
        dispatch({ type: 'TOGGLE_THEME' });
    };

    return (
        <ThemeContext.Provider value={{ ...state, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

/**
 * Get the theme context.
 * @returns Theme context value containing state and toggleTheme function.
 */
const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export { ThemeProvider, useTheme };
