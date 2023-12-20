---
lang: zh-CN
title: 使用Rust创建简单的HTTP服务器
description: 使用Rust创建简单的HTTP服务器
date: 2023-12-20
permalinkPattern: :year/:slug.html
editLink: false
lastUpdated: true
category: Rust CookBook
tags:
  - "Rust"
coverImg: ""
---

让我们使用`Rust`创建一个简单的`HTTP`服务器。

## 创建一个简单的`HTTP`服务器

首先想一下，创建一个服务器需要哪些步骤？

1. 监听一个端口
2. 接受连接，获取请求的数据流
3. 解析请求
4. 根据路由规则，处理请求
5. 返回响应

### 监听端口

监听端口，可以使用`std::net::TcpListener`，它是一个`TCP`监听器，可以监听`TCP`连接请求。

```rust
let listener = TcpListener::bind("127.0.0.1:7878").unwrap();
```
在这里，我们绑定了ip地址和端口。`bind`方法返回一个`Result`，如果绑定成功，就会返回一个`TcpListener`实例，否则返回一个错误。这里我们使用`unwrap`方法，如果绑定失败，就直接退出程序。

### 接受连接，获取请求的数据流

要获取请求的数据流，需要用到`TcpStream`。它也是`net`包中的实体。

我们在一个`for`循环中，不断接受从`TcpListener`实例中发来端口连接，获取请求的数据流。

```rust
for stream in listener.incoming() {
    let stream = stream.unwrap();
    println!("Connection established!");
}
```

现在，服务器就已经启动。并能够获取到链接和数据。

### 解析请求

获取到链接和数据，肯定还需要解析处理。读取数据流，需要用到`BufReader`。

通过使用 `BufReader` 和 `BufWriter`，可以进行缓冲读取和写入数据，以提高读写性能。这对于处理大量数据或进行网络通信等场景非常有用。
要使用`BufReader`，首先需要导入。

```rust
use std::io::{ prelude::*, BufReader };

```

### 根据路由规则，处理请求

现在我们就可以读取到客户端发来的http请求信息了。按照HTTP和TCP协议的定义，解析请求的数据流，就可以得到请求的方法、路径、协议版本、请求头和请求体等信息。

根据解析到的路径，我们就能进行路由处理。根据路由规则，进行不同的响应。

### 返回响应

最后，我们需要按照HTTP协议的定义，返回响应。响应的数据流，也需要使用`TcpStream`的`write_all`进行缓冲写入。

### 完整代码

:::: code-group

::: code-group-item 目录设置
```
/src
  ├── main.rs
/templates
  ├── 404.html
  ├── index.html
Cargo.html
```
:::

::: code-group-item main.rs
```rust
use std::{ 
    io::{ prelude::*, BufReader }, 
    fs, 
    net::{TcpListener, TcpStream} 
};

fn main() {
    let listener = TcpListener::bind("127.0.0.1:7878").unwrap();
    for stream in listener.incoming() {
        let stream = stream.unwrap();
        println!("Connection established!");
        handle_connection(stream);
    }
}

fn handle_connection(mut stream: TcpStream) {
    let buf_reader = BufReader::new(&stream);

    let request_line = buf_reader.lines().next().unwrap().unwrap();

    let (status_line, filename) = if request_line == "GET / HTTP/1.1" {
        ("HTTP/1.1 200 OK", "./templates/index.html")
    } else {
        ("HTTP/1.1 404 NOT FOUND", "./templates/404.html")
    };

    let contents = fs::read_to_string(filename).unwrap();
    let length = contents.len();
    let response = format!("{status_line}\r\nContent-Type: text/html\r\nContent-Length: {length}\r\n\r\n{contents}");
    stream.write_all(response.as_bytes()).unwrap();
}

```
:::

::: code-group-item index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello!</title>
</head>
<body>
    <h1>Hello!</h1>
    <p>Hi from Rust</p>
</body>
</html>
```
:::

::: code-group-item 404.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 Not Found</title>
</head>
<body>
    <h1>404 Not Found</h1>
</body>
</html>
```
:::

::::
