---
lang: zh-CN
title: 学习如何使用duckdb 01
description: 学习使用Rust, python, node.js和go开发duckdb应用
date: 2025-9-18
permalinkPattern: :year/:slug.html
editLink: false
lastUpdated: true
category: Database Development
tags:
  - "Database"
coverImg: ""
---

# 学习使用 duckdb 01

## 安装

### 安装命令行

#### 在 macos 上使用`Homebrew`进行安装

```shell
$ brew install duckdb
```

### 在 rust 项目中进行安装

### 在 python 项目中进行安装

### 在 node.js 项目中进行安装

### 在 go 项目中进行安装

## 创建数据库并进行持久化

duckdb 有两种存储形式：

- 内存形式。在进程退出或关闭计算机后，会被释放。
- 磁盘持久化形式。生成磁盘文件，不会在进程退出或计算机被关闭后被释放。

### 内存形式创建数据库

#### python

直接使用`.sql(query)`方法，或使用无参数的`.connect()`方法，都会在内存中创建 duckdb 数据库。

```python
import duckdb

con = duckdb.connect()
# 或
con.sql("SELECT 42 AS x").show()
```

#### rust

```rust
use duckdb::{params, Connection, Result};

let conn = Connection::open_in_memory()?;

```

### 持久化为磁盘文件

持久化数据库文件，首先需要一个存放数据库文件的路径。数据库的名称可以自定义，最好保持与变量命令相同的习惯。扩展名，可以使用`.db`、`.duckdb`或`.ddb`。还可以不设置扩展名。推荐`.db`或`.duckdb`。

下一步就使用相应的方法，用于连接数据库。如果数据库文件不存在，duckdb 则会创建文件。

#### python

python 中使用`.connect(path)`方法，并传入文件的路径。

```python
import duckdb
import os

def create_db():
    db_path = os.path.join(os.path.dirname(__file__), '..', '..', 'database', 'duckdb', 'my_db1.duckdb')
    with duckdb.connect(db_path) as con:
      # do something
```

在这里我们在相对于当前目录的`../../database/duckdb/`目录中，创建了名为`my_duckdb1.duckdb`的数据库文件。
然后可以使用`with`语句打开数据库，并在操作完成后自动关闭数据库。

如果要手动关闭数据库，需要调用`.close()`方法。

#### rust

在 rust 中，我们使用`Connection`模块中的方法

```rust
use duckdb::{Connection, Result};

fn main() {
  let db_path = std::env::current_dir()
        .expect("无法获取当前目录")
        .join("../../database/duckdb/my_db2.duckdb");

  let con = Connection::open(db_path).expect("无法打开数据库");
}
```

由于 rust 语言的特性和机制，我们需要特别注意处理异常错误。这里我们同样在当前目录的`../../database/duckdb`位置，创建了一个名为`my_db2.duckdb`的数据库。
这里使用的`open()`方法，等同于使用`Connection::open_with_flags(path, Config::default())`。

在 rust 中，数据库连接将在作用域结束时（通过`Drop`）自动关闭底层的数据库连接。
也可以使用`conn.close()`显式关闭连接。
在典型情况下，这两者之间没有太大区别，但如果有错误发生，可以通过`.close()`方法显式关闭。

## 创建数据库表

我们可以通过直接使用`query`的形式创建和操作数据库表。这里我们假设需要创建一个用于存放文章数据的表。
每条文章数据，包含:

- `id` 自增的数值，用于表中的主键
- `title` 字符串类型的文章标题
- `description` 文章的摘要和描述
- `content` 文章的内容
- `art_id` 其他表或数据库中的文章 id

### python

:::: code-group

::: code-group-item main.py

```python
import operation

def main():
    create_db_safe()


if __name__ == "__main__":
    main()
```

:::

::: code-group-item operation.py

```python
import duckdb
import os

def create_db(db_path: str):
    with duckdb.connect(db_path) as con:
        con.sql("DROP TABLE IF EXISTS articles;")
        con.sql("DROP SEQUENCE IF EXISTS seq_article_id;")
        con.sql("CREATE SEQUENCE seq_article_id START 1;")
        con.sql("CREATE TABLE articles (id INTEGER PRIMARY KEY, title TEXT, description TEXT, content TEXT, art_id INTEGER);")
        con.sql(
            """INSERT INTO articles (id, title, description, content, art_id) VALUES (
                nextval('seq_article_id'),
                '学习DuckDB',
                '介绍',
                'DuckDB 是一个高性能的分析型数据库，专为 OLAP 工作负载设计。DuckDB 在 MIT 许可下开源，使其易于采用和扩展，适用于广泛的商业和非商业应用。',
                1
            );"""
        )
        con.sql(
            """INSERT INTO articles (id, title, description, content, art_id) VALUES (
                nextval('seq_article_id'),
                'DuckDB与SQLite对比',
                'DuckDB与SQLite对比有哪些区别',
                'DuckDB 被有意设计来在特定的访问模式下表现良好，你应该确认这些模式适合你的用例。如果你需要一个针对 OLTP 工作负载进行优化的进程内数据库管理系统，那么 SQLite 几乎无法超越。',
                2
            );"""
        )
        con.sql("SELECT * FROM articles;").show()

def create_db_safe():
    """安全地创建数据库表，如果表已存在则不执行任何操作"""
    db_path = os.path.join(os.path.dirname(__file__), '..', '..', 'database', 'duckdb', 'my_db1.duckdb')
    with duckdb.connect(db_path) as con:
        # 检查articles表是否存在
        result = con.sql("SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'articles';").fetchone()

        if result[0] > 0:
            print("articles表已存在，跳过创建操作，展示数据")
            con.sql("SELECT * FROM articles;").show()
            return

        print("articles表不存在，开始创建...")

        create_db(db_path)

```

::::

这里我们创建了一个`articles`表，用于存放文章数据。并且创建了一个序列，用于产生自增 id。

### rust

相对于 python，rust 要稍显麻烦一些，因为我们要考虑到异常处理和变量的生命周期。

```rust
use duckdb::{Connection, Result};

fn main() {
    println!("让我们来学习在Rust中使用DuckDB");

    create_table_safe().expect("无法创建数据库");
}

/// 创建表安全模式
fn create_table_safe() -> Result<()> {
    let db_path = std::env::current_dir()
        .expect("无法获取当前目录")
        .join("../../database/duckdb/my_db2.duckdb");

    let con = Connection::open(db_path).expect("无法打开数据库");

    // 检查表是否存在
    let table_exists = check_table_exists(&con, "articles")?;
    let sequence_exists = check_sequence_exists(&con, "seq_article_id")?;

    if table_exists && sequence_exists {
        return print_db(&con)
    }

    println!("articles表或序列不存在，开始创建...");
    return create_table(&con);
}

/// 创建
fn create_table(con: &Connection) -> Result<()> {

    con.execute_batch(
        r"
            CREATE SEQUENCE IF NOT EXISTS seq_article_id START 100;
            CREATE TABLE IF NOT EXISTS articles (
                id INTEGER PRIMARY KEY,
                title VARCHAR,
                description VARCHAR,
                content TEXT,
                art_id INTEGER
            );
        ",
    )?;

    con.execute(
        r"INSERT INTO articles (id,title, description, content, art_id) VALUES (nextval('seq_article_id'), ?, ?, ?, ?)",
    [
                "学习DuckDB",
                "介绍",
                "DuckDB 是一个高性能的分析型数据库，专为 OLAP 工作负载设计。DuckDB 在 MIT 许可下开源，使其易于采用和扩展，适用于广泛的商业和非商业应用。",
                "1"
            ]
    )?;

    con.execute(
        r"INSERT INTO articles (id,title, description, content, art_id) VALUES (nextval('seq_article_id'), ?, ?, ?, ?)",
        [
            "DuckDB与SQLite对比",
            "DuckDB与SQLite对比有哪些区别",
            "DuckDB 被有意设计来在特定的访问模式下表现良好，你应该确认这些模式适合你的用例。如果你需要一个针对 OLTP 工作负载进行优化的进程内数据库管理系统，那么 SQLite 几乎无法超越。",
            "2"
        ]
    )?;

    return print_db(con);
}

/// 打印数据库
fn print_db(con: &Connection) -> Result<()> {
    println!("articles表和seq_article_id序列已存在，跳过创建操作，展示数据");
    let mut stmt = con.prepare(r"SELECT * FROM articles")?;
    let mut rows = stmt.query([])?;
    while let Some(row) = rows.next()? {
        println!(
            "id: {:?}, title: {:?}, description: {:?}, content: {:?}, art_id: {:?}",
            row.get::<usize, i32>(0),
            row.get::<usize, String>(1),
            row.get::<usize, String>(2),
            row.get::<usize, String>(3),
            row.get::<usize, i32>(4)
        );
    }
    Ok(())
}

/// 检查表是否存在
fn check_table_exists(con: &Connection, table_name: &str) -> Result<bool> {
    // DuckDB中检查表是否存在的方法
    let sql = "SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name = ?";
    let mut stmt = con.prepare(sql)?;
    let mut rows = stmt.query([table_name])?;

    if let Some(row) = rows.next()? {
        let count: i64 = row.get(0)?;
        Ok(count > 0)
    } else {
        Ok(false)
    }
}

/// 检查序列是否存在
fn check_sequence_exists(con: &Connection, sequence_name: &str) -> Result<bool> {
    // 尝试查询序列的当前值，如果序列不存在会报错
    let sql = format!("SELECT nextval('{}')", sequence_name);
    match con.execute(&sql, []) {
        Ok(_) => Ok(true),
        Err(_) => Ok(false),
    }
}
```

## 进行增删改查

### 查

让我们从最简单的查询开始。
如果使用了命令行，那么我们直接编写语句`SELECT * FROM articles;`。就可以查询所有记录的文章信息。

#### python

::: note

**区分.sql(query)和.execute(query)**

对于查询或者执行数据库操作语句的方法，要注意区分`.sql(query)`和`.execute(query)`的区别和联系。
首先，两个方法都可以进行查询等语句的执行，但是返回值不同。

| 特性       | `sql()`                                                | `execute()`                                                            |
| ---------- | ------------------------------------------------------ | ---------------------------------------------------------------------- |
| 返回结果   | 返回一个 `DuckDBPyRelation` 对象 (关系对象)            | 通常返回一个`DuckDBPyConnection`对象 (连接对象)                        |
| 主要用途   | 执行**查询**语句（如 `SELECT`），并直接操作结果        | 执行不返回结果集的语句（如 `INSERT`, `UPDATE`, `DELETE`, `CREATE`）    |
| 结果获取   | 自动执行并返回关系对象，可链式操作或转换为 `DataFrame` | 需要额外调用 `fetch*()` 方法（如 `fetchall()`, `fetchdf()`）来获取结果 |
| 链式操作   | 支持，可进行链式操作                                   | 不支持链式操作                                                         |
| 参数化查询 | 支持                                                   | 支持                                                                   |

**如何选择使用哪个方法**

- 当你需要执行数据查询（`SELECT`），并且希望直接对结果进行链式操作（例如过滤、聚合、转换）或者方便地转换为`Pandas DataFrame/Arrow Table`时，优先使用`sql()`方法。它在数据探索和交互式分析中非常方便。

- 当你需要执行修改数据库状态或不返回结果集的操作时（例如`INSERT`、`UPDATE`、`DELETE`、`CREATE TABLE`、`COPY`等），或者需要显式控制查询执行和结果获取的步骤时，可以使用`execute()`方法。这在数据导入、模式变更或批量更新时更常用。

- 如果你需要重复执行同一条语句（尤其是带参数的），使用`execute()`可能会更高效，因为你可以预处理语句。

对于简单快速的查询和探索，`sql()`的简洁性和链式能力非常出色。对于更复杂或需要精细控制的场景，`execute()`提供了更多的灵活性。

:::

我们修改一下前面的代码

1. 将`create_db_safe() -> str`函数的返回值，改为返回数据库文件的地址
2. 增加一个`connect_db(db_path: str) -> duckdb.DuckDBPyConnection`，用于连接数据库，并返回数据库连接。
3. 增加一个`show_data(con: duckdb.DuckDBPyConnection, table_name: str) -> None`，用于打印全部数据。

:::: code-group

::: code-group-item main.py

```python
import operation

def main():
    db_path = operation.create_db_safe()
    con = operation.connect_db(db_path)
    operation.show_data(con, "articles")

if __name__ == "__main__":
    main()
```

:::

::: code-group-item operation.py

```python
def create_db_safe() -> str:
    """安全地创建数据库表，如果表已存在则不执行任何操作"""
    db_path = os.path.join(os.path.dirname(__file__), '..', '..', 'database', 'duckdb', 'my_db1.duckdb')
    print("db_path:", db_path)
    with duckdb.connect(db_path) as con:
        # 检查articles表是否存在
        result = con.sql("SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'articles';").fetchone()

        if result[0] > 0:
            print("articles表已存在，跳过创建操作，展示数据")
            # con.sql("SELECT * FROM articles;").show()
            return db_path

        print("articles表不存在，开始创建...")
        create_db(db_path)

    return db_path

def connect_db(db_path: str) -> duckdb.DuckDBPyConnection:
    """连接数据库"""
    return duckdb.connect(db_path)

def show_data(con: duckdb.DuckDBPyConnection, table_name: str) -> None:
    """展示数据"""
    con.sql(f"SELECT * FROM {table_name};").show()
```

:::

::::

#### rust

::: note

在rust中，也有`execute()`方法。作为执行单个SQL语句的便捷方法。在成功的情况下，返回更改、插入或删除的行数。
如果 SQL 无法转换为与 C 兼容的字符串或如果底层的 DuckDB 调用失败，将返回 Err。

签名：`pub fn execute<P: Params>(&self, sql: &str, params: P) -> Result<usize>`

```rust
fn update_rows(conn: &Connection) {
    match conn.execute("UPDATE foo SET bar = 'baz' WHERE qux = ?", [1i32]) {
        Ok(updated) => println!("{} rows were updated", updated),
        Err(err) => println!("update failed: {}", err),
    }
}
```

如果要对查询的结果进行更多更灵活的操作，可以使用`prepare()`获取`Statement`结构体实例，然后使用实例方法进行操作。

- `prepare()`签名: `pub fn prepare(&self, sql: &str) -> Result<Statement<'_>>`
- `Statement`结构体，有三个常用的查询方法：
  - `.query()`: `pub fn query<P: Params>(&mut self, params: P) -> Result<Rows<'_>>`
  - `.query_map()`: `pub fn query_map<T, P, F>(&mut self, params: P, f: F,) -> Result<MappedRows<'_, F>> where P: Params, F: FnMut(&Row<'_>) -> Result<T>,`
  - `.query_and_then()`: `pub fn query_and_then<T, E, P, F>(&mut self, params: P, f: F,) -> Result<AndThenRows<'_, F>> where P: Params, E: From<Error>, F: FnMut(&Row<'_>) -> Result<T, E>,`

```rust
fn get_names(conn: &Connection) -> Result<Vec<String>> {
    let mut stmt = conn.prepare("SELECT name FROM people")?;
    let mut rows = stmt.query([])?;

    let mut names = Vec::new();
    while let Some(row) = rows.next()? {
        names.push(row.get(0)?);
    }

    Ok(names)
}
```

:::

我们同样修改下前面代码中的`create_table_safe()`，并新增`connect_db()`和`show_data()`函数

```rust
/// 创建表安全模式
fn create_table_safe() -> Result<PathBuf> {
    let db_path = std::env::current_dir()
        .expect("无法获取当前目录")
        .join("../../database/duckdb/my_db2.duckdb");

    let con = Connection::open(&db_path).expect("无法打开数据库");

    // 检查表是否存在
    let table_exists = check_table_exists(&con, "articles")?;
    let sequence_exists = check_sequence_exists(&con, "seq_article_id")?;

    if table_exists && sequence_exists {
        return Ok(db_path);
    }

    println!("articles表或序列不存在，开始创建...");
    create_table(&con)?;

    Ok(db_path)
}

//? ============================================================
/// 连接数据库
fn connect_db(db_path: &PathBuf) -> Result<Connection> {
    match Connection::open(db_path) {
        Ok(con) => Ok(con),
        Err(e) => {
            println!("无法打开数据库");
            Err(e)
        }
    }
}

/// 打印表中的所有数据
fn show_data(con: &Connection, table_name: &str) -> Result<()> {
    let mut stmt = con.prepare(format!("SELECT * FROM {}", table_name).as_str())?;
    let mut rows = stmt.query([])?;
    while let Some(row) = rows.next()? {
        println!(
            r#"-----------------------------------------------
id: {:?}
title: {:?}
description: {:?}
content: {:?}
art_id: {:?}
-----------------------------------------------"#,
            row.get::<usize, i32>(0),
            row.get::<usize, String>(1),
            row.get::<usize, String>(2),
            row.get::<usize, String>(3),
            row.get::<usize, i32>(4)
        );
    }
    Ok(())
}
```
