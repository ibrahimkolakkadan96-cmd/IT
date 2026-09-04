import React, { useState, useEffect, useMemo } from 'react';
import {
  MonitorPlay,
  Terminal,
  Send,
  WifiOff,
} from 'lucide-react';
import { RemoteSession, ITAsset } from '../../types';

interface RemoteSupportViewProps {
  sessions: RemoteSession[];
  assets: ITAsset[];
  onOpenAssetTicket: (assetTag: string) => void;
}

export const RemoteSupportView: React.FC<RemoteSupportViewProps> = ({
  sessions = [],
  onOpenAssetTicket,
}) => {
  const safeSessions = Array.isArray(sessions) ? sessions : [];
  const [selectedSessionId, setSelectedSessionId] = useState<string>(
    safeSessions[0]?.id || ''
  );

  useEffect(() => {
    if (safeSessions.length > 0) {
      if (!safeSessions.some((s) => s.id === selectedSessionId)) {
        setSelectedSessionId(safeSessions[0].id);
      }
    } else {
      setSelectedSessionId('');
    }
  }, [safeSessions, selectedSessionId]);

  const activeSession = useMemo(() => {
    return safeSessions.find((s) => s.id === selectedSessionId) || safeSessions[0] || null;
  }, [safeSessions, selectedSessionId]);

  const [commandInput, setCommandInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<string[]>(() => {
    if (safeSessions[0]?.recentLogs && safeSessions[0].recentLogs.length > 0) {
      return [
        ...safeSessions[0].recentLogs,
        'Remote diagnostic session active. Type a command or click quick actions below.',
      ];
    }
    return [
      'Remote diagnostic subsystem ready.',
      'Select an active session or verify network topology status.',
    ];
  });

  const handleSelectSession = (s: RemoteSession) => {
    setSelectedSessionId(s.id);
    setTerminalLogs([
      `Session attached to ${s.deviceName} (${s.ipAddress})`,
      `Protocol: ${s.protocol} | Authenticated as ${s.technician}`,
      ...(s.recentLogs || []),
    ]);
  };

  const executeCommand = (cmd: string) => {
    if (!cmd.trim()) return;
    const cleanCmd = cmd.trim();
    setTerminalLogs((prev) => [...prev, `$ ${cleanCmd}`]);

    if (!activeSession) {
      setTimeout(() => {
        setTerminalLogs((prev) => [
          ...prev,
          'Error: No active host connection. Please select a remote session node first.',
        ]);
      }, 200);
      setCommandInput('');
      return;
    }

    const hostIp = activeSession.ipAddress || '127.0.0.1';
    const hostName = activeSession.deviceName || 'remote-host';

    setTimeout(() => {
      if (cleanCmd.includes('top') || cleanCmd.includes('cpu')) {
        setTerminalLogs((prev) => [
          ...prev,
          `PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND`,
          `  1 root      20   0  168532  11824   8340 S   0.0   0.1   0:02.14 systemd`,
          `891 docker    20   0 1482912 245012  98120 S  18.4   3.8  14:22.09 dockerd`,
          `942 postgres  20   0 2145892 512000 120000 S  12.1   7.9   8:41.33 postgres: 16-main`,
        ]);
      } else if (cleanCmd.includes('df') || cleanCmd.includes('disk')) {
        setTerminalLogs((prev) => [
          ...prev,
          `Filesystem      Size  Used Avail Use% Mounted on`,
          `/dev/nvme0n1p2  1.8T  540G  1.2T  32% /`,
          `tmpfs            32G     0   32G   0% /dev/shm`,
          `/dev/nvme1n1    3.8T  1.9T  1.9T  50% /data/storage`,
        ]);
      } else if (cleanCmd.includes('ip') || cleanCmd.includes('ifconfig')) {
        setTerminalLogs((prev) => [
          ...prev,
          `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN`,
          `    inet 127.0.0.1/8 scope host lo`,
          `2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP`,
          `    inet ${hostIp}/24 brd 10.40.4.255 scope global eth0`,
        ]);
      } else if (cleanCmd.includes('restart') || cleanCmd.includes('systemctl')) {
        setTerminalLogs((prev) => [
          ...prev,
          `[OK] Executed: ${cleanCmd}`,
          `Daemon reloaded and service unit successfully restarted with zero error code.`,
        ]);
      } else if (cleanCmd.includes('reboot')) {
        setTerminalLogs((prev) => [
          ...prev,
          `Broadcast message from root@${hostName}:`,
          `The system is going down for graceful reboot NOW!`,
          `Connection closed by remote host.`,
        ]);
      } else {
        setTerminalLogs((prev) => [
          ...prev,
          `Output for [${cleanCmd}]: Operation completed successfully. Return code 0.`,
        ]);
      }
    }, 300);

    setCommandInput('');
  };

  return (
    <div className="space-y-4 text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-sm p-3.5 shadow-sm">
        <div>
          <h1 className="text-sm font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
            <MonitorPlay className="w-4 h-4 text-blue-600" />
            <span>Remote Support & Diagnostic Operations</span>
            <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
              {safeSessions.length} Registered Remote Agents
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Secure agentless and agent-assisted remote desktop, SSH terminal management, and live hardware telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-2.5 py-1 rounded bg-green-50 text-green-800 border border-green-200 text-xs font-mono font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse" />
            <span>{safeSessions.filter(s => s.connectionStatus === 'Connected').length} Active TLS Tunnels</span>
          </span>
        </div>
      </div>

      {/* Main Grid: Active Session List on Left, Live Console on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Col: Session Selector */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-tight">
              Active Remote Sessions
            </h2>
            <span className="text-[10px] text-slate-500 font-mono">TLS 1.3</span>
          </div>

          <div className="space-y-2.5">
            {safeSessions.length === 0 ? (
              <div className="p-4 rounded-sm bg-white border border-slate-200 text-center text-xs text-slate-500 space-y-2">
                <WifiOff className="w-6 h-6 text-slate-400 mx-auto" />
                <p className="font-semibold text-slate-700">No Sessions for this Branch</p>
                <p className="text-[11px] text-slate-400">
                  No active diagnostic agent is enrolled for this branch. Switch branch to All Branches or another site.
                </p>
              </div>
            ) : (
              safeSessions.map((session) => {
                const isSelected = activeSession?.id === session.id;

                return (
                  <div
                    key={session.id}
                    id={`session-card-${session.id}`}
                    onClick={() => handleSelectSession(session)}
                    className={`p-3 rounded-sm border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-blue-500 ring-1 ring-blue-500 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-bold text-blue-700">{session.sessionCode}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-medium">
                            {session.protocol}
                          </span>
                        </div>
                        <h3 className="text-xs font-bold text-slate-900 mt-1">{session.deviceName}</h3>
                        <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                          {session.ipAddress} · {session.branchName}
                        </div>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          session.connectionStatus === 'Connected'
                            ? 'bg-green-100 text-green-700'
                            : session.connectionStatus === 'Standby'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {session.connectionStatus}
                      </span>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                      <span>Tech: <strong className="text-slate-800">{(session.technician || 'Staff').split(' ')[0]}</strong></span>
                      <span className="font-mono">User: {session.loggedUser}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right 2 Cols: Live Diagnostics & Shell Console */}
        <div className="lg:col-span-2 space-y-3.5">
          {!activeSession ? (
            <div className="p-8 rounded-sm bg-white border border-slate-200 text-center space-y-2">
              <MonitorPlay className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">No Active Remote Host Selected</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Select an active remote session from the left panel, or reset the branch filter to view and interact with live telemetry.
              </p>
            </div>
          ) : (
            <>
              {/* Active Session Telemetry Banner */}
              <div className="p-3.5 rounded-sm bg-white border border-slate-200 shadow-sm space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{activeSession.deviceName}</h3>
                      <span className="text-xs font-mono text-blue-700 font-semibold">({activeSession.assetTag})</span>
                    </div>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">
                      OS: {activeSession.os} · Active duration: {activeSession.durationMinutes} min
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenAssetTicket(activeSession.assetTag)}
                      className="px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold hover:bg-amber-100 transition-colors"
                    >
                      Log Ticket for Node
                    </button>
                  </div>
                </div>

                {/* Live Metrics Gauges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
                  <div className="p-2 rounded bg-slate-50 border border-slate-100">
                    <span className="text-[9px] text-slate-400 font-semibold uppercase">CPU LOAD</span>
                    <div
                      className={`text-base font-bold font-mono mt-0.5 ${
                        (activeSession.systemMetrics?.cpuPercent || 0) > 80 ? 'text-red-600' : 'text-blue-700'
                      }`}
                    >
                      {activeSession.systemMetrics?.cpuPercent || 0}%
                    </div>
                    <div className="w-full h-1 rounded-full bg-slate-200 mt-1 overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded"
                        style={{ width: `${activeSession.systemMetrics?.cpuPercent || 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-2 rounded bg-slate-50 border border-slate-100">
                    <span className="text-[9px] text-slate-400 font-semibold uppercase">MEMORY RAM</span>
                    <div className="text-base font-bold font-mono text-green-700 mt-0.5">
                      {activeSession.systemMetrics?.memoryPercent || 0}%
                    </div>
                    <div className="w-full h-1 rounded-full bg-slate-200 mt-1 overflow-hidden">
                      <div
                        className="h-full bg-green-600 rounded"
                        style={{ width: `${activeSession.systemMetrics?.memoryPercent || 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-2 rounded bg-slate-50 border border-slate-100">
                    <span className="text-[9px] text-slate-400 font-semibold uppercase">DISK USAGE</span>
                    <div className="text-base font-bold font-mono text-slate-800 mt-0.5">
                      {activeSession.systemMetrics?.diskPercent || 0}%
                    </div>
                    <div className="w-full h-1 rounded-full bg-slate-200 mt-1 overflow-hidden">
                      <div
                        className="h-full bg-slate-500 rounded"
                        style={{ width: `${activeSession.systemMetrics?.diskPercent || 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-2 rounded bg-slate-50 border border-slate-100">
                    <span className="text-[9px] text-slate-400 font-semibold uppercase">PROCESSES</span>
                    <div className="text-base font-bold font-mono text-slate-800 mt-0.5">
                      {activeSession.systemMetrics?.activeProcesses || 0}
                    </div>
                    <div className="text-[9px] text-slate-400 font-mono mt-0.5">Active Threads: 1,420</div>
                  </div>
                </div>
              </div>

              {/* Simulated Shell Terminal */}
              <div className="rounded-sm bg-slate-900 border border-slate-800 shadow-lg overflow-hidden flex flex-col h-80">
                {/* Terminal Titlebar */}
                <div className="px-3 py-1.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Terminal className="w-3.5 h-3.5 text-blue-400" />
                    <span>ssh://{(activeSession.technician || 'staff').toLowerCase().split(' ')[0]}@{activeSession.ipAddress || '127.0.0.1'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full inline-block ${activeSession.connectionStatus === 'Connected' ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`} />
                    <span className="text-[10px] text-green-400 font-bold uppercase">{activeSession.connectionStatus}</span>
                  </div>
                </div>

                {/* Terminal Output */}
                <div className="flex-1 p-3 overflow-y-auto font-mono text-xs text-slate-200 space-y-1 custom-scrollbar select-text">
                  {terminalLogs.map((log, i) => (
                    <div key={i} className={log.startsWith('$') ? 'text-blue-400 font-bold' : 'text-slate-300 leading-tight'}>
                      {log}
                    </div>
                  ))}
                </div>

                {/* Quick Action Command Chips */}
                <div className="px-3 py-1.5 bg-slate-950 border-t border-slate-800 flex flex-wrap gap-1.5 text-[10px] font-mono">
                  <span className="text-slate-500 py-0.5">Quick Actions:</span>
                  <button
                    onClick={() => executeCommand('top -b -n 1')}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-blue-300 cursor-pointer"
                  >
                    top
                  </button>
                  <button
                    onClick={() => executeCommand('df -h')}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-blue-300 cursor-pointer"
                  >
                    df -h
                  </button>
                  <button
                    onClick={() => executeCommand('ip a')}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-blue-300 cursor-pointer"
                  >
                    ip addr
                  </button>
                  <button
                    onClick={() => executeCommand('systemctl restart networking')}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-blue-300 cursor-pointer"
                  >
                    restart network
                  </button>
                  <button
                    onClick={() => executeCommand('reboot --graceful')}
                    className="px-2 py-0.5 rounded bg-red-950/60 hover:bg-red-900/70 text-red-300 border border-red-800/50 cursor-pointer"
                  >
                    graceful reboot
                  </button>
                </div>

                {/* Terminal Input */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    executeCommand(commandInput);
                  }}
                  className="p-2 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
                >
                  <span className="text-blue-400 font-mono text-xs pl-1">$</span>
                  <input
                    type="text"
                    value={commandInput}
                    onChange={(e) => setCommandInput(e.target.value)}
                    placeholder="Enter diagnostic command (e.g. df -h, top, ping 10.10.0.1, reboot)..."
                    className="flex-1 bg-transparent text-xs font-mono text-white placeholder-slate-600 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1 font-mono cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>Run</span>
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

