+++
title = 'Tmux使用教程'
date = 2026-03-24T19:13:32+08:00
draft = false
+++
![](https://somnusblog.oss-cn-shanghai.aliyuncs.com/images/20260324191423298.png)
>为什么用tmux：首先，因为我最近换了一个终端模拟器alacritty，这个模拟器不支持原生的分屏，需要通过tmux辅助。别问为什么非要用alacritty而不是自带分屏的ghostty，因为一个是rust一个是zig。
>另外，我在使用服务器训练raft视觉模型的时候，偶尔因为网络断开连接，导致远程ssh关闭，自动的结束了训练，虽然我知道了可以使用nohup 在>输出到log文件中，但是还是觉得如果可以用tmux这种会更方便。

## 1、tmux简介
为了解决上面提到的很常见的问题（关闭终端窗口&断开连接会导致任务（会话）终止），tmux的任务就是把session和窗口解除了绑定。
因此，tmux有三层结构，这样既解决了上面的问题，也推出了方便的分屏功能。
```
session（会话）
  └── window（窗口）
        └── pane（面板/分屏）
```
![](https://somnusblog.oss-cn-shanghai.aliyuncs.com/images/20260324213922252.png)
上面这个例子中就是在seesion：s1中的window：0。

## 2、tmux安装
### 2.1安装本体
```zsh
#Ubuntu & Debian
sudo apt install tmux
#CentOS & Fedora
sudo yum install tmux
# Mac
brew install tmux
```
### 2.2安装tpm（tmux插件管理工具）
```zsh
git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm
```
### 2.3配置conf文件
```zsh
nano ~/.tmux.conf
```
### 2.4写入配置
```zsh
# =========================
# 基础配置
# =========================
set -g prefix C-a
unbind C-b
bind C-a send-prefix

set -g mouse on

# =========================
# 插件管理
# =========================
set -g @plugin 'tmux-plugins/tpm'

# Catppuccin主题
set -g @plugin 'catppuccin/tmux'

# 可选：增强体验插件
set -g @plugin 'tmux-plugins/tmux-sensible'

# =========================
# Catppuccin配置（可选优化）
# =========================
set -g @catppuccin_flavour 'mocha'   # latte / frappe / macchiato / mocha

# 状态栏位置
set -g status-position bottom

# =========================
# 初始化 TPM（必须放最后）
# =========================
run '~/.tmux/plugins/tpm/tpm'
```
### 2.5安装插件
进入tmux``tmux``，然后``Ctrl + a ->Shift + I``
- 等待自动安装
- 大写I
### 2.6加载配置
```zsh
tmux source-file ~/.tmux.conf
```
## 3.tmux使用


### 🟢 会话（session）

```bash
tmux new -s name          # 创建会话
tmux ls                   # 列出会话
tmux attach -t name       # 进入会话
tmux kill-session -t name # 删除会话
tmux rename-session -t old new
```

### 🔵 基本快捷键（前缀 Ctrl + a）

```text
Ctrl + a d        # detach（后台运行）
Ctrl + a r        # 重载配置（需绑定）
Ctrl + a :        # 命令模式
```

### 🟡 窗口（window）

```text
Ctrl + a c        # 新建窗口
Ctrl + a n        # 下一个窗口
Ctrl + a p        # 上一个窗口
Ctrl + a 数字     # 切换窗口
Ctrl + a ,        # 重命名窗口
Ctrl + a w        # 列出窗口
Ctrl + a &        # 关闭窗口
```


### 🟣 分屏（pane）

```text
Ctrl + a %        # 垂直分屏
Ctrl + a "        # 水平分屏
Ctrl + a 方向键   # 切换 pane
Ctrl + a x        # 关闭 pane
Ctrl + a z        # 最大化/还原 pane
```

### 🟠 调整大小

```text
Ctrl + a Ctrl + ←/→/↑/↓   # 调整 pane 大小
```

### 🟤 布局

```text
Ctrl + a 空格      # 切换布局
Ctrl + a Alt + 1   # even-horizontal
Ctrl + a Alt + 2   # even-vertical
Ctrl + a Alt + 3   # main-horizontal
Ctrl + a Alt + 4   # main-vertical
```


### ⚫ 复制模式（vi）

```text
Ctrl + a [        # 进入 copy-mode
v                # 开始选择
y                # 复制
q                # 退出
```

### 🎯 一句话速记

```text
session：tmux new -s
退出不关：Ctrl+a d
分屏：% 和 "
切换：方向键
```
