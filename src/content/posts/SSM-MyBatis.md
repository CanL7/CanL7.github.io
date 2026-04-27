---
title: SSM-MyBatis
published: 2026-04-27
description: 'SSM-MyBatis'
image: '/images/sagiri/15.png'
tags: [java,MyBatis,SSM]
category: 'java'
draft: false 
lang: ''
---
# MyBatis

## 1.初认识

MyBatis 是轻量级**持久层**(数据库)框架，通过 SQL 映射简化 JDBC 操作，解耦 SQL 与 Java 代码，自动完成数据库与 JavaBean 的映射，支持动态 SQL，兼顾灵活性与开发效率。他是一种半自动化框架 只保留关键的sql语句自己编写

## 2.Mybatis的HelloWorld

### 1. 基础环境准备

- 导入 MyBatis 核心依赖（及数据库驱动依赖）
- 配置数据源信息（数据库地址、用户名、密码等）

### 2. 数据模型映射

编写 JavaBean 实体类，属性与数据库表字段一一对应（支持驼峰命名自动映射）

### 3. 数据访问层实现

| 实现方式         | 流程                                | 核心注解                            |
| ------------ | --------------------------------- | ------------------------------- |
| 传统 Dao 方式    | Dao 接口 → 编写 Dao 实现类               | `@Repository`（将实现类交给 Spring 管理） |
| 现代 Mapper 方式 | Mapper 接口 → 编写 Mapper.xml（配置 SQL） | `@Mapper`（标记为 MyBatis 映射接口）     |

CRUD几个部分比较相同 这里给出一个查询select

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd" >
<mapper namespace="org.springdata.mybatis01helloworld.mapper.EmpMapper">

    <select id="selectById" resultType="org.springdata.mybatis01helloworld.bean.Emp">
        select id,emp_name as empName,age,emp_salary as empSalary from t_emp
        where id = #{id}
        <!-- #{}是用来提取变量的 -->
    </select>
</mapper>
```

> 效率优化：安装 MyBatisX 插件，可一键为 Mapper 接口生成 Mapper.xml 文件，无需手动创建

### 4. 配置文件扫描

在 application.properties 中配置 Mapper.xml 扫描路径：

```properties
mybatis.mapper-locations=classpath:mapper/**.xml
```

### 5. 编写单元测试

```java
    @Autowired
    private EmpMapper empMapper;

    @Test
    void testSelectById() {
        Emp emp = empMapper.selectById(1);
        System.out.println(emp);
    }
```

> 接口都没有实现类竟然能注入进容器
> 
> 这说明Mybatis在底层给接口生成了一个代理对象Proxy 然后注入容器进行调用



在配置文件中设置包的级别为debug,这样可以查看Mybatis发出的sql语句(日志)

```properties
logging.level.org.springdata.mybatis01helloworld.mapper=debug
```

### 6.自增id回填机制

注意: id是自增的, 如果添加了一个用户,想知道自己添加用户的id是多少应该怎么办呢

```xml
<insert id="addEmp" useGeneratedKeys="true" keyProperty="id"> 
<!-- useGeneratedKeys告诉mybatis,这个sql会使用自动生成的id,
keyProperty指定自动生成的id对应的属性,把自动生成的id封装到Emp对象的id属性-->
       insert into t_emp(emp_name,age,emp_salary) values (#{empName},#{age},#{salary})
</insert>
```

这样填写数据的时候,只需要再加一句获取id并输出即可 emp.getId();

### 7.查询所有员工

mapper接口

```java
List<Emp> getAllEmp();
```

xml

```xml
<!--返回的是集合,resultType类型也就写对象的类型就行-->
<select id="getAllEmp" resultType="com.atguigu.mybatis01helloworld.bean.Emp">
    select * from t_emp
</select> 
```

注意:可以在配置文件里开启**驼峰下划线**映射, 这样数据库里带下划线的列名可以和JavaBean中的驼峰命名的属性名互相映射

```properties
mybatis.configuration.map-underscore-to-camel-case=true
```

比如 empName -> emp_name

那么 Mybatis的HelloWorld项目就算完成了 还是很简单的

## 3.Mybatis-参数传递

#### 1. #{ } 与 ${ }

常用有两种传递方式:

- #{ } sql语句是占位符 是动态的

- ${ } 是以**拼接**参数进sql的形式 目前只有一个使用场景 也就是要指定查询的表名的时候 因为sql原生语法不支持不指定表名进行操作 而且其用于sql注入问题

**总结**: 参数传递,大部分地方都用#{ }, 少部分用不了#{ }的用${ }

用${ }传参可以做一个sql防注入的校验,用的时候直接ai找相应的代码即可

#### 2. 单/多参数

**单个参数**的情况下,直接#{参数名}就可以取到值,

如果参数是Map或者JavaBean,用#{ key 或者 JavaBean中的属性名} 取值

**多个参数**时用@Param指定参数名 也推荐我们都加上@Param

```java
Emp getEmployByIdAndName(@Param("id")Long id,@Param("name") String name)
```

需求: 按传入的id,和map里的name,list里的第三个索引是年龄,以及e中的salary来查询一个用户

```java
  Emp getEmploy(@Param("id") Long id,     //首先要写@Param,有mybatisx插件可以用
                  @Param("m") Map<String,Object> m,
                  @Param("ids") List<Long> ids,
                  @Param("e") Employ e)// params.put("age",12)
}
```

> alt+enter 可以自动生成@Param

```xml
<select id="getEmploy" resultType="com.atguigu.mybatis01helloworld.bean.Emp">
    select * from t_emp where id = #{id} and emp_name=#{m.name} and age=#{ids[2]}and emp_salary=#{e.empSalary}
</select>
```

只要mapper的方法中参数多于一个,Map JavaBean就要用xx.xx的方式指定到具体的数值进行传递



## 4.MyBatis-结果封装

### resultType默认封装

返回基本类型和集合

返回基本类型、普通对象 都只需要在 resultType 中声明返回值类型全类名即可

演示: 返回基本类型的演示

Mapper

```java
Long countEmp(); //查询一共有多少条数据
```

xml

```xml
<select id="countEmp" resultType="java.lang.Long"> 
    select count(*) from t_emp
</select>
```

如果返回的是List集合,resultType 写集合中元素类型的全类名即可(上面已经用过了)

如果返回Map集合,应该在mapper接口的**方法上**标注 **@MapKey("id")**

代表指定了id是key,resultType 写集合中元素的全类名,此时控制台输出的时候, key就是id值 注意:自动生成的resultType 可能是map类型,需要自己手动改一下



### 自定义结果集resultMap

#### 用法

数据库的字段名 如果和javaBean的属性名 不能一一对应,此时数据会封装不上，有三种办法

•1、如果符合驼峰命名，则开启驼峰命名规则

•2、编写自定义结果集（ResultMap） 进行封装

还有可以起别名,让名字对应上(别用)



标签里的resultType代表的是默认规则, 可以写resultMap(自定义规则),具体如下

```xml
<resultMap id="EmpResultMap" type="com.atguigu.mybatis01helloworld.bean.Emp">
    <id column="id" property="id"></id> column代表数据库的类,property代表JavaBean的属性
    <id>标签是用来声明主键映射规则的                         
    <result column="emp_name" property="empName"></result> result标签用来声明其他属性的映射
</resultMap>

<select id="countEmp" resultType="EmpResultMap">  这里面写resultType等于EmpResultMap(resultMap的id)
    select count(*) from t_emp
</select>
```

最佳做法:

首先开启驼峰命名规则, 如果还有数据传不进去,就用自定义结果集方式



#### 关联查询

- 1-1：一对一；多表联查产生一对一关系，比如一个订单对应唯一一个下单客户；此时需要保存关系键到某个表中都可

- 1-N：一对多；多表联查产生一对多关系，比如一个客户产生了多个订单记录；此时多的一端需要保存关系键

- N-N：多对多：无论从哪端出发看，都是对多关系，这就是一个多对多的关系，比如 一个学生有多个老师、一个老师又教了多个学生；此时需要一个中间表记录学生和老师的关联关系

**collection**标签：指定自定义集合封装规则, 对多关系, 可以关联多个

**association**标签：指定自定义对象封装规则, 对一关系, 一对一,唯一关联一个



##### 一对一关联封装演示:

根据id查询订单,并且查询下单的客户信息

首先导入ppt中的sql

写JavaBean

```java
@Data
public class Order {
    private Long id;
    private String address;
    private BigDecimal amount;
    private Long customerId;
    //订单对应的客户
    private Customer customer;
}

```



mapper

```java
@Mapper
public interface OrderMapper {
    Order getOrderByIdWithCustomer(Integer id); //根据id查询订单,并且查询下单的客户信息
}
```

xml

```xml
<select id="getOrderByIdWithCustomer" resultType="com.atguigu.mybatis01helloworld.bean.Order">
    select o.* , c.* from t_order as o left join t_customer as c on o.customer_id= c.id where o.id =#{id}
</select>
```



注意: 此时测试的话, c表的信息传不进去

因为 resultType是**默认规则**, 这里只表明了Order类

所以此时应该写自**定义结果集**

让Mybatis知道把c表的信息封装到o表的customer中



```xml
<!--    自定义结果集  -->
<resultMap id="OrderRM" type="com.atguigu.mybatis.bean.Order">
    <id column="id" property="id"/> <!-- id标签代表主键,列id和JavaBean的id映射-->
    <result column="address" property="address"/><!--result标签代表普通列-->
    <result column="amount" property="amount"/>
    <result column="customer_id" property="customerId"/>
    <!--       一对一关联封装   -->
    <association property="customer" javaType="com.atguigu.mybatis.bean.Customer"> <!--指定 javaType的类型        是customer -->
        <id column="c_id" property="id"/>
        <result column="customer_name" property="customerName"/>
        <result column="phone" property="phone"/>
    </association>
</resultMap>
<select id="getOrderByIdWithCustomer" resultMap="OrderRM"> 
select o.*, 
    c.id c_id, 
    c.customer_name, 
    c.phone from t_order o left join t_customer c 
    on o.customer_id = c.id 
    where o.id = #{id} 
</select>
</mapper>
```



##### 一对多关联封装演示:

按照id查询客户,以及他下的所有订单

JavaBean

```java
@Data
public class Customer {
    private Long id;
    private String customerName;
    private String phone;

    private List<Order> orders;//保存所有订单的集合
}
```



mapper接口

```java
@Mapper
public interface CustomerMapper {
    Customer getCustomerByIdWithOrders (Integer id);
}
```



xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd" >
<mapper namespace="com.atguigu.mybatis01helloworld.mapper.CustomerMapper">
        <resultMap id="CutomerRM" type="com.atguigu.mybatis01helloworld.bean.Customer">
            <id column="c_id" property="id"/>
            <result column="customer_name" property="customerName"/>
            <result column="phone" property="phone"/>
            <!-- 集合的封装用collection来说明一对多的封装规则-->
            <!-- 单个对象要说明javaType, 集合要说明ofType,说明了集合里是多个Order对象-->
            <collection property="orders" ofType="com.atguigu.mybatis01helloworld.bean.Order">
                <id column="id" property="id"/>
                <result column="address" property="address"/>
                <result column="amount" property="amount"/>
                <result column="c_id" property="customerId"/>
            </collection>
        </resultMap>
        <select id="getCustomerByIdWithOrders" resultMap="CutomerRM"> select c.id c_id, c.customer_name, c.phone, o.* from t_customer c left join t_order o on c.id = o.customer_id where c.id = #{id} </select>
</mapper>
```



##### 多对多

也是使用collection  原理和一对多一样  

就可以理解为一对多 然后"多"里面逐一一对多

:::tip

跨mapper也可以使用别人的结果集,方法调用也可以跨mapper使用

:::

#### 分布查询

分布查询就是按两步进行查询先按照id查客户,再根据客户id查订单

association和collection除了javaType和ofType外还有两个属性,**select**发sql 和**column**指定传参

###### 原生写法

mapper

```java
@Mapper
public interface OrderCustomerStepMapper {
    //需求：按照id查询客户 以及他下的所有订单
    //1. 查询客户
    Customer getCustomerById(Long id);
    //2. 按照客户的id查询所有订单
    List<Order> getOrdersByCustomerId(Long cId);

}
```



xml

```xml
<mapper namespace="com.atguigu.mybatis.mapper.OrderCustomerStepMapper">
<!--    按照id查询客户  -->
<select id="getCustomerById" resultMap="CustomerOrdersStepRM"> 
    select * from t_customer where id = #{id} </select>
<!--    按照客户id查询他的所有订单  -->
<select id="getOrdersByCustomerId" resultType="com.atguigu.mybatis.bean.Order"> 
    select * from t_order where customer_id = #{cId} 
</select>
```

测试代码

```java
@Autowire
OrderCustomerStepMapper orderCustomerStepMapper;
@Test
void test(){
Customer c= orderCustomerStepMapper.getCustomerById(1L);
List<Order> orders = orderCustomerStepMapper.getOrdersByCustomerId(c.getId()); //测试也是分两步
c.setOrders(orders); //把订单数据也赋值给查询到的用户头上    
}
```



**借助Mybatis的自动分布查询机制进行分布查询**

###### 需求1: 按照id 查询客户 + 查询客户下的订单

mapper

```java
//分步查询：自动做两步 = 查询客户 + 查询客户下的订单
Customer getCustomerByIdAndOrdersStep(Long id);
```

xml

```xml
<!--    分步查询的自定义结果集：  -->
<resultMap id="CustomerOrdersStepRM" type="com.atguigu.mybatis.bean.Customer">
    <id column="id" property="id"/>
    <result column="customer_name" property="customerName"/>
    <result column="phone" property="phone"/>
    <collection property="orders"         select="com.atguigu.mybatis.mapper.OrderCustomerStepMapper.getOrdersByCustomerId" column="id"> </collection>
<!--     告诉MyBatis，封装 orders 属性的时候，是一个集合，
    使用collection的select属性,来指定我们要调用的另一个方法
    column：来指定我们要调用方法时，把哪一列的值作为传递的参数，交给这个方法
    column="id"： 单传参: 这个id就是下面sql语句中传过来的id,把这个id传到getOrdersByCustomerId

注意:如果select指定的方法参数位置有多个参数,需要用@Param来取别名
如果select指定的方法需要传多个参数按这种格式写,column="{cid=id,name=customer_name}"
                        cid=id：cid参数位置上的别名，id是下面sql传进来的  -->
</resultMap>
<select id="getCustomerByIdAndOrdersStep" resultMap="CustomerOrdersStepRM"> 
select * from t_customer where id = #{id} 
</select>
```

此时调用接口方法,直接可以发送两条sql,实现分布查询



###### 需求2: 按照id查询订单 + 查询下单的客户

mapper

```java
 //分步查询：自动做两步 = 按照id查询订单 + 查询下单的客户
    Order getOrderByIdAndCustomerStep(Long id);
```

xml

```xml
<!--    分步查询：自定义结果集；封装订单的分步查询   -->
<resultMap id="OrderCustomerStepRM" type="com.atguigu.mybatis.bean.Order">
<id column="id" property="id"/>
<result column="address" property="address"/>
<result column="amount" property="amount"/>
<result column="customer_id" property="customerId"/>
<!--       一对一查询这个对象,使用association,使用select来绑定方法,使用column来传id -->
<association property="customer" select="com.atguigu.mybatis.mapper.OrderCustomerStepMapper.getCustomerById" column="customer_id"> </association>
</resultMap>
<select id="getOrderByIdAndCustomerStep" resultMap="OrderCustomerStepRM"> select * from t_order where id = #{id} </select>
```



###### 需求3:按照id查询订单 以及 下单的客户 以及 此客户的所有订单

mapper

```java
 Order getOrderByIdAndCustomerAndOtherOrdersStep(Long id);
```

xml

一层套一层的调用,只需要小心循环了会**栈溢出**(Stack OverFlow)



###### 开启延迟加载(懒加载)

全局配置中添加这两项

```properties
mybatis.configuration.lazy-loading-enabled=true
mybatis.configuration.aggressive-lazy-loading=false
```

用到某个信息,才会发送某个信息的sql, 以前是立即发送全部sql



## 5.MyBatis-动态SQL

简介

•动态 SQL 是 MyBatis 的强大特性之一。如果你使用过 JDBC 或其它类似的框架，你应该能理解根据不同条件拼接 SQL 语句有多痛苦，例如拼接时要确保不能忘记添加必要的空格，还要注意去掉列表最后一个列名的逗号。利用动态 SQL，可以彻底摆脱这种痛苦。

•使用动态 SQL 并非一件易事，但借助可用于任何 SQL 映射语句中的强大的动态 SQL 语言，MyBatis 显著地提升了这一特性的易用性。

例如之前restful的update方法,很多if判断,有信息则覆盖那一段,实际上很麻烦,可以用动态sql解决



### if,where标签

#### if标签的使用

需求:按照 empName 和 empSalary 查询员工,如果只传了一个,带name就按name查,带salary就按salary查

以前的做法

mapper

```java
@Mapper
public interface EmpDynamicSQLMapper {
//    按照 empName 和 empSalary 查询员工,如果只传了一个,带name就按name查,带salary就按salary查
   List<Emp> queryEmpByNameAndSalary(@Param("name") String name,
                                         @Param("salary") BigDecimal salary);
}
```

xml

```xml
<mapper namespace="com.atguigu.mybatis01helloworld.mapper.EmpDynamicSQLMapper">
    <select id="queryEmpByNameAndSalary" resultType="com.atguigu.mybatis01helloworld.bean.Emp">
        select * from t_emp where emp_name =#{name} and emp_salary=#{salary}
    </select><!--问题是别人传来的name和salary可能是为空的 -->
</mapper>
```

测试

```java
 @Autowired
 EmpDynamicSQLMapper d;
 @Test
 void contextLoads() throws SQLException {
d.queryEmpByNameAndSalary("l",null);
 }
```



注意: 此时的问题是,这样做,最后系统发出的sql是按名字是l,并且薪资是null的查询, 这和我们的需求并不相同了, 而且按照薪资为空查询在sql里也是用is null不是= null, 所以此时需要动态的sql来拼装这个条件

xml修改成

```xml
    <select id="queryEmpByNameAndSalary" resultType="com.atguigu.mybatis01helloworld.bean.Emp">
        select * from t_emp where
       <if test="name!=null">
           emp_name =#{name}
       </if>
        <if test="salary!=null">  test属性用来判断条件
           and emp_salary=#{salary}
        </if>
    </select> 
```

此时,Mybatis写的sql语句就只会按名字为l的查了,薪资为空,也不会按薪资=null来查询



#### where标签的使用

注意: 上面的做法如果传的name是空,salary有值,直接会报错, 因为按照上面if标签的拼接,第一个if里的语句没有,则此时Mybatis生成的sql是

select * from t_emp where and emp_salary=?  此时多了一个and

如果name和salary都是null, 那输出的sql就是where后面啥也没有, 一样也会报错



解决方式:用where标签来代替where, 他会自动解决sql拼接的问题

```xml
  <select id="queryEmpByNameAndSalary" resultType="com.atguigu.mybatis01helloworld.bean.Emp">
        select * from t_emp
      <where>
       <if test="name!=null">
           emp_name =#{name}
       </if>
        <if test="salary!=null">  test属性用来判断条件
           and emp_salary=#{salary}
        </if>
      </where>
    </select> 
```



### set标签的使用

需求: 更新员工信息,带了什么信息就更新哪个,不带的信息保持不变

mapper

```java
void updateEmp(Emp emp);
```

xml

```xml
  <update id="updateEmp">
update t_emp set emp_name=#{empName},emp_salary=#{empSalary},emp_age=#{age} where id=#{id}
    </update>
```

测试

```java
@Autowired
EmpDynamicSQLMapper d;
@Test
void contextLoads() throws SQLException {
    Emp emp = new Emp();
    emp.setId(4);
    emp.setEmpName("hhhhhh");
    emp.setAge(14);
    emp.setEmpSalary(11111.0);
    d.updateEmp(emp);
}
```

**注意**: 正常可以进行数据的更新,但是如果更新的时候, 有字段没传,也会正常运行,更新数据库表的信息, 没传的数据修改为空,这和需求不符,需求是不传的数据保持不变



此时我们可以使用**if标签**

```xml
 <update id="updateEmp">
update t_emp set 
                 <if test="empName!=null">emp_name=#{empName},</if>
                 <if test="empSalary!=null"> emp_salary=#{empSalary},</if>
                 <if test="age!=null">age=#{age}</if>
                  where id=#{id}
    </update>
```

注意:此时如果最后一句为空, 会因为逗号,

存在sql拼接异常

此时可以使where前面写1=1 每个if里的语句都写逗号, 或者使用set标签来代替set

```xml
 <update id="updateEmp">
update t_emp <set> 
                 <if test="empName!=null">emp_name=#{empName},</if>
                 <if test="empSalary!=null"> emp_salary=#{empSalary},</if>
                 <if test="age!=null">age=#{age}</if>
     </set>
                  where id=#{id}
    </update>
```





### trim标签

是一个功能比where set强大的标签 支持自定义

trim标签代替where

```xml
  <select id="queryEmpByNameAndSalary" resultType="com.atguigu.mybatis01helloworld.bean.Emp">
        select * from t_emp
      <trim prefix = "where" suffix ="" prefixOverrides="" suffixOverrides="">                                      prefix代表前缀,suffix代表后缀,意思是标签体里面有东西,就自动拼上这个前缀和后缀,prefixOverrides前缀覆盖:标签体中最终生成的字符串,如果以指定前缀开始,就覆盖成空串,比如下面第一个条件空,第二个条件成立,prefixOverrides应该写="and"  
       <if test="name!=null">                   
           emp_name =#{name}
       </if>
        <if test="salary!=null">  test属性用来判断条件
           and emp_salary=#{salary}
        </if>
      </trim>
    </select> 
```



trim代替set

```xml
 <update id="updateEmp">
        update t_emp 
             <trim prefix="set" suffixOverrides=","> 
                 <if test="empName!=null">emp_name=#{empName},</if>
                 <if test="empSalary!=null"> emp_salary=#{empSalary},</if>
                 <if test="age!=null">age=#{age}</if>
              </trim>
        where id=#{id}
    </update>
```



### choose/when/otherwise标签

```xml
select * from t_emp
<where>
    <choose>
        <when test="name!=null">  符合此条件就走下面的语句
            emp_name=#{name}
        </when>
        <when test="salary>3000"> 符合此条件就走下面的语句
            emp_salary=#{salary}
        </when>
        <otherwise>    都不符合就走这下面的语句
            id=1
        </otherwise>
    </choose>
</where>
```

注意:如果上面两个条件都满足,那就走第一个



### sql-foreach批量操作

需求:查询指定id集合中的员工

mapper

```java
List<Emp> getEmpsByIdIn(List<Long> ids); //查询指定id集合中的员工
```

xml

```xml
<select id="getEmpsByIdIn"
        resultType="com.atguigu.mybatis01helloworld.bean.Emp">                                                     <!--foreach遍历集合和数组, item指定的id就是遍历出来的数据,separator指定了每次遍历元素之间拼接的分隔符,还可以                   写open(遍历开始的前缀)="(",以及close=")"那样包裹foreach标签的小括号也不用写了-->
    select * from t_emp 
    <if test="ids!=null"> <!--注意:如果传的集合是空会报错,所以写if,这样如果为空就是查所有了,不会报错 -->
        <foreach collection="ids" item="id" separator="," open="where id IN(" close=")">
            #{id}
        </foreach>
    </if>
</select>
```

注意:如果传过来的集合没有元素,这样不会报错,因为如果没有数据就不会走foreach遍历,也就不会走open的语句

需求2:批量插入一批员工

mapper

```java
void addEmp(List<Emp> emps);
```

xml

```xml
<insert id="addEmp">
    insert into t_emp(emp_name,age,emp_salary) values
        <foreach collection="emps" item="emp" separator=",">
        (#{emp.empName},#{emp.age},#{emp.empSalary})   <!--注意,这要写对象点属性,因为要具体确定是集合中哪一个对象的属性 --> 
    </foreach>
</insert>
```

这样就可以批量插入两个元素

需求3: 批量删除(基本和批量插入一样,所以不演示)

需求4: 批量修改

mappper

```java
void updateBatchEmp(List<Emp> emps);
```

xml

```xml
<update id="updateBatchEmp">
        <foreach collection="emps" item="e" separator=";">
            update t_emp
            <set>
                <if test="e.empName!=null">
                    emp_name=#{e.empName}
                </if>
                <if test="e.empsalary!=null">
                    emp_salary=#{e.empSalary}
                </if>
            <if test="e.age!=null">
                age=#{e.age}
            </if>
            </set>
            where id =#{e.id}
        </foreach>
    </update>
```

**注意**:用Mybatis发送sql, 数据库默认不支持一个长sql里包含多个短sql

可以在配置文件里写上

```properties
jdbc:mysql://mybatis-example?allowMultiQueries=true
```

**allowMultiQueries**：允许多个SQL用;隔开，批量发送给数据库执行



由于一口气操纵数据库的代码很多,可以开启事务, 在主类上标注@EnableTransactionManagement, 在mapper上标注@Transactional

这样遇到异常数据库内容就可以回滚了,

**注意**:分布式项目下,很多不支持sql批量操作的回滚



### 抽取可复用的sql片段

```xml
<sql id = "column_names">
id,emp_name empName,age,emp_salary empSalary
</sql>

在别的标签的sql语句位置直接写就可以拼接上
select
<include refid ="column_names"></include>
form t_emp ............................
```



### 特殊字符

注意:正常都是写大于号> 写小于号的话 xml会识别成尖括号的一部分<   所以需要写转义字符

| **原始字符** | **转义字符** |
| -------- | -------- |
| &        | &amp;    |
| <        | &lt;     |
| >        | &gt;     |
| "        | &quot;   |
| '        | &apos;   |



## 6.MyBatis-扩展内容

### PageHelper分页插件(前后端配合)

前端需要的数据

1 总页码或者总记录数

2 当前是第几页的数据

3 本页的数据

4 后端收到前端传来的页码,响应前端需要的数据

第四步的实现只需要使用PageInfo方法

```java
    @Autowired
    EmpMapper d;
    @Test
    void contextLoads() throws SQLException {
        PageHelper.startPage(1, 2);//页码和每页大小
        List<Emp> allEmp = d.getAllEmp();
        PageInfo<Emp> empPageInfo = new PageInfo<>(allEmp);
        System.out.println(empPageInfo.getPageNum()); //获取当前页码
        System.out.println(empPageInfo.getPages());   //获取总页码
        System.out.println(empPageInfo.getTotal());   //获取总记录数
        System.out.println(empPageInfo.isHasNextPage()); //是否有下一页
    }
}
```

实际使用的时候controller层的写法

```java
    //查询所有员工分页显示
    @GetMapping("/emps")
    @Operation(summary = "查询所有员工", description = "分页查询所有员工信息")
    public R<List<Employee>> getEmps(){
        PageHelper.startPage(1,5);
        List<Employee> list = empService.getAllEmp();
        //int i = 1/0; 检查全局异常处理是否生效
        R<List<Employee>> R = new R<>();
        R.setData(list);
        return R.ok(list);
    }
```



### 逆向生成

Mybatis有一个好用的功能 只需要先连接上数据库 右键数据库选择 MybatisX-generator

配置好相关参数 即可自动生成你数据库里的那些表的增删改查(也是很很偷懒上了好吧)



## 最终作业

写一个完整的SSM项目 项目总结在下面





# 员工管理系统项目总结

## 1. 项目基本信息

### 1.1 技术栈

- **Spring Boot 4.0.6**：基础框架
- **MyBatis 4.0.1**：ORM框架
- **MySQL**：数据库
- **Lombok**：简化代码
- **Knife4j**：接口文档
- **Spring Validation**：数据校验

### 1.2 主要功能

- 员工CRUD操作
- 分页查询
- 数据校验
- 全局异常处理
- RESTful风格接口
- 跨域支持
- 接口文档

## 2. 项目结构

```
mybatis-02-crud/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── org/
│   │   │       └── springdata/
│   │   │           └── mybatis02crud/
│   │   │               ├── bean/            # 实体类
│   │   │               │   └── Employee.java
│   │   │               ├── common/          # 通用类
│   │   │               │   ├── R.java        # 统一返回类型
│   │   │               │   └── ResultCode.java  # 错误码枚举
│   │   │               ├── controller/       # 控制器
│   │   │               │   └── EmpController.java
│   │   │               ├── mapper/           # MyBatis映射接口
│   │   │               │   └── EmployeeMapper.java
│   │   │               ├── service/          # 服务层
│   │   │               │   ├── EmpService.java
│   │   │               │   └── impl/
│   │   │               │       └── EmpServiceImpl.java
│   │   │               ├── util/             # 工具类
│   │   │               │   └── VoConvertUtil.java  # VO转换工具
│   │   │               ├── vo/               # 视图对象
│   │   │               │   ├── req/          # 请求VO
│   │   │               │   │   └── AddEmpVo.java
│   │   │               │   └── resp/         # 响应VO
│   │   │               │       └── EmpRespVo.java
│   │   │               └── advice/           # 全局异常处理
│   │   │                   └── GlobalExceptionHandler.java
│   │   └── resources/
│   │       ├── org/
│   │       │   └── springdata/
│   │       │       └── mybatis02crud/
│   │       │           └── mapper/           # MyBatis XML映射文件
│   │       │               └── EmployeeMapper.xml
│   │       ├── application.yaml              # 配置文件
│   │       └── messages.properties           # 校验错误信息
│   └── test/
│       └── java/
│           └── org/
│               └── springdata/
│                   └── mybatis02crud/
│                       └── Mybatis02CrudApplicationTests.java
└── pom.xml                                   # Maven依赖配置
```

## 3. 核心功能实现

### 3.1 统一返回类型（R类）

- **功能**：封装API响应格式，包含状态码、消息和数据
- **关键方法**：
  - `ok()`：成功响应（无数据）
  - `ok(T data)`：成功响应（带数据）
  - `error()`：错误响应（默认错误）
  - `error(ResultCode resultCode)`：错误响应（指定错误码）
  - `error(ResultCode resultCode, String message)`：错误响应（指定错误码和消息）

### 3.2 错误码枚举（ResultCode）

- **功能**：集中管理错误码和消息，确保类型安全和代码清晰
- **主要枚举值**：
  - `SUCCESS`：成功
  - `SYSTEM_ERROR`：系统错误
  - `PARAM_ERROR`：参数错误
  - `DATA_NOT_FOUND`：数据未找到
  - `BUSINESS_ERROR`：业务错误

### 3.3 员工CRUD操作

- **查询所有员工**：GET /emps（分页查询）
- **根据ID查询员工**：GET /emps/{id}
- **添加员工**：POST /emp（接收JSON格式数据）(requestbody)
- **更新员工**：PUT /emp（接收JSON格式数据）
- **删除员工**：DELETE /emp/{id}

### 3.4 数据校验

- **使用注解**：@NotBlank、@Email等
- **校验错误处理**：通过GlobalExceptionHandler捕获并返回统一格式的错误响应
- **错误信息国际化**：通过messages.properties配置错误消息

### 3.5 VO层设计

- **AddEmpVo**：添加员工请求VO，包含必要字段和校验规则
- **EmpRespVo**：员工响应VO，用于返回员工信息
- **VoConvertUtil**：工具类，用于VO与实体类之间的转换

### 3.6 接口文档

- **使用Knife4j**：基于OpenAPI的增强型接口文档工具
- **配置**：在application.yaml中配置springdoc和knife4j
- **注解**：使用@Tag、@Operation、@Schema等注解描述接口和参数

## 4. 注意事项和要点

### 4.1 技术要点

- **@RequestBody注解**：用于接收JSON格式的请求数据，必须添加在方法参数前
- **@PathVariable注解**：用于接收URL路径中的参数，必须添加在方法参数前
- **@Valid注解**：用于启用数据校验，必须添加在需要校验的参数前
- **@CrossOrigin注解**：用于解决跨域问题，可添加在控制器类或方法上
- **Lombok的@Data注解**：自动生成getter、setter、equals、hashCode和toString方法，简化代码

### 4.2 最佳实践

- **分层设计**：遵循MVC架构，分离控制层、服务层和数据访问层
- **统一返回格式**：使用R类封装所有API响应，确保格式一致
- **错误处理**：使用全局异常处理器统一处理异常，返回标准化的错误响应
- **代码复用**：将重复代码抽取为工具类，如VoConvertUtil
- **文档化**：使用Knife4j生成接口文档，方便前端开发和测试

## 5. 总结

本项目是一个基于Spring Boot和MyBatis的员工管理系统，实现了员工的CRUD操作、分页查询、数据校验、全局异常处理和接口文档等功能。通过合理的分层设计和代码组织，提高了代码的可维护性和可读性。同时，通过使用Knife4j生成接口文档，方便了前端开发和测试。

项目中使用的技术栈和实现方式都是目前企业开发中的主流实践，具有一定的参考价值。通过本项目的开发，可以掌握Spring Boot、MyBatis、数据校验、全局异常处理等核心技术的使用方法，为后续的企业级应用开发打下基础。
