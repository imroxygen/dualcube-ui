import { Component, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  onError: (error: Error) => void; // Required by Lexical
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    this.props.onError(error); // Pass the error to Lexical's handler
  }

  render() {
    if (this.state.hasError) {
      return <div style={{ color: "red" }}>Something went wrong.</div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
