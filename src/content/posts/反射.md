---
title: 反射
published: 2026-03-23
description: 'Reflect'
image: '/images/sagiri/9.jpg'
tags: [java,反射]
category: 'java'
draft: false 
lang: ''
---
# 反射

## 1.反射是什么？

是在运行状态中，对于任意一个类，都能够知道这个类的所有属性和方法；

​对于任意一个对象，都能够调用它的任意属性和方法；



## 2. 获取字节码文件对象的三种方式

* Class这个类里面的静态方法forName（“全类名”）**（最常用）**
* 通过class属性获取
* 通过对象获取字节码文件对象

代码示例：

```java
    //Class.forName("类的全类名")： 全类名 = 包名 + 类名
    Class clazz1 = Class.forName("reflectdemo.Student");
    //2.通过class属性获取
    //类名.class
    Class clazz2 = Student.class;
    //因为class文件在硬盘中是唯一的，所以，当这个文件加载到内存之后产生的对象也是唯一的
    System.out.println(clazz1 == clazz2);//true

    //3.通过Student对象获取字节码文件对象
    Student s = new Student();
    Class clazz3 = s.getClass();
    System.out.println(clazz1 == clazz2);//true
    System.out.println(clazz2 == clazz3);//true
```



## 3.获取及其规则

​ get表示获取 Declared表示私有 s表示所有，复数形式

​ 如果当前获取到的是私有的，必须要临时修改访问权限，否则无法使用(暴力反射)

即setAccessible(true)

### 3.1获取构造方法

- Constructor<?>[] getConstructors()

- Constructor<?>[] getDeclaredConstructors()

- Constructor<T> getConstructor(Class<?>... parameterTypes)

- Constructor<T> getDeclaredConstructor(Class<?>... parameterTypes)

- newInstance( ) 创造对象用

### 3.2获取成员变量

- Field[] getFields() 

- Field[] getDeclaredFields()

- Field getField(String name) 

- Field getDeclaredField(String name)

- void set(Object obj, Object value）赋值

- Object get(Object obj) 修改值

### 3.3 获取成员方法

- Method[] getMethods()

- Method[] getDeclaredMethods()

- Method getMethod(String name, Class<?>... parameterTypes)

- Method getDeclaredMethod(String name, Class<?>... parameterTypes)

- Object invoke(Object obj, Object... args) 
  参数一：用obj对象调用该方法
  参数二：调用方法的传递的参数（如果没有就不写）
  返回值：方法的返回值（如果没有就不写）




