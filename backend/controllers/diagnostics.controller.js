import { exec } from "child_process";
import { promisify } from "util";
import os from "os";
import fs from "fs";
import path from "path";

const execPromise = promisify(exec);

export const runPingTest = async (req, res) => {
  try {
    const { host } = req.body;
    if (!host) {
      return res.status(400).json({ message: "Host is required" });
    }

    const command = process.platform === "win32" ? `ping -n 4 ${host}` : `ping -c 4 ${host}`;
    const { stdout } = await execPromise(command);

    res.json({
      test: "ping",
      host,
      result: stdout,
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      test: "ping",
      error: error.message,
      timestamp: new Date(),
    });
  }
};

export const getSystemInfo = async (req, res) => {
  try {
    const cpus = os.cpus();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memPercentage = ((usedMem / totalMem) * 100).toFixed(2);

    const uptime = os.uptime();
    const uptimeHours = Math.floor(uptime / 3600);
    const uptimeMinutes = Math.floor((uptime % 3600) / 60);

    res.json({
      timestamp: new Date(),
      system: {
        platform: os.platform(),
        arch: os.arch(),
        cpuCount: cpus.length,
        cpuModel: cpus[0]?.model || "Unknown",
      },
      memory: {
        total: `${(totalMem / 1024 / 1024 / 1024).toFixed(2)} GB`,
        used: `${(usedMem / 1024 / 1024 / 1024).toFixed(2)} GB`,
        free: `${(freeMem / 1024 / 1024 / 1024).toFixed(2)} GB`,
        percentage: `${memPercentage}%`,
      },
      uptime: {
        hours: uptimeHours,
        minutes: uptimeMinutes,
        formatted: `${uptimeHours}h ${uptimeMinutes}m`,
      },
      loadAverage: os.loadavg(),
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      timestamp: new Date(),
    });
  }
};

export const getDiskInfo = async (req, res) => {
  try {
    const drives = [];
    
    if (process.platform === "win32") {
      // On Windows, check common drive letters
      const drivesToCheck = ['C:', 'D:', 'E:', 'F:'];
      
      for (const drive of drivesToCheck) {
        try {
          const stats = fs.statfsSync(drive);
          const total = stats.blocks * stats.bsize;
          const free = stats.bfree * stats.bsize;
          const used = total - free;
          
          drives.push({
            drive,
            total: `${(total / 1024 / 1024 / 1024).toFixed(2)} GB`,
            used: `${(used / 1024 / 1024 / 1024).toFixed(2)} GB`,
            free: `${(free / 1024 / 1024 / 1024).toFixed(2)} GB`,
            percentage: `${((used / total) * 100).toFixed(2)}%`,
          });
        } catch (err) {
          // Drive doesn't exist or is not accessible, skip
        }
      }
    } else {
      // On Linux/Mac, use df command
      const { stdout } = await execPromise("df -h");
      return res.json({
        test: "disk",
        result: stdout,
        timestamp: new Date(),
      });
    }
    
    res.json({
      test: "disk",
      drives,
      result: drives.map(d => 
        `${d.drive}: ${d.used} used / ${d.total} total (${d.percentage} used)`
      ).join('\n'),
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      test: "disk",
      error: error.message,
      message: "Failed to retrieve disk info. System may not support disk statistics.",
      timestamp: new Date(),
    });
  }
};

export const generateDiagnosticLog = async (req, res) => {
  try {
    const systemInfo = {
      timestamp: new Date(),
      platform: os.platform(),
      arch: os.arch(),
      cpus: os.cpus().length,
      memory: {
        total: os.totalmem(),
        free: os.freemem(),
      },
      uptime: os.uptime(),
      hostname: os.hostname(),
    };

    const logs = {
      systemInfo,
      diagnostics: {
        cpuLoad: os.loadavg(),
        networkInterfaces: os.networkInterfaces(),
      },
      report: `
=== SYSTEM DIAGNOSTIC REPORT ===
Generated: ${new Date().toISOString()}
Platform: ${systemInfo.platform}
Hostname: ${systemInfo.hostname}
CPUs: ${systemInfo.cpus}
Uptime: ${(systemInfo.uptime / 3600).toFixed(2)} hours
Memory: ${(systemInfo.memory.total / 1024 / 1024 / 1024).toFixed(2)} GB total
Free Memory: ${(systemInfo.memory.free / 1024 / 1024 / 1024).toFixed(2)} GB
================================
      `,
    };

    res.json(logs);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      timestamp: new Date(),
    });
  }
};
