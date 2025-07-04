/**
 * SuperClaude 25組成果管理系統 - 真實後端整合版本
 * 連接 PostgreSQL 資料庫，支援真實檔案上傳
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient, API_ENDPOINTS } from '../config/api.js';

const ResultsContext = createContext();

export const useResults = () => {
  const context = useContext(ResultsContext);
  if (!context) {
    throw new Error('useResults must be used within a ResultsProvider');
  }
  return context;
};

export const ResultsProvider = ({ children }) => {
  const [results, setResults] = useState([]);
  const [availableGroups, setAvailableGroups] = useState([]);
  const [statistics, setStatistics] = useState({
    totalGroups: 24,
    uploadedCount: 0,
    pendingCount: 24,
    taskBreakdown: {}
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 載入可用組別
  const loadAvailableGroups = async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.availableGroups);
      if (response.success) {
        setAvailableGroups(response.data);
      }
    } catch (error) {
      console.error('Failed to load available groups:', error);
      // 回退到本地產生的組別選項
      const fallbackGroups = [];
      for (let i = 2; i <= 25; i++) {
        fallbackGroups.push({
          value: i,
          label: {
            zh: `第${i}組`,
            en: `Group ${i}`
          }
        });
      }
      setAvailableGroups(fallbackGroups);
    }
  };

  // 載入所有成果
  const loadAllResults = async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.submissions);
      if (response.success) {
        setResults(response.data);
      }
    } catch (error) {
      console.error('Failed to load results:', error);
      setError('無法載入成果數據');
    }
  };

  // 載入統計資料
  const loadStatistics = async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.statistics);
      if (response.success) {
        setStatistics(response.data);
      }
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  };

  // 初始化載入數據
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          loadAvailableGroups(),
          loadAllResults(),
          loadStatistics()
        ]);
      } catch (error) {
        console.error('Failed to initialize data:', error);
        setError('初始化失敗，請重新整理頁面');
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  // 上傳成果
  const uploadResult = async (resultData) => {
    setIsLoading(true);
    setError(null);

    try {
      // 準備 FormData
      const formData = new FormData();
      formData.append('groupNumber', resultData.groupNumber);
      formData.append('task', resultData.task);
      formData.append('description', resultData.description);
      
      if (resultData.youtubeLink) {
        formData.append('youtubeLink', resultData.youtubeLink);
      }

      // 添加檔案
      if (resultData.files && resultData.files.length > 0) {
        resultData.files.forEach((file) => {
          formData.append('files', file);
        });
      }

      // 發送請求
      const response = await apiClient.post(API_ENDPOINTS.submitResult, formData);

      if (response.success) {
        // 重新載入數據
        await Promise.all([
          loadAvailableGroups(),
          loadAllResults(),
          loadStatistics()
        ]);

        return {
          success: true,
          message: '成果上傳成功！',
          data: response.data
        };
      } else {
        throw new Error(response.error || '上傳失敗');
      }

    } catch (error) {
      console.error('Upload failed:', error);
      setError(error.message || '上傳失敗，請重試');
      
      return {
        success: false,
        error: error.message || '上傳失敗'
      };
    } finally {
      setIsLoading(false);
    }
  };

  // 取得可用組別
  const getAvailableGroups = () => {
    return availableGroups;
  };

  // 取得所有成果
  const getAllResults = () => {
    return results;
  };

  // 取得統計資料
  const getStatistics = () => {
    return statistics;
  };

  // 取得特定組別的成果
  const getResultsByGroup = (groupNumber) => {
    return results.filter(result => result.group_number === groupNumber);
  };

  // 取得特定任務的成果
  const getResultsByTask = (taskKey) => {
    return results.filter(result => result.task_key === taskKey);
  };

  // 檢查組別是否已上傳
  const hasGroupUploaded = (groupNumber) => {
    return results.some(result => result.group_number === groupNumber);
  };

  // 重新載入數據
  const refreshData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadAvailableGroups(),
        loadAllResults(),
        loadStatistics()
      ]);
    } catch (error) {
      console.error('Failed to refresh data:', error);
      setError('重新載入失敗');
    } finally {
      setIsLoading(false);
    }
  };

  // 清除錯誤
  const clearError = () => {
    setError(null);
  };

  // 健康檢查 - 測試後端連線
  const healthCheck = async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.health);
      return response.status === 'OK';
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  };

  const contextValue = {
    // 數據狀態
    results,
    availableGroups,
    statistics,
    isLoading,
    error,

    // 核心功能
    uploadResult,
    getAvailableGroups,
    getAllResults,
    getStatistics,
    getResultsByGroup,
    getResultsByTask,
    hasGroupUploaded,

    // 工具功能
    refreshData,
    clearError,
    healthCheck,

    // 數據載入功能
    loadAvailableGroups,
    loadAllResults,
    loadStatistics
  };

  return (
    <ResultsContext.Provider value={contextValue}>
      {children}
    </ResultsContext.Provider>
  );
};