---
title: MySQL
published: 2026-03-29
description: 'MySQL'
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



# 3. 函数

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

# 4. 约束

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

# 5. 多表查询

### 5.1 多表关系

项目开发 中，在进行数据库表结构设计时，会根据业务需求及业务模块之间的关系，分析并设计表结构，由于业务之间相互关联，所以各个表结构之间也存在着各种联系，基本上分为三种：

- 一对多(多对一)

- 多对多

- 一对一

#### 5.1.1一对多

* 案例 : 部门与员工的关系
  
  * 关系 : 一个部门对应多个员工， 一个员工对应一个部门。
  
  * 实现 : 在多的一方建立外键，指向一的一方的主键。

#### 5.1.2多对多

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

#### 5.1.3一对一

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

### 5.2 分类

连接查询

**内连接**：相当于查询A、B**交集**部分数据。内连接查询的是两张表交集部分的数据。

**外连接**：

- 左外连接：查询左表**所有**数据，以及两张表交集部分数据

- 右外连接：查询右表**所有**数据，以及两张表交集部分数据 

> 需要所有数据时用

**自连接**：当前表与自身的连接查询，自连接必须使用表别名



### 5.2.1 内连接

###### 1.隐式内连接

用where的

```sql
 SELECT 字段列表 FROM 表1 , 表2 WHERE 条件 ... ;
```

###### 2.显式内连接

用join on的 

```sql
SELECT 字段列表 FROM 表1 [ INNER ] JOIN 表2 ON 连接条件 ... ;
```

:::tip

起别名注意事项：一旦为表起了别名，就不能再使用表名来指定对应的字段了，此时只能够使用别名来指定字段。

:::

```sql
# 多表查询
-- 内连接
-- 查询每一个员工的姓名  , 及关联的部门的名称   (隐式内连接实现)
select emp.name, dept.name from emp, dept where emp.dept_id = dept.id;

-- 为每一张表起别名,简化SQL编写
select e.name,d.name from emp e , dept d where e.dept_id = d.id;


-- 查询每一个员工的姓名   , 及关联的部门的名称   (显式内连接实现)  
--- INNER JOIN ... ON ...
select emp.name, dept.name from emp inner join dept on emp.dept_id = dept.id;
```

### 5.2.2 外连接

分为左,右连接 因为左右可以互换 我们一般采用左连接

```sql
# 多表查询
-- 外连接
-- 查询emp表的所有数据 , 和对应的部门信息（左外连接）
select emp.*, dept.name from emp left join dept on emp.dept_id = dept.id;


-- 查询dept表的所有数据 , 和对应的员工信息(右外连接)
select dept.*, emp.*  from emp right join dept on emp.dept_id = dept.id;

select d.*, e.* from dept d left outer join emp e on e.dept_id = d.id; 
-- 左右调换
```

### 5.2.3 自连接

自连接查询，顾名思义，就是自己连接自己，也就是把一张表连接查询多次。

* **对于自连接查询，可以是内连接查询，也可以是外连接查询。**

* 在自连接查询中，必须要为表起**别名**，要不然我们不清楚所指定的条件、返回的字段，到底 是哪一张表的字段。

###### 1.自连接查询

```sql
-- 自连接
-- 查询员工及其所属领导的名字
select a.name , b.name from emp a join emp b on a.managerid = b.id;

-- 查询所有员工  emp 及其领导的名字  emp , 如果员工没有领导 , 也需要查询出来 表结构 : emp a , emp b
select A.name '员工', B.name '领导' from emp A left join emp B on A.managerid = B.id;
```

###### 2.联合查询

union查询，就是把多次查询的结果合并起来，形成一个新的查询结果集。

```sql
-- 联合查询
-- 将薪资低于  10000 的员工 , 和年龄大于 50 岁的员工全部查询出来。
-- 当前对于这个需求，我们可以直接使用多条件查询，使用逻辑运算符o连接即可。那这里呢，我们
-- 也可以通过union/union all来联合查询 .
select * from emp where salary < 10000
union all
select * from emp where age > 50;
/*
select * from emp where salary < 10000
union all
select name from emp where age > 50;  --报错 字段数量不一致
*/
```

* union all查询出来的结果，仅仅进行简单的合并，并**未去重**。

* union 联合查询，会对查询出来的结果进行**去重**处理。
  
  

### 5.3 子查询

**分类**

* 根据子查询结果不同，分为：
  
  * 标量子查询（子查询结果为单个值）
  
  * 列子查询(子查询结果为一列)
  
  * 行子查询(子查询结果为一行)
  
  * 表子查询(子查询结果为多行多列)

###### 1.标量子查询

也就是select查询的是单个值 可以直接嵌套

来两个例子

```sql
-- 查询  "销售部 " 的所有员工信息
-- 0.查询销售部id
select id from dept where name = '市场部 ';
-- 1.根据"销售部 " 部门ID, 查询员工信息
select * from emp where dept_id = (select id from dept where name = '市场部 ');

-- 查询在  "方东白 " 入职之后的员工信息
-- 查询  方东白  的入职日期
select entrydate from emp where name = '方东白 ';
-- 查询指定入职日期之后入职的员工信息
select * from emp where entrydate > (select entrydate from emp where name = '方东白');
```

###### 2.列子查询

字面意思 返回的是一列数据

操作符有: in , not in , all , any ,some(==any)

```sql
-- 列子查询
-- 查询   "销售部 " 和  "市场部 " 的所有员工信息
select id from dept where name = '销售部 ' or name = '市场部 ';
select * from emp where dept_id in (select id from dept 
where name = '销售部 ' or name = '市场部 ');

-- 查询比财务部所有人工资都高的员工信息
select id from dept where name = '财务部';

select salary from emp where dept_id = (select id from dept where name = '财务部');

select * from emp where salary > all (select salary from emp where dept_id = (select id from dept where name = '财务部'));

-- 查询比研发部其中任意一人工资高的员工信息
select * from emp where salary > any ( select salary from emp where dept_id = (select id from dept where name = '研发部 ') );
```

###### 3.行子查询

```sql
-- 查询与  "张无忌 " 的薪资及直属领导相同的员工信息   ;
select salary, managerid from emp where name = '张无忌 ';
select * from emp where (salary,managerid) = (select salary, managerid from emp where name = '张无忌 ');
```

###### 4.表子查询

子查询返回的结果是多行多列，这种子查询称为表子查询

常用**in**操作符

```sql
-- 查询与  "鹿杖客 " , "宋远桥 " 的职位和薪资相同的员工信息
select job, salary from emp where name = '鹿杖客 ' or name = '宋远桥 ';
select * from emp where (job,salary) in (select job, salary from emp where name = '鹿杖客 ' or name = '宋远桥 ');

-- 查询入职日期是  "2006-01-01" 之后的员工信息   , 及其部门信息
select * from emp where entrydate > '2006-01-01';
select e.*, d.* from (select * from emp where entrydate > '2006-01-01 ') e left join dept d on e.dept_id = d.id ;
```

### 5.4 多表查询案例

补充: 

- 查重关键字 distinct

- ......

一共12个

```sql
# 多表查询案例
create table salgrade (
         grade int,
         losal int,
         hisal int
) comment '薪资等级表 ';

insert into salgrade values (1,0,3000);
insert into salgrade values (2,3001,5000);
insert into salgrade values (3,5001,8000);
insert into salgrade values (4,8001,10000);
insert into salgrade values (5,10001,15000);
insert into salgrade values (6,15001,20000);
insert into salgrade values (7,20001,25000);
insert into salgrade values (8,25001,30000);

-- 1). 查询员工的姓名、 年龄、职位、部门信息  （隐式内连接）
select e.name, e.age, e.job, d.name from emp e, dept d where e.dept_id = d.id;

-- 2). 查询年龄小于30岁的员工的姓名、年龄、职位、部门信息（显式内连接）
select e.name, e.age, e.job, d.name frm emp e inner join dept d on e.dept_id = d.id where age < 30;

-- 3). 查询拥有员工的部门ID、部门名称
select distinct dept.id, dept.name from emp, dept where emp.dept_id = dept.id;

-- 4). 查询所有年龄大于40岁的员工 , 及其归属的部门名称 ; 如果员工没有分配部门 , 也需要展示出来(外连接)
select emp.*, dept.name from emp left join dept on emp.dept_id = dept.id where age > 40;

-- 5). 查询所有员工的工资等级
select e.* , s.grade , s.losal, s.hisal from emp e , salgrade s where e.salary >= s.losal and e.salary <= s.hisal;

select e.* , s.grade , s.losal, s.hisal from emp e , salgrade s where e.salary between s.losal and s.hisal;

-- 6). 查询  "研发部 " 所有员工的信息及  工资等级
select e.* , s.grade from emp e , dept d , salgrade s where e.dept_id = d.id and ( e.salary between s.losal and s.hisal ) and d.name = '研发部 ';

-- 7). 查询  "研发部 " 员工的平均工资
select avg(e.salary) from emp e, dept d where e.dept_id = d.id and d.name = '研发部';

-- 8). 查询工资比   "灭绝 " 高的员工信息。
select salary from emp where name = '灭绝 ';
select * from emp where salary > ( select salary from emp where name = '灭绝 ' );

-- 9). 查询比平均薪资高的员工信息
select avg(salary) from emp;
select * from emp where salary > ( select avg (salary) from emp );

-- 10). 查询低于本部门平均工资的员工信息
select avg(e1.salary) from emp e1 where e1.dept_id = 1;
select avg(e1.salary) from emp e1 where e1.dept_id = 2;

select * from emp e2 where e2.salary < ( select avg(e1.salary) from emp e1 where e1.dept_id = e2.dept_id );

-- 11). 查询所有的部门信息 , 并统计部门的员工人数
select d.id, d.name , ( select count (*) from emp e where e.dept_id = d.id ) '人数 ' from dept d;

-- 12). 查询所有学生的选课情况 , 展示出学生名称 , 学号 , 课程名称 
select s.name , s.no , c.name from student s , student_course sc , course c where s.id = sc.studentid and sc.courseid = c.id ;# 多表查询案例

```



# 6.事务

### 1.事务简介

是一组操作的集合，它是一个不可分割的工作单位，事务会把所有的操作作为一个整体一起向系 统提交或撤销操作请求，即这些操作**要么同时成功，要么同时失败**。

### 2.事务操作

#### 2.1 第一种操作方式

```sql
--查看事务自动提交方式
--1为打开自动提交
SELECT @@autocommit ;
--设置事务提交方式
SET @@autocommit = 0 ;
--提交
COMMIT;
--回滚事务
ROLLBACK;
```

* 上述的这种方式，我们是修改了事务的自动提交行为 , 把默认的自动提交修改为了手动提交 , 此时我们执行的DML语句都不会提交 , 需要手动的执行commit进行提交。

* 每条单独的DQL语句都是一个事务。

#### 2.2 第一种操作方式

```sql
--开启事务
START TRANSACTION 或 BEGIN ;
--提交以及回滚与第一种相同
```

### 3.事务四大特性（ACID）

- **原子性**（Atomicity）：事务是不可分割的最小操作单元，要么全部成功，要么全部失败。

- **一致性**（Consistency）：事务完成时，必须使所有的数据都保持一致状态。（如张三李四账户一共有四千块，在事务结束后，一共的数据还是四千块，如果一共为三千，则出现了不一致）

- **隔离性**（Isolation）：数据库系统提供的隔离机制，保证事务在不受外部并发操作影响的独立环境下运行。（两个并发事务不会互相影响）

- **持久性**（Durability）：事务一旦提交或回滚，它对数据库中的数据的改变就是永久的。 （数据存储到磁盘中）
  

### 4. 并发事务问题

#### 1.赃读:

一个事务读到另外一个事务**还没有提交**的数据。

![209b4fcfc9bca89401af8b46e6d80368](/images/postimage/MySQL/209b4fcfc9bca89401af8b46e6d80368.png)

#### 2.不可重复读：

一个事务先后读取同一条记录，但两次读取的数据不同，称之为不可重复读。

事务A两次读取同一条记录，但是读取到的数据却是不一样的。（此时另一个事务提交了数据，导致两次读取结果不一致，但是在此隔离级别下，不会读到另一个事务还未提交的数据。）
![a201a2542957f7b998eb4a9d1305d155](/images/postimage/MySQL/a201a2542957f7b998eb4a9d1305d155.png)

#### 3.幻读:

一个事务按照条件查询数据时，没有对应的数据行，但是在插入数据时，又发现这行数据已经存在，好像出现了 "幻影"

![221fd1b8ea8d7279a665234bbd63099d](/images/postimage/MySQL/221fd1b8ea8d7279a665234bbd63099d.png)

### 5.事务隔离级别

- Read uncommitted 读未提交：事务一会读取到事务二未提交的数据。比如事务一第一次读取id=1的数据，此时事务二修改了id=1的数据但未提交，这时候事务一能读取到未提交的修改后的数据，即脏读错误。

- Read committed 读已提交：事务一不会读取到事务二未提交的数据，但是会读取到事务二已提交的数据。同上例，事务二如果提交了对id=1的修改，则事务一会读取到修改后的结果，如果第一次读取的结果和第二次读取的结果不一致（事务二对其进行了修改），则出现不可重复读错误。

- Repeatable Read(默认) 可重复读：事务一不会读取到事务二已提交的数据，每一个事务中的数据都是单独的，只有事务提交后再开启事务才会读到新的数据。同上例，如果事务一先读取id=1的数据，假设id=1不存在，则读取为空，此时如果事务二修改了id=1的数据，并提交，事务一再插入id=1的数据，则会报错，因为数据库中存在id=1的数据，但是事务一再查询id=1的数据，查询依然为空，因为在这个权限下，每一个事务内的数据只有开启事务时的数据。这个错误称为幻读。

- Serializable 串行化：不会出现幻读现象，在权限下，事务只能一个接一个进行，只有上一个事务提交了，下一个事务才能提交。
  

```sql
SELECT @@TRANSACTION ISOLATION;

--设置隔离级别
--session是该窗口
--global是全局
SET [ SESSION | GLOBAL ] TRANSACTION ISOLATION LEVEL { READ UNCOMMITTED |READ COMMITTED | REPEATABLE READ | SERIALIZABLE }
```

* 注意：事务隔离级别越高，数据越安全，但是性能越低。
