import { Component, ReactNode } from "react";
import toast from "react-hot-toast";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("React ErrorBoundary caught an error:", error, errorInfo);

    toast.error("Unexpected error occurred. Please try refreshing the page.");
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black to-gray-900 text-white px-4 text-center">
          <div className="text-6xl mb-4">😵‍💫</div>
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-2">
            Oops! Something Went Wrong
          </h1>
          <p className="text-gray-400 text-base sm:text-lg mb-6 max-w-md">
            An unexpected error occurred. Please try refreshing the page or come
            back later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-purple-700 hover:bg-purple-800 rounded-full text-white font-semibold shadow-lg transition-all"
          >
            🔄 Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
