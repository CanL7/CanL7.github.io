---
title: MySQL
published: 2026-03-26
description: '未学完 持续更新中'
image: '/images/sagiri/11.png'
tags: [java,MySQL]
category: 'java'
draft: false 
lang: ''
---

# 1.MySQL

## 1.如何连接到MySQL

1.通过命令行管理员启动    输入mysql -u root -p 回车 然后输入root密码即可连接

2.通过mysql指定命令行也可 在搜索中直接找



# 2.SQL

## 2.1 SQL分类

![4d0f9c210953713bbce201115fb7c645](/images/postimage/MySQL/4d0f9c210953713bbce201115fb7c645.png)



## 2.2 DDL

**Data Definition Language**，数据定义语言，用来定义数据库对象(数据库，表，字段) 。

### 2.2.1 数据库操作

1.查询所有数据库 

```sql
show databases;
```

2.查询当前数据库 

```sql
select database();
```

3.创建数据库 

```sql
create database [ if not exists ] 数据库名 [ default charset 字符集 ] [ collate 排序 规则 ]
```

4.删除数据库

```sql
drop database [ if exists ] 数据库名 ;
```

5.切换数据库

```sql
use 数据库名 ;
```

### 2.2.2 表操作-查询创建

1.查询当前数据库所有表

```sql
show tables;
```

2.查看指定表结构

```sql
desc 表名;
```

3.查询指定表的建表语句

```sql
show create table 表名;
```

4.创建表结构

```sql
CREATE TABLE 表名(  
    字段1 字段1类型 [ COMMENT 字段1注释 ],  
    字段2 字段2类型 [COMMENT 字段2注释 ],  
    字段3 字段3类型 [COMMENT 字段3注释 ],  
    ......  
    字段n 字段n类型 [COMMENT 字段n注释 ]  
) [ COMMENT 表注释 ] ; 
```

> 最后一个字段没有逗号

### 2.2.3 表操作-数据类型

![d4336a25a5e62ba06d723a4bd85998be](/images/postimage/MySQL/d4336a25a5e62ba06d723a4bd85998be.png)

* `char`与 `varchar`都可以描述字符串，char是定长字符串，指定长度多长，就占用多少个字符，和字段值的长度无关 。而varchar是变长字符串，指定的长度为最大占用长度 。相对来说， char的性能会更高些（因为varchar会计算存储内容所占空间）。

![6bf8c519641f354f2a59c4d8b0fd7dc8](/images/postimage/MySQL/6bf8c519641f354f2a59c4d8b0fd7dc8.png)

### 2.2.4 表操作-修改(alter)

1.添加字段

```sql
ALTER TABLE 表名 ADD 字段名 类型 (长度) [ COMMENT 注释 ] [ 约束 ];
```

```sql
--为emp表增加一个新的字段”昵称”为nickname，类型为varchar(20)
ALTER TABLE emp ADD nickname varchar (20) COMMENT '昵称';
```

2.修改数据类型

```sql
ALTER TABLE 表名 MODIFY 字段名 新数据类型 (长度);
```

3.修改字段名和字段类型

```sql
ALTER TABLE 表名 CHANGE 旧字段名 新字段名 类型 (长度) [ COMMENT 注释 ] [ 约束 ];
```

4. 删除字段

```sql
ALTER TABLE 表名 DROP 字段名;
```

5.修改表名

```sql
ALTER TABLE 表名 RENAME TO 新表名;
```

### 2.2.5 表操作-删除

1.删除表 

```sql
DROP TABLE [ IF EXISTS ] 表名;
```

2.删除指定表并重新创建表

```sql
TRUNCATE TABLE 表名;
//不就清空数据嘛
```



## 2.3 DML

DML英文全称是**Data Manipulation Language**(数据操作语言)，用来对数据库中表的数据记录进 行增、删、改操作。

添加数据（ INSERT） . 修改数据（ UPDATE） . 删除数据（ DELETE）

### 2.3.1添加数据

1.给指定字段添加数据 

```sql
INSERT INTO 表名 (字段名1, 字段名2, ...) VALUES (值1, 值2, ...);
```

2给全部字段添加数据

```sql
INSERT INTO 表名 VALUES (值1, 值2, ...);
```

### 2.3.2修改数据

```sql
UPDATE 表名 SET 字段名1 = 值1 , 字段名2 = 值2 , .... [ WHERE 条件 ] ;
```

### 2.3.3删除数据

```sql
DELETE FROM 表名 [ WHERE 条件 ] ;
```

## 2.4 DQL

DQL英文全称是Data Query Language(数据查询语言)，数据查询语言，用来查询数据库中表的记录。

跟拼积木一样 感觉就一堆if嵌套

```sql
SELECT 字段列表

FROM 表名列表

WHERE 条件列表

GROUP BY 分组字段列表

HAVING 分组后条件列表

ORDER BY 排序字段列表    默认asc升序 desc降序

LIMIT 分页参数
--编写顺序
```

来几个例子方便理解

```sql
# 案例

-- 查询年龄小于45的员工, 并根据工作地址分组, 获取员工数量大于等于3的工作地址
select workaddress, count(*) address_count from emp where age < 45 group by workaddress having address_count >= 3;
> address-count 是别名 省略了as

-- 查询年龄为20,21,22,23岁的员工信息。
select * from emp where age between 20 and 23;

-- 查询性别为男，并且年龄在  20-40 岁 (含)以内的姓名为三个字的员工。
select * from emp where gender = '男' and ( age between 20 and 40 ) and name like '___';

-- 统计员工表中,年龄小于60岁的, 男性员工和女性员工的人数。
select gender, count(*) from emp where age < 60 group by gender;

-- 查询所有年龄小于等于35岁员工的姓名和年龄，并对查询结果按年龄升序排序，如果年龄相同按 入职时间降序排序。
select name, age  from emp where age <= 35 order by age asc, entrydate desc;

-- 查询性别为男，且年龄在20-40 岁 (含)以内的前5个员工信息，对查询的结果按年龄升序排序， 年龄相同按入职时间升序排序。
select * from emp where gender = '男' and ( age between 20 and 40 ) order by age asc, entrydate asc limit 5;
```

有几个特殊条件

```sql
BETWEEN ... AND ...    在某个范围之内 (含最小、最大值)
IN(...)    在in之后的列表中的值，多选一
LIKE 占位符    模糊匹配 (_匹配单个字符 , %匹配任意个字符)
```

> 编写顺序和执行顺序有所不同 执行顺序是最上面的412356（分组的是一个）

## 2.5 DCL

DCL英文全称是**Data Control Language** (数据控制语言)，用来**管理**数据库**用户**、控制数据库的访问权限。

代码省略 不用掌握



## 2.6 函数

比较简单 我们快速跳过

###### 1.字符串函数

- CONCAT, LOWER, UPPER, 左补全LPAD(str,n,pad), RPAD, TRIM, SUBSTRING

```sql
--由于业务需求变更，企业员工的工号，统一为5位数，
--目前不足5位数的全部在前面补0。比如:1号员工的工号应该为00001。
update emp set workno = lpad(workno,5,'0');
```

###### 2.数值函数

- CEIL,FLOOR,MOD, RAND,ROUND

```sql
--生成6位随机验证码
select lpad(round(rand() * 1000000, 0),6,'0');
```

###### 3.日期函数

- CURDATE, CURTIME, NOW, YEAR, MONTH, DAY, DATE ADD, DATEDIFF(日期相减函数)
  
  

```sql
--查询所有员工的入职天数，并根据入职天数倒序排序
select name,datediff(curdate(),entrydate)as 'entrydays' from emp order by entrydays desc;
```

###### 4.流程函数

- IF, IFNULL, CASE[...] WHEN ... THEN...  ELSE ...END

```sql
select
id,
name,
(case when math >= 85 then '优秀'when math >=60 then '及格'else '不及格'end )'数学',
(case when english >= 85 then '优秀' when english >=60 then '及格' else '不及格' end )'英语',(case when chinese >= 85 then '优秀' when chinese >=60 then '及格' else '不及格' end )'语文',
from score;
```

## 2.7 约束

概念：约束是作用于表中字段上的规则，用于限制存储在表中的数据。

目的：保证数据库中数据的正确、有效性和完整性。

![525fbbec92a76f600ebf035c39fdabf6](/images/postimage/MySQL/525fbbec92a76f600ebf035c39fdabf6.png)

:::tip

约束是作用于表中字段上的，可以在创建表/修改表的时候添加约束。

:::

```sql
# 约束演示

create table user (
    id int primary key auto_increment comment 'ID唯一标识 ',
    name varchar(10) not null unique comment '姓名',
    age int check ( age > 0 && age <= 120 ) comment '年龄',
    status char(1) default '1' comment '状态',
    gender char(1) comment '性别'
) comment '用户表';

```

### 2.7.1 外键约束

**外键**:用来让两张表的数据之间建立连接，从而保证数据的**一致性**和**完整性**。

用法

```sql
--建表前
CREATE TABLE 表名 (
  字段名 数据类型,
  ...
  [CONSTRAINT] [外键名称] FOREIGN KEY (外键字段名) REFERENCES 主表 (主表列名)
);

--建表后
ALTER TABLE 表名 ADD CONSTRAINT 外键名称 FOREIGN KEY (外键字段名) REFERENCES 主表 (主表列名) ;

--删除外键
ALTER TABLE 表名 DROP FOREIGN KEY 外键名称;
```

来个例子

```sql
-- 添加外键
alter table emp add constraint fk_emp_dept_id foreign key (dept_id) references dept(id);

-- 删除外键
alter table emp drop foreign key fk_emp_dept_id;
```

#### 删除/更新行为                                      
![e27e42a76150bc796ede93997f74a9ca](/images/postimage/MySQL/e27e42a76150bc796ede93997f74a9ca.png)

- 语法：

```sql
ALTER TABLE 表名 ADD CONSTRAINT 外键名称 FOREIGN KEY (外键字段) REFERENCES
主表名 (主表字段名) ON UPDATE CASCADE ON DELETE CASCADE;
```

依旧来个例子

```sql

-- 外键的删除和更新操作
alter table emp add constraint fk_emp_dept_id foreign key (dept_id) 
    references dept(id) on update cascade on delete cascade ;

alter table emp add constraint fk_emp_dept_id foreign key (dept_id) 
    references dept(id) on update set null on delete set null ;
```

在datagrip中可以用图形化界面修改

## 2.8 多表查询

### 2.8.1 多表关系

项目开发 中，在进行数据库表结构设计时，会根据业务需求及业务模块之间的关系，分析并设计表结构，由于业务之间相互关联，所以各个表结构之间也存在着各种联系，基本上分为三种：

- 一对多(多对一)

- 多对多

- 一对一

#### 1.一对多

* 案例 : 部门与员工的关系
  
  * 关系 : 一个部门对应多个员工， 一个员工对应一个部门。
  
  * 实现 : 在多的一方建立外键，指向一的一方的主键。

#### 2.多对多

* 案例 : 学生与课程的关系
  
  * 关系 : 一个学生可以选修多门课程， 一门课程也可以供多个学生选择。
  
  * 实现 : 建立**第三张中间表**，中间表至少包含两个**外键**，分别**关联两方主键**。

```sql
-- 多对多
create table student (
    id int auto_increment primary key comment '主键ID ',
    name varchar (10) comment '姓名 ',
    no varchar (10) comment '学号 '
) comment '学生表 ';
insert into student values (null, '黛绮丝 ', '2000100101 '), (null, '谢逊 ','2000100102 ')
                           , (null, '殷天正 ', '2000100103 '), (null, '韦一笑 ', '2000100104 ');


create table course (
        id int auto_increment primary key comment '主键ID ',
        name varchar (10) comment '课程名称 '
) comment '课程表 ';
insert into course values (null, 'Java '), (null, 'PHP '), (null , 'MySQL '), (null, 'Hadoop ');

create table student_course (
            id int auto_increment comment '主键 ' primary key,
            studentid int not null comment '学生ID ',
            courseid  int not null comment '课程ID ',
            constraint fk_courseid foreign key (courseid) references course (id),
            constraint fk_studentid foreign key (studentid) references student (id)
) comment '学生课程中间表 ';
insert into student_course values (null,1,1), (null,1,2), (null,1,3), (null,2,2),(null,2,3), (null,3,4);
```

#### 3.一对一

* 案例 : 用户 与 用户详情的关系
  
  * 关系 : 一对一关系，多用于**单表拆分**，将一张表的基础字段放在一张表中，其他详情字段放在另 一张表中，以提升操作效率
  
  * 实现 : 在任意一方加入外键，关联另外一方的主键，并且设置外键为**唯一的** (UNIQUE)

```sql
-- 一对一
create table tb_user (
       id int auto_increment primary key comment '主键ID ',
       name varchar (10) comment '姓名 ',
       age int comment '年龄 ',
       gender char (1) comment '1: 男 , 2: 女 ',
       phone char (11) comment '手机号 '
) comment '用户基本信息表 ';

create table tb_user_edu (
      id int auto_increment primary key comment '主键ID ',
      degree varchar (20) comment '学历 ',
      major varchar (50) comment '专业 ',
      primaryschool varchar (50) comment '小学 ',
      middleschool varchar (50) comment '中学 ',
      university varchar (50) comment '大学 ',
      userid int unique comment '用户ID ',constraint fk_userid foreign key (userid) references tb_user (id)
) comment '用户教育信息表 ';

insert into tb_user (id, name, age, gender, phone) values
       (null, '黄渤 ',45, '1 ', '18800001111 '),
       (null, '冰冰 ',35, '2 ', '18800002222 '),
       (null, '码云 ',55, '1 ', '18800008888 '),
       (null, '李彦宏 ',50, '1 ', '18800009999 ');
insert into tb_user_edu (id, degree, major, primaryschool, middleschool,university, userid)
            values (null, '本科 ', '舞蹈 ', '静安区第一小学 ', '静安区第一中学 ', '北京舞蹈学院 ',1),
                   (null, '硕士 ', '表演 ', '朝阳区第一小学 ', '朝阳区第一中学 ', '北京电影学院 ',2),
                   (null, '本科 ', '英语 ', '杭州市第一小学 ', '杭州市第一中学 ', '杭州师范大学 ',3),
                   (null, '本科 ', '应用数学 ', '阳泉第一小学 ', '阳泉区第一中学 ', '清华大学 ',4);
```
