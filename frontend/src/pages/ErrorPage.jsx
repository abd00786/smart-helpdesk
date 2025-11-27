import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
    const error = useRouteError();

    // Normalize error message
    const message =
        error?.statusText ||
        error?.message ||
        "Something went wrong. Please try again.";

    // Determine error code
    const status = error?.status || 500;

    const getTitle = () => {
        switch (status) {
            case 404:
                return "Page Not Found";
            case 500:
                return "Internal Server Error";
            case 401:
                return "Unauthorized";
            case 403:
                return "Forbidden";
            default:
                return "Unexpected Error";
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-6">
            <h1 className="text-7xl font-bold text-red-400">{status}</h1>
            <h2 className="text-3xl mt-4">{getTitle()}</h2>
            <p className="text-gray-400 mt-2 text-center max-w-lg">
                {message}
            </p>

            <button
                onClick={() => (window.location.href = "/")}
                className="mt-6 px-6 py-3 bg-blue-600 rounded-lg text-white hover:bg-blue-700"
            >
                Go Home
            </button>
        </div>
    );
}
