import { useState } from "react";
import apiClient from "../api/apiClient";

export default function ITSupport() {
  const [activeTab, setActiveTab] = useState("system");
  const [systemInfo, setSystemInfo] = useState(null);
  const [pingHost, setPingHost] = useState("");
  const [pingResult, setPingResult] = useState(null);
  const [diskInfo, setDiskInfo] = useState(null);
  const [diagnosticLog, setDiagnosticLog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSystemInfo = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/diagnostics/system-info");
      setSystemInfo(res.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch system info");
    } finally {
      setLoading(false);
    }
  };

  const handlePingTest = async (e) => {
    e.preventDefault();
    if (!pingHost.trim()) {
      setError("Please enter a host");
      return;
    }

    try {
      setLoading(true);
      const res = await apiClient.post("/diagnostics/ping", { host: pingHost });
      setPingResult(res.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Ping test failed");
      setPingResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDiskInfo = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await apiClient.get("/diagnostics/disk-info");
      setDiskInfo(res.data);
    } catch (err) {
      console.error("Disk info error:", err);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || "Failed to fetch disk info";
      setError(errorMsg);
      setDiskInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDiagnosticLog = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/diagnostics/diagnostic-log");
      setDiagnosticLog(res.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate diagnostic log");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">IT Support Tools</h1>

        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("system")}
              className={`px-6 py-4 font-semibold ${
                activeTab === "system"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600"
              }`}
            >
              System Info
            </button>
            <button
              onClick={() => setActiveTab("ping")}
              className={`px-6 py-4 font-semibold ${
                activeTab === "ping"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600"
              }`}
            >
              Ping Test
            </button>
            <button
              onClick={() => setActiveTab("disk")}
              className={`px-6 py-4 font-semibold ${
                activeTab === "disk"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600"
              }`}
            >
              Disk Info
            </button>
            <button
              onClick={() => setActiveTab("diagnostic")}
              className={`px-6 py-4 font-semibold ${
                activeTab === "diagnostic"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600"
              }`}
            >
              Full Diagnostic
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* System Info Tab */}
            {activeTab === "system" && (
              <div>
                <button
                  onClick={handleSystemInfo}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Loading..." : "Get System Info"}
                </button>

                {systemInfo && (
                  <div className="mt-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border rounded p-4">
                        <p className="text-gray-600 text-sm">Platform</p>
                        <p className="text-lg font-semibold">{systemInfo.system.platform}</p>
                      </div>
                      <div className="border rounded p-4">
                        <p className="text-gray-600 text-sm">Architecture</p>
                        <p className="text-lg font-semibold">{systemInfo.system.arch}</p>
                      </div>
                      <div className="border rounded p-4">
                        <p className="text-gray-600 text-sm">CPU Count</p>
                        <p className="text-lg font-semibold">{systemInfo.system.cpuCount}</p>
                      </div>
                      <div className="border rounded p-4">
                        <p className="text-gray-600 text-sm">CPU Model</p>
                        <p className="text-sm font-semibold">{systemInfo.system.cpuModel}</p>
                      </div>
                    </div>

                    <div className="border rounded p-4 bg-blue-50">
                      <p className="text-gray-600 text-sm font-semibold mb-2">Memory Usage</p>
                      <p className="text-2xl font-bold text-blue-600 mb-2">{systemInfo.memory.percentage}</p>
                      <p className="text-sm text-gray-700">{systemInfo.memory.used} / {systemInfo.memory.total}</p>
                    </div>

                    <div className="border rounded p-4 bg-green-50">
                      <p className="text-gray-600 text-sm font-semibold mb-2">Uptime</p>
                      <p className="text-2xl font-bold text-green-600">{systemInfo.uptime.formatted}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Ping Test Tab */}
            {activeTab === "ping" && (
              <div>
                <form onSubmit={handlePingTest} className="mb-6">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={pingHost}
                      onChange={(e) => setPingHost(e.target.value)}
                      placeholder="Enter host (e.g., google.com)"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? "Pinging..." : "Ping"}
                    </button>
                  </div>
                </form>

                {pingResult && (
                  <div className="border rounded p-4 bg-gray-50">
                    <pre className="text-sm overflow-auto text-gray-700">
                      {pingResult.result}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Disk Info Tab */}
            {activeTab === "disk" && (
              <div>
                <button
                  onClick={handleDiskInfo}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Loading..." : "Get Disk Info"}
                </button>

                {diskInfo && (
                  <div className="border rounded p-4 bg-gray-50 mt-6">
                    <pre className="text-sm overflow-auto text-gray-700">
                      {diskInfo.result}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Full Diagnostic Tab */}
            {activeTab === "diagnostic" && (
              <div>
                <button
                  onClick={handleDiagnosticLog}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Generating..." : "Generate Full Report"}
                </button>

                {diagnosticLog && (
                  <div className="mt-6 space-y-4">
                    <div className="border rounded p-4 bg-blue-50">
                      <p className="text-sm font-semibold text-gray-700 mb-2">System Information</p>
                      <p className="text-sm">Hostname: <span className="font-mono">{diagnosticLog.systemInfo.hostname}</span></p>
                      <p className="text-sm">Platform: <span className="font-mono">{diagnosticLog.systemInfo.platform}</span></p>
                    </div>

                    <div className="border rounded p-4 bg-gray-50">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Diagnostic Report</p>
                      <pre className="text-xs overflow-auto text-gray-700">
                        {diagnosticLog.report}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
