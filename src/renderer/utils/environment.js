// 环境检测工具
export const isElectronEnvironment = () => {
  return typeof window !== 'undefined' && 
         window.DataStorage && 
         typeof window.DataStorage === 'object';
};

export const isDevelopment = () => {
  return process.env.NODE_ENV === 'development';
};

export const isProduction = () => {
  return process.env.NODE_ENV === 'production';
};

// 安全的 DataStorage 调用
export const safeDataStorageCall = (methodName, ...args) => {
  if (isElectronEnvironment() && window.DataStorage[methodName]) {
    try {
      return window.DataStorage[methodName](...args);
    } catch (error) {
      console.error(`Error calling DataStorage.${methodName}:`, error);
      return null;
    }
  }
  console.warn(`DataStorage.${methodName} not available - running in browser mode`);
  return null;
};

// 模拟数据存储（浏览器环境下的备用方案）
export const createMockDataStorage = (componentId) => {
  const storageKey = `mockDataStorage_${componentId}`;
  
  return {
    save: (key, data) => {
      try {
        const storage = JSON.parse(localStorage.getItem(storageKey) || '{}');
        storage[key] = data;
        localStorage.setItem(storageKey, JSON.stringify(storage));
        console.log(`[MockDataStorage] Saved ${key} to localStorage`);
        return true;
      } catch (error) {
        console.error('[MockDataStorage] Save failed:', error);
        return false;
      }
    },
    
    load: (key) => {
      try {
        const storage = JSON.parse(localStorage.getItem(storageKey) || '{}');
        const data = storage[key] || null;
        console.log(`[MockDataStorage] Loaded ${key} from localStorage:`, data);
        return data;
      } catch (error) {
        console.error('[MockDataStorage] Load failed:', error);
        return null;
      }
    }
  };
};

// 获取 DataStorage 实例（自动检测环境）
export const getDataStorage = (componentId) => {
  if (isElectronEnvironment()) {
    return safeDataStorageCall('loadDataStorage', componentId);
  } else {
    console.log('[Environment] Running in browser mode, using mock DataStorage');
    return createMockDataStorage(componentId);
  }
};

const environmentUtils = {
  isElectronEnvironment,
  isDevelopment,
  isProduction,
  safeDataStorageCall,
  createMockDataStorage,
  getDataStorage
};

export default environmentUtils;
