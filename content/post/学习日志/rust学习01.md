---
title: Rust学习01-所有权
date: 2026-04-04T22:39:47+08:00
draft: false
categories:
  - 学习日志
tags:
  - Rust
image: ""
math: true
---

## Trait
trait（特征）是一种**定义共享行为**的机制，可以理解成其他语言中的接口，相当于是不管你底层是什么数据类型，只要定义了这个trait，就一定要实现这个trait的功能。
### 定义和实现
trait本质上是一组方法签名的集合，你可以定义一个trait并为不同的结构体去实现这个trait，代码实例如下
```rust
// 1. 定义一个名为 `MakeSound` 的 Trait，规定了必须有一个 `sound` 方法
pub trait MakeSound {
    fn sound(&self) -> String;
}

// 2. 定义两个完全不同的结构体
struct Dog;
struct Cat;

// 3. 为 Dog 实现 `MakeSound` 契约
impl MakeSound for Dog {
    fn sound(&self) -> String {
        String::from("汪汪！")
    }
}

// 4. 为 Cat 实现 `MakeSound` 契约
impl MakeSound for Cat {
    fn sound(&self) -> String {
        String::from("喵喵！")
    }
}
```
### 主要作用
trait主要的有下面几个特点
- 多态：允许编写处理多种类型的通用代码，你可以写一个函数，不关心她是`Dog`还是`Cat`，只关心传入的类型能否`make_sound`。
```rust
// 这个函数接收任何实现了 MakeSound 的类型
fn play_sound(animal: &impl MakeSound) {
    println!("听到声音: {}", animal.sound());
}
```
- 泛型约束：trait可以来限制泛型能够接受的类型。例如`<T:MakeSound>`表示T可以是任何类型，但是必须实现了MakeSound这个trait。
- 代码复用：trait中的方法可以有默认的实现逻辑，如果某个类型实现了trait但是没有重写方法，则会自动获得默认行为。
### rust内置的trait
rust极其依赖trait，这也是rust设计优雅的原因，有很多理所当然的行为，实际上都是trait：
- Debug和Display：可以使用`println("{:?}",x)`来打印变量。
- Clone和Copy：定义了数据的复制
- Add和Sub：定义了`+`和`-`如何对*非基础类型*进行数学运算
rust的trait还符合**开闭原则**，即倘若要新增一个动物，无需重写`playsound`这个函数，而是直接新建一个动物结构体，并且为他`impl MakeSound`就可以了。
还体现了职责分离这一特点，MakeSound只负责发出声音，动物的逻辑只在动物的部分内，不同的模块就被安全的隔开了。

---
