import { electronApp, optimizer, is } from '@electron-toolkit/utils'
const { app, BrowserWindow, Menu, dialog } = require('electron');
const path = require('path');
const { ipcMain, net, session } = require('electron');
const WebSocket = require('ws');
const { URL } = require('url');

let mainWindow;

function createWindow() {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 950,
    webPreferences: {
      partition: String(+new Date()),
      nodeIntegration: true,      
      contextIsolation: true,    
      enableRemoteModule: false,
      webSecurity: false,
      preload: path.join(__dirname, '../preload/preload.js'),
    },
    resizable: false,
    titleBarStyle: 'hiddenInset',
    icon: path.join(__dirname, '../../resources/icon.png'),
    show: false,
  });

  // 直接加载构建后的 index.html
  const indexPath = path.join(__dirname, '../build/index.html');
//   mainWindow.loadFile(indexPath);
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(indexPath);
  }


  // 窗口准备就绪时显示并打开开发者工具
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.webContents.openDevTools();
  });

  // 当窗口关闭时
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // 设置菜单
  if (process.platform === 'darwin') {
    const template = [
      {
        label: 'YatPotato',
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { role: 'services' },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideothers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      },
      {
        label: 'Edit',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          { role: 'selectall' }
        ]
      }
    ];
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  } else {
    Menu.setApplicationMenu(null);
  }
}

// WebSocket 连接管理
const wsConnections = new Map();

// 防止重复注册的标志
let ipcHandlersRegistered = false;

// 新增：处理图片选择对话框
ipcMain.handle('dialog:openImage', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'] }
    ]
  });
  if (!canceled) {
    return filePaths[0];
  }
  return null;
});

// 新增：处理图片文件读取
ipcMain.handle('file:readImage', async (event, imagePath) => {
  try {
    const fs = require('fs');
    const imageBuffer = fs.readFileSync(imagePath);
    const base64String = imageBuffer.toString('base64');
    
    // 获取文件扩展名来确定 MIME 类型
    const ext = path.extname(imagePath).toLowerCase();
    const mimeTypes = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.bmp': 'image/bmp',
      '.webp': 'image/webp'
    };
    
    const mimeType = mimeTypes[ext] || 'image/jpeg';
    
    return {
      base64: base64String,
      mimeType: mimeType
    };
  } catch (error) {
    console.error('Error reading image file:', error);
    throw error;
  }
});

// IPC 处理器设置
function setupRemoteClientIPC() {
    // 防止重复注册
    if (ipcHandlersRegistered) {
        console.log('[MainProcess] IPC handlers already registered, skipping...');
        return;
    }
    
    console.log('[MainProcess] Setting up IPC handlers...');
    ipcHandlersRegistered = true;
    
    // 处理 HTTP 请求
    ipcMain.on('http-request', async (event, data) => {
        const { requestId, url, options } = data;
        
        try {
            console.log(`[MainProcess] 处理HTTP请求: ${options.method || 'GET'} ${url}`);
            const response = await makeHttpRequest(url, options);
            
            event.reply('http-response', {
                requestId,
                response
            });
        } catch (error) {
            console.error(`[MainProcess] HTTP请求失败:`, error);
            event.reply('http-response', {
                requestId,
                error: error.message
            });
        }
    });
    
    // 处理 WebSocket 连接
    ipcMain.on('websocket-connect', (event, data) => {
        const { url, componentId, userId, token } = data;
        const clientId = `${componentId}_${userId}`;
        
        // 关闭已存在的连接
        if (wsConnections.has(clientId)) {
            try {
                wsConnections.get(clientId).close();
            } catch (error) {
                console.error('[MainProcess] 关闭旧连接失败:', error);
            }
        }
        
        try {
            console.log(`[MainProcess] 创建WebSocket连接: ${url}`);
            const ws = new WebSocket(url);
            wsConnections.set(clientId, ws);
            
            // 设置连接超时
            const connectTimeout = setTimeout(() => {
                if (ws.readyState === WebSocket.CONNECTING) {
                    ws.terminate();
                    event.reply('websocket-status', { 
                        connected: false, 
                        error: 'WebSocket连接超时' 
                    });
                }
            }, 10000);
            
            ws.on('open', () => {
                clearTimeout(connectTimeout);
                console.log(`[MainProcess] WebSocket连接已建立: ${clientId}`);
                event.reply('websocket-status', { connected: true });
                
                // 自动发送token认证
                if (token) {
                    try {
                        ws.send(JSON.stringify({
                            type: 'auth',
                            token: token
                        }));
                    } catch (error) {
                        console.error('[MainProcess] 发送认证消息失败:', error);
                    }
                }
            });
            
            ws.on('message', (data) => {
                try {
                    const message = JSON.parse(data.toString());
                    event.reply('websocket-message', message);
                } catch (error) {
                    console.error('[MainProcess] WebSocket消息解析错误:', error);
                }
            });
            
            ws.on('close', () => {
                clearTimeout(connectTimeout);
                console.log(`[MainProcess] WebSocket连接已关闭: ${clientId}`);
                event.reply('websocket-status', { connected: false });
                wsConnections.delete(clientId);
            });
            
            ws.on('error', (error) => {
                clearTimeout(connectTimeout);
                console.error(`[MainProcess] WebSocket错误 [${clientId}]:`, error);
                event.reply('websocket-status', { 
                    connected: false, 
                    error: error.message 
                });
                wsConnections.delete(clientId);
            });
            
        } catch (error) {
            console.error('[MainProcess] WebSocket连接初始化失败:', error);
            event.reply('websocket-status', { 
                connected: false, 
                error: error.message 
            });
        }
    });
    
    // 处理 WebSocket 认证
    ipcMain.on('websocket-auth', (event, data) => {
        const { token } = data;
        
        for (const [clientId, ws] of wsConnections) {
            if (ws.readyState === WebSocket.OPEN) {
                try {
                    ws.send(JSON.stringify({
                        type: 'auth',
                        token: token
                    }));
                } catch (error) {
                    console.error('[MainProcess] 发送认证失败:', error);
                }
                break;
            }
        }
    });
    
    // 处理 WebSocket 断开连接
    ipcMain.on('websocket-disconnect', (event) => {
        for (const [clientId, ws] of wsConnections) {
            try {
                ws.close();
            } catch (error) {
                console.error('[MainProcess] 关闭连接失败:', error);
            }
        }
        wsConnections.clear();
    });
    
    console.log('[MainProcess] IPC handlers setup complete');
}

// HTTP 请求处理函数
async function makeHttpRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
        let isResolved = false;
        
        try {
            const requestOptions = {
                method: options.method || 'GET',
                url: url,
                headers: {
                    'User-Agent': 'ElectronApp/1.0',
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                    ...options.headers
                }
            };

            console.log(`[MainProcess] 创建请求:`, {
                method: requestOptions.method,
                url: requestOptions.url,
                hasBody: !!options.body
            });

            const request = net.request(requestOptions);

            // 设置超时
            const timeout = setTimeout(() => {
                if (!isResolved) {
                    isResolved = true;
                    try {
                        request.abort();
                    } catch (e) {
                        console.warn('[MainProcess] 请求取消失败:', e.message);
                    }
                    reject(new Error('请求超时'));
                }
            }, options.timeout || 15000);

            request.on('response', (response) => {
                if (isResolved) return;
                
                console.log(`[MainProcess] 收到响应: ${response.statusCode}`);
                
                let data = '';
                
                response.on('data', (chunk) => {
                    data += chunk.toString();
                });
                
                response.on('end', () => {
                    if (isResolved) return;
                    
                    clearTimeout(timeout);
                    isResolved = true;
                    
                    console.log(`[MainProcess] 响应完成，状态码: ${response.statusCode}, 数据长度: ${data.length}`);
                    
                    // 预先解析 JSON 数据，而不是发送函数
                    let jsonData = null;
                    try {
                        jsonData = data ? JSON.parse(data) : {};
                    } catch (error) {
                        console.error('[MainProcess] JSON解析失败:', error);
                        // 如果JSON解析失败，将原始数据作为text返回
                    }
                    
                    // 只发送可序列化的数据
                    const result = {
                        status: response.statusCode,
                        statusText: response.statusMessage || 'OK',
                        headers: response.headers,
                        data: jsonData,  // 已解析的JSON数据
                        text: data,      // 原始文本数据
                        success: response.statusCode >= 200 && response.statusCode < 300
                    };
                    
                    resolve(result);
                });
                
                response.on('error', (error) => {
                    if (isResolved) return;
                    
                    clearTimeout(timeout);
                    isResolved = true;
                    console.error('[MainProcess] 响应错误:', error);
                    reject(error);
                });
            });

            request.on('error', (error) => {
                if (isResolved) return;
                
                clearTimeout(timeout);
                isResolved = true;
                console.error('[MainProcess] 请求错误:', error);
                reject(error);
            });

            // 写入请求体
            if (options.body) {
                try {
                    console.log(`[MainProcess] 写入请求体:`, options.body.substring(0, 200));
                    request.write(options.body, 'utf8');
                } catch (writeError) {
                    if (!isResolved) {
                        clearTimeout(timeout);
                        isResolved = true;
                        reject(new Error('写入请求体失败: ' + writeError.message));
                        return;
                    }
                }
            }
            
            // 结束请求
            try {
                request.end();
            } catch (endError) {
                if (!isResolved) {
                    clearTimeout(timeout);
                    isResolved = true;
                    reject(new Error('结束请求失败: ' + endError.message));
                }
            }
            
        } catch (error) {
            if (!isResolved) {
                isResolved = true;
                console.error('[MainProcess] 请求创建失败:', error);
                reject(error);
            }
        }
    });
}

// 应用事件处理
app.whenReady().then(() => {
    console.log('[MainProcess] App ready, creating window and setting up IPC...');
    createWindow();
    setupRemoteClientIPC();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// 确保在应用退出时清理连接
app.on('before-quit', () => {
    console.log('[MainProcess] Cleaning up WebSocket connections...');
    for (const [clientId, ws] of wsConnections) {
        try {
            ws.close();
        } catch (error) {
            console.error('[MainProcess] 清理连接失败:', error);
        }
    }
    wsConnections.clear();
});