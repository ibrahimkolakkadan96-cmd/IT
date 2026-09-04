import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity,
  Play,
  Terminal,
  WifiOff,
} from 'lucide-react';
import { NetworkDevice, Branch } from '../../types';

interface NetworkMonitoringViewProps {
  networkDevices: NetworkDevice[];
  branches: Branch[];
  onOpenCreateTicketForDevice: (device: NetworkDevice) => void;
}

export const NetworkMonitoringView: React.FC<NetworkMonitoringViewProps> = ({
  networkDevices = [],
  onOpenCreateTicketForDevice,
}) => {
  const safeDevices = Array.isArray(networkDevices) ? networkDevices : [];
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(
    safeDevices[0]?.id || ''
  );

  useEffect(() => {
    if (safeDevices.length > 0) {
      if (!safeDevices.some((d) => d.id === selectedDeviceId)) {
        setSelectedDeviceId(safeDevices[0].id);
      }
    } else {
      setSelectedDeviceId('');
    }
  }, [safeDevices, selectedDeviceId]);

  const selectedDevice = useMemo(() => {
    return safeDevices.find((d) => d.id === selectedDeviceId) || safeDevices[0] || null;
  }, [safeDevices, selectedDeviceId]);

  const [pingRunning, setPingRunning] = useState(false);
  const [pingLogs, setPingLogs] = useState<string[]>([
    'ICMP ping engine initialized.',
    'Select a device and press "Retest Connection".',
  ]);

  const runPingDiagnostic = (device: NetworkDevice | null) => {
    if (!device) return;
    setSelectedDeviceId(device.id);
    setPingRunning(true);
    setPingLogs([
      `[PROBE] Pinging ${device.name} (${device.ip}) with 64 bytes of data:`,
    ]);

    setTimeout(() => {
      setPingLogs((prev) => [
        ...prev,
        `Reply from ${device.ip}: bytes=64 time=${(device.latencyMs + Math.random() * 2).toFixed(1)}ms TTL=64`,
      ]);
    }, 400);

    setTimeout(() => {
      setPingLogs((prev) => [
        ...prev,
        `Reply from ${device.ip}: bytes=64 time=${(device.latencyMs + Math.random() * 1.5).toFixed(1)}ms TTL=64`,
      ]);
    }, 800);

    setTimeout(() => {
      setPingLogs((prev) => [
        ...prev,
        device.packetLossPercent > 10
          ? `Request timed out. (Packet loss detected: ${device.packetLossPercent}%)`
          : `Reply from ${device.ip}: bytes=64 time=${(device.latencyMs + Math.random() * 1.2).toFixed(1)}ms TTL=64`,
      ]);
    }, 1200);

    setTimeout(() => {
      setPingLogs((prev) => [
        ...prev,
        `--- ${device.ip} ping statistics ---`,
        `4 packets transmitted, ${device.packetLossPercent > 10 ? '3' : '4'} received, ${device.packetLossPercent}% packet loss, avg latency ${device.latencyMs}ms`,
        device.packetLossPercent > 10
          ? '⚠ WARNING: High jitter and packet loss on link interface!'
          : '✓ Diagnostic successful. Link latency within nominal operational thresholds.',
      ]);
      setPingRunning(false);
    }, 1600);
  };

  const avgLatency = (
    networkDevices.reduce((sum, d) => sum + d.latencyMs, 0) / networkDevices.length
  ).toFixed(1);

  const onlineNodes = networkDevices.filter((d) => d.status === 'Online').length;
  const degradedNodes = networkDevices.filter((d) => d.status === 'Degraded').length;
  const offlineNodes = networkDevices.filter((d) => d.status === 'Offline').length;

  return (
    <div className="space-y-4 text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-sm p-3.5 shadow-sm">
        <div>
          <h1 className="text-sm font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <span>Network Infrastructure & WAN Telemetry</span>
            <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
              {networkDevices.length} Monitored Endpoints
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time ping probes, packet loss telemetry, bandwidth saturation gauges, and switch port density.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => runPingDiagnostic(selectedDevice)}
            disabled={pingRunning}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs transition-all shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{pingRunning ? 'Probing...' : 'Probe Selected Device'}</span>
          </button>
        </div>
      </div>

      {/* Network Overview Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-sm bg-white border border-slate-200 shadow-sm">
          <span className="text-[10px] text-slate-500 font-semibold uppercase">ONLINE NODES</span>
          <div className="text-lg font-bold font-mono text-green-700 mt-0.5">
            {onlineNodes} / {networkDevices.length}
          </div>
          <span className="text-[10px] text-slate-400">Operational state</span>
        </div>

        <div className="p-3 rounded-sm bg-white border border-slate-200 shadow-sm">
          <span className="text-[10px] text-slate-500 font-semibold uppercase">AVG WAN LATENCY</span>
          <div className="text-lg font-bold font-mono text-blue-700 mt-0.5">{avgLatency} ms</div>
          <span className="text-[10px] text-slate-400">Across enterprise links</span>
        </div>

        <div className="p-3 rounded-sm bg-white border border-slate-200 shadow-sm">
          <span className="text-[10px] text-slate-500 font-semibold uppercase">DEGRADED / FLAPPING</span>
          <div className="text-lg font-bold font-mono text-amber-700 mt-0.5">{degradedNodes}</div>
          <span className="text-[10px] text-slate-400">High packet jitter</span>
        </div>

        <div className="p-3 rounded-sm bg-white border border-slate-200 shadow-sm">
          <span className="text-[10px] text-slate-500 font-semibold uppercase">OFFLINE CRITICAL</span>
          <div className="text-lg font-bold font-mono text-red-700 mt-0.5">{offlineNodes}</div>
          <span className="text-[10px] text-slate-400">Unresponsive nodes</span>
        </div>
      </div>

      {/* Main Grid: Devices List & Live Ping Diagnostic Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Device Cards List (2 cols) */}
        <div className="lg:col-span-2 space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-tight">
              Monitored Core Switches & Gateway Routers
            </h2>
            <span className="text-[11px] text-slate-500">Click node to inspect</span>
          </div>

          <div className="space-y-2.5">
            {safeDevices.length === 0 ? (
              <div className="p-6 rounded-sm bg-white border border-slate-200 text-center text-xs text-slate-500 space-y-2">
                <WifiOff className="w-6 h-6 text-slate-400 mx-auto" />
                <p className="font-semibold text-slate-700">No Network Devices for this Branch</p>
                <p className="text-[11px] text-slate-400">
                  No edge switches, routers, or firewalls are registered for this branch node. Switch branch to view active nodes.
                </p>
              </div>
            ) : (
              safeDevices.map((device) => {
                const isSelected = selectedDevice?.id === device.id;
                const bwPercent = Math.round((device.bandwidthUsageMbps / (device.maxBandwidthMbps || 1)) * 100);

                return (
                  <div
                    key={device.id}
                    id={`network-node-${device.id}`}
                    onClick={() => setSelectedDeviceId(device.id)}
                    className={`p-3.5 rounded-sm border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-blue-500 ring-1 ring-blue-500 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-900">{device.name}</span>
                        <span className="text-[11px] text-slate-500">({device.type})</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-600 font-mono">
                        <span className="text-blue-700 font-semibold">{device.ip}</span>
                        <span>· {device.branchName}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          device.status === 'Online'
                            ? 'bg-green-100 text-green-700'
                            : device.status === 'Degraded'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {device.status}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          runPingDiagnostic(device);
                        }}
                        className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-blue-700 text-xs font-semibold"
                      >
                        Ping Test
                      </button>
                    </div>
                  </div>

                  {/* Telemetry Metrics */}
                  <div className="grid grid-cols-4 gap-2 mt-2.5 pt-2.5 border-t border-slate-100 text-center">
                    <div className="p-1.5 rounded bg-slate-50 border border-slate-100">
                      <div className="text-[9px] text-slate-400 font-semibold uppercase">LATENCY</div>
                      <div
                        className={`text-xs font-bold font-mono ${
                          device.latencyMs > 100
                            ? 'text-red-600'
                            : device.latencyMs > 40
                            ? 'text-amber-600'
                            : 'text-green-700'
                        }`}
                      >
                        {device.latencyMs} ms
                      </div>
                    </div>
                    <div className="p-1.5 rounded bg-slate-50 border border-slate-100">
                      <div className="text-[9px] text-slate-400 font-semibold uppercase">PACKET LOSS</div>
                      <div
                        className={`text-xs font-bold font-mono ${
                          device.packetLossPercent > 5 ? 'text-red-600' : 'text-slate-800'
                        }`}
                      >
                        {device.packetLossPercent}%
                      </div>
                    </div>
                    <div className="p-1.5 rounded bg-slate-50 border border-slate-100">
                      <div className="text-[9px] text-slate-400 font-semibold uppercase">UPTIME</div>
                      <div className="text-xs font-bold font-mono text-slate-800">{device.uptimePercentage}%</div>
                    </div>
                    <div className="p-1.5 rounded bg-slate-50 border border-slate-100">
                      <div className="text-[9px] text-slate-400 font-semibold uppercase">ACTIVE PORTS</div>
                      <div className="text-xs font-bold font-mono text-blue-700">
                        {device.portStatus.activePorts}/{device.portStatus.totalPorts}
                      </div>
                    </div>
                  </div>

                  {/* Bandwidth Throughput Bar */}
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-slate-500">
                      <span>Throughput: {device.bandwidthUsageMbps} Mbps / {device.maxBandwidthMbps} Mbps</span>
                      <span className={bwPercent > 80 ? 'text-red-600 font-bold' : ''}>{bwPercent}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          bwPercent > 85 ? 'bg-red-500' : bwPercent > 70 ? 'bg-amber-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${bwPercent}%` }}
                      />
                    </div>
                  </div>

                  {device.status !== 'Online' && (
                    <div className="mt-2.5 flex items-center justify-between text-xs p-2 rounded bg-red-50 border border-red-200 text-red-800">
                      <span>Degradation or outage detected on this edge node.</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenCreateTicketForDevice(device);
                        }}
                        className="px-2 py-0.5 rounded bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold"
                      >
                        Log Incident Ticket
                      </button>
                    </div>
                  )}
                </div>
              );
            }))}
          </div>
        </div>

        {/* Diagnostic Terminal & Node Specs (1 col) */}
        <div className="space-y-3.5">
          {!selectedDevice ? (
            <div className="p-6 rounded-sm bg-white border border-slate-200 text-center text-xs text-slate-500 space-y-2">
              <Activity className="w-6 h-6 text-slate-400 mx-auto" />
              <p className="font-semibold text-slate-700">No Edge Node Selected</p>
              <p className="text-[11px] text-slate-400">
                Select a network device or switch branches to run ICMP diagnostics.
              </p>
            </div>
          ) : (
            <>
              <div className="p-3.5 rounded-sm bg-white border border-slate-200 shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-blue-600" />
                  <span>Diagnostic Probe Console</span>
                </h3>

                {/* Terminal Window */}
                <div className="rounded bg-slate-900 border border-slate-800 p-3 font-mono text-[11px] text-green-400 space-y-1 min-h-[220px] max-h-[300px] overflow-y-auto">
                  <div className="text-slate-500">Enterprise Ping Diagnostic Subsystem v2.8</div>
                  <div className="text-slate-400 pb-1 border-b border-slate-800">
                    Target: {selectedDevice.name} [{selectedDevice.ip}]
                  </div>

                  {pingLogs.map((log, index) => (
                    <div
                      key={index}
                      className={
                        log.includes('WARNING')
                          ? 'text-red-400 font-bold'
                          : log.includes('successful')
                          ? 'text-green-300 font-bold'
                          : 'text-slate-300'
                      }
                    >
                      {log}
                    </div>
                  ))}

                  {pingRunning && <div className="text-cyan-400 animate-pulse">Scanning packet hops...</div>}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => runPingDiagnostic(selectedDevice)}
                    disabled={pingRunning}
                    className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs cursor-pointer"
                  >
                    Retest Connection
                  </button>

                  <button
                    onClick={() => setPingLogs(['Diagnostic console cleared. Ready.'])}
                    className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    Clear Log
                  </button>
                </div>
              </div>

              {/* Selected Device Hardware Specs */}
              <div className="p-3.5 rounded-sm bg-white border border-slate-200 shadow-sm space-y-2.5 text-xs">
                <h3 className="font-bold text-slate-800 uppercase tracking-tight text-xs">Active Node Hardware Profile</h3>
                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between p-1.5 rounded bg-slate-50 border border-slate-100">
                    <span className="text-slate-500">Firmware:</span>
                    <span className="text-slate-800 font-medium">{selectedDevice.firmwareVersion}</span>
                  </div>
                  <div className="flex justify-between p-1.5 rounded bg-slate-50 border border-slate-100">
                    <span className="text-slate-500">Total Ports:</span>
                    <span className="text-slate-800 font-medium">{selectedDevice.portStatus?.totalPorts ?? 0} RJ45/SFP+</span>
                  </div>
                  <div className="flex justify-between p-1.5 rounded bg-slate-50 border border-slate-100">
                    <span className="text-slate-500">Assigned Branch:</span>
                    <span className="text-slate-800 font-medium">{selectedDevice.branchName}</span>
                  </div>
                  <div className="flex justify-between p-1.5 rounded bg-slate-50 border border-slate-100">
                    <span className="text-slate-500">Last Telemetry Ping:</span>
                    <span className="text-blue-700 font-bold">{selectedDevice.lastChecked}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
