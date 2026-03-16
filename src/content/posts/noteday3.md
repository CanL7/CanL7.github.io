---
title: noteday3
published: 2026-03-16
description: '集合进阶'
image: '/images/sagiri/5.jpg'
tags: [java,集合]
category: 'Note'
draft: false 
lang: ''
---
# 集合进阶

List系列集合：添加的元素是有序 可重复 有索引三大特点

Set系列集合：添加的元素是无序 不重复 无索引

> object 中的equals方法是比较地址值 如果我们想要比较类中的属性值则需要在javabean中重写equals方法

> collection中的contains底层就是基于equals进行判断的

迭代器 Iterator 迭代器遍历时不能用集合的方法进行增加或者删除

> 实在要删除 可以用迭代器里自带的remove方法

遍历完迭代器指针不会复位 如果再想遍历只能重新获取新的迭代器对象

**collection遍历有以下三种方法**

###### 1.迭代器遍历 hasNext（） Next（）

###### 2.增强for遍历

快捷生成方式 ->集合的名字+for 回车

###### 3.lambda表达式遍历

###### List遍历

它有一种特殊的列表迭代器 它可以在遍历中添加元素（add方法） 同时 它可以向前遍历

用到hasPrevious（） Previous（）


# 数据结构

###### 1.栈 stack  
先进后出 入栈/压栈

###### 2.队列 queue 
先进先出 从后端进 前端出 入/出队列

###### 3.数组 Array
查询快 增删慢

###### 4.链表 List
增删快 查询慢 每个节点都包含数据值以及下一个节点的地址值（单向链表）

> 拓展：还有双向链表 即每个节点还有前节点的地址
>
> 这样查找时可以先判断离头近还是尾近 从而做到优化的效果

###### LinkedList集合

底层数据结构是双链表，查询慢，首尾操作的速度是极快的，所以多了很多首尾操作的特有API。