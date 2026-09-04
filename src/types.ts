export type ModuleTab =
  | 'dashboard'
  | 'branches'
  | 'assets'
  | 'tickets'
  | 'maintenance'
  | 'network'
  | 'remote'
  | 'warranties'
  | 'spare-parts'
  | 'reports'
  | 'notifications'
  | 'users';

export interface Branch {
  id: string;
  code: string;
  name: string;
  region: string;
  city: string;
  address: string;
  manager: string;
  managerEmail: string;
  phone: string;
  activeAssetsCount: number;
  openTicketsCount: number;
  networkStatus: 'healthy' | 'degraded' | 'critical';
  bandwidthUsage: number; // e.g. 74%
  primarySubnet: string;
  techniciansAssigned: number;
  lastAuditDate: string;
}

export type AssetCategory =
  | 'Workstation'
  | 'Server'
  | 'Networking'
  | 'Firewall'
  | 'Printer & Peripheral'
  | 'Mobile Device'
  | 'VoIP System';

export type AssetStatus = 'Operational' | 'In Maintenance' | 'Decommissioned' | 'In Storage' | 'Dispatched';
export type AssetCondition = 'Excellent' | 'Good' | 'Fair' | 'Requires Service';

export interface ITAsset {
  id: string;
  tag: string;
  name: string;
  category: AssetCategory;
  model: string;
  manufacturer: string;
  serialNumber: string;
  branchId: string;
  branchName: string;
  assignedToUser: string;
  ipAddress?: string;
  macAddress?: string;
  os?: string;
  status: AssetStatus;
  condition: AssetCondition;
  purchaseDate: string;
  warrantyExpiry: string;
  purchaseCost: number;
  specifications: {
    cpu?: string;
    ram?: string;
    storage?: string;
    firmware?: string;
  };
  lastMaintenanceDate?: string;
}

export type TicketPriority = 'Critical' | 'High' | 'Medium' | 'Low';
export type TicketStatus = 'Open' | 'In Progress' | 'Pending Vendor' | 'Resolved' | 'Closed';
export type TicketCategory = 'Hardware' | 'Network' | 'Software' | 'Access & Security' | 'Printer' | 'Telephony';

export interface ITTicket {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  requesterName: string;
  requesterEmail: string;
  branchId: string;
  branchName: string;
  assigneeName: string;
  assigneeId: string;
  assetTag?: string;
  createdAt: string;
  slaDueDate: string;
  isBreachedSla: boolean;
  resolutionNotes?: string;
  resolutionDate?: string;
  activityHistory: {
    id: string;
    timestamp: string;
    author: string;
    action: string;
    note?: string;
  }[];
}

export interface MaintenanceTask {
  id: string;
  jobCode: string;
  title: string;
  assetId?: string;
  assetTag?: string;
  assetName?: string;
  branchId: string;
  branchName: string;
  type: 'Preventive' | 'Emergency' | 'Firmware Patch' | 'Hardware Upgrade' | 'Calibration';
  frequency: 'One-time' | 'Monthly' | 'Quarterly' | 'Biannual' | 'Annual';
  scheduledDate: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Deferred';
  leadEngineer: string;
  estimatedHours: number;
  checklist: {
    id: string;
    task: string;
    completed: boolean;
  }[];
  notes: string;
  completedAt?: string;
}

export interface NetworkDevice {
  id: string;
  name: string;
  ip: string;
  type: 'Core Router' | 'Edge Switch' | 'Firewall' | 'Access Point' | 'VoIP Gateway' | 'SAN Storage';
  branchId: string;
  branchName: string;
  status: 'Online' | 'Degraded' | 'Offline';
  latencyMs: number;
  uptimePercentage: number;
  packetLossPercent: number;
  bandwidthUsageMbps: number;
  maxBandwidthMbps: number;
  portStatus: {
    totalPorts: number;
    activePorts: number;
  };
  lastChecked: string;
  firmwareVersion: string;
}

export interface RemoteSession {
  id: string;
  sessionCode: string;
  deviceName: string;
  assetTag: string;
  branchId: string;
  branchName: string;
  loggedUser: string;
  ipAddress: string;
  os: string;
  connectionStatus: 'Connected' | 'Standby' | 'Disconnected' | 'Session Closed';
  technician: string;
  durationMinutes: number;
  protocol: 'SSH / CLI' | 'VNC / Desktop' | 'RDP' | 'SNMP Agent';
  systemMetrics: {
    cpuPercent: number;
    memoryPercent: number;
    diskPercent: number;
    activeProcesses: number;
  };
  recentLogs: string[];
}

export interface WarrantyContract {
  id: string;
  contractNumber: string;
  vendor: string;
  vendorSupportPhone: string;
  vendorSupportEmail: string;
  coverageType: '24/7 Onsite Mission-Critical' | 'Next Business Day' | 'Standard Depot' | 'Software Maintenance';
  status: 'Active' | 'Expiring Soon' | 'Expired';
  startDate: string;
  endDate: string;
  daysRemaining: number;
  annualCost: number;
  coveredAssetsCount: number;
  coveredCategories: string[];
  slaResponseHours: number;
}

export interface SparePart {
  id: string;
  sku: string;
  name: string;
  category: 'Storage / SSD' | 'RAM Modules' | 'Power Supplies' | 'Network Cables' | 'SFP Modules' | 'Cooling Fans' | 'Motherboards';
  quantityInStock: number;
  minimumThreshold: number;
  reservedCount: number;
  unitCost: number;
  warehouseBin: string;
  assignedBranch: string;
  compatibleModels: string[];
  lastRestockedDate: string;
  supplier: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  severity: 'critical' | 'warning' | 'info' | 'success';
  timestamp: string;
  isRead: boolean;
  targetModule: ModuleTab;
  relatedEntityId?: string;
}

export interface UserStaff {
  id: string;
  name: string;
  username: string;
  password?: string;
  email: string;
  role: 'IT Director' | 'Network Admin' | 'Systems Specialist' | 'Field Engineer' | 'Helpdesk Analyst' | 'Branch Supervisor';
  assignedBranchId: string;
  assignedBranchName: string;
  status: 'Active' | 'On Leave' | 'Standby';
  phone: string;
  activeTicketLoad: number;
  joinedDate: string;
  lastPasswordChange?: string;
  twoFactorEnabled?: boolean;
}
