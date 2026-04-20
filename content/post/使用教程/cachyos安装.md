+++
title = 'Cachyos安装'
date = 2026-04-20T16:47:51+08:00
draft = false
categories = ["使用教程"]
tags = ["linux","cachyos","grub"]
image = ""
math = true
[build]
  list = "always"
+++

> 前言：
> 刚刚入职一周左右，我现在也算在玄武**安定下来**了，于是我便让我家里人把我寒假组装的台式机从老家寄过来，然后我还买了一块 **1TB 的固态硬盘** :floppy_disk:，专门用于台式机的 Linux 系统。
> 最近这段时间，Linux 系统也是经历了*频繁更换* :sweat_smile: -> `ubuntu` -> `archlinux` -> `fedora` -> `cachyos`。最终决定**长期使用**的就是 `CachyOS` :tada:。

# 1. 简要介绍 :star2:

**CachyOS** 是由 CDN77 和 CLOUDFLARE 赞助的、基于 Arch Linux 的开源 Linux 发行版，主打的特点是**极致的性能** :rocket:！它的每个封装都编译了 `x86-64-v3`、`x86-64-v4` 和 `Zen4` 指令集以及 LTO。核心封装还会获得额外的 **PGO** 和 **BOLT** 优化——_完全无需手动重建_。
为了方便能释放出我电脑的**所有性能** :muscle:，于是我便选择了 CachyOS，不太喜欢像 Arch Linux 那种*完全自定义*，实在是太麻烦了 :cry:

# 2. 安装 :wrench:

安装直接可以看 **shorin** 的 wiki。
通过这个连接访问 :link: [Shorin-ArchLinux-Guide/wiki/CachyOS](https://github.com/SHORiN-KiWATA/Shorin-ArchLinux-Guide/wiki/CachyOS)
我就写一个注意的点。我在我的 HP 笔记本上装双系统，按照这个流程几乎**一点问题都没有**（原本别人说的在 ISO 中要提前改源的点似乎已经被修复了 :white_check_mark:）。
但是在我的**台式机** :desktop_computer: 上，在两个不同的硬盘上安装双系统就出现问题了 :warning:。

## 2.1 问题 1 :question:

### 表现 :eyes:

在配置安装的时候会发现选择引导 (grub) 界面会和 shorin 的教程中不太一样，只剩下两个选择，就是 `grub` 和另一个什么，此时就该发现不对了 :no_good:。然后在后面安装的过程中也会出现报错，直接终止安装 :x:。

```txt
The bootloader could not be installed. The installation command <pre>grub-install --target=i386-pc --recheck --force /dev/nvme0n1</pre> returned error code 1.
```

### 解决 :hammer_and_wrench:

这个问题其实很好解决。在安装的时候，我起初没有注意到 **bootloader** 的位置。在选择分区的时候左下角有一个选择 bootloader，将这个要设置成和要装 **CachyOS** 的盘一致 :disk:。此后就安装成功了 :tada:，但紧接着就是第二个问题。

## 2.2 问题 2 :question:

### 表现 :eyes:

按照 **CachyOS Hello** 的指引，选择了 _reboot_，我们会发现电脑直接进入了 **Windows** 而非 `grub` :sob:。
根据网上的说法，可能是主板 BIOS 启动设置的问题，比如什么 **secure boot** 模式。这一部分问题我全部都排查过了，可以从 _shorin 的 wiki_ 中提前做好设置。
![](https://somnusblog.oss-cn-shanghai.aliyuncs.com/images/20260420175939731.png)

### 解决 :hammer_and_wrench:

我首先去主板里把启动项设置成我装 Linux 的**固态硬盘**，然后才可以正常进入 `grub`。但是问题是没能够在 `grub` 中找到 Windows 的启动选项 :thought_balloon:。后来逐渐摸排，才发现问题出现在主板上：主板处于 **UEFI 和 Legacy 的兼容模式** (CSM)，导致开机会自动进入主板的兼容选择模式，此时便会根据在 BIOS 中的选择来启动，而 `grub` 没办法兼容两种启动方式。如果你强行在 `grub` 里面添加 Windows 的启动项，就会出现下面的报错情况：
![](https://somnusblog.oss-cn-shanghai.aliyuncs.com/images/20260420181352693.png)
为了解决这个问题，我们*直接把主板的 CSM 兼容模式关闭* :no_entry_sign:，然后重新安装一遍，便大功告成 :smiling_face_with_three_hearts: :confetti_ball:!

## 2.3 问题 3 (可能存在) :warning:

### 表现 :eyes:

由于网络原因，安装的下载过程**奇慢无比** :snail:。

### 解决 :hammer_and_wrench:

**手动把源换成中国的源** :cn:。

```zsh
# 切换目录
cd /etc/pacman.d/

# 替换CachyOS本体源为中科大国内源
sudo tee cachyos-mirrorlist <<EOF
Server = https://mirrors.ustc.edu.cn/cachyos/repo/\$arch/\$repo
EOF

sudo tee cachyos-v3-mirrorlist <<EOF
Server = https://mirrors.ustc.edu.cn/cachyos/repo/\$arch_v3/\$repo
EOF

sudo tee cachyos-v4-mirrorlist <<EOF
Server = https://mirrors.ustc.edu.cn/cachyos/repo/\$arch_v4/\$repo
EOF

# 替换Arch Linux基础源为中科大国内源
sudo tee mirrorlist <<EOF
Server = https://mirrors.ustc.edu.cn/archlinux/\$repo/os/\$arch
EOF

```

禁用自动测速：

```zsh
sudo sed -i '1i exit 0' /etc/calamares/scripts/update-mirrorlist
```

# 3. 配置 :gear:

进入 **CachyOS** 后，主要可以根据 **shorin** 的教程设置几个*基础选项*，此外你还可以进行以下操作：

## 3.1 安装 Clash Verge :globe_with_meridians:

第一步也是**最重要的一步** :exclamation:，先准备好科学上网的环境。在 AUR 中可以找到 `clash-verge-rev-bin` :mag:，但是由于源头是在 GitHub，所以下载速度也是**奇慢无比** :turtle:。我们可以通过代理方式，先提前下载好 `clash-verge-rev` 的 Deb 安装包，然后执行一次 `paru` 安装指令。

```zsh
paru -S clash-verge-rev-bin
```

让它生成文件夹： :open_file_folder:

```zsh
cp ~/Downloads/Clash.Verge_2.4.7_amd64.deb ~/.cache/paru/clone/clash-verge-rev-bin/clash-verge-rev-2.4.7-x86_64.deb
```

然后把下载好的*安装包*丢进 `paru` 的缓存目录里，重新执行一遍安装即可。 :sparkles:

## 3.2 从 Fish 换到 Zsh :shell:

_等明天再写吧..._ :zzz:
`todo!()` :pencil:
