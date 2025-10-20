const { ipcMain, app } = require('electron')

function setupWindowEvents(mainWindow) {
  // 窗口控制相关事件
  ipcMain.on('maximize', () => {
    mainWindow.maximize()
  })
  ipcMain.on('unmaximize', () => {
    mainWindow.unmaximize()
  })
  ipcMain.on('minimize', () => {
    mainWindow.minimize()
  })
  ipcMain.on('restore', () => {
    mainWindow.restore()
  })
  ipcMain.on('close', () => {
    mainWindow.close()
  })
  ipcMain.on('reset', () => {
    app.exit()
    app.relaunch()
  })
  
  // 快捷键处理：添加调出开发者控制台的功能
  // 使用Ctrl+Shift+I或F12键来切换开发者工具
  mainWindow.webContents.on('before-input-event', (event, input) => {
    // 检查是否按下了Ctrl+Shift+I组合键
    if (input.control && input.shift && input.key.toLowerCase() === 'i') {
      event.preventDefault()
      mainWindow.webContents.toggleDevTools() // 切换开发者工具的显示状态
    }
    // 检查是否按下了F12键
    else if (input.key === 'F12') {
      event.preventDefault()
      mainWindow.webContents.toggleDevTools() // 切换开发者工具的显示状态
    }
  })
  
  // 注册IPC事件，允许从渲染进程手动打开开发者工具
  ipcMain.on('toggle-devtools', () => {
    mainWindow.webContents.toggleDevTools()
  })
}
export default setupWindowEvents
