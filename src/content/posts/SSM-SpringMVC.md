---
title: SSM-SpringMVC
published: 2026-04-12
description: 'SSMSpringMCVC'
image: '/images/sagiri/14.png'
tags: [java,SpringMVC,SSM,web]
category: 'java'
draft: false 
lang: ''
---
# SSM-SpringMVC

SpringMVC是Spring的web模块 用来开发web项目

web应用的核心就是**处理HTTP请求响应**



## 1. @RequestMapping

实现helloworld

```java
/*
等同于@Controller && @ResponseBody
*/
@RestController
public class HelloController {
    @RequestMapping("/hello" )
    public String hello(){
        return "hello SpringMVC!~~你好呀";
    }
}
```

### 1.1 路径映射-通配符

*代表匹配多个字符 

**代表匹配任意多层路径 

?代表匹配任意单个字符 

### 1.2 请求限定

如果没满足限定的要求,浏览器会报错

•请求方式：method    限定请求类型

```java
举例:
@RequestMappng(value="/test",method=RequestMethod.POST)//只接收POST请求

```

•请求参数：params  限定请求参数

```java
@RequestMapping(value = "/hello",params = "!username","age=18","gen!=1")//不能有username
//没有gen 也算gen!=1,等于空也是不等于1
```

•请求头：headers 限定请求头

```java
@RequestMapping(value = "/hello",headers = "hha")//请求头中必须有hha (基本和请求参数的类似)
```



•请求内容类型：consumes   指定消费的内容类型,浏览器必须带这个类型的数据

消费, 浏览器发数据,相当于数据的生产者,服务器是数据的消费者

```java
    @RequestMapping(value = "/hello",consumes = "application/json")//限定浏览器要携带json类型的数据
```

•响应内容类型：produces  客户端给浏览器指定类型,让浏览器以此类型解析

如:@RequestMapping(value = "/hello",produces = "text/html") 此时浏览器会按照html规则解析页面,就可以解析<h1>标签等内容

```java
@Controller//告诉Spring这是一个控制器(处理请求的组件)
public class test {

    @ResponseBody //把字符串放到响应体里
    @RequestMapping(value = "/hello",produces = "text/html") //会识别<h1>是html中的标签
    public String hello(){
        return "<h1>我</h1>"; //默认会认为返回值是跳到一个页面,加了@ResponseBody就不会了
    }
}
```

## 2. 请求处理

### 2.1 普通参数

直接将对应参数名字写在方法参数里面传过来即可

```java
public  String Request(String username,String password,String cellphone,boolean agreement){
    //如果没携带信息,包装类型自动封装为null,基本类对象封装为默认值
    return "ok!";
}
```

### 2.2 @RequestParam 明确参数

在1.3.1中要求变量名要和参数名一致,否则数据封装不上,此时可以用@RequestParam注解

```java
@RestController
public class Request {
    @RequestMapping("/handle02")
    public String Request(@RequestParam("username") String name,        @RequestParam("password")String pwd,  @RequestParam("cellphone") String phone, @RequestParam("agreement")boolean ok) {
    //参数无论是GET方式发送还是POST方式发送都可以获取参数
    //用@RequestParam表注的参数,一定要带上(在浏览器提交时),否则会报错,
    // 如果确定某个参数没有携带,可以填写required=false@RequestParam(value="username",required=false) 让此参数非必须携带
    //还可以设置defaultValue = "123", 此时如果不携带,默认值就为123,且required=false就可以不写了
        System.out.println(name);
        System.out.println(pwd);
        System.out.println(phone);
        System.out.println(ok);
    return "登录成功";
    }
}
```

### 2.3 使用Pojo封装所有参数

可以新建一个Bean类 里面设置好参数 

如果目标方法参数是一个pojo,那么SpringMVC会自动把请求参数和pojo的属性进行自动匹配

### 2.4 用@RequestBody来反序列化json串

前面的所有传值(GET POST)都是key value形式 那如果我们想发送json串呢?

**这时** @RequestBody就出现了 我们无法直接获取json串 于是我们可以

```java
@RestController
public class Request {
    @RequestMapping("/handle07")
    //1.发送json 利用postman
  public String handle05(@RequestBody Person person){//不加注解的话获取的全是空
        //@RequestBody的作用是获取请求体的json字符串数据,并且自动将字符串转换成person对象(反序列化)
        //也可以写(@RequestBody String abc) 把json的字符串收过来,按照字符串的格式(没啥意义)
        System.out.println(person);
    return "登录成功";
    }
}
```

### 2.5 文件上传

**MultipartFile**专门封装**文件**项,还要加 **@RequestParam**取出指定的文件项, 多文件的话用数组

```java
@RestController
public class Request {
    @RequestMapping("/handle08")
  public String handle05(Person person, 
        @RequestParam("headerImg") MultipartFile file,//headermg是文件的key,具体在浏览器查看                                                                                        
        @RequestParam("lifeImg") MultipartFile[] file2) throws IOException {
        String originalFilename = file.getOriginalFilename();//获取原始的文件名(上传时的文件名)
        long size = file.getSize();//获取文件的大小
        //InputStream inputStream = file.getInputStream();获取到文件内容,文件流 没啥用
        file.transferTo(new File("C:\\test\\"+originalFilename));//将文件转存,按照原来的文件名
        System.out.println("原始文件名"+originalFilename+"大小为"+size);
        System.out.println("以上处理了头像==========");
        for (MultipartFile multipartFile : file2) {
            multipartFile.transferTo(new File("C:\\test\\"+multipartFile.getOriginalFilename()));//将每一个生活照保存,按照名字
        }
        return "登录成功";
    }
}
```

:::tip
springmvc默认限制,最大不能上传文件超过1mb
可以在配置文件(properties)里设置spring.servlet.multipart.max-file-size=1GB (单个文件最大1gb)
spring.servlet.multipart.max-request-size=1GB (单次请求最大1gb)

:::

### 2.6 使用HttpEntity获取整个请求

不常用 除非你真有这个需求 可以看看

```java
//HttpEntity封装整个请求, 他里面的泛型代表把请求体里面的内容转换成什么指定的类型
@RequestMapping("/handle09")
public String handle09(HttpEntity<String> entity){ //可以通过改泛型将请求体自动转换成javabean对象
    HttpHeaders headers = entity.getHeaders();//获取请求头
    String body = entity.getBody();//获取请求体
    System.out.println(headers);
    System.out.println(body);
    return "ok";
    }
}
```

## 3. 响应处理

服务器给浏览器返回的数据

### 3.1 返回json

```java
@RequestMapping("/resp01")
    public Person resp01(Person person){
        person = new Person();
        person.setUsername("admin");
        person.setPassword("123456");
        person.setCellphone("123456778");
        person.setAgreement(true);
        return person;
        //Spring会自动将person对象转换为json串 
    }
```

### 3.2 文件下载

代码是固定的 除了路径其他不用改

```java
@RequestMapping("/download")
public ResponseEntity<InputStreamResource> download() throws IOException {
    FileInputStream inputStream = new FileInputStream("...");
    //一口气读会溢出
    //byte[] bytes = inputStream.readAllBytes();

    //1、文件名中文会乱码：解决：
    String encode = URLEncoder.encode("你好.jpg", "UTF-8");

    //2、文件太大会oom（内存溢出）
    InputStreamResource resource = new InputStreamResource(inputStream);
    return ResponseEntity.ok()
            //内容类型：流
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            //内容大小
            .contentLength(inputStream.available())
            // Content-Disposition ：内容处理方式
            .header("Content-Disposition", "attachment;filename="+encode)
            .body(resource);
}
```

### 3.3 模板引擎 (跳过)

## 4. Restful

### 1.介绍

REST是一种**软件架构风格**,它认为对**web**的操作,就是对**资源**的操作(CRUD)

**总结**:使用资源作为URI,使用HTTP的请求方式,表示对资源的操作

满足REST风格的系统,就是RESTful系统

下面是**示例**:

| **URI**         | **请求方式** | **请求体**       | **作用** | **返回数据**(响应)        |
| --------------- | -------- | ------------- | ------ | ------------------- |
| /employee/{id}  | GET      | 无             | 查询某个员工 | Employee JSON       |
| /employee       | POST     | employee json | 新增某个员工 | 成功或失败状态             |
| /employee       | PUT      | employee json | 修改某个员工 | 成功或失败状态             |
| /employee/{id}  | DELETE   | 无             | 删除某个员工 | 成功或失败状态             |
| /employees      | GET      | 无/查询条件        | 查询所有员工 | List<Employee> JSON |
| /employees/page | GET      | 无/分页条件        | 查询所有员工 | 分页数据  JSON          |

### 2.RestfulAPI

API是web应用暴露出来的,让别人访问的请求路径,访问之后就可以执行相应的方法, API是对接的入口(RESTfulAPI接口,就是所谓的controller层代码),我们写controller来设计他

所谓的web应用,后端程序员的主要任务就是写接口

`@RequestMapping("/yuangong/{id}")` 意思:请求映射 这句话定义了RESTfulAPI接口

调用别人的功能的方式

1.API:直接给第三方发请求,获取到响应数据

2.SDK:软件开发工具包,就是导入jar包



### 3.员工管理系统

然后我们完成了一个Restful的员工管理系统(CRUD)

完整的文件目录:
```
 ├── org.springdata.spring.rest.crud
 ├── advice ->全局异常处理
 │   └── GlobalExceptionHandler
 ├── annotation ->自定义注解
 │   └── @Gender -> 自定义校验性别注解
 ├── bean 
 │   └── Employee ->员工类
 ├── common 
 │   └── R -> 统一返回类型 code,msg,data
 ├── config -> 配置
 │   └── MySpringMVCConfig -> 拦截器配置文件
 ├── controller 
 │   ├── EmployeeRestController -> CRUD控制层 控制service
 │   ├── HahaController
 │   └── HelloController
 ├── dao -> 主要逻辑处 与数据库交涉层
 │   ├── impl
 │   └── EmployeeDao
 ├── exception -> 异常包
 │   ├── BizException ->业务异常类
 │   └── BizExceptionEnum -> 业务异常枚举类 enum
 ├── filter ->没学
 ├── interceptor -> 拦截器
 │   ├── MyHandlerInterceptor0
 │   ├── MyHandlerInterceptor1
 │   └── MyHandlerInterceptor2
 ├── service -> 服务层 包装了Dao
 │   ├── impl
 │   └── EmployeeService
 ├── validator -> 自定义检验
 │   └── GenderValidator
 ├── vo -> 视图对象 与客户端交互对象
 │   ├── req -> 请求
 │   │   ├── EmployeeAddVo
 │   │   └── EmployeeUpdateVo
 │   └── resp -> 响应
 │       └── EmployRespVo
 └── Springmvc02BestPracticeApplication
 
 resources ->资源包
 ├── static
 ├── templates
 ├── application.properties
 ├── application.yaml -> 配置swagger部分 knife4j
 └── 资源包 'messages' -> 校验错误信息
     └── messages.properties
```
代码篇幅过长 这里我们重点讲解重要部分 源码去本地看 每个部分都有重要的注释

#### 1. Dao / Service / Controller 层

##### 1.1 分层职责说明

| 层级                 | 核心职责             | 关键操作                                            |
| ------------------ | ---------------- | ----------------------------------------------- |
| **Controller 控制层** | 接收请求、参数校验、响应封装   | 接收 HTTP 请求、`@Valid` 校验参数、调用 Service、返回统一 `R` 响应 |
| **Service 业务层**    | 实现业务逻辑、事务控制、业务校验 | 调用 Dao 操作、`@Transactional` 事务管理、业务异常处理、规则校验     |
| **Dao 数据访问层**      | 与数据库交互，仅做数据读写    | 执行 SQL、`JdbcTemplate` 操作、数据增删改查                 |



##### 1.2 各层详细说明

- **Dao 层（数据访问层）**

> 只负责和数据库交互，不包含任何业务逻辑

- 定义接口：`EmployeeDao` 提供 `insert/update/select/delete` 等基础方法

- 实现方式：通过 `JdbcTemplate` 编写 SQL，完成参数绑定与结果映射

- 设计原则：单一职责，只做数据读写，不处理业务规则

- **Service 层（业务逻辑层）**

> 核心业务处理层，是 Controller 和 Dao 的桥梁

- 调用 Dao 层方法，组合完成复杂业务流程

- 额外操作：
  
  - 业务校验（如工号是否重复、部门是否存在）
  
  - 事务控制（`@Transactional` 保证数据一致性）
  
  - 异常封装（将数据库异常转为 `BizException`）
  
  - 数据转换（Vo 与 Entity 的互转）

- **Controller 层（控制层）**

> 请求入口与响应出口，负责前后端交互

- 接收请求：通过 `@PostMapping`/`@GetMapping` 映射请求路径

- 参数校验：`@Valid` + `@NotBlank`/`@NotNull` 完成请求参数校验

- 调用 Service：执行业务方法，不写具体逻辑

- 响应封装：统一返回 `R` 对象，携带状态码与提示信息

- 文档支持：通过 `@Tag`/`@Schema` 注解生成接口文档

---

##### 1.3 三层调用流程

```java
前端请求 → Controller（参数校验、接收请求）
        → Service（业务逻辑、事务控制、业务校验）
        → Dao（数据库交互、SQL执行）
        ← 结果返回 ← 数据读写
        ← Controller（响应封装、返回结果）
```

##### 1.4 核心代码示例（

- Controller 层示例

```java
@RestController
@RequestMapping("/emp")
@Tag(name = "员工管理接口")
public class EmployeeRestController {
    @Autowired
    private EmployeeService employeeService;

    @PostMapping("/add")
    public R add(@Valid @RequestBody EmployeeAddVo vo) {
        employeeService.addEmployee(vo);
        return R.ok();
    }
}
```

- Service 层示例

```java

@Service
public class EmployeeServiceImpl implements EmployeeService {
    @Autowired
    private EmployeeDao employeeDao;

    @Override
    @Transactional
    public void addEmployee(EmployeeAddVo vo) {
        // 1. 业务校验：工号是否存在
        if (employeeDao.selectByNo(vo.getEmpNo()) != null) {
            throw new BizException(BizExceptionEnum.EMP_NO_EXIST);
        }
        // 2. 数据转换
        Employee employee = convertToEntity(vo);
        // 3. 调用 Dao 插入数据
        employeeDao.add(employee);
    }
}
```

- Dao 层示例

```java

public interface EmployeeDao {
    int insert(Employee employee);
    Employee selectByNo(String empNo);
}
```

#### 2. 统一返回类型 R

为了方便我们前端更好的展示呢 我们要统一一下返回的东西

于是有个规范JSON 我们返回code状态码 msg信息 以及data所有的数据

记得写在common包下

```java
@Schema(description = "统一返回")
@Data
public class R<T> {

    @Schema(description = "状态码")
    private Integer code;

    @Schema(description = "提示信息")
    private String msg;

    @Schema(description = "数据")
    private T data;

    public static<T> R<T> ok(T data){
        R<T> tr = new R<>();
        tr.setCode(200);
        tr.setMsg("ok");
        tr.setData(data);
        return tr;
    }

    public static R ok(){
        R tr = new R<>();
        tr.setCode(200);
        tr.setMsg("ok");
        return tr;
    }

    public static R error(){
        R tr = new R<>();
        tr.setCode(500); //默认失败码
        tr.setMsg("error");
        return tr;
    }

    public static R error(Integer code,String msg){
        R tr = new R<>();
        tr.setCode(code); //默认失败码
        tr.setMsg(msg);
        return tr;
    }

    public static R error(Integer code,String msg,Object data){
        R tr = new R<>();
        tr.setCode(code); //默认失败码
        tr.setMsg(msg);
        tr.setData(data);
        return tr;
    }
}


```

#### 3. 拦截器 interceptor

- `@Component`：将自定义拦截器（如MyHandlerInterceptor0/1/2）注册到Spring容器

- `@Configuration`：标记MVC配置类（MySpringMVCConfig）

- `WebMvcConfigurer`：实现该接口重写`addInterceptors()`方法，**注册**拦截器
  
  #### 核心方法（拦截器生命周期）
  
  实现HandlerInterceptor接口 并重写一下三个方法

- `preHandle()`：请求处理前执行（返回true放行，false拦截）

- `postHandle()`：Controller执行后、视图渲染前执行

- `afterCompletion()`：响应返回后执行（资源清理）
  多拦截器执行顺序:
  pre123 post和after都是321倒序
  
  #### 配置示例
  
  ```java
  @Configuration
  public class MySpringMVCConfig implements WebMvcConfigurer {
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new MyHandlerInterceptor0())
                .addPathPatterns("/**"); // 拦截所有请求
    }
  }
  ```
  
  

#### 4. 异常处理

* `@RestControllerAdvice`：全局异常处理器（捕获所有 Controller 层异常）
* `@ExceptionHandler(异常类.class)`：捕获指定类型异常（如 MethodArgumentNotValidException、BizException）

异常我们有两种

###### 业务异常

**业务异常**:自定义`BizException` + `BizExceptionEnum`（**枚举**管理错误码 / 信息)

```java
//业务异常类
@Data
public class bize extends RuntimeException {
    private Integer code;//业务异常马
    private String msg;//业务的异常信息
    public bize(Integer code, String msg) {
        super(msg);
        this.code = code;
        this.msg = msg;
    }
    /*
    大型业务会有多个异常 此时如果不停的throw多个码和异常原因很麻烦
    推荐的做法是 用枚举来专门列举所有的状态码和错误的原因
     */
    public bize(bizeEnume b){   //写个构造器,方便传参
        super(b.getMsg());
        this.code = b.getCode();
        this.msg = b.getMsg();
    }

//枚举类
@Getter
public enum bizeEnume {
    ORDER_CLOSED(1001,"订单已关闭"),ORDER_NOT_EXIST(1002,"订单不存在"),   //ORDER_XX都是订单模块相关异常
    PRODUCT_NO_STOCK(2001,"商品已下架");   //product_XX都是商品模块相关异常.....
    private Integer code;
    private String msg;
    private bizeEnume(Integer code, String msg) {
        this.code = code;
        this.msg = msg;
    }
}
```

此时全局异常处理器可以添加上自己定义的异常类了

```java
@ExceptionHandler(bize.class)
public R handlerException(bize e){
    System.out.println("全局bize异常");
    return R.error(e.getCode(),e.getMessage());
}

```

流程的总结:

1.必须要自定义一个业务异常类(bize),

2.必须有异常枚举类(bizeEnume), 枚举类里面的内容根据业务来进行动态的扩充,列举所有的异常情况

3.编写代码只需要写正确逻辑,如果出现预期的问题,要以抛异常的方式中断逻辑,并通知上层.

4.需要有一个全局异常处理器,处理所有异常,返回给前端约定的json数据与错误码



###### 数据校验异常

**数据校验异常**:捕获`MethodArgumentNotValidException`，返回字段级错误

1. 先引入校验依赖：spring-boot-starter-validation

2. 然后给Bean的字段标注校验注解，并指定校验错误消息提示

3. 使用@Valid、@Validated在Controller上开启校验

```java
@PostMapping("/employee") //新增员工要求.前端发送请求,把员工的json串放到请求体中
public R add(@RequestBody @Valid Employee employee){
    employeeservice.addEmployee(employee);
    return R.ok();
}
```

4.使用全局异常处理 获取信息

```java
    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    public R methodArgumentNotValidException(MethodArgumentNotValidException ex) {
        //1、result 中封装了所有错误信息
        BindingResult result = ex.getBindingResult();

        List<FieldError> errors = result.getFieldErrors();
        Map<String, String> map = new HashMap<>();
        for (FieldError error : errors) {
            String field = error.getField();
            String message = error.getDefaultMessage();
            map.put(field, message);
        }

        return R.error(500, "参数错误", map);
    }
```



#### 5. 接口文档（Knife4j/OpenAPI 3.0）

* `@Tag(name = "员工管理接口", description = "员工CRUD相关接口")`：
  
  标记 Controller 类，定义接口分组名称 / 描述
* `@Operation(summary = "新增员工", description = "接收员工信息，完成新增操作")`:
  
  标记接口方法，定义接口说明
* `@Parameter(name = "id", description = "员工ID", required = true)`：
  
  标记请求参数，说明参数含义 / 是否必填
* `@Schema(description = "员工姓名", example = "张三", required = true)`：
  
  标记 VO / 实体类字段，定义字段说明 / 示例值 / 是否必填

##### 核心配置

1. 依赖引入（pom.xml）
   
   ```xml
   <dependency>
          <groupId>com.github.xiaoymin</groupId>
          <artifactId>knife4j-openapi3-jakarta-spring-boot-starter</artifactId>
          <version>4.4.0</version>
      </dependency>
   ```
   
   2. 访问路径：
   
   * 接口文档页面：`http://localhost:8080/doc.html`
   * OpenAPI 3.0 规范文档：`http://localhost:8080/v3/api-docs`





#### 6.所有注解

分层相关：@RestController/@Service/@Repository/@Autowired

请求相关：@GetMapping/@PostMapping/@RequestBody/@CrossOrigin(跨域)

校验相关：@Valid/@NotBlank/@Gender（自定义）

异常相关：@RestControllerAdvice/@ExceptionHandler

配置/拦截器：@Configuration/@Component

其他：@SpringBootApplication/@Transactional/@Data
