import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'owner' | 'gm' | 'asst_mgr' | 'marketing' | 'finance';

export type PermissionId =
  | 'campaign_view'
  | 'campaign_create'
  | 'campaign_delete'
  | 'budget_approve'
  | 'crm_access'
  | 'wa_dispatch'
  | 'export_reports'
  | 'workspace_settings';

export const ALL_ROLES: { id: UserRole; key: string }[] = [
  { id: 'owner', key: 'owner' },
  { id: 'gm', key: 'gm' },
  { id: 'asst_mgr', key: 'asst_mgr' },
  { id: 'marketing', key: 'marketing' },
  { id: 'finance', key: 'finance' },
];

export const ALL_PERMISSIONS: { id: PermissionId; key: string }[] = [
  { id: 'campaign_view', key: 'campaign_view' },
  { id: 'campaign_create', key: 'campaign_create' },
  { id: 'campaign_delete', key: 'campaign_delete' },
  { id: 'budget_approve', key: 'budget_approve' },
  { id: 'crm_access', key: 'crm_access' },
  { id: 'wa_dispatch', key: 'wa_dispatch' },
  { id: 'export_reports', key: 'export_reports' },
  { id: 'workspace_settings', key: 'workspace_settings' },
];

export const DEFAULT_RBAC_MATRIX: Record<UserRole, PermissionId[]> = {
  owner: [
    'campaign_view',
    'campaign_create',
    'campaign_delete',
    'budget_approve',
    'crm_access',
    'wa_dispatch',
    'export_reports',
    'workspace_settings',
  ],
  gm: [
    'campaign_view',
    'campaign_create',
    'campaign_delete',
    'budget_approve',
    'crm_access',
    'wa_dispatch',
    'export_reports',
    'workspace_settings',
  ],
  asst_mgr: [
    'campaign_view',
    'campaign_create',
    'crm_access',
    'wa_dispatch',
    'export_reports',
  ],
  marketing: [
    'campaign_view',
    'campaign_create',
    'crm_access',
    'wa_dispatch',
    'export_reports',
  ],
  finance: [
    'campaign_view',
    'budget_approve',
    'export_reports',
  ],
};

const MATRIX_STORAGE_KEY = 'rmcc_rbac_matrix';
const ROLE_STORAGE_KEY = 'rmcc_user_role';

interface RbacContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  rolePermissions: Record<UserRole, PermissionId[]>;
  togglePermission: (roleId: UserRole, permId: PermissionId) => void;
  hasPermission: (permId: PermissionId) => boolean;
}

const RbacContext = createContext<RbacContextType | undefined>(undefined);

export const RbacProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRoleState] = useState<UserRole>(() => {
    const savedRole = localStorage.getItem(ROLE_STORAGE_KEY) as UserRole;
    if (savedRole && ALL_ROLES.some((r) => r.id === savedRole)) {
      return savedRole;
    }
    return 'marketing';
  });

  const [rolePermissions, setRolePermissions] = useState<Record<UserRole, PermissionId[]>>(() => {
    try {
      const saved = localStorage.getItem(MATRIX_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_RBAC_MATRIX,
          ...parsed,
        };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_RBAC_MATRIX;
  });

  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    localStorage.setItem(ROLE_STORAGE_KEY, role);
    window.dispatchEvent(new Event('rmcc_rbac_changed'));
  };

  const togglePermission = (roleId: UserRole, permId: PermissionId) => {
    setRolePermissions((prev) => {
      const current = prev[roleId] || [];
      const updated = current.includes(permId)
        ? current.filter((p) => p !== permId)
        : [...current, permId];
      const nextMatrix = { ...prev, [roleId]: updated };
      localStorage.setItem(MATRIX_STORAGE_KEY, JSON.stringify(nextMatrix));
      window.dispatchEvent(new Event('rmcc_rbac_changed'));
      return nextMatrix;
    });
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const savedRole = localStorage.getItem(ROLE_STORAGE_KEY) as UserRole;
      if (savedRole && ALL_ROLES.some((r) => r.id === savedRole)) {
        setUserRoleState(savedRole);
      }
      try {
        const savedMatrix = localStorage.getItem(MATRIX_STORAGE_KEY);
        if (savedMatrix) {
          setRolePermissions({
            ...DEFAULT_RBAC_MATRIX,
            ...JSON.parse(savedMatrix),
          });
        }
      } catch {
        // Fallback
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('rmcc_rbac_changed', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('rmcc_rbac_changed', handleStorageChange);
    };
  }, []);

  const hasPermission = (permId: PermissionId): boolean => {
    const currentPerms = rolePermissions[userRole] || [];
    return currentPerms.includes(permId);
  };

  return (
    <RbacContext.Provider
      value={{
        userRole,
        setUserRole,
        rolePermissions,
        togglePermission,
        hasPermission,
      }}
    >
      {children}
    </RbacContext.Provider>
  );
};

export const useRbac = (): RbacContextType => {
  const context = useContext(RbacContext);
  if (!context) {
    throw new Error('useRbac must be used within an RbacProvider');
  }
  return context;
};
