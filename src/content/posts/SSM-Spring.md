---
title: SSM-Spring部分
published: 2026-04-07
description: 'SSMSpring部分'
image: '/images/sagiri/13.png'
tags: [java,SSM,Spring]
category: 'java'
draft: false 
lang: ''
---
# SSM-Spring

## 1. Spring-容器（IOC）

### 1.1 IOC 核心概念

#### 1.1.1 什么是 IOC（控制反转）

在学习 Servlet 时，我们所有对象都是**手动 new 出来**的；

在 Spring 中，**对象的创建、管理、依赖注入、销毁**全部交给 Spring 容器统一处理，我们不再手动创建对象。

:::tip 核心定义

IOC 是一种设计思想：**把对象的控制权从代码反转给 Spring 容器**。

DI（依赖注入）是 IOC 思想的具体实现方式。

:::

#### 1.1.2 什么是 Bean

被 Spring IOC 容器创建、管理、维护的**所有对象**，统称为 Bean。

简单理解：容器里的每一个对象 = 一个 Bean。

#### 1.1.3 IOC 容器核心对象

```java
ConfigurableApplicationContext ioc = SpringApplication.run(主启动类.class, args);
```

- 这就是 Spring 的**核心容器**

- 所有 Bean 的创建、获取、管理都依靠这个对象

- 容器启动 → Bean 初始化 → 容器关闭 → Bean 销毁

:::warning 关键区别

Servlet：服务器管理 Servlet 实例（单例）

Spring：IOC 容器管理所有 Bean（默认单例）

两者的管理思想完全一致

:::

### 1.2 标准项目目录结构

严格按照 Spring 规范创建，所有组件必须放在**主启动类的包/子包**下：

```plain
src/main/java/你的项目根包
├── bean          // 实体类：Car、Dog、Person、User 等
├── config        // Spring 配置类（替代XML配置文件）
├── controller    // 控制层 = 升级版 Servlet
├── service       // 业务层 
├── dao           // 持久层
├── factory       // 自定义 FactoryBean 工厂类
├── condition     // 自定义条件装配类
└── 主启动类       // Spring 项目入口，容器启动类
```

:::caution 强制规则

如果组件不在主启动类的包/子包下，Spring 无法扫描，**不会注册为 Bean**

:::

### 1.3 Bean 的两种注册方式

#### 方式 1：分层注解扫描（开发最常用）

对标 Servlet 分层架构，**注解直接写在类上**，Spring 自动扫描注册为 Bean。

| 注解名称        | 书写位置         | 核心作用      |
| ----------- | ------------ | --------- |
| @Controller | controller 包 | 接收前端请求    |
| @Service    | service 包    | 处理业务逻辑、判断 |
| @Repository | dao 包        | 操作数据库、SQL |
| @Component  | 通用类/工具类      | 普通组件注册    |

##### 完整代码示例

```java
// 控制层
@Controller
public class UserController { }

// 业务层
@Service
public class UserService { }

// 持久层
@Repository
public class UserDao { }

// 通用实体类
@Component
public class Car { }
```

:::note 拓展说明

四大分层注解本质都是 @Component，只是语义不同，方便开发者区分业务层！

:::

#### 方式 2：配置类 + @Bean（手动注册）

**适用场景**

1. 第三方工具类（无法修改源码添加 @Component）

2. 需要自定义对象创建逻辑

3. 整合数据库连接池、第三方框架

**存放目录**：config 包

**注解规则**

- @Configuration：标记当前类为 Spring 配置类

- @Bean：标记方法，**方法返回值自动注册为 Bean**

##### 完整代码示例

```java
@Configuration
public class AppConfig {

    // Bean 名称 = 方法名 zhangsan
    // 容器启动时自动执行方法，将返回的 Person 放入容器
    @Bean
    public Person zhangsan(){
        Person person = new Person();
        person.setName("张三");
        person.setAge(20);
        return person;
    }

    // 自定义 Bean 名称
    @Bean("lisi")
    public Person person(){
        return new Person("李四",22);
    }
}
```

:::important 核心要点

配置类本身也是一个 Bean，会被 Spring 容器自动管理；@Bean 方法支持自定义 Bean 名称！

:::

### 1.4 IOC 容器获取 Bean 的 4 种方式

容器启动后，通过 ioc 对象获取已经创建好的 Bean，**全程无需 new**。

```java
// 1. 启动 Spring 容器
ConfigurableApplicationContext ioc = SpringApplication.run(主启动类.class, args);
```

#### 1.4.1 按 Bean 名称获取

```java
Person person = (Person) ioc.getBean("zhangsan");
```

#### 1.4.2 按 Bean 类型获取

```java
Person person = ioc.getBean(Person.class);
```

#### 1.4.3 获取同类型所有 Bean（返回 Map）

```java
Map<String, Person> personMap = ioc.getBeansOfType(Person.class);
```

#### 1.4.4 名称 + 类型 精准获取（推荐）

```java
Person person = ioc.getBean("zhangsan", Person.class);
```

:::caution 高频报错

1. 容器中无此 Bean → NoSuchBeanDefinitionException

2. 同类型多个 Bean，仅按类型获取 → NoUniqueBeanDefinitionException

:::

### 1.5 Bean 作用域 @Scope 详解

@Scope 用于控制 Bean 的创建数量和生命周期，**可写在类上 / @Bean 方法上**。

| 作用域类型         | 创建时机    | 核心特点       | 使用场景       |
| ------------- | ------- | ---------- | ---------- |
| singleton（默认） | 容器启动时创建 | 单例，全局唯一对象  | 99% 业务场景   |
| prototype     | 每次获取时创建 | 多例，每次都是新对象 | 线程不安全组件    |
| request（Web）  | 一次请求创建  | 请求内单例      | Web 请求独立对象 |
| session（Web）  | 一次会话创建  | 会话内单例      | 用户登录会话     |

#### 代码示例

```java
// 多例 Bean，每次获取都创建新对象
@Component
@Scope("prototype")
public class Dog { }
```

:::tip 单例 vs 多例

- 单例：bean1 == bean2 → true

- 多例：bean1 == bean2 → false

:::

### 1.6 懒加载 @Lazy 原理与使用

**仅针对单例 Bean 生效**！

- 默认单例：容器启动时**立即创建**对象

- 添加 @Lazy：**第一次获取对象时才创建**

**作用**：加快 Spring 容器启动速度，延迟加载不常用的 Bean。

#### 代码示例

```java
@Bean
@Lazy
public Person lazyPerson(){
    System.out.println("懒加载 Bean 被创建了");
    return new Person();
}
```

:::warning 使用场景

项目启动慢、Bean 初始化逻辑复杂时，优先使用懒加载；高频使用的 Bean 不建议加！

:::

### 1.7 FactoryBean 工厂 Bean 实战

**适用场景**：创建复杂对象、自定义对象初始化逻辑，普通 @Bean 无法满足时使用。

**存放目录**：factory 包

#### 实现步骤

1. 类实现 FactoryBean<T> 接口

2. 重写 getObject()：创建目标对象

3. 重写 getObjectType()：指定对象类型

4. 添加 @Component 注册工厂

#### 完整代码示例

```java
@Component
public class CarFactory implements FactoryBean<Car> {

    // 自定义复杂创建逻辑
    @Override
    public Car getObject() throws Exception {
        Car car = new Car();
        car.setBrand("比亚迪");
        car.setPrice(200000);
        return car;
    }

    // 指定容器中 Bean 的类型
    @Override
    public Class<?> getObjectType() {
        return Car.class;
    }

    // 默认单例，改为 false 则为多例
    @Override
    public boolean isSingleton() {
        return true;
    }
}
```

:::important 核心规则

工厂本身是 Bean，但容器中**最终存储的是泛型对象（Car）**

直接获取 Car.class 即可使用，无需关心工厂类。

:::

### 1.8 @Conditional 条件装配全用法

**核心作用**：满足自定义条件 → 注册 Bean；不满足 → 不注册。

**存放目录**：condition 包

**支持 3 个书写位置**：@Bean 方法上、配置类上、组件类上。

#### 1.8.1 自定义条件类

```java
public class WindowsCondition implements Condition {
    @Override
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
        // 获取系统环境变量
        String os = context.getEnvironment().getProperty("os.name");
        // 满足条件返回 true，注册 Bean
        return os.contains("Windows");
    }
}
```

#### 1.8.2 三种使用方式

```java
// ① 写在 @Bean 上：控制单个 Bean
@Bean
@Conditional(WindowsCondition.class)
public Person winPerson(){}

// ② 写在配置类上：控制整个配置类
@Configuration
@Conditional(WindowsCondition.class)
public class DbConfig {}

// ③ 写在业务类上：控制整个组件
@Service
@Conditional(WindowsCondition.class)
public class UserService {}
```

#### 1.8.3 获取环境变量

```java
ConfigurableEnvironment env = ioc.getEnvironment();
String os = env.getProperty("os.name");
```

:::note 拓展

Spring 提供内置条件注解，无需自定义类：

- @ConditionalOnProperty：配置文件存在指定属性

- @ConditionalOnClass：类路径存在指定类

- @ConditionalOnMissingBean：容器中无此 Bean

:::



### 1.9 依赖注入

>  hello 这一块笔记有点混乱 如果你回过头来看的话 可能要自己回味一番了 
> 
> 最好去本地找老师的代码 跟着每一步流程走一遍...我实在没招了
> 
> 更新: 有位大佬给了笔记 就在本地 可以去看 特别好 我都想直接传他笔记了..

#### 1.9.1 @Autowired 自动装配（开发常用）

**核心作用**：Spring原生注解，默认按类型（byType）自动注入容器中的Bean，日常开发最基础常用。

**重点写法**：

1. 字段注入（最简洁，使用频率最高）

```java
/**
     * 自动装配流程（先按照类型，再按照名称）
     * 1、按照类型，找到这个组件；
     *      1.0、只有且找到一个，直接注入，名字无所谓
     *      1.1、如果找到多个，再按照名称去找; 变量名就是名字（新版）。
     *           1.1.1、如果找到： 直接注入。
     *           1.1.2、如果找不到，报错
     */
    @Autowired //自动装配； 原理：Spring 调用 容器.getBean
    UserService abc;

    @Autowired
    Person bill;

    @Autowired  //把这个类型的所有组件都拿来
    List<Person> personList;

    @Autowired
    Map<String,Person> personMap;

    @Autowired //注入ioc容器自己
    ApplicationContext applicationContext;

```

2. 构造器注入（官方推荐，避免空指针）

```java
@Service
public class UserService {
    private final UserDao userDao; // final保证依赖不可变
    // 单构造器可省略@Autowired，Spring自动匹配注入
    public UserService(UserDao userDao) {
        this.userDao = userDao;
    }
}

```

3. Setter方法注入（极少用，仅适配可选依赖，带过）

```java
@Service
public class UserService {
    private UserDao userDao;
    @Autowired
    public void setUserDao(UserDao userDao) {
        this.userDao = userDao;
    }
}

```

**关键细节**：

- 默认必须有匹配Bean，否则报错；@Autowired(required = false)可允许为空（不推荐）。

- 多实现类时单独使用会冲突，需配合@Qualifier或@Primary。

#### 1.9.2 @Qualifier 精准指定Bean（开发常用）

**核心作用**：配合@Autowired，按Bean名称（byName）解决多实现类注入冲突。

**实战用法**：

```java
// 给同接口实现类指定Bean名称
@Repository("userDaoMysql")
public class UserDaoMysql implements UserDao {}
@Repository("userDaoOracle")
public class UserDaoOracle implements UserDao {}

// 注入时精准指定名称
@Service
public class UserService {
    @Autowired
    @Qualifier("userDaoMysql") // 明确注入指定名称的Bean
    private UserDao userDao;
}

```

**关键细节**：必须配合@Autowired使用，Bean名称默认首字母小写，可手动指定。

#### 1.9.3 @Primary 优先默认Bean（开发常用）

**核心作用**：多实现类时，标记首选Bean，无需每次用@Qualifier指定。

**实战用法**：

```java
@Primary // 设为默认首选Bean
@Repository
public class UserDaoMysql implements UserDao {}
@Repository
public class UserDaoOracle implements UserDao {}

// 直接@Autowired，自动注入首选的UserDaoMysql
@Service
public class UserService {
    @Autowired
    private UserDao userDao;
}

```

**关键细节**：优先级：@Qualifier > @Primary；同一接口只能有一个@Primary。

#### 1.9.4 @Resource

**核心作用**：Java标准注解，Spring兼容，先按名称、再按类型注入

**简化用法**：

```java
@Service
public class UserService {
    @Resource(name = "userDaoMysql") // 直接指定Bean名称
    private UserDao userDao;
}

```

**关键细节**：无required属性，找不到Bean直接报错；追求通用性时使用。

> @Resource 和 @Autowired 区别？  
> 1、@Autowired 和 @Resource 都是做bean的注入用的，都可以放在属性上  
> 2、@Resource 具有更强的通用性

#### 1.9.5 xxxAware 感知接口

**核心作用**：获取Spring底层容器资源,仅框架扩展使用。

```java
@Component
public class MyBean implements ApplicationContextAware {
    @Override
    public void setApplicationContext(ApplicationContext ctx) {
        // 获取容器上下文（日常开发用不到）
    }
}

```

#### 1.9.6 @Value 配置取值（开发常用）

**核心作用**：读取yml/properties配置，注入属性，适配简单配置取值。

**用法**：

```java
// 读取配置，支持默认值（配置不存在时用默认值）
@Value("${db.url:jdbc:mysql://localhost:3306/test}")
private String dbUrl;
// 配合SpEL表达式（简单使用）
@Value("#{10*2}")
private Integer num;

```

#### 1.9.7 SpEL 表达式（简化带过）

用#{表达式}实现运算、调用静态方法，常配合@Value使用，日常开发掌握基础用法即可。

#### 1.9.8 @PropertySource 加载自定义配置（开发常用）

**核心作用**：加载自定义properties文件 读取的

```java
@Configuration
@PropertySource(value = "classpath:db.properties", encoding = "UTF-8")
public class DbConfig {
    @Value("${db.username}")
    private String dbUser;
}

```

#### 1.9.9 @Profile 多环境切换（开发常用）

**核心作用**：绑定Bean/配置到指定环境（dev/test/prod），实现一套代码多环境适配。

```java
//组件
@Component
public class DeliveryDao {
    @Autowired
    MyDataSource myDataSource;
    //打印数据源
    public void delivery() {
        System.out.println(myDataSource);
    }
}
//配置Config
@Configuration
public class DataSourceConfig {

    @Profile("dev")
    @Bean
    public MyDataSource dev() {
        MyDataSource myDataSource = new MyDataSource();
        myDataSource.setUrl("jdbc:mysql://localhost:3306/dev");
        myDataSource.setUsername("root");
        myDataSource.setPassword("123456");
        return myDataSource;
    }
    @Profile("test")
    @Bean
    public MyDataSource test() {省略}
    @Profile("prod")
    @Bean
    public MyDataSource prod() {}
}
//这样只需要在配置文件中修改对应激活环境即可采取不同的数据源
spring.profiles.active = dev/prod/test
```

1. @Autowired 和 @Resource 区别？

答：① @Autowired 是 Spring 注解，@Resource 是 JDK 自带；② @Autowired 先按类型注入，需配合 @Qualifier 解决歧义，@Resource 可直接指定名称；③ @Autowired 有 required 属性，@Resource 没有。

2. @Profile 和 @Qualifier 区别？

答：均解决多 Bean 歧义；@Profile 按环境自动筛选，@Qualifier 手动指定 Bean 名称。



### 1.10 Bean 的生命周期

发生某种情况时,执行某段代码, spring会把各个环节暴露出来

#### 1.10.1 @Bean注解

```java
@Configuration
public class personconfig {
    @Bean(initMethod = "chushihua",destroyMethod = "xiaohui")//代表p1组件初始化时会执行chushihua方法,销毁时会执行                                                                      xiaohui方法
    public Person p1() {
        Person person = new Person();
        person.setName("刘玉婕");
        person.setAge(23);
        person.setGender("女");
        return person;
    }    
```

```java
@Data
@AllArgsConstructor
public class Person {
    private String name;
    private Integer age;
    private String gender;

    public void chushihua(){
        System.out.println("初始化");   //初始化方法
    }
    public void xiaohui(){
        System.out.println("销毁时");   //销毁时的方法
    }
    public Person(){
        System.out.println("构造器");   //定义构造器
    }
}
```

整体流程为

创建组件后,先执行构造器, 之后若有属性注入执行属性注入, 之后执行@Bean的初始化方法, 之后运行主程序, 最后执行@Bean的销毁方法,之后组件结束

执行构造器 ->执行属性注入->  执行@Bean的初始化方法-> 运行主程序 -> 执行@Bean的销毁方法



#### 1.10.2 两个接口

- InitializingBean  重写afterPropertiesSet

- DisposableBean 重写destory

bean包下的Person类实现这两个接口,重写这两个方法,

#### 1.10.3 @PostConstruct @PreDestroy

@PostConstruct 后面写的方法,在组件注入之后,afterPropertiesSet之前 (属于初始化周期)

@PreDestroy 后面写的方法,在主程序运行之后,重写destory之前运行

#### 1.10.4 BeanPostProcessor

定义一个类实现BeanPostProcessor接口, 这个处理器会拦截所有@Bean的初始化

 实现后重写内部的两个方法, 一个是在初始化之前的后置处理, 一个是在初始化之后的后置处理(**这俩方法有返回值**)

这俩方法一个执行在属性注入之后执行, 另一个在主程序运行前Bean的修改器

此方法和@Autowired的实现有关

@Autowired有一个专门处理注解的AutowiredAnnotationBeanPostProcessor方法, 每个Bean创建后,会调用BeanPostProcessor中的初始化之前的后置处理方法,在方法里会利用反射,看是否有@Autowired注解, 如果有的话,去容器中找到对应的组件,完成组件的注入

#### 1.10.5 生命周期的全流程

![](file:///C:/Users/Sagiri/mizuki/public/images/postimage/SSM/1.png)

#### 1.11 单元测试

我们在Test文件夹中 找到主程序对应的包名 即可测试main对应包下的主程序

这时要添加新注解@SpringBootTest 代码示例如下 还是挺方便的

```java
@SpringBootTest
class Spring01ApplicationTests {
    @Autowired
    Person p1;
    @Test
    void contextLoads() {
        System.out.println(p1);
    }
}
```

<!-- 此处预留 Bean 生命周期笔记位置，可后续补充：

1. 生命周期完整流程（实例化→属性赋值→初始化→销毁）

2. 初始化方法（@PostConstruct、init-method）

3. 销毁方法（@PreDestroy、destroy-method）

4. BeanPostProcessor 后置处理器等内容

-->

如果要测试一些简单功能 临时注释掉@SpringBootTest就好了

**至此 Spring-容器部分完结**

## 2. Spring-AOP

#### 2.1 AOP与OOP

- AOP Aspect Oriented Programming 面向切面

- OOP Object Oriented Programming 面向对象

    这两玩意有啥不同呢?

    AOP会有日志的生成 以后写项目运行肯定是看日志来改代码 而OOP一般没有

#### 2.2 日志的生成

生成日志有以下三种方法

1. 硬编码 (不选)

2. 静态代理 懒得写了

3. **动态代理** 我们重点说明动态代理

#### 2.3 动态代理

    静态代理,每包裹一个组件就需要写一个对应的方法, 很不方便

定义:目标对象target在执行之前,会被拦截从而开始执行动态代理的指定逻辑(拦截器的思想)

优点:什么都可以代理 世间万物!

缺点:不好写,复杂, **被代理的对象必须有接口** 其实就是被代理的对象是接口的实现类 接口里是需要的方法

> AOP的目的就是简化这个动态代理

虽然我们是在学AOP 但是我们还是来手搓一个动态代理加强Java底层能力

![](file:///C:/Users/Sagiri/mizuki/public/images/postimage/SSM/2.png)

我们将获取代理抽取出来 以及日志抽取出来 这样看起来代码更易读 增加复用性

获取代理对象用Proxy.newProxyInstance()

```java

public class DynamicProxy {
    public static void main(String[] args) { }
    public static Object getProxyInstance(Object target){

        return Proxy.newProxyInstance(
                target.getClass().getClassLoader(),//参数1
                target.getClass().getInterfaces(),//参数2
                (proxy, method, args) -> {
                    LogUtils.logStart(method.getName(), args);
                    Object result = null;
                    try {
                        result = method.invoke(target, args);
                    } catch (Exception e) {
                        LogUtils.logException(method.getName(), e);

                    } finally {
                        LogUtils.logResult(method.getName(), result);
                        LogUtils.logEnd(method.getName(), args);
                        return result;
                    }
                }//参数3
        );
    }
}
```

测试代码

```java
public class MathTest {
    @Test
    public void test() {

        MathCalculator Proxy = (MathCalculator) DynamicProxy.getProxyInstance(new MyCalculator());
        int add = Proxy.add(1, 2);
        System.out.println(add);
        System.out.println("========================");
        int div = Proxy.div(10, 0);
        System.out.println(div);
    }
}
```

<!-- 此处预留 AOP 笔记位置，可后续补充：

1. AOP 核心概念（切面、通知、连接点、切入点等）

2. AOP 实现方式（注解式、XML式）

3. 通知类型（前置、后置、环绕、异常、最终）

4. 切入点表达式等内容

-->

#### 2.4 AOP专业术语

![](file:///C:/Users/Sagiri/mizuki/public/images/postimage/SSM/3.png)

#### 2.5 AOP实现

1. 先引入AOP依赖 (高版本还没有)

2. 先创建一个切面类Aspect  标上@Aspect注解 里面写上需要的通知方法

3. 指定切入点表达式
   
   > 通知方法是用来告诉Spring以下方法何时何地运行的
   
   何时？
- @Before：方法执行之前运行。

- @AfterReturning：方法执行正常返回结果运行。

- @AfterThrowing：方法抛出异常运行。

- @After：方法执行之后运行
  何地？
  切入点表达式：
     execution(方法的全签名)：
  
       全写法：[public] int [com.atguigu.spring.aop.calculator.MathCalculator].add(int,int)     [throws ArithmeticException]
       省略写法：int add(int i,int j)
  
  代码如下

```java
@Component
@Aspect
public class LogAspect {

    @Before("execution(int org.springdata.spring02aop.Calculator.MathCalculator.*(int,int))")
    public void logStart(){
        System.out.println("logStart...");
    }

    @After("execution(int org.springdata.spring02aop.Calculator.MathCalculator.*(int,int))")
    public void logReturn(){
        System.out.println("logReturn...");
    }

    @AfterThrowing("execution(int org.springdata.spring02aop.Calculator.MathCalculator.*(int,int))")
    public void logException() {
        System.out.println("logException...");
    }

    @AfterReturning("execution(int org.springdata.spring02aop.Calculator.MathCalculator.*(int,int))")
    public void logEnd(){
        System.out.println("logEnd...");
    }

```

###### 通知方法的执行顺序:

1. 正常链路:前置通知->目标方法->返回通知->后置通知

2. 异常链路:前置通知->目标方法->异常通知->后置通知
   
   

#### 2.6 AOP的底层原理

1. Spring会为每个被切面切入的组件创建**代理对象**(Spring CGLIB创建的 无需接口 )

2. 代理对象中保存了切面类里面所有通知方法构成的增强器链。

3. 目标方法执行时，会先去执行**增强器链**中拿到需要提前执行的**通知方法**去执行。

#### 2.7 JoinPoint && @Pointcut && Signiture

joinpoint 即连接点 我们可以通过传递连接点 通过链接点来获取想要的东西

```java

        @Before("execution(int *(int,int))")
        public void logstart(JoinPoint joinPoint){//这个joinPoint就代表连接点,连接点里有当前方法的全部信息
            //Signature signature = joinPoint.getSignature();//拿到方法全签名
            MethodSignature signature = (MethodSignature) joinPoint.getSignature();//转换成MethodSignature,因为有更多的方                                                                                  法可以调用
            String methodName = signature.getName();//拿到方法名
            Object[] args = joinPoint.getArgs();//参数值
            System.out.println(methodName+"开始,参数列表是"+ Arrays.toString(args));
        }

        @After("execution(int *(int,int))")
        public void logend(){//后置方法可以获取一下名字,这里就不展示了
            System.out.println("结束");
        }

        @AfterReturning(value="execution(int *(int,int))",returning="result")  //写returning指定result接收返回值
        public void logreturn(JoinPoint joinPoint,Object result){  //写Object参数来接收返回值
            MethodSignature signature = (MethodSignature) joinPoint.getSignature();
            String name = signature.getName();
            System.out.println("返回值是"+result);//把返回值输出
        }

        @AfterThrowing(value="execution(int *(int,int))",throwing = "e") //想加上异常的信息,指定e接收异常的信息
        public void logexception(JoinPoint joinPoint,Exception e){//写Exception参数来接收异常信息
            MethodSignature signature = (MethodSignature) joinPoint.getSignature();
            String name = signature.getName();
            System.out.println(name+"方法异常了,错误信息是"+e.getMessage());//把异常信息输出
        } 
```

@Pointcut 可以提取切入点表达式 以达到易改易读的效果

记得写一个方法 方法随便取 下面是案例

```java
 @Pointcut("execution(int com.atguigu.maven.spring02.jisuanqi.shuxue.*(..))")
    public void asd() {} //方法名写啥都行

//之后写切入点表达式,
 //asd() 就代表execution(int com.atguigu.maven.spring02.jisuanqi.shuxue.*(..))
 @Before("asd()")
    public void logstart(JoinPoint joinPoint){//这个joinPoint就代表连接点,连接点里有当前方法的全部信息
        //Signature signature = joinPoint.getSignature();//拿到方法全签名
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();//转换成MethodSignature
        String methodName = signature.getName();//拿到方法名
        Object[] args = joinPoint.getArgs();//参数值
        System.out.println(methodName+"开始,参数列表是"+ Arrays.toString(args));
    }
```



#### 2.8 多切面的执行顺序

切面的执行顺序可以看成一个包裹的顺序 从外层到内层 一层一层执行

默认通过类名A-Z进行排序 也可以通过@Order(num)进行 数字越小优先级越高

![](file:///C:/Users/Sagiri/mizuki/public/images/postimage/SSM/4.png)

#### 2.9 环绕通知

@Before @After @AfterReturning @AfterThrowing 这些只是通知方法,不能改变目标方法的参数和内容等,只是管理了代理方法

@Around 可以控制目标方法是否执行,修改目标方法参数,执行结果等

```java
@Aspect
@Component
public class AroundAspect {
    @Pointcut("execution(int org.springdata.spring02aop.Calculator.MathCalculator.*(int,int))")
    public void pointcut(){}
        /*
        环绕通知的固定写法如下
        public Object aroundAdvice(ProceedingJoinPoint pjp) throws Throwable{
        }
         */
        @Around("pointcut()")
        public Object aroundAdvice(ProceedingJoinPoint pjp) throws Throwable{
            //Object是返回值,因为可能会切各种方法,不确定那些方法具体返回类型
            System.out.println("环绕的前置通知");
            Object proceed = null;
            try {
                proceed = pjp.proceed();//继续执行目标方法  这句话类似于动态代理的method.invoke,
                System.out.println("环绕的返回通知");
            }catch (Throwable e){
                System.out.println("环绕的异常通知");
                throw e;//让别人继续感知到异常
            }
            finally {
                System.out.println("环绕的后置通知");
            }
            Object[] args = pjp.getArgs();//获取目标方法的参数
            //Object proceed = pjp.proceed(这里也可以传参);   如果想修改参数,只需要写args[0] = xxx; 之后把args传入就可以了
            return proceed; //想返回什么就可以返回什么,因此可以修改返回值
        }
    }


```

:::tip

如果有多切面包裹了环绕通知 而环绕通知把异常吃了 那么外面的切面就感知不到异常从而使日志混乱

解决办法 在catch语句中向上抛出异常 即throw(e);

::: 

AOP的使用场景

日志记录, 事务管理, 权限检查, 性能监控,异常处理,缓存管理,安全审计,自动化测试等

## 3. 事务



### 3.1 分类

一般分为两种 一种是**声明式** 一种是编程式

**声明式**:通过注解等方式,告诉框架,要做什么,框架会帮忙做

优点是:代码量小,上手快 缺点是:封装太多,如果切面出问题就找不到错误所在了

编程式:通过代码的方式告诉,框架,要做什么需要自己写代码实现

优点:容易排错 缺点:代码量太高 所以一般都用声明式

我们这里也采用的声明式 



<!-- 此处预留事务笔记位置，可后续补充：

1. 事务四大特性（ACID）

2. 声明式事务（@Transactional）

3. 事务传播行为

4. 事务隔离级别

5. 事务回滚规则等内容

-->

### 3.2 实现

配置依赖 MySQL Driver 以及相应的SpringData JDBC (后面我们会学习Mybatis

首先得连接上数据库 在resource的application,properties里编写以下信息

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/你的数据库名字 
spring.datasource.username=root
spring.datasource.password=你的密码
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

然后就是写Dao方法 Service Test测试类等等

:::tip

记得不要把包放在顶级目录中 放在java下面得一个倒写域名得子包下 不然会找不到包

:::



### 3.3 @Transactional事务

开启事务

1.在**主程序**中开启**事务管理** (开启的是基于注解的自动化事务管理)

```java
@EnableTransactionManagement
```

2.要给谁加事务,就给哪个**方法**上面加注解

```java
@Transactional
```



### 3.4 事务细节

##### 1.事务管理器原理 TransactionManager

底层有两个部分组成

- **事务管理器** 用于控制事务的提交和回滚

- **事务拦截器** 用于控制何时提交和回滚 是一个切面Aspect
  
  

##### 2.timeout - 超时控制

```java
@Transactional(timeout=3) //单位为秒
```

整个事务一旦超过3秒,事务就会回滚,比如事务中间代码业务很多的时候,测试的时候用Thread.sleep(单位为毫秒)即可

:::tip

超时这个作用范围仅仅是从事务的开始(方法开始),到最后一次dao(对数据库操作),如果在最后一次对数据库操作之后又有很多代码,只要不再对数据库进行操作,就不算超时.

:::

##### 3.readOnly - 只读优化

```java
@Transactional(timeout=3,readOnly=true)
```

只是一个优化项,就是在没代码的方法用他能加快运行速度



##### 4.rollbackfor & norollbackfor

不是所有的异常都会引起事务回滚

异常分为**运行时异常**(可执行),**编译时异常**(无法执行)

Spring对异常回滚的机制,**运行时异常**都回滚,而编译时异常不回滚(编译时异常抛出错误,也可以运行)

```java
@Transactional(rollbackFor={IOException.class}) //这时除了默认的以外,遇到io异常也一样会回滚了
```

##### 5.隔离级别(重要)

| 隔离级别             | 概述                 | 脏读  | 不可重复读 | 幻读      |
| ---------------- | ------------------ | --- | ----- | ------- |
| read-uncommitted | 读未提交事务数据           | 是   | 是     | 是       |
| read-committed   | 读已提交事务数据(oracle默认) | 否   | 是     | 是       |
| repeatable-read  | 可重复度(mysql默认)      | 否   | 否     | 是(极小概率) |
| serializable     | 串行化和序列化            | 否   | 否     | 否       |

**可重复读**和**读已提交**的区别还有, 如果读多个数据(相同的数据,赋值给多个变量), 在运行过程中如果修改数据并提交, 那么在读已提交的隔离级别下 数据会发生改变, 但是使用可重复读,多个数据值还是不变的,即使删除掉都还有不变的数据值 是因为可重复读的结束是在事务结束后 只要事务内的方法没调用完 就可以继续读

Spring事务注解配置示例：

```java
@Transactional(isolation = Isolation.REPEATABLE_READ)
```



##### 6.传播行为 propagation(重要)

Spring 事务传播行为用于定义**事务方法被另一个事务方法调用时，事务如何传递**，共 7 种：

| 传播行为             | 核心说明              |
| ---------------- | ----------------- |
| REQUIRED（重要）     | 支持当前事务，无则新建       |
| SUPPORTS         | 支持当前事务，无则以非事务运行   |
| MANDATORY        | 必须在当前事务中运行，无则抛异常  |
| REQUIRES_NEW(重要) | 新建事务，挂起当前事务       |
| NOT_SUPPORTED    | 以非事务运行，挂起当前事务     |
| NEVER            | 以非事务运行，存在当前事务则抛异常 |
| NESTED           | 在当前事务嵌套运行，无则新建    |

简单来说 好比一个坐车 REQUIRED就是跟大事务坐一辆车 REQUIRED_NEW就是开新车

下面给出一个案例便于理解

需求:如果出错,金额回滚,库存不回滚

```java
@Transactional //这是大事务
checkout(){
扣减金额; // 点击方法,在具体方法上写@Transactional(propagation =REOUIRED)
扣减库存; //@Transactional(propagation =REQUIRES_NEW) //创建了新事务,不在老事务中了
int i =10/0; //此时大事务就会异常,不会影响新事务
}
```

如果出错在扣减库存的内部, 则大事务会异常,扣减库存会回滚,扣减金额也会回滚,注意关注**异常**的**传播链**



## 总结

至此 SSM-Spring部分结束 我们一共学习了SSM的三大部分 容器IOC AOP以及事务Transaction

在容器IOC中 了解了Bean组件与容器的关系  

AOP中了解了连接点JointPOint 切面Aspect的概念 能够起到用注解简略动态代理的效果 里面还有环绕通知 可以控制执行前后相当于拦截器 

然后 我们学习了声明式事务 学习了几大事务细节 其中学习了事务管理器原理 是由一个管理器控制执行和一个拦截器控制何时发生的 然后复习了4大隔离类型以及学到了传播行为Propagation 其中REQUIRED 以及REQUIRED_NEW需要重点理解

反正 东西挺多 全部记住不可能 搞忘了就回来看一眼 这也是笔记的作用
