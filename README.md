# YatPotato - React Electron 桌面应用

这是一个使用 React 和 Electron 构建的桌面应用程序项目。

## 项目技术栈

- **前端框架**: React 19.1.0
- **桌面应用框架**: Electron 36.3.2
- **构建工具**: React Scripts 5.0.1
- **开发环境**: Node.js + npm

## 项目结构

```
yatpotato-react-test/
├── src/                    # React 应用源代码
│   ├── components/         # React 组件
│   ├── utils/             # 工具函数
│   ├── App.js             # 主应用组件
│   └── index.js           # React 入口
├── public/                # 静态资源和 Electron 配置
│   ├── electron.js        # Electron 主进程
│   └── preload.js         # 预加载脚本
├── .cursor/               # Cursor AI 规则配置
│   └── rules/             # 开发规则文件
├── build/                 # 构建输出目录
├── data/                  # 数据存储目录
└── package.json           # 项目配置
```

![类](E:\study\SE\YatPotato\图\类.png)

## 开发命令

### 标准 React 命令

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### Electron 专用命令

### `npm run electron-dev`

并发启动 React 开发服务器和 Electron 应用，支持热重载。

### `npm run electron-build`

构建 React 应用后启动 Electron。

### `npm run dist`

构建并打包 Electron 应用为可分发的安装包。

## 变更日志

### 2024-12-19 - AI助手变更记录 (Bug修复更新)

#### 修复问题
- `src/components/PomodoroTimer.js` - 
  - 🐛 **修复计时器状态不同步问题**: 重构计时器逻辑，使用totalSeconds统一管理时间状态
  - 🔧 **解决23:59跳跃问题**: 避免在setSeconds回调中同时调用setMinutes导致的状态更新不同步
  - ⚡ **优化性能**: 使用单一状态源管理时间，减少状态更新复杂度
  - 🎯 **精确计时**: 现在计时器从设定时间准确倒计时，不会出现时间跳跃
  - ✅ **测试结果**: 
    - 25分钟计时器从25:00准确倒计时到00:00
    - 1分钟计时器从01:00准确倒计时到00:00  
    - 2分钟计时器从02:00准确倒计时到00:00
    - 不再出现24:59或23:59的时间跳跃

#### 技术重构详情
- **核心改变**: 
  - 移除单独的minutes和seconds状态变量
  - 新增totalSeconds作为唯一时间状态源
  - 通过计算属性获取分钟和秒钟显示值
- **计算逻辑**:
  ```javascript
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  ```
- **计时逻辑**: 每秒减少totalSeconds，避免多状态同步问题
- **进度计算**: 基于totalSeconds重新计算进度百分比

#### 解决的根本问题
- **状态同步问题**: React中多个相关状态同时更新可能不同步
- **时间跳跃**: setSeconds和setMinutes在同一个更新周期中可能产生竞态条件
- **计算错误**: 分别管理分钟和秒钟容易出现边界条件错误

---

- `src/App.css` - 
  - 🎨 **修复登录界面布局问题**: 将login-container-desktop的height改为min-height: 680px
  - 📐 **改进白色区域覆盖**: 确保"注册一个新的吧！"按钮完全显示在白色背景区域内
  - 💡 **用户体验提升**: 登录界面现在有足够的空间容纳所有UI元素

#### 技术细节
- **计时器问题根因**: React状态管理中，同时更新多个相关状态会导致同步问题和竞态条件
- **解决方案**: 使用单一状态源(totalSeconds)管理时间，通过计算属性派生显示值
- **布局问题根因**: 固定高度620px不足以容纳所有登录界面元素
- **解决方案**: 改用min-height: 680px，允许容器根据内容自适应高度

---

### 2024-12-19 - AI助手变更记录

#### 新增文件
- `.cursor/rules/project-overview.mdc` - 项目概览规则，描述项目架构、目录结构和主要入口点
- `.cursor/rules/react-development.mdc` - React 开发规则，包含组件开发约定、状态管理和测试规范
- `.cursor/rules/electron-development.mdc` - Electron 开发规则，涵盖架构、IPC通信、安全实践和打包指南
- `.cursor/rules/coding-standards.mdc` - 代码规范标准，定义代码风格、命名约定、依赖管理和性能优化准则
- `.cursor/rules/development-workflow.mdc` - 开发工作流程规则，包含项目设置、开发流程、构建部署和调试指南
- `.cursor/rules/change-tracking.mdc` - 变更跟踪规则，要求AI助手在每次代码修改后记录变更日志
- `src/components/PomodoroTimer.js` - 完整的番茄钟组件，实现以下功能：
  - 🔊 **音效系统**: 使用Web Audio API生成开始音效、结束音效和倒计时滴答声
  - ⏰ **完整倒计时**: 精确的分钟秒钟倒计时逻辑
  - 🍅 **番茄工作法**: 25分钟专注 + 5分钟休息，第4个番茄钟后15分钟长休息
  - 📊 **进度跟踪**: 实时计算和显示进度百分比
  - 🔔 **桌面通知**: 支持浏览器原生通知API
  - 🎯 **阶段管理**: 自动在专注时间和休息时间之间切换

#### 修改文件
- `src/App.js` - 
  - 集成新的PomodoroTimer组件，替换原有简单计时器逻辑
  - 添加番茄钟统计数据管理(总番茄数、今日番茄数、总专注时长)
  - 新增视觉增强功能：
    - 🎨 进度圆环显示计时进度
    - 🏷️ 当前阶段指示器(专注/休息)
    - 📈 实时统计信息显示
    - ⏭️ 跳过当前阶段按钮
  - 改进用户界面交互和反馈
  - 更新成就系统以基于实际番茄钟完成数据
  - 优化锁定屏幕显示当前阶段信息

- `src/App.css` - 
  - 添加番茄钟专用样式：进度圆环、阶段指示器、统计卡片
  - 美化控制按钮：渐变背景、悬停效果、禁用状态
  - 新增成就解锁动画效果
  - 增强设置面板视觉设计
  - 改进响应式设计支持移动设备
  - 添加激励语句样式美化

- `README.md` - 
  - 添加了项目说明和技术栈介绍
  - 重新组织了项目结构说明
  - 新增了Electron专用命令说明
  - 创建了变更日志部分用于跟踪所有代码变更

#### 功能特性总结
🎵 **音效系统**:
- 开始专注时播放上升音调提示音
- 结束时播放三声和弦提示音  
- 最后10秒播放滴答倒计时音

⏱️ **计时功能**:
- 精确的分钟+秒钟倒计时
- 可视化进度圆环
- 自定义专注时长(1-90分钟)

🍅 **番茄工作法**:
- 标准25分钟专注 + 5分钟休息
- 每4个番茄钟后15分钟长休息
- 自动阶段切换和提醒

📊 **数据统计**:
- 今日完成番茄钟数量
- 总专注时长统计
- 持久化数据存储

🏆 **成就系统**:
- 基于实际数据的动态成就解锁
- 发光动画效果
- 激励用户持续使用

---

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## 相关图

#### 1. 用户添加任务交互流程
- **参与者**：用户、应用（App）、任务管理器（TaskManager）、任务列表（TaskList）
- **流程描述**：
  - 用户点击“添加任务”按钮。
  
  - 应用接收到用户请求，调用任务管理器的 `addTask(task)` 方法。
  
  - 任务管理器保存任务，并返回任务保存成功的确认信息。
  
  - 应用接收到任务保存成功的消息后，更新任务列表。
  
  - 最后，应用重新渲染界面，展示最新的任务列表给用户。
  
    顺序图如下：
  
    ![顺序](E:\study\SE\YatPotato\图\顺序.png)

#### 2. 任务状态转换图
- **状态**：待办（ToDo）、进行中（InProgress）、已完成（Done）、已归档（Archived）、已删除（Deleted）
- **流程描述**：
  - 任务从“待办”状态开始，可以通过 `startTask()` 方法转换为“进行中”状态。
  
  - “进行中”的任务可以通过 `completeTask()` 方法变为“已完成”，也可以通过 `archiveTask()` 方法变为“已归档”。
  
  - “已完成”和“已归档”的任务都可以通过 `deleteTask()` 方法被删除，进入“已删除”状态。
  
    状态图如下：
  
    ![状态](E:\study\SE\YatPotato\图\状态.png)

#### 3. 任务创建、编辑和删除流程
- **流程描述**：
  - **创建任务**：用户创建新任务，输入任务详情，系统验证输入。如果输入有效，保存任务并显示保存成功的确认信息；如果无效，显示验证错误信息。
  
  - **编辑任务**：用户可以选择编辑已存在的任务，修改后重新保存。
  
  - **标记完成**：用户可以将任务标记为已完成，系统更新任务状态。
  
  - **删除任务**：用户可以选择删除任务，系统执行删除操作。
  
    活动图如下：
  
    ![活动](E:\study\SE\YatPotato\图\活动.png)
