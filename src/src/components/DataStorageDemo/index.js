import React, { useState, useEffect } from 'react';
import { getDataStorage, isElectronEnvironment } from '../utils/environment';

const DataStorageDemo = () => {
  const [data, setData] = useState('');
  const [key, setKey] = useState('test-key');
  const [status, setStatus] = useState('');
  const [dataStorage, setDataStorage] = useState(null);

  useEffect(() => {
    // 初始化 DataStorage
    const ds = getDataStorage('demo-component');
    setDataStorage(ds);
    
    if (ds) {
      setStatus(`已连接到 ${isElectronEnvironment() ? 'Electron' : '浏览器'} 环境`);
    } else {
      setStatus('DataStorage 初始化失败');
    }
  }, []);

  const handleSave = async () => {
    if (!dataStorage) {
      setStatus('DataStorage 未初始化');
      return;
    }

    try {
      const result = await dataStorage.save(key, { value: data, timestamp: new Date().toISOString() });
      setStatus(result ? '保存成功！' : '保存失败');
    } catch (error) {
      setStatus(`保存失败: ${error.message}`);
    }
  };

  const handleLoad = async () => {
    if (!dataStorage) {
      setStatus('DataStorage 未初始化');
      return;
    }

    try {
      const result = await dataStorage.load(key);
      if (result) {
        setData(result.value || '');
        setStatus(`加载成功！时间戳: ${result.timestamp || '未知'}`);
      } else {
        setStatus('未找到数据');
        setData('');
      }
    } catch (error) {
      setStatus(`加载失败: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px', borderRadius: '5px' }}>
      <h3>DataStorage 演示</h3>
      <p>环境: {isElectronEnvironment() ? '🖥️ Electron' : '🌐 浏览器'}</p>
      <p>状态: {status}</p>
      
      <div style={{ margin: '10px 0' }}>
        <label>
          键名: 
          <input 
            type="text" 
            value={key} 
            onChange={(e) => setKey(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px' }}
          />
        </label>
      </div>
      
      <div style={{ margin: '10px 0' }}>
        <label>
          数据: 
          <textarea 
            value={data} 
            onChange={(e) => setData(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px', width: '200px', height: '60px' }}
            placeholder="输入要保存的数据..."
          />
        </label>
      </div>
      
      <div style={{ margin: '10px 0' }}>
        <button onClick={handleSave} style={{ marginRight: '10px', padding: '5px 10px' }}>
          保存数据
        </button>
        <button onClick={handleLoad} style={{ padding: '5px 10px' }}>
          加载数据
        </button>
      </div>
    </div>
  );
};

export default DataStorageDemo;
