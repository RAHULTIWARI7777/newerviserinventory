export const PATH_PUBLIC = {
  home: '/',
  register: '/register',
  login: '/login',
  unauthorized: '/unauthorized',
  notFound: '/404',
};

export const PATH_DASHBOARD = {
  dashboard: '/dashboard',
  usersManagement: '/dashboard/users-management',
  updateRole: '/dashboard/update-role/:userName',
  employees: '/dashboard/employee', // Updated path for Employee
  inventories: '/dashboard/inventory', // Updated path for Inventory
  allMessages: '/dashboard/employee-hardware', // Updated path for Employee Hardware
  systemLogs: '/dashboard/system-logs',
  myLogs: '/dashboard/my-logs',
  owner: '/dashboard/owner',
  admin: '/dashboard/admin',
  manager: '/dashboard/manager',
  user: '/dashboard/user',
};
