---
title: Servlet  
published: 2026-03-31  
description: 'javaweb入门必学之Servlet'  
image: '/images/sagiri/12.png'  
tags: [java,Servlet]  
category: 'java'  
draft: false 
lang: ''
---

# Servlet

## 1.Http

### 1.1Http协议的特点

1. 支持客户/服务端模式

2. **简单快速**:客户向服务器请求服务时，只需传送**请求方法**和**路径**。请求方法常用的有GET、POST。每种方法规定了客户与服务器联系的类型不同。由于HTTP协议简单，使得HTTP服务器的程序规模小，因而通信速度很快。

3. **灵活**:HTTP允许传输任意类型的数据对象。传输的类型由Content-Type加以标记。

4. **无连接**:无连接是表示每次连接只处理一个请求。服务器处理完客户的请求，并收到客户的应答后，即断开连接。采用这种方式可以节省传输时间。
   **HTTP1.1版本**后支持**可持续连接**。通过这种连接,就有可能在建立一个TCP连接后,发送请求并得到回应，然后发送更多的请求并得到更多的回应.通过把建立和释放TCP连接的开销分摊到多个请求上，则对于每个请求而言，由于TCP而造成的相对开销被大大地降低了。而且，还可以发送流水线请求,也就是说在发送请求1之后的回应到来之前就可以发送请求2 也可以认为一次连接发送多个请求，由客户机确认是否关闭连接，而服务器会认为这些请求分别来自不同的客户端。

5. 无状态:HTTP协议是无状态协议。无状态是指协议对于事务处理没有**记忆**能力。缺少状态意味着如果后续处理需要前面的信息，则它必须重传，这样可能导致每次连接传送的数据量增大。另一方面，在服务器不需要先前信息时它的应答就较快。

### 1.2 Http请求

由三大部分组成: 请求头,请求行,请求正文(get没有 post有)

请求行又分为 请求方式 请求路径 请求协议版本

#### 1.3 HTTP响应

也有三大部分组成:状态行,消息报头,响应正文

#### 1.4 消息头

**请求头**

- Referer 指明请求从哪来 比如从a页面到b页面 那b页面那热referer就会显示a页面的地址

**响应头**

- Location  用于重定向 比如com域名过期了重定向到cn域名

- Refresh 用于自动跳转 自动刷新啥的
  
  

## 2.Tomcat服务器

Tomcat服务器是一个免费的开放源代码的Web应用服务器，属于轻量级应用服务器.在中小型系统和并发访问用户不是很多的场合被普遍使用



## 3.Servlet

### 3.1 Servlet的实现

1. 创建普通Java类

2. 实现Servlet的规范，extends继承HttpServlet类

3. 重写service方法，用来处理请求

4. 设置注解@WebServlet，指定访问的路径

```java
eg:
@WebServlet("/ser01")
@WebServlet(name ="Servlet01",value = "/ser01")
@WebServlet(name = "Servlet01",value = {"/ser01","/ser001"})
value 也可以换成 urlPatterns
```

### 3.2 Servlet的生命周期

Servlet的生命周期，简单的概括这就分为四步:servlet类加载-->实例化-->服务-->销毁。

## 4. HttpServletRequest对象

### 4.1 接受请求

#### 4.1.1 常用方法

- getRequestURL()    获取客户端发出请求时的完整URL

- getRequestURI()    获取请求行中的资源名称部分(项目名称开始)

- getRequestURI()    获取请求行中的资源名称部分(项目名称开始)

- getMethod()    获取客户端请求方式

- getProtocol()    获取HTTP版本号

- getContextPath()     获取 webapp名字
  
  ```java
  //获取客户端请求的完整URL (从http开始，到?前面结束)
  String url = request.getRequestURL.toString();
  System.out.println("获取客户端请求的完整uRL:"+url);
  // 获取客户端请求的部分URL(从站点名开始，到?前面结束)
  String uri = request.getRequestURI();
  System.out.println("获取客户端请求的部分URL:"+uri);
  //获取请求行中的参数部分
  String querystring = request.getQueryString();
  System.out.println("获取请求行中的参数部分:"+ queryString);
  // 获取客户端的请求方式
  String method = request.getMethod();
  System.out.println("获取客户端的请求方式:"+method);
  //获取HTTP版本号
  String protocol = request.getProtocol();
  
  ```

#### 4.1.2 获取请求参数

- getParameter(name) 获取指定名称的参数

- getParameterValues(String name)      获取指定名称参数的所有值

```java
//获取指定名称的参数，返回字符串
String uname = request.getParameter("uname");
System.out.println("uname的参数值:"+ uname);
//获取指定名称参数的所有参数值，返回数组
String[] hobbys = request.getParameterValues("hobby");
System.out.println("获取指定名称参数的所有参数值:"+ Arrays.toString(hobbys));
```

### 4.2 请求乱码问题

默认Get方法不会出现乱码 但是Post方法会有 如何解决?

通过在获取参数之前,设置服务器解析编码的格式即可

```java
request.setCharacterEncoding("UTF-8");
```

### 4.3 请求转发

是一种**服务器的行为**,可以让请求从服务端跳转到客户端 (或指定Servlet)

**特点**:

1. 服务端行为

2. 地址栏不发生改变

3. 从始至终只有一个**请求**因为是传递request和response

4. request数据是**共享**的 原因同上

```java
//请求转发跳转到Servlet04
request.getRequestDispatcher("s04").forward(request,response);
//请求转发跳转到jsp页面
request.getRequestDispatcher("login.jsp").forward(request, response);

```



### 4.4 request作用域

通过该对象可以在一个请求中传递数据 作用范围:在一次请求中有效,即服务器跳转有效

```java
//设置域对象内容
request.setAttribute(String name, Object value);//这个value其实是Object对象
//获取域对象内容
request.getAttribute(String name);
//删除域对象内容
request.removeAttribute(String name);
```

request域对象中的数据在一次请求中有效，则经过请求转发，request域中的数据依然存在，则在请求转发的过程中可以通过request来传输/共享数据。



## 5.HttpServletResponse对象

### 5.1 响应数据

响应数据时需要获取输出流 有以下两种形式

        getWriter() 获取字符流

        getOutputStream() 获取字节流

> 两者不能同时使用 因为响应只能响应一次

```java
//字符输出流
Printwriter writer = response.getwriter();
writer.write("Hello");
writer.write("<h2>Hello</h2>");
//字节输出流
ServletoutputStream out = response.getoutputstream();
out.write("Hello".getBytes());
out.write("<h2>Hello</h2>".getBytes();
```

### 5.2 响应乱码问题

    在响应中，如果我们响应的内容中含有中文，则有可能出现乱码。这是因为服务器响应的数据也会经过网络传输，服务器端有一种编码方式，在客户端也存在一种编码方式，当两端使用的编码方式不同时则出现乱码。

    **解决字符乱码**  字符流字节流都一样 

```java
//单独设置服务端的编码
response.setcharacterEncoding("uTF-8");
//单独设置客户端的响应类型及编码
response.setHeader("content-type","text/html;charset=UTF-8");
// 同时设置客户端和服务端的编码格式
response.setContentType("text/html;charset=UTF-8");
//得到字符输出流
Printwriter writer = response.getwriter();
writer.write("<h2>你好</h2>");
```

一句话: **就是要保证发送端与接收端的编码一致** 字符流字节流两种都要设置

### 5.3 重定向

- 服务端指导，客户端行为

- 存在两次请求

- 地址栏会发生改变

- request对象不共享

```java
//重定向到Servlet05
response.sendRedirect("s05");
```

### 5.4 请求转发与重定向区别

| 请求转发（`req.getRequestDispatcher().forward()`） | 重定向（`resp.sendRedirect()`） |
| -------------------------------------------- | -------------------------- |
| 一次请求，数据在 request 域中共享                        | 两次请求，request 域中数据不共享       |
| 服务器端行为                                       | 客户端行为                      |
| 地址栏不发生变化                                     | 地址栏发生变化                    |
| 绝对地址定位到站点后                                   | 绝对地址可写到 http://://         |



## 6.Cookie对象

        Cookie是浏览器提供的一种技术，通过服务器的程序能将一些只须保存在客户端，或者在客户端进行处理的数据，放在本地的计算机上，不需要通过网络传输，因而提高网页处理的效率，并且能够减少服务器的负载，但是由于Cookie是服务器端保存在客户端的信息，所以其安全性也是很差的。例如常见的记住密码则可以通过Cookie来实现有一个专门操作Cookie的类j**avax.servlet.http.Cookie。**随着服务器端的响应发送给客户端，保存在浏览器。当下次再访问服务器时把Cookie再带回服务器。

### 6.1 Cookie的创建和发送

```java
//创建Cookie对象
Cookie cookie = new Cookie("uname","zhangsan");
//发送cookie对象
response.addcookie(cookie);
```

### 6.2 Cookie的获取

在服务器端只提供了一个getCookies()的方法用来获取客户端回传的所有cookie组成的一个数组，如果需要获取单个cookie 则需要通过遍历，getName()获取Cookie 的名称，getValue()获取Cookie 的值。

```java
//获取cookie数组
Cookie[] cookies = request.getcookies();
//判断数组是否为空
if (cookies != null && cookies.length > 0) {
//遍历cookie数组
    for (cookie cookie : cookies){
        System.out.println(cookie.getName());
        System.out.println(cookie.getvalue());
        }
    }
```

### 6.3 Cookie设置到期时间

```java
Cookie cookie = new Cookie("uname","zhangsan");
cookie.setMaxAge(30);
```

括号内有三种填法

- 负整数(默认) 关闭浏览器后自动删除

- 零 直接删除

- 正整数 xx秒后删除 会存储Cookie到硬盘中

### 6.4 Cookie的注意点

1. Cookie中不能存中文(其实是不建议 也很少存)

2. 服务端发送重复的Cookie会覆盖原有的Cookie

### 6.5 Cookie的路径

Cookie的setPath设置cookie的路径，这个路径直接决定服务器的请求是否会从浏览器中加载某些cookie

只有在setPath()里的指定路径才能进行访问Cookie

> 设置路径为"/”，表示在当前服务器下任何项目都可访问到Cookie对象



## 7.Session对象

```java
//获取Session对象
HttpSession session = req.getSession();

System.out.println(session.getId());
```

### 7.1 JSESSIONID标识符

        Session 用于标识客户端与服务器之间的一次会话，而区分不同会话的关键，就是每个会话独有的**sessionId**。当客户端请求到达服务器并使用会话时，服务器会先检查请求中是否携带名为 **JSESSIONID** 的 Cookie：

1.若未携带 JSESSIONID，服务器判定为**新会话**，会创建新的 Session 对象，并生成唯一 sessionId 作为会话标识；

2.若携带 JSESSIONID，服务器会根据该 ID 查找对应的 Session 对象：找到则复用该 Session 实现数据共享，未找到则仍视为新会话并重新创建。

所以 JSESSIONID 是一个特殊 Cookie：当客户端访问 Session 时，服务器会自动生成该 Cookie，其值为当前 sessionId，并在响应时返回给客户端，默认有效期至浏览器关闭。因此，**Session 底层依赖 Cookie 实现会话跟踪**，依靠 JSESSIONID 来维持客户端与服务器之间的会话关联。

### 7.2 Session域对象

    Session用来表示一次会话，在一次会话中数据是可以**共享**的，这时session作为域对象存在，可以通过setAttribute(name,value)方法向域对象中添加数据，通过getAttribute(name) 从域对象中获取数据，通过removeAttribute(name)从域对象中移除数据。

| 域对象         | 作用范围     | 生命周期     | 适用场景     |
|:----------- | -------- | -------- | -------- |
| **Request** | 一次**请求** | 请求转发内有效  | 单次请求内传参  |
| **Session** | 一次**会话** | 浏览器打开到关闭 | 登录状态、购物车 |

### 7.3 Session销毁

```java
// 手动销毁Session
session.invalidate();
// 设置Session超时时间（秒）
session.setMaxInactiveInterval(1800);
```



## 8.ServletContext对象

**ServletContext** 是**整个 Web 应用的全局域对象**，一个 Web 应用只有一个。代表**当前应用本身**，所有 Servlet、JSP 都共享同一个 ServletContext。

作用：在**整个应用运行期间**实现数据共享。

获取方式:

```java
// 方式1：通过 request
ServletContext context = request.getServletContext();
// 方式2：通过 session
ServletContext context = session.getServletContext();
// 方式3：在 Servlet 中直接获取
ServletContext context = getServletContext();
```

常用方法

```java
// 存数据（全局共享）
context.setAttribute("key", value);
// 取数据
Object value = context.getAttribute("key");

// 删除数据
context.removeAttribute("key");

// 获取项目真实路径
String realPath = context.getRealPath("/");
```

:::tip

生命周期很长 不要存过多数据

:::



## 三大域对象对比

| 域对象                | 作用范围 | 生命周期          | 典型用途       |
| ------------------ | ---- | ------------- | ---------- |
| **request**        | 一次请求 | 请求开始～响应结束     | 一次请求内传参、转发 |
| **session**        | 一次会话 | 浏览器打开～关闭 / 超时 | 登录状态、购物车   |
| **ServletContext** | 整个应用 | 服务器启动～关闭      | 全局统计、公共数据  |

## 9. 文件上传和下载

### 9.1 前台上传代码实现

我们在web文件夹下新创一个upload.html文件

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>文件上传</title>
</head>
<body>

<!--
    文件上传
        1.准备表单
        2.设置表单的提交类型为PoST请求method="post"
        3.设置表单类型为文件上传表单 enctype="multipart/form-data"
        4.设置文件提交的地址
        5.准备表单元素
            1.普通的表单项 type="text"
            2.文件项 type="file"
        6.设置表单元素的name属性位(表单提交一定要设置表单元素的name属性值，否则后台无法接收数据!)
-->
    <form method="post" enctype="multipart/form-data" action="uploadServlet">
        姓名:<input type="text" name="uname"> <br>
        文件:<input type="file" name="myfile"> <br>
        <!--button默认的类型是提交类型type="submit"-->
        <button>提交</button>
    </form>
</body>
</html>
```

### 9.2 上传后台实现

使用注解 @MultipartConfig将一个Servlet 标识为支持文件上传。Servlet 将 multipart/form-data 的POST请求封装成**Part**，通过**Part**对上传的文件进行操作。

```java
@WebServlet("/uploadServlet")//与上面前台action对应
@MultipartConfig
public class UploadServlet extends HttpServlet {
    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("uploading");
        //设置编码格式
        request.setCharacterEncoding("UTF-8");
        //读取表单名字
        String uname = request.getParameter("uname");
        System.out.println("uname:"+uname);
        //读取文件名字 用Part对象
        Part part = request.getPart("myfile");
        String fileName = part.getSubmittedFileName();
        System.out.println("fileName:"+fileName);
        //找路径
        String path = request.getServletContext().getRealPath("/");
        System.out.println("path:"+path);
        //上传到指定路径
        part.write(path + "/" + fileName);

    }
}
```

> 我们最后要访问这个页面是访问/upload.html不是/uploadServlet 

### 9.3 超链接下载

超链接下载
    当使用超链接(a标签)时，如果遇到浏览器能够识别的资源，则会显示内容;如果遇到浏览器不能识别的资源，则会进行下载。

download属性
    通过download属性规定浏览器进行下载。
download 属性可以不写任何信息，会自动使用默认文件名。如果设置了download属性的值，则使用设置的值做为文件名。



```html
<!-- 浏览器能够识别的资源-->
<a hrf="download/test.txt">文本文件</a>
<a href="download/test.png">图片文件</a>
<!--浏览器不能识别的资源-->
<a href="download/test.zip">压缩文件</a><hr>
<a href="download/test.txt"download>文本文件</a>
<a href="download/test.png"download ="Sagiri.png">图片文件</a>

<!--浏览器不能识别的资源-->
<a href="download/test.rar">压缩文件</a>
<hr>
href="download/test.txt">文本文件</a><adownload
<a href="download/bd_logo1.png" download="百度.png">图片文件</a>
```
### 9.4 后台实现下载

download.html 我们创建一个表单 并给一个text框来输入需要下载的文件名 

placeholder是框框中的提示信息

```html
<form action="downloadServlet">
        文件名<input type="text" name="fileName" placeholder="请输入要下载的文件名">
        <button>下载</button>
    </form>
```

来到downloadServlet文件

```java
@WebServlet("/downloadServlet")
public class DownloadServlet extends HttpServlet {
    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response) 
throws ServletException, IOException {

        System.out.println("downloading");
        //设置编码格式
        request.setCharacterEncoding("UTF-8");//请求编码
        response.setContentType("text/html;charset=UTF-8");//响应编码
        //获取参数
        String fileName = request.getParameter("fileName");
        //参数的非空判断
        //trim():去除字符串的前后空格
        if(fileName == null || fileName.trim().equals("")){
            response.getWriter().write("请输入要下载的文件名");
            response.getWriter().close();
            return;
        }

        String filePath = request.getServletContext().getRealPath("/download/");
        //通过路径来得到file
        File file = new File(filePath + fileName);
        //判断file文件是否为标准文件
        if(file.exists() && file.isFile()){
            //设置相应类型 ContentType
            response.setContentType("application/octet-stream");
            //设置响应头 固定格式 改最后一个参数就行
            response.setHeader("Content-Disposition", "attachment; filename=" + fileName);
            //获取输入输出流
            InputStream inputStream = new FileInputStream(file);
            //ServletOutputStream返回请求至浏览器
            ServletOutputStream outputStream = response.getOutputStream();
            //标准读取流程
            byte bytes[] = new byte[1024];
            int len;
            while((len = inputStream.read(bytes)) != -1){
                outputStream.write(bytes,0,len);
            }
            //先开后关
            outputStream.close();
            inputStream.close();
        }
        //不符合条件
        else{
            response.getWriter().write("文件不存在 请重试");
            response.getWriter().close();
        }
    }
}
```

**至此** **已学完Servlet所有课程**

###### 杂谈
下午开完会后再进行Spring框架的学习 预计1号学习完毕 算法就算了不学了
时间有限 算法学习还是挺耗时间的 打比赛啥的就算了 现在所有公司都在找啥ai智能应用开发 
aiagent这块现在是所有想从事后端开发的人员必须学的了 挺加分的 要是能独立写出个Rag项目就很牛逼了
预计4月10号开始学习 我想着外卖写了就去学 腾讯那边的比赛正好需要学习相关内容 说python java golang都可以写
我感觉我就用java写得了... 还有 计算机协会能不能让我进 求你了 吃饭去了好饿.. 
2026.3.31 12.21


