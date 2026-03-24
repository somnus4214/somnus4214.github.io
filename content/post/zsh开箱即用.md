+++
title = 'Zsh开箱即用'
date = 2026-03-23T19:41:24+08:00
draft = false
tag = ["tool","life"]
summary = "本文简单介绍了一下如何在linux（ubuntu24.04）上面安装zsh"
tags = ["Blog","Tool"]
+++

>why zsh: 本人长期使用bash，其实早有耳闻zsh的方便快捷，之前黄学长给我的使用的服务器里面就配置了zsh，当时感觉自动补齐功能很惊艳，但是受限于我原本在机器人队打工，很多网上开源雷达点云算法（pointlio，fastlio）都需要通过source setup.bash来配置环境，如果用zsh可能会有些问题，但最近很高兴去尝试一些新的东西，于是就有了这篇博客

## 1.zsh的特点
- zsh，即z-shell，是在bourne-shell的基础上，作出许多改进的一种**命令解释器**，其实就是shell就是linux或者类linux架构中，起到和kernel内核传达指令的“**壳**”（shell）。
zsh是保罗（Paul Falstad）在普林斯顿大学求学期间编写的，当时只是初版，而zsh的名字是来源于他的一个老师邵中（zhong shao），保罗把他老师的名字zsh作为了shell的名称。
此后，zsh一直作为bash替代，不稳不火。2019年，由于macos上的bash版本太旧了，但是新版的bash采用GPLv3授权，这让苹果无法接受，自此苹果改成了zsh作为默认shell(依旧果子重拳出击)。
zsh有着更好的扩展性，同时可以定制更多的主题，让平平无奇的终端变得赏心悦目。
- oh-my-zsh：一个免费好用，非常好用的**开源zsh框架**，由开源社区推动，现在已经有了很多非常好用的插件。比如git，zsh-autosuggestions，建议每一个人都无脑使用oh-my-zsh。
- alacritty:一个使用rust编写基于opengl的终端模拟器，**快、轻便、跨平台**是他的特点，他相对于ghostty的缺点就是不能支持原生分屏，但这一点可以通过tmux弥补。其他全是优点。

## 2.安装zsh和oh-my-zsh
### 2.1下载
在ubuntu安装zsh可以直接用apt来安装
```bash
sudo apt update
sudo apt install -y zsh git curl #顺便检查一下git和curl的安装
```
安装完可以检查一下
```bash
which zsh
zsh --verstion
```
### 2.2配置
如果有需要，可以把zsh设置为默认的shell
通过执行这个命令可以完成设置
```bash
chsh -s "$(which zsh)"
```
会要求你输入密码，然后退出重新打开终端，通过下面这个指令来确认是否切换成功。
```bash
echo $SHELL
```
### 2.3安装oh-my-zsh
直接用[官方仓库](https://github.com/ohmyzsh/ohmyzsh)(omz竟然有185.6k stars)给的脚本来安装。
```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```
然后可以使用下面的指令来安装两个最常用的插件
```zsh
git clone https://github.com/zsh-users/zsh-autosuggestions \
  ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions

git clone https://github.com/zsh-users/zsh-syntax-highlighting.git \
  ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```
clone完之后，还要去~/.zshrc中把plugins后面加上zsh-autosuggestions和zsh-syntax-highlighting，如下：
```zsh
plugins=(
  git
  zsh-autosuggestions
  zsh-syntax-highlighting
)
```
还要执行一下下面这两行，这两行是用来是zsh的自动补齐生效的。
```zsh
autoload -Uz compinit
compinit
```
### 2.4安装[starship](https://github.com/starship/starship)(可选)
这是一个终端美化工具，如果你本地有rust和cargo环境，可以直接用cargo来安装（如果没有rust，建议尝试一下安装rust，你不会后悔的）。
```zsh
cargo install starship --locked
```
如果没有也不用着急，starship官方还给了脚本安装的方式，``curl -sS https://starship.rs/install.sh | sh``
[这个网址](https://starship.rs/presets/)里面有很多别人配置好的预设，你如果有兴趣也可以自己配置。直接把别人的预设复制粘贴到下面这个toml文件内。
```zsh
mkdir -p ~/.config
nano ~/.config/starship.toml
```
最后可以通过`source ~/.zshrc`来让自己的配置生效。

## 3.可能存在的问题

### 3.1可能在安装并且设置好默认shell后发现没有改。
这个问题好像是ubuntu自带的终端一直存在的问题，就是没有办法去真正的改变他的shell，我自己也试过很多方法，最后都不行。
所以我给出的权宜之计就是使用其他的终端模拟器，就是我上面介绍的两个，anticritty或者ghostty，这两者相对来说，功能更完善的还是使用zig编写的ghostty，但是我还是推荐你使用anticritty，(别问为什么，问就是他是使用rust编写的，我是rust信徒。)
还有一种可能，就是需要logout之后在重新进入才能正确设置成zsh。
