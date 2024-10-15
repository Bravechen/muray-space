---
lang: zh-CN
title: 如何使用axcum框架开发web服务--01
description: 介绍了使用axcum框架开发web服务的基本步骤
date: 2024-9-21
permalinkPattern: :year/:slug.html
editLink: false
lastUpdated: true
category: Rust Development
tags:
  - "Rust"
  - "Axum"
  - "service development"
coverImg: ""
---

## 跨域

在Axum框架中设置允许跨域访问（CORS）的方法如下：

1. 首先，需要添加`tower-http`crate的`cors`特性。在`Cargo.toml`中添加：

```toml
tower-http = { version = "0.4", features = ["cors"] }
```

2. 然后，在你的服务器代码中，需要导入相关模块并设置CORS中间件。以下是如何修改你的`server.rs`文件：

```rust:src/bin/dev2-static-server/server.rs
use axum::{
    // ... 其他导入 ...
    Router,
};
use tower_http::cors::{Any, CorsLayer};
// ... 其他导入 ...

// ... 现有代码 ...

/// 注册静态文件目录
fn register_static_dirs(ary: Vec<(String, String)>) -> Router {
    let mut router = Router::new();

    // 设置CORS
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    for (route, dir) in ary {
        let serve_dir = ServeDir::new(dir);
        let service = handle_404.into_service();
        router = router
            .nest_service(route.as_str(), serve_dir)
            .fallback_service(service);
    }

    // 应用CORS中间件
    router.layer(cors)
}

// ... 其他代码 ...
```

这个配置允许所有来源、所有HTTP方法和所有头部。在生产环境中，你可能需要更严格的设置。

解释：

1. 我们导入了`tower_http::cors`模块。
2. 在`register_static_dirs`函数中，我们创建了一个`CorsLayer`实例，允许任何来源、方法和头部。
3. 最后，我们使用`.layer(cors)`将CORS中间件应用到整个路由器。

这样设置后，你的Axum服务器将允许来自任何源的跨域请求。请注意，这是一个非常宽松的CORS配置，适合开发环境。在生产环境中，你可能需要更具体地指定允许的源、方法和头部，以增加安全性。

---

要配置指定某个域名可以跨域访问当前服务器，您可以修改 CORS 设置。以下是如何实现这一点：

```rust:src/bin/dev2-static-server/server.rs
use axum::{
    // ... 其他导入 ...
    Router,
};
use tower_http::cors::{CorsLayer, Origin};
use http::HeaderName;
// ... 其他导入 ...

// ... 现有代码 ...

/// 注册静态文件目录
fn register_static_dirs(ary: Vec<(String, String)>) -> Router {
    let mut router = Router::new();

    // 设置CORS
    let cors = CorsLayer::new()
        .allow_origin(Origin::exact("http://example.com".parse().unwrap()))
        .allow_methods([http::Method::GET, http::Method::POST]) // 根据需要调整
        .allow_headers([HeaderName::from_static("content-type")]);

    for (route, dir) in ary {
        // ... 现有代码 ...
    }

    // 应用CORS中间件
    router.layer(cors)
}

// ... 其他代码 ...
```

这个配置做了以下更改：

1. 使用 `Origin::exact()` 指定了允许跨域访问的具体域名（在这个例子中是 "http://example.com"）。
2. 限制了允许的 HTTP 方法（这里只允许 GET 和 POST）。
3. 限制了允许的请求头（这里只允许 "content-type" 头）。

您可以根据实际需求调整这些设置。例如，如果需要允许多个域名，可以这样做：

```rust
.allow_origin([
    "http://example1.com".parse().unwrap(),
    "http://example2.com".parse().unwrap(),
])
```

或者如果需要在运行时动态设置允许的域名，可以使用环境变量或配置文件来实现。

请记住，这种配置更安全，因为它限制了可以访问您服务器的域名。在部署到生产环境时，请确保仔细检查和测试您的 CORS 设置，以确保它们符合您的安全要求。
