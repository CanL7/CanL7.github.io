---
title: Redis初入门
published: 2026-03-25
description: 'Redis'
image: '/images/sagiri/10.jpg'
tags: [java,Redis]
category: 'java'
draft: false 
lang: ''
---



# Redis快速入门

Redis的常见命令和客户端使用



# 1.初识Redis

Redis是一种键值型的NoSql数据库，这里有两个关键字：

- 键值型

- NoSql

其中**键值型**，是指Redis中存储的数据都是以key、value对的形式存储，而value的形式多种多样，可以是字符串、数值、甚至json：

而NoSql则是相对于传统关系型数据库而言，有很大差异的一种数据库。



## 1.1.认识NoSQL

**NoSql**可以翻译做Not Only Sql（不仅仅是SQL），或者是No Sql（非Sql的）数据库。是相对于传统关系型数据库而言，有很大差异的一种特殊的数据库，因此也称之为**非关系型数据库**。



### 1.1.1.结构化与非结构化

传统关系型数据库是结构化数据，每一张表都有严格的约束信息：字段名、字段数据类型、字段约束等等信息，插入的数据必须遵守这些约束：

![](/images/postimage/Redis/4tUgFo6.png)

而NoSql则对数据库格式没有严格约束，往往形式松散，自由。

可以是键值型：

![](/images/postimage/Redis/GdqOSsj.png)

也可以是文档型：

![](/public/images/postimage/Redis/zBBQfcc.png)



甚至可以是图格式：

![](/public/images/postimage/Redis/zBnKxWf.png)



### 1.1.2.关联和非关联

传统数据库的表与表之间往往存在关联，例如外键：

![](/public/images/postimage/Redis/tXYSl5x.png)



而非关系型数据库不存在关联关系，要维护关系要么靠代码中的业务逻辑，要么靠数据之间的耦合：

```json
{
  id: 1,
  name: "张三",
  orders: [
    {
       id: 1,
       item: {
     id: 10, title: "荣耀6", price: 4999
       }
    },
    {
       id: 2,
       item: {
     id: 20, title: "小米11", price: 3999
       }
    }
  ]
}
```

此处要维护“张三”的订单与商品“荣耀”和“小米11”的关系，不得不冗余的将这两个商品保存在张三的订单文档中，不够优雅。还是建议用业务来维护关联关系。



### 1.1.3.查询方式

传统关系型数据库会基于Sql语句做查询，语法有统一标准；

而不同的非关系数据库查询语法差异极大，五花八门各种各样。

![](/public/images/postimage/Redis/AzaHOTF.png)



### 1.1.4.事务

传统关系型数据库能满足事务**ACID**的原则。

而非关系型数据库往往不支持事务，或者不能严格保证ACID的特性，只能实现基本的一致性。



### 1.1.5.总结

除了上述四点以外，在存储方式、扩展性、查询性能上关系型与非关系型也都有着显著差异，总结如下：

![](/public/images/postimage/Redis/kZP40dQ.png)

- 存储方式
  
  - 关系型数据库基于磁盘进行存储，会有大量的磁盘IO，对性能有一定影响
  - 非关系型数据库，他们的操作更多的是依赖于内存来操作，内存的读写速度会非常快，性能自然会好一些
* 扩展性
  
  * 关系型数据库集群模式一般是主从，主从数据一致，起到数据备份的作用，称为垂直扩展。
  * 非关系型数据库可以将数据拆分，存储在不同机器上，可以保存海量数据，解决内存大小有限的问题。称为水平扩展。
  * 关系型数据库因为表之间存在关联关系，如果做水平扩展会给数据查询带来很多麻烦
    
    

## 1.2.认识Redis

Redis诞生于2009年全称是**Re**mote  **D**ictionary **S**erver 远程词典服务器，是一个基于内存的键值型NoSQL数据库。

**特征**：

- 键值（key-value）型，value支持多种不同数据结构，功能丰富
- 单线程，每个命令具备原子性
- 低延迟，速度快（基于内存、IO多路复用、良好的编码）。
- 支持数据持久化
- 支持主从集群、分片集群
- 支持多语言客户端

**作者**：Antirez

Redis的官方网站地址：https://redis.io/

# 2.Redis常见命令

Redis是典型的key-value数据库，key一般是字符串，而value包含很多不同的数据类型：

![](/public/images/postimage/Redis/8tli2o9.png)



Redis为了方便我们学习，将操作不同数据类型的命令也做了分组，在官网（ [https://redis.io/commands ](https://redis.io/commands)）可以查看到不同的命令：

不同类型的命令称为一个group，我们也可以通过help命令来查看各种不同group的命令：



下面，来学习常见的五种基本数据类型的相关命令。



## 2.1.Redis通用命令

通用指令是部分数据类型的，都可以使用的指令，常见的有：

- KEYS：查看符合模板的所有key
- DEL：删除一个指定的key
- EXISTS：判断key是否存在
- EXPIRE：给一个key设置有效期，有效期到期时该key会被自动删除,单位秒
- TTL：查看一个KEY的剩余有效期

通过help [command] 可以查看一个命令的具体用法，例如：

```sh
# 查看keys命令的帮助信息：
127.0.0.1:6379> help keys

KEYS pattern
summary: Find all keys matching the given pattern
since: 1.0.0
group: generic
```



## 2.2.String类型

String类型，也就是字符串类型，是Redis中最简单的存储类型。

其value是字符串，不过根据字符串的格式不同，又可以分为3类：

- string：普通字符串
- int：整数类型，可以做自增、自减操作
- float：浮点类型，可以做自增、自减操作

不管是哪种格式，底层都是字节数组形式存储，只不过是编码方式不同。字符串类型的最大空间不能超过512m.



### 2.2.1.String的常见命令

String的常见命令有：

- SET：添加或者修改已经存在的一个String类型的键值对
- GET：根据key获取String类型的value
- MSET：批量添加多个String类型的键值对
- MGET：根据多个key获取多个String类型的value
- INCR：让一个整型的key自增1
- INCRBY:让一个整型的key自增并指定步长，例如：incrby num 2 让num值自增2
- INCRBYFLOAT：让一个浮点类型的数字自增并指定步长
- SETNX：添加一个String类型的键值对，前提是这个key不存在，否则不执行
- SETEX：添加一个String类型的键值对，并且指定有效期
  
  
  
  

### 2.2.2.Key结构

Redis没有类似MySQL中的Table的概念，我们该如何区分不同类型的key呢？

例如，需要存储用户、商品信息到redis，有一个用户id是1，有一个商品id恰好也是1，此时如果使用id作为key，那就会冲突了，该怎么办？

我们可以通过给key添加前缀加以区分，不过这个前缀不是随便加的，有一定的规范：

Redis的key允许有多个单词形成层级结构，多个单词之间用':'隔开，格式如下：

```java
    项目名:业务名:类型:id
```

这个格式并非固定，也可以根据自己的需求来删除或添加词条。这样以来，我们就可以把不同类型的数据区分开了。从而避免了key的冲突问题。

例如我们的项目名称叫 heima，有user和product两种不同类型的数据，我们可以这样定义key：

- user相关的key：**heima:user:1**

- product相关的key：**heima:product:1**
  
  

如果Value是一个Java对象，例如一个User对象，则可以将对象序列化为JSON字符串后存储：

| **KEY**   | **VALUE**                                |
| --------- | ---------------------------------------- |
| user:1    | {"id":1,  "name": "Jack", "age": 21}     |
| product:1 | {"id":1,  "name": "小米11", "price": 4999} |

并且，在Redis的桌面客户端中，还会以相同前缀作为层级结构，让数据看起来层次分明，关系清晰：



## 2.3.Hash类型

Hash类型，也叫散列，其value是一个无序字典，类似于Java中的HashMap结构。

String结构是将对象序列化为JSON字符串后存储，当需要修改对象某个字段时很不方便：

![](/public/images/postimage/Redis/x2zDBjf.png)



Hash结构可以将对象中的每个字段独立存储，可以针对单个字段做CRUD：

![](/public/images/postimage/Redis/VF2EPt0.png)

Hash的常见命令有：

- HSET key field value：添加或者修改hash类型key的field的值

- HGET key field：获取一个hash类型key的field的值

- HMSET：批量添加多个hash类型key的field的值

- HMGET：批量获取多个hash类型key的field的值

- HGETALL：获取一个hash类型的key中的所有的field和value

- HKEYS：获取一个hash类型的key中的所有的field

- HINCRBY:让一个hash类型key的字段值自增并指定步长

- HSETNX：添加一个hash类型的key的field值，前提是这个field不存在，否则不执行
  
  
  
  

## 2.4.List类型

Redis中的List类型与Java中的**LinkedList**类似，可以看做是一个**双向链表**结构。既可以支持正向检索和也可以支持反向检索。

特征也与LinkedList类似：

- 有序
- 元素可以重复
- 插入和删除快
- 查询速度一般

常用来存储一个有序数据，例如：朋友圈点赞列表，评论列表等。



List的常见命令有：

- LPUSH key element ... ：向列表左侧插入一个或多个元素
- LPOP key：移除并返回列表左侧的第一个元素，没有则返回nil
- RPUSH key element ... ：向列表右侧插入一个或多个元素
- RPOP key：移除并返回列表右侧的第一个元素
- LRANGE key star end：返回一段角标范围内的所有元素
- BLPOP和BRPOP：与LPOP和RPOP类似，只不过在没有元素时等待指定时间，而不是直接返回nil
  
  
  
  

## 2.5.Set类型

Redis的Set结构与Java中的HashSet类似，可以看做是一个value为null的HashMap。因为也是一个hash表，因此具备与HashSet类似的特征：

- 无序

- 元素不可重复

- 查找快

- 支持交集、并集、差集等功能
  
  

Set的常见命令有：

- SADD key member ... ：向set中添加一个或多个元素
- SREM key member ... : 移除set中的指定元素
- SCARD key： 返回set中元素的个数
- SISMEMBER key member：判断一个元素是否存在于set中
- SMEMBERS：获取set中的所有元素
- SINTER key1 key2 ... ：求key1与key2的交集
- 还有差集SDIFF并集SUNION 此处省略
  
  

## 2.6.SortedSet类型

Redis的SortedSet是一个可排序的set集合，与Java中的TreeSet（底层红黑树）有些类似，但底层数据结构却差别很大。SortedSet中的每一个元素都带有一个score属性，可以基于score属性对元素排序，底层的实现是一个跳表（SkipList）加 hash表。

SortedSet具备下列特性：

- 可排序
- 元素不重复
- 查询速度快

因为SortedSet的可排序特性，经常被用来实现**排行榜**这样的功能。



**SortedSet**的常见命令有：

- ZADD key score member：添加一个或多个元素到sorted set ，如果已经存在则更新其score值
- ZREM key member：删除sorted set中的一个指定元素
- ZSCORE key member : 获取sorted set中的指定元素的score值
- ZRANK key member：获取sorted set 中的指定元素的排名
- ZCARD key：获取sorted set中的元素个数
- ZCOUNT key min max：统计**score值**在给定范围内的所有**元素的个数**
- ZINCRBY key increment member：让sorted set中的指定元素自增，步长为指定的increment值
- ZRANGE key min max：按照score排序后，获取指定**排名**范围内的**元素**
- ZRANGEBYSCORE key min max：按照score排序后，获取指定score范围内的元素
- ZDIFF、ZINTER、ZUNION：求差集、交集、并集

注意：所有的排名默认都是升序，如果要降序则在命令的Z后面添加**REV**即可，例如：

- **升序**获取sorted set 中的指定元素的排名：ZRANK key member

- **降序**获取sorted set 中的指定元素的排名：ZREVRANK key memeber
  
  

# 3.Redis的Java客户端

包括：

- Jedis和Lettuce：这两个主要是提供了Redis命令对应的API，方便我们操作Redis，而SpringDataRedis又对这两种做了抽象和封装，因此我们后期会直接以SpringDataRedis来学习。
- Redisson：是在Redis基础上实现了分布式的可伸缩的java数据结构，例如Map、Queue等，而且支持跨进程的同步机制：Lock、Semaphore等待，比较适合用来实现特殊的功能需求。
  
  
  
  

## 3.1.Jedis客户端

### 3.1.1.快速入门

1）引入依赖：

```xml
<!--jedis-->
<dependency>
    <groupId>redis.clients</groupId>
    <artifactId>jedis</artifactId>
    <version>3.7.0</version>
</dependency>
<!--单元测试-->
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.7.0</version>
    <scope>test</scope>
</dependency>
```



2）建立连接

新建一个单元测试类，内容如下：

```java
private Jedis jedis;

@BeforeEach
void setUp() {
    // 1.建立连接
    // jedis = new Jedis("192.168.150.101", 6379);
    jedis = JedisConnectionFactory.getJedis();
    // 2.设置密码
    jedis.auth("123321");
    // 3.选择库
    jedis.select(0);
}
```



3）测试：

```java
@Test
void testString() {
    // 存入数据
    String result = jedis.set("name", "虎哥");
    System.out.println("result = " + result);
    // 获取数据
    String name = jedis.get("name");
    System.out.println("name = " + name);
}

@Test
void testHash() {
    // 插入hash数据
    jedis.hset("user:1", "name", "Jack");
    jedis.hset("user:1", "age", "21");

    // 获取
    Map<String, String> map = jedis.hgetAll("user:1");
    System.out.println(map);
}
```



4）释放资源

```java
@AfterEach
void tearDown() {
    if (jedis != null) {
        jedis.close();
    }
}
```



### 3.1.2.连接池

Jedis本身是线程不安全的，并且频繁的创建和销毁连接会有性能损耗，因此推荐使用Jedis连接池代替Jedis的直连方式。

```java
package com.heima.jedis.util;

import redis.clients.jedis.*;

public class JedisConnectionFactory {

    private static JedisPool jedisPool;

    static {
        // 配置连接池
        JedisPoolConfig poolConfig = new JedisPoolConfig();
        poolConfig.setMaxTotal(8);
        poolConfig.setMaxIdle(8);
        poolConfig.setMinIdle(0);
        poolConfig.setMaxWaitMillis(1000);
        // 创建连接池对象，参数：连接池配置、服务端ip、服务端端口、超时时间、密码
        jedisPool = new JedisPool(poolConfig, "192.168.150.101", 6379, 1000, "123321");
    }

    public static Jedis getJedis(){
        return jedisPool.getResource();
    }
}
```

> TRAE说线程池最好也要关闭 所以我们添加一个关闭方法

```java
// 关闭连接池
    public static void closePool() {
        if (jedisPool != null) {
            jedisPool.close();
        }
    }
```

## 3.2.SpringDataRedis客户端

SpringData是Spring中数据操作的模块，包含对各种数据库的集成，其中对Redis的集成模块就叫做SpringDataRedis，[官网地址](https://spring.io/projects/spring-data-redis)

- 提供了对不同Redis客户端的整合（Lettuce和Jedis）
- 提供了RedisTemplate统一API来操作Redis
- 支持Redis的发布订阅模型
- 支持Redis哨兵和Redis集群
- 支持基于Lettuce的响应式编程
- 支持基于JDK、JSON、字符串、Spring对象的数据序列化及反序列化
- 支持基于Redis的JDKCollection实现
  
  

SpringDataRedis中提供了RedisTemplate工具类，其中封装了各种对Redis的操作。并且将不同数据类型的操作API封装到了不同的类型中：

![](../../../public/images/postimage/Redis/UFlNIV0.png)



### 3.2.1.快速入门

SpringBoot已经提供了对SpringDataRedis的支持，使用非常简单。



首先，新建一个maven项目，然后按照下面步骤执行：



#### 1）引入依赖

选择的时候选上 SpringDataRedis 然后在项目依赖项中添加上连接池依赖 pool

```xml
<!-- Redis 连接池依赖（必须手动加！） -->
        <dependency>
            <groupId>org.apache.commons</groupId>
            <artifactId>commons-pool2</artifactId>
        </dependency>
```



#### 2）配置Redis

```yaml
spring:
  redis:
    host: 192.168.150.101
    port: 6379
    password: 123321
    lettuce: //默认SpringDataRedis会采用lettuce  如果需要用Jedis需手动添加依赖
      pool:
        max-active: 8
        max-idle: 8
        min-idle: 0
        max-wait: 100ms
```



#### 3）注入RedisTemplate

因为有了SpringBoot的自动装配，我们可以拿来就用：

```java
@SpringBootTest
class RedisStringTests {

    @Autowired
    private RedisTemplate redisTemplate;
}
```



#### 4）编写测试

```java
@SpringBootTest
class RedisStringTests {

    @Autowired
    private RedisTemplate edisTemplate;

    @Test
    void testString() {
        // 写入一条String数据
        redisTemplate.opsForValue().set("name", "虎哥");
        // 获取string数据
        Object name = stringRedisTemplate.opsForValue().get("name");
        System.out.println("name = " + name);
    }
}
```

但是当我们测试后去终端里用get方法会发现得不到刚才存的东西 那其实是因为SpringBoot默认采用JDK序列化 

如果我们想看懂 就需要采用自定义序列化 下面开始解释



### 3.2.2.自定义序列化

RedisTemplate可以接收任意Object作为值写入Redis：

只不过写入前会把**Object**序列化为字节形式，**默认**是采用**JDK序列化**，结果就是一串你看不懂的码

**缺点**：

- 可读性差
- 内存占用较大
  
  
  
  

我们可以**自定义**RedisTemplate的**序列化**方式，代码如下：

```java
// 1. Spring Boot 自动配置会创建一个默认的 RedisTemplate Bean
// 2. 你创建了 RedisConfig 配置类
@Configuration
public class RedisConfig {

    // 3. 你用 @Bean 注解定义了一个方法
    @Bean 
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory) {
        // 4. 你在这个方法里：
        RedisTemplate<String, Object> template = new RedisTemplate<>(); // a) 手动 new 一个新对象
        template.setConnectionFactory(factory);                           // b) 设置连接工厂
        template.setKeySerializer(new StringRedisSerializer());         // c) **自定义** key 序列化器
        template.setValueSerializer(new GenericJackson2JsonRedisSerializer()); // d) **自定义** value 序列化器
        // ...
        return template; // e) 将这个配置好的新对象返回
    }
    // 5. Spring 把你返回的这个对象（Bean）放入容器，替换掉了原来的默认对象
}
```



我们来理解一下这个东西

**`RedisTemplate` 是一个 Spring 提供的类。Spring Boot 会自动创建一个该类的 Bean。如果我想自定义这个 Bean 的配置（比如修改序列化方式），我就可以新建一个 `@Configuration` 配置类，在里面写一个 `@Bean` 注解的方法。在这个方法里，我手动创建一个 `RedisTemplate` 对象，进行我想要的自定义配置，然后将它返回。Spring 会用我这个自定义的 Bean，替换掉它自动创建的那个默认的 Bean**



```java
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private String name;
    private Integer age;
}

@Test
void testSaveUser() {
    User user = new User("lisi",19);
    redisTemplate.opsForValue().set("user:101",user);
    User o = (User) redisTemplate.opsForValue().get("user:101");
//注意 这个会自动反序列化回User 是因为在存的Json数据中第一行就有声明user
    System.out.println("user = " + o);
}



```

> 为了在反序列化时知道对象的类型，JSON序列化器会将类的class类型写入json结果中，存入Redis，会带来额外的内存开销。
> 
> 那我们难道只有这一种方法吗？ 其实不然

### 3.2.3.StringRedisTemplate

为了节省内存空间，我们可以不使用JSON序列化器来处理value，而是统一使用String序列化器，要求只能存储String类型的key和value。当需要存储Java对象时，**手动完成**对象的序列化和反序列化。



因为存入和读取时的序列化及反序列化都是我们自己实现的，SpringDataRedis就不会将class信息写入Redis了，从而实现节省内存功能

SpringDataRedis提供了RedisTemplate的子类：StringRedisTemplate，它的key和value的序列化方式默认就是String方式。

省去了我们自定义RedisTemplate的序列化方式的步骤，而是直接使用：

```java
@Autowired
private StringRedisTemplate stringRedisTemplate;
// JSON序列化工具
private static final ObjectMapper mapper = new ObjectMapper();

@Test
void testSaveUser() throws JsonProcessingException {
    // 创建对象
    User user = new User("小王", 21);
    // 手动序列化
    String json = mapper.writeValueAsString(user);
    // 写入数据
    stringRedisTemplate.opsForValue().set("user:200", json);
    // 获取数据
    String jsonUser = stringRedisTemplate.opsForValue().get("user:200");
    // 手动反序列化
    User user1 = mapper.readValue(jsonUser, User.class);//指定反序列化对象class文件
    System.out.println("user1 = " + user1);

}

```

### 3.2.4 Hash结构操作




```java
@SpringBootTest
class RedisStringTests {
    @Autowired
    private StringRedisTemplate stringRedisTemplate;
    @Test
    void testHash() {
        stringRedisTemplate.opsForHash().put("user:400", "name", "虎哥");
        stringRedisTemplate.opsForHash().put("user:400", "age", "21");

        Map<Object, Object> entries = stringRedisTemplate.opsForHash().entries("user:400");
//符合java语法习惯
        System.out.println("entries = " + entries);
    }
}
```


        


