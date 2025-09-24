---
lang: zh-CN
title: 学习如何使用duckdb 1.1—— duckdb-rs中的query_map()和query_and_then()
description: duckdb的rust库中的api，query_map()和query_and_then()的区别
date: 2025-9-24
permalinkPattern: :year/:slug.html
editLink: false
lastUpdated: true
category: Database Development
tags:
  - "Database"
  - "DuckDB"
coverImg: ""
---

::: warning
这篇文章的例子，全部使用AI生成，仅供参考。
:::

在`DuckDB`的`Rust`库中，`Statement`结构体中的实例方法`query()`、`query_map()` 和 `query_and_then()` 都是用于执行 SQL 查询的方法，它们在错误处理和结果转换方面有不同的设计。

## 三个方法介绍

### `query()`

这是最基础的查询方法，直接执行 SQL 并返回结果。

```rust
use duckdb::{Connection, Result};

fn basic_query() -> Result<()> {
    let conn = Connection::open_in_memory()?;
    
    // 创建测试表
    conn.execute("CREATE TABLE users (id INTEGER, name TEXT)", [])?;
    
    // 使用 query() 方法
    let mut stmt = conn.prepare("SELECT id, name FROM users")?;
    let mut rows = stmt.query([])?;
    
    while let Some(row) = rows.next()? {
        let id: i32 = row.get(0)?;
        let name: String = row.get(1)?;
        println!("User: id={}, name={}", id, name);
    }
    
    Ok(())
}
```

### `query_map()`

用于在查询时对每一行进行映射转换，自动处理行的迭代。

```rust
use duckdb::{Connection, Result, params};

fn query_map_example() -> Result<()> {
    let conn = Connection::open_in_memory()?;
    conn.execute("CREATE TABLE products (id INTEGER, name TEXT, price REAL)", [])?;
    
    // 插入测试数据
    conn.execute("INSERT INTO products VALUES (1, 'Apple', 1.5), (2, 'Banana', 0.8)", [])?;
    
    // 使用 query_map() - 自动处理行迭代和错误
    let products: Result<Vec<(i32, String, f64)>> = conn
        .query_map("SELECT id, name, price FROM products", [], |row| {
            Ok((row.get(0)?, row.get(1)?, row.get(2)?))
        })
        .and_then(|rows| rows.collect());
    
    for product in products? {
        println!("Product: {:?}", product);
    }
    
    Ok(())
}
```

### `query_and_then()`

与`query_map()`类似，但允许在闭包中返回`Result`类型，提供更灵活的错误处理。

```rust
use duckdb::{Connection, Result, params};
use std::collections::HashMap;

#[derive(Debug)]
struct Product {
    id: i32,
    name: String,
    price: f64,
}

fn query_and_then_example() -> Result<()> {
    let conn = Connection::open_in_memory()?;
    conn.execute("CREATE TABLE products (id INTEGER, name TEXT, price REAL)", [])?;
    
    conn.execute("INSERT INTO products VALUES (1, 'Apple', 1.5), (2, 'Banana', 0.8)", [])?;
    
    // 使用 query_and_then() - 闭包可以返回 Result
    let products: Result<Vec<Product>> = conn
        .query_and_then("SELECT id, name, price FROM products", [], |row| {
            let id: i32 = row.get(0)?;
            let name: String = row.get(1)?;
            let price: f64 = row.get(2)?;
            
            // 可以在这里添加业务逻辑验证
            if price < 0.0 {
                return Err(duckdb::Error::ApiError("Price cannot be negative".into()));
            }
            
            Ok(Product { id, name, price })
        })
        .and_then(|rows| rows.collect());
    
    match products {
        Ok(products) => {
            for product in products {
                println!("Product: {:?}", product);
            }
        }
        Err(e) => println!("Error: {}", e),
    }
    
    Ok(())
}
```

### 实际应用示例

```rust
use duckdb::{Connection, Result};

fn compare_methods() -> Result<()> {
    let conn = Connection::open_in_memory()?;
    conn.execute("CREATE TABLE items (id INTEGER, value TEXT)", [])?;
    conn.execute("INSERT INTO items VALUES (1, 'hello'), (2, 'world')", [])?;
    
    // 方法1: 使用 query() - 最灵活
    println!("=== Using query() ===");
    let mut stmt = conn.prepare("SELECT id, value FROM items")?;
    let mut rows = stmt.query([])?;
    while let Some(row) = rows.next()? {
        let id: i32 = row.get(0)?;
        let value: String = row.get(1)?;
        println!("id: {}, value: {}", id, value);
    }
    
    // 方法2: 使用 query_map() - 更简洁
    println!("=== Using query_map() ===");
    let items: Result<Vec<(i32, String)>> = conn
        .query_map("SELECT id, value FROM items", [], |row| {
            Ok((row.get(0)?, row.get(1)?))
        })
        .and_then(|rows| rows.collect());
    
    for (id, value) in items? {
        println!("id: {}, value: {}", id, value);
    }
    
    // 方法3: 使用 query_and_then() - 错误处理最强
    println!("=== Using query_and_then() ===");
    let result: Result<Vec<String>> = conn
        .query_and_then("SELECT value FROM items", [], |row| {
            let value: String = row.get(0)?;
            if value.len() > 10 {
                Err(duckdb::Error::ApiError("Value too long".into()))
            } else {
                Ok(value.to_uppercase())
            }
        })
        .and_then(|rows| rows.collect());
    
    match result {
        Ok(values) => println!("Values: {:?}", values),
        Err(e) => println!("Error: {}", e),
    }
    
    Ok(())
}
```
选择哪个方法取决于你的具体需求：

- 需要最大控制权时用 `query()`
- 简单的行到值映射用 `query_map()`
- 需要复杂错误处理时用 `query_and_then()`

## `query_map()`与`query_and_then()`的区别

### `query_map()` 的闭包签名

```rust{8}
pub fn query_map<T, P, F>(
    &mut self,
    params: P,
    f: F,
) -> Result<MappedRows<'_, F>>
where
    P: Params,
    F: FnMut(&Row<'_>) -> Result<T>,
```

### `query_and_then()` 的闭包签名

```rust{9}
pub fn query_and_then<T, E, P, F>(
    &mut self,
    params: P,
    f: F,
) -> Result<AndThenRows<'_, F>>
where
    P: Params,
    E: From<Error>,
    F: FnMut(&Row<'_>) -> Result<T, E>,
```

### 对比实例

`query_map()` 的限制

```rust
use duckdb::{Connection, Result};

fn query_map_limitation() -> Result<()> {
    let conn = Connection::open_in_memory()?;
    conn.execute("CREATE TABLE products (id INTEGER, name TEXT, price REAL)", [])?;
    conn.execute("INSERT INTO products VALUES (1, 'Apple', 1.5), (2, 'Banana', -0.8)", [])?;
    
    // 这行代码会编译错误！
    let result = conn.query_map("SELECT id, name, price FROM products", [], |row| {
        let price: f64 = row.get(2)?;
        
        // 无法在 query_map 中返回 Result
        if price < 0.0 {
            // 编译错误：类型不匹配，期望 f64，找到 Result<f64, Error>
            return Err(duckdb::Error::ApiError("Negative price".into()));
        }
        
        Ok(price) // 这里 Ok() 实际上被解包了
    });
    
    Ok(())
}
```

`query_and_then()` 的灵活性

```rust
fn query_and_then_flexibility() -> Result<()> {
    let conn = Connection::open_in_memory()?;
    conn.execute("CREATE TABLE products (id INTEGER, name TEXT, price REAL)", [])?;
    conn.execute("INSERT INTO products VALUES (1, 'Apple', 1.5), (2, 'Banana', -0.8)", [])?;
    
    // 这在 query_and_then() 中是允许的
    let result: Result<Vec<f64>> = conn
        .query_and_then("SELECT price FROM products", [], |row| {
            let price: f64 = row.get(0)?;
            
            // 可以在闭包内部返回 Result！
            if price < 0.0 {
                return Err(duckdb::Error::ApiError("Negative price not allowed".into()));
            }
            
            Ok(price) // 返回 Result<f64, Error>
        })
        .and_then(|rows| rows.collect());
    
    match result {
        Ok(prices) => println!("Valid prices: {:?}", prices),
        Err(e) => println!("Error: {}", e), // 会捕获到 "Negative price not allowed"
    }
    
    Ok(())
}
```

来看一个实际例子对比

```rust
use duckdb::{Connection, Result};

fn demonstrate_difference() -> Result<()> {
    let conn = Connection::open_in_memory()?;
    conn.execute("CREATE TABLE data (id INTEGER, value INTEGER)", [])?;
    conn.execute("INSERT INTO data VALUES (1, 100), (2, 200), (3, 0)", [])?;
    
    // 场景：计算 1000/value，需要处理除零错误
    
    // 方法1: query_map() - 无法在映射过程中返回错误
    println!("=== query_map() ===");
    let values_map: Result<Vec<f64>> = conn
        .query_map("SELECT value FROM data", [], |row| {
            let value: i32 = row.get(0)?;
            // 只能 panic 或返回默认值，无法优雅地传播错误
            if value == 0 {
                // 不好的做法：panic 或返回特殊值
                f64::INFINITY
            } else {
                1000.0 / value as f64
            }
        })
        .and_then(|rows| rows.collect());
    
    println!("query_map result: {:?}", values_map?);
    
    // 方法2: query_and_then() - 可以优雅地处理错误
    println!("=== query_and_then() ===");
    let values_then: Result<Vec<f64>> = conn
        .query_and_then("SELECT value FROM data", [], |row| {
            let value: i32 = row.get(0)?;
            
            if value == 0 {
                // 可以返回错误，会传播到外层 Result
                Err(duckdb::Error::ApiError("Division by zero".into()))
            } else {
                Ok(1000.0 / value as f64)
            }
        })
        .and_then(|rows| rows.collect());
    
    match values_then {
        Ok(values) => println!("Success: {:?}", values),
        Err(e) => println!("Error caught: {}", e), // 会在这里捕获除零错误
    }
    
    Ok(())
}
```

#### 什么时候用什么？

使用 query_map() 当：
- 转换过程不会失败
- 失败时可以使用默认值继续处理
- 只需要简单的值转换

```rust
// 适合 query_map() 的场景
let names: Result<Vec<String>> = conn
    .query_map("SELECT name FROM users", [], |row| {
        // 只是提取字段，不会失败
        row.get(0).unwrap() // 可以安全使用 unwrap()
    })
    .and_then(|rows| rows.collect());
```

使用 query_and_then() 当：
- 转换过程可能失败且需要传播错误
- 需要数据验证逻辑
- 有复杂的业务规则检查

```rust
// 适合 query_and_then() 的场景
let valid_users: Result<Vec<User>> = conn
    .query_and_then("SELECT age, email FROM users", [], |row| {
        let age: i32 = row.get(0)?;
        let email: String = row.get(1)?;
        
        // 业务逻辑验证
        if age < 0 || age > 150 {
            return Err(duckdb::Error::ApiError("Invalid age".into()));
        }
        if !email.contains('@') {
            return Err(duckdb::Error::ApiError("Invalid email".into()));
        }
        
        Ok(User { age, email })
    })
    .and_then(|rows| rows.collect());
```

## 更详细的对比

### `query_map()` - 错误会立即终止

```rust
use duckdb::{Connection, Result};

fn query_map_behavior() -> Result<()> {
    let conn = Connection::open_in_memory()?;
    conn.execute("CREATE TABLE test (id INTEGER, value TEXT)", [])?;
    conn.execute("INSERT INTO test VALUES (1, 'a'), (2, 'b'), (3, 'c')", [])?;
    
    let result: Result<Vec<String>> = conn
        .query_map("SELECT value FROM test ORDER BY id", [], |row| {
            let value: String = row.get(0)?; // 如果这里出错，整个查询立即失败
            Ok(value.to_uppercase())
        })
        .and_then(|iter| iter.collect());
    
    // 如果任何一行的 row.get() 失败，整个 result 就是 Err
    match result {
        Ok(values) => println!("All values: {:?}", values), // 成功获取所有行
        Err(e) => println!("Failed at first error: {}", e), // 某行失败就整个失败
    }
    
    Ok(())
}
```

### `query_and_then()` - 错误会传播但可以逐个处理

```rust
fn query_and_then_behavior() -> Result<()> {
    let conn = Connection::open_in_memory()?;
    conn.execute("CREATE TABLE test (id INTEGER, value TEXT)", [])?;
    conn.execute("INSERT INTO test VALUES (1, 'a'), (2, 'error'), (3, 'c')", [])?;
    
    let result: Result<Vec<String>> = conn
        .query_and_then("SELECT value FROM test ORDER BY id", [], |row| {
            let value: String = row.get(0)?;
            
            // 自定义业务逻辑错误
            if value == "error" {
                return Err(duckdb::Error::ApiError("Business logic error".into()));
            }
            
            Ok(value.to_uppercase())
        })
        .and_then(|iter| {
            // 这里可以逐个处理结果，决定如何聚合错误
            let mut successes = Vec::new();
            for item in iter {
                match item {
                    Ok(value) => successes.push(value),
                    Err(e) => {
                        println!("Skipping row due to error: {}", e);
                        // 可以继续处理后续行，而不是立即返回
                    }
                }
            }
            Ok(successes)
        });
    
    match result {
        Ok(values) => println!("Processed values: {:?}", values), // 可能只包含成功的行
        Err(e) => println!("Overall failure: {}", e),
    }
    
    Ok(())
}
```

### 更精确的区别

`query_map()`的错误处理

```rust
// 伪代码展示 query_map 的行为
fn query_map_behavior() -> Result<Vec<T>> {
    let rows = execute_query()?; // 查询失败立即返回
    
    let mut results = Vec::new();
    for row in rows {
        // 如果任何一行的闭包执行失败，整个函数立即返回错误
        let value = closure(row)?; // 这个 ? 是关键！
        results.push(value);
    }
    Ok(results)
}
```

`query_and_then()`的错误处理

```rust
// 伪代码展示 query_and_then 的行为
fn query_and_then_behavior() -> Result<Vec<T>> {
    let rows = execute_query()?; // 查询失败立即返回
    
    let mut results = Vec::new();
    for row in rows {
        // 闭包返回 Result，调用者决定如何处理每个错误
        match closure(row) {
            Ok(value) => results.push(value),
            Err(e) => {
                // 调用者可以选择：立即返回、跳过、记录等
                return Err(e); // 或者继续处理下一行
            }
        }
    }
    Ok(results)
}
```

```rust
use duckdb::{Connection, Result};

fn partial_processing() -> Result<()> {
    let conn = Connection::open_in_memory()?;
    conn.execute("CREATE TABLE numbers (id INTEGER, value INTEGER)", [])?;
    conn.execute("INSERT INTO numbers VALUES (1, 10), (2, 0), (3, 20), (4, 0), (5, 30)", [])?;
    
    println!("=== query_and_then with partial processing ===");
    
    let processed: Result<Vec<f64>> = conn
        .query_and_then("SELECT value FROM numbers ORDER BY id", [], |row| {
            let value: i32 = row.get(0)?;
            
            if value == 0 {
                Err(duckdb::Error::ApiError("Division by zero".into()))
            } else {
                Ok(100.0 / value as f64)
            }
        })
        .and_then(|iter| {
            // 灵活处理：跳过错误，只收集成功的结果
            let mut valid_results = Vec::new();
            let mut errors = Vec::new();
            
            for result in iter {
                match result {
                    Ok(value) => valid_results.push(value),
                    Err(e) => {
                        errors.push(e);
                        println!("Skipping invalid value");
                    }
                }
            }
            
            if !errors.is_empty() {
                println!("Encountered {} errors, but processed {} valid values", 
                        errors.len(), valid_results.len());
            }
            
            Ok(valid_results)
        });
    
    println!("Final result: {:?}", processed?);
    Ok(())
}
```

```rust
use duckdb::{Connection, Result};

fn correct_understanding() -> Result<()> {
    let conn = Connection::open_in_memory()?;
    conn.execute("CREATE TABLE test (id INTEGER, data TEXT)", [])?;
    conn.execute("INSERT INTO test VALUES (1, 'ok'), (2, 'error'), (3, 'also ok')", [])?;
    
    // query_map(): 在第二行会立即整体失败
    let map_result: Result<Vec<String>> = conn
        .query_map("SELECT data FROM test ORDER BY id", [], |row| {
            let data: String = row.get(0)?;
            if data == "error" {
                // 这里无法优雅处理，整个操作会失败
                "forced continuation".to_string() // 只能继续
            } else {
                format!("Processed: {}", data)
            }
        })
        .and_then(|iter| iter.collect());
    // map_result: 要么全部成功，要么整体失败
    
    // query_and_then(): 会处理所有行，返回每行的结果
    let then_iterator_result: Result<Vec<Result<String>>> = conn
        .query_and_then("SELECT data FROM test ORDER BY id", [], |row| {
            let data: String = row.get(0)?;
            if data == "error" {
                Err("Business logic error".into()) // 这行失败，但后续继续
            } else {
                Ok(format!("Processed: {}", data)
            }
        })
        .and_then(|iter| iter.collect());
    // then_iterator_result 包含三行的独立结果
    
    Ok(())
}
```

## 总结

- `query_map()` 错误会导致立即整体失败（全有或全无，错误立即终止）
- `query_and_then()` 不会因单行错误而停止迭代，需要手动处理（逐行处理，错误不终止迭代，但需要手动处理每行结果）

