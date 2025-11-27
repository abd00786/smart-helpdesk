import React from "react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, message: "" };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, message: error.message };
    }

    componentDidCatch(error, info) {
        console.error("Error captured:", error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-6">
                    <h1 className="text-5xl text-red-400 font-bold">Unexpected Error</h1>
                    <p className="mt-4 text-gray-300">{this.state.message}</p>
                    <button
                        className="mt-6 px-6 py-3 bg-blue-600 rounded-lg"
                        onClick={() => window.location.reload()}
                    >
                        Reload Page
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
