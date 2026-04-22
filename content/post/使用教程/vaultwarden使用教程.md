+++
title = 'Vaultwarden使用教程'
date = 2026-03-31T16:13:42+08:00
draft = false
categories = ["使用教程"]
tags = ["Blog","Self-host","Docker","SSL","VPS"]
image = ""
math = true
[build]
  list = "always"
+++

> 最近正在因为换了浏览器，进行过一次密码迁移，在迁移的过程中总感觉有种隐忧，就是密码泄露或者丢失的风险
> 其实密码泄露给这些大型的公司比如Microsoft/Google，其实对我没影响，但是如果片丢失了，就影响大了，因为我有很多的网络站点都是使用浏览器生成的强密码，此前很多密码管理工具也出现过数据丢失的问题。
> 所以我想着自己搭建属于自己的服务来实现，更安全（但不一定更可靠）的密码服务。

## 调研

我简单调查了市面上所有的密码管理器，主要分为两部分：

- a、云服务：除了依赖浏览器厂商，还有一些专业的密码服务厂商，比如被广泛使用的1password和以隐私保护著称的proton pass，但是这两个的服务都不是免费的，而且都不便宜，国内的连接也不够稳定。
- b、自搭建服务：使用大名鼎鼎的bitwarden或者keepassxc，后者很安全，因为数据文件只能保存在本地，但问题也就是他没有任何的云服务，非常不方便。

最终我决定使用vaultwarden，一个基于bitwarden的rust重写版（rust信徒狂喜），使用我之前的买的一个火山云的服务器2g2核，足够运行。当时这个服务器还是用来跑openclaw的，后来没弄成，就闲置下来了。

## 部署

### 部署要求

- 云服务器：由于rust底层，导致占用很低，2gb2核绝对够用
- 域名：需要一个域名，因为需要ios自动填充和chrome插件都需要HTTPS环境，所以需要把域名解析到我的个人服务器上，并且需要SSL证书。
- 环境要求：服务器最好有docker环境

### 部署过程

#### 配置docker

这是第一步，对于国内来说也是最难的一步，因为服务器不同于个人网络，不可以部署vpn服务，所以要配置要准备好可以连接的docker是最麻烦的，首先是docker安装，可以在部署服务器的时候，可以选择自带并且安装好docker的环境。对于不同的服务器厂商，可以直接搜各自[指定的文档](https://www.volcengine.com/docs/6396/75300?lang=zh)来安装docker。
安装docker，通常不会出现问题，问题主要出现在拉取镜像上，网上对于这方面的解决措施纷繁复杂，什么配置镜像源，什么本地pull再传到服务器上，我这里之给出一种解决我的问题的方法

- 1ms：一毫秒，是一个国内可以访问的docker代理网站

```zsh
docker pull docker.1ms.run/vaultwarden/server:latest
docker pull docker.1ms.run/library/caddy:2
```

此处下载了两个镜像，一个是vaultwarden本地，另一个是caddy，用来反向代理的

#### 安装环境

首先创建文件夹

```zsh
mkdir -p /home/somnus/vaultwarden
cd /home/somnus/vaultwarden
```

接着就是创建Caddyfile，他是用来全自动申请和续签Let's Encrypt 的 HTTPS 证书，完全不需要手动配置。

```zsh
nano Caddyfile
```

并输入以下内容

```Plaintext
pwd.yourdomain.com { #此处替代为自己的域名
    reverse_proxy vaultwarden:80
}
```

并保存退出

#### 创建docker-compose.yaml

创建该yaml文件

```zsh
nano docker-compose.yaml
```

并且输入以下内容

```Plaintext
version: '3'

services:
  vaultwarden:
    image: vaultwarden/server:latest
    container_name: vaultwarden
    restart: always
    environment:
      - WEBSOCKET_ENABLED=true
      - SIGNUPS_ALLOWED=true   # 第一次启动设为 true，注册完后改为 false
    volumes:
      - ./vw-data:/data

  caddy:
    image: caddy:2
    container_name: caddy
    restart: always
    ports:
      - 80:80      # 必须映射 80 和 443 端口
      - 443:443
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - ./caddy-data:/data
      - ./caddy-config:/config
    depends_on:
      - vaultwarden
```

保存并退出，执行以下命令

```zsh
sudo docker compose up -d
```

此时如果一切正常，你在访问自己的域名的时候就能进入vaultwarden的登陆界面了。

### 备案

如果你选择的是国内的运营商的服务器，那么不可避免的你都需要进行备案，可以直接按照对应公司的备案流程来。
![](https://somnusblog.oss-cn-shanghai.aliyuncs.com/images/20260401181254590.png)
备案时间真的很长，至少需要一周左右。所以现在都再等待备案通过。

---

过了大概三天，工信部的备案就通过了，再过不到24hour，就可以直接访问这个网站了。
网站页面如下：
![](https://somnusblog.oss-cn-shanghai.aliyuncs.com/images/20260403222851908.png)
点击下方的注册，创建账号，输入邮箱和主密码，**注意注意注意**，这个主密码一定要记住，一定要存在一个你记得的地方。因为主密码忘记之后无法恢复。
注册完账号之后就可以登陆并导入浏览器的密码本。
