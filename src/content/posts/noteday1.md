---
title: noteDay1
published: 2026-03-15
description: 'note'
image: '/images/sagiri/1.png'
tags: [java]
category: 'Note'
draft: false 
lang: ''
---
# 笔记

**1.** 多态如果要调用类中的独特方法 用instance of 来判断为哪个类 从而转为相应的类再调用

例如： Animal a = new Dog();

我们就可以用

if (a instance of Dog d) 如果a为dog类 则转为dog类 用d来表示

**2.** 代码块中的static{ }代码块 一般用来初始化数据 因其特性 只能被调用一次且是随着类的加载而调用的

**3.** 抽象类继承需重写抽象方法abstract-> 生成的对象无意义即可用abstract来修饰类

**4.** 当一个接口中抽象方法过多，但只要使用其中一部分的时候，就可以适配器设计模式

编写中间类XXXAdapter 实现对应接口并空实现 真正实现类去继承中间类 重写所需方法即可 （abstract修饰）

**5.** 调用内部类中静态方法可直接类名.方法名调用 调用非静态则需创建对象

> [!NOTE]
> 气笑了 day2的笔记没保存就关机了 可恶