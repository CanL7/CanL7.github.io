---
title: noteday4
published: 2026-03-17
description: 'note'
image: '/images/sagiri/6.jpg'
tags: [java]
category: 'Note'
draft: false 
lang: ''
---

# 泛型

**1.** 泛型中不能写基本数据类型
指定泛型的具体类型后，传递数据时，可以传入该类型和他的子类类型
如果不写泛型，类型默认是Object

**2.** 泛型类:类名后面定义泛型

泛型方法:修饰符后面定义方法

泛型接口:接口名后面定义泛型

**3.** 泛型不具备继承性，但是数据具备继承性
泛型的通配符:? -> eg:? extend E && ? superE

## 数据结构

**1. 二叉树**

    1.1 **二叉查找树**：小的存左边 大的存右边 一样的不存

    1.2 遍历方式：前序遍历 中序遍历 后序遍历 层序遍历

    1.3 **平衡二叉树** ：任意节点左右子树高度差不超过1

        1.3.1 **旋转！** 当添加一个新节点导致树不平衡时 我们进行旋转操作 从新节点开始找父节点

        左左：右旋 左右：局部右旋再左旋 

        右右： 左旋 右左：局部左旋再右选

**2.红黑树** (特殊的二叉查找树)

    **2.1 红黑规则** 

![1](/images/postimage/Noteday4imgs/1.png)

    **2.2 添加节点的操作**

![2](/images/postimage/Noteday4imgs/2.png)

**红黑树增删改查的性能都很好**



## Set集合

###### **1.HashSet** 底层采用**哈希表** jdk8之后采用数组+链表+红黑树 默认长度16 加载因数0.75

```java
int index = (数组长度-1) & 哈希值
```

**哈希值**是对象的整数表示 不重写hashcode方法的话就跟equals方法一样比地址

当链表大于8且数组大于64时 自动转为**红黑树**处理 加载因数是扩容时机 

###### **2.LinkedHashSet** 特点：有序 添加节点时会与上一个节点互相记录地址值

> 数据去重默认用HashSet 如果要求存取有序 则采取LinkedHashSet

###### **3.TreeSet** 特点： 不重复 无索引 可排序 基于**红黑树**

> 对于排序解释: 默认从小到大 字符或字符串按照ASCII码升序排序

   **TreeSet的两种排序:** 

        **1.** 默认排序/自然排序:Javabean类实现**Comparable**接口指定比较规则(o为树中已存节点)
        **2.** 比较器排序:创建TreeSet对象时候，传递比较器**Comparator**指定规则 (默认排序不满足要求时再采用第二种)

:::tip

如果当方法一和方法二同时存在时 会采用方法二

:::

> 比如排序字符串时 我们想按照字符串长度排序 此时第一种排序则会调用字符串String本身的排序方法 而我们无法重写String中的compareTo方法 此时就可以采用比较器排序



## 小总结

###### 1.想要集合中的元素**可重复**

用**ArrayList集合**，基于数组的。(用的最多)

###### 2.想要集合中的元素**可重复**，而且当前的**增删操作**明显**多于查询**

用**LinkedList集合**，基于链表的。

###### 3.想对集合中的元素**去重**

用**HashSet集合**，基于哈希表的。(用的最多) 

###### 4.想对集合中的元素**去重**，而且**保证存取顺序**

用**LinkedHashSet集合**，基于哈希表和双链表，效率低于HashSet。

###### 5.想对集合中的元素进行**排序**

用**TreeSet集合**，基于红黑树。后续也可以用List集合实现排序。

这些底层都用到了map集合(还没学...)



## 双列集合

这个集合中存的都叫做键值对 (entry) 或者键值对对象 一个键对应一个值

键(K key)不可以重复 而值(V value)可以重复  

**Map**是**双列集合**的**顶层接口**

###### 1.创建**Map**集合的对象

```java
Map<String, String> m = new HashMap<>();
```

###### 2.添加元素(put方法)

在添加数据的时候，如果**键**不存在，那么直接把键值对对象添加到map集合当中，方法返回nu11 如果键是存在的，那么会把原有的键值对对象**覆盖**，会把**被覆盖的值**进行**返回** 补充:可以通过m.get(key)来获取key所对应的value

##### Map的三种遍历方式

###### 1.键找值

```java
Set<String> keys = map.keySet();
```



###### 2.键值对

```java
Set<Map.Entry<String, String>> entries = map.entrySet();
for (Map.Entry<String, String> entry : entries) {
            System.out.println(entry.getKey() + " : " + entry.getValue());
        }
```

###### 3.Lambda表达式 底层用的第二种键值对 只不过采用的forEach进行遍历

#### 1.HashMap

1.HashMap底层是**哈希表**结构的
2.依赖hashCode方法和equals方法保证**键**的**唯一** 通过键来计算的**哈希值**得到的**索引**

**小练习**

```java
public class HashMapTest2 {
    public static void main(String[] args) {
        /*
            某个班级80名学生，现在需要组成秋游活动，
            班长提供了四个景点依次是（A、B、C、D）,
            每个学生只能选择一个景点，请统计出最终哪个景点想去的人数最多。
        */
        //1.需要先让同学们投票
        //定义一个数组，存储4个景点
        String[] arr = {"A","B","C","D"};
        //利用随机数模拟80个同学的投票，并把投票的结果存储起来
        ArrayList<String> list = new ArrayList<>();
        Random r = new Random();
        for (int i = 0; i < 80; i++) {
            int index = r.nextInt(arr.length);
            list.add(arr[index]);
        }
        //2.如果要统计的东西比较多，不方便使用计数器思想(自己做的第一遍就是计数器(捂脸)
        //我们可以定义map集合，利用集合进行统计。 
        HashMap<String,Integer> hm = new HashMap<>();
        for (String name : list) {
            //判断当前的景点在map集合当中是否存在
            if(hm.containsKey(name)){
                //存在
                //先获取当前景点已经被投票的次数
                int count = hm.get(name);
                //表示当前景点又被投了一次
                count++;
                //把新的次数再次添加到集合当中
                hm.put(name,count);
            }else{
                //不存在 添加景点
                hm.put(name,1);
            }
        }
        System.out.println(hm);
        //3.求最大值
        int max = 0;
        Set<Map.Entry<String, Integer>> entries = hm.entrySet();
        for (Map.Entry<String, Integer> entry : entries) {
            int count = entry.getValue();
            if(count > max){
                max = count;
            }
        }
        System.out.println(max);
        //4.判断哪个景点的次数跟最大值一样，如果一样，打印出来
        for (Map.Entry<String, Integer> entry : entries) {
            int count = entry.getValue();
            if(count == max){
                System.out.println(entry.getKey());
            }
        }
    }
}
```

> 1. 使用 `ArrayList` 存储临时数据（如投票结果）
> 2. 使用 `HashMap` 进行统计（键是统计对象，值是计数）
> 3. 利用 `entrySet` 遍历 `HashMap`，同时获取键和值
> 4. 分步处理问题：先统计，再计算最大值，最后找出结果

TreeMap

1.特点不重复、无索引、可排序，底层基于红黑树实现排序，增删改查性能较好

2.TreeMap集合排序的两种方式（与TreeSet一样）
     2.1实现Comparable接口，指定比较规则
     2.2创建集合时传递Comparator比较器对象，指定比较规则