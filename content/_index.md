---
title: ""
summary: ""
type: landing

sections:
  - block: resume-biography-3
    content:
      username: me
      text: "学习、项目、实验和一些被密码保护起来的日常。"
      button:
        text: 查看文章
        url: /post/
      headings:
        about: ""
        education: ""
        interests: ""
    design:
      background:
        gradient_mesh:
          enable: true
      avatar:
        size: medium
        shape: circle
      name:
        size: md
  - block: markdown
    content:
      title: "最近在写"
      text: |-
        这里保留原博客的文章、项目记录和加密私密内容。
    design:
      columns: "1"
  - block: somnus-recent-posts
    id: posts
    content:
      title: "最新文章"
      count: 9
      order: desc
    design:
      view: article-grid
      columns: 3
---
