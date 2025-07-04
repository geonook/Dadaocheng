// API 配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.DEV ? 'http://localhost:5001' : 'https://dadaoweb-backend.zeabur.app');

// API 端點
export const API_ENDPOINTS = {
  // 成果相關
  submissions: `${API_BASE_URL}/api/submissions`,
  submitResult: `${API_BASE_URL}/api/submissions`,
  submissionById: (id) => `${API_BASE_URL}/api/submissions/${id}`,
  statistics: `${API_BASE_URL}/api/submissions/statistics`,
  
  // 組別相關
  groups: `${API_BASE_URL}/api/groups`,
  availableGroups: `${API_BASE_URL}/api/groups/available`,
  groupById: (groupNumber) => `${API_BASE_URL}/api/groups/${groupNumber}`,
  
  // 任務相關
  tasks: `${API_BASE_URL}/api/tasks`,
  taskByKey: (taskKey) => `${API_BASE_URL}/api/tasks/${taskKey}`,
  
  // 檔案相關
  fileDownload: (fileId) => `${API_BASE_URL}/api/files/${fileId}/download`,
  fileInfo: (fileId) => `${API_BASE_URL}/api/files/${fileId}/info`,
  submissionFiles: (submissionId) => `${API_BASE_URL}/api/files/submission/${submissionId}`,
  
  // 管理員相關
  adminLogin: `${API_BASE_URL}/api/admin/login`,
  adminSubmissions: `${API_BASE_URL}/api/admin/submissions`,
  adminDashboard: `${API_BASE_URL}/api/admin/dashboard`,
  updateSubmissionStatus: (id) => `${API_BASE_URL}/api/admin/submissions/${id}/status`,
  
  // 健康檢查
  health: `${API_BASE_URL}/health`
};

// HTTP 客戶端配置
const defaultHeaders = {
  'Content-Type': 'application/json',
};

// API 請求輔助函數
export const apiClient = {
  // GET 請求
  get: async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
        ...options,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API GET Error:', error);
      throw error;
    }
  },

  // POST 請求
  post: async (url, data, options = {}) => {
    try {
      const isFormData = data instanceof FormData;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...(isFormData ? {} : defaultHeaders),
          ...options.headers,
        },
        body: isFormData ? data : JSON.stringify(data),
        ...options,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API POST Error:', error);
      throw error;
    }
  },

  // PUT 請求
  put: async (url, data, options = {}) => {
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
        body: JSON.stringify(data),
        ...options,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API PUT Error:', error);
      throw error;
    }
  },

  // DELETE 請求
  delete: async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
        ...options,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API DELETE Error:', error);
      throw error;
    }
  },
};

// 管理員 token 管理
export const authUtils = {
  setToken: (token) => {
    localStorage.setItem('admin_token', token);
  },
  
  getToken: () => {
    return localStorage.getItem('admin_token');
  },
  
  removeToken: () => {
    localStorage.removeItem('admin_token');
  },
  
  getAuthHeaders: () => {
    const token = authUtils.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};

// 帶認證的 API 客戶端
export const authenticatedApiClient = {
  get: (url, options = {}) => apiClient.get(url, {
    ...options,
    headers: { ...authUtils.getAuthHeaders(), ...options.headers }
  }),
  
  post: (url, data, options = {}) => apiClient.post(url, data, {
    ...options,
    headers: { ...authUtils.getAuthHeaders(), ...options.headers }
  }),
  
  put: (url, data, options = {}) => apiClient.put(url, data, {
    ...options,
    headers: { ...authUtils.getAuthHeaders(), ...options.headers }
  }),
  
  delete: (url, options = {}) => apiClient.delete(url, {
    ...options,
    headers: { ...authUtils.getAuthHeaders(), ...options.headers }
  }),
};

export default API_BASE_URL;