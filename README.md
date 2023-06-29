yargs && typescript examples

使用`yargs`做的一个简单的todo-list命令行工具，主要熟悉`yargs`在`typescript`+`node`环境下的使用及装饰器的使用

## install
```shell
$ npm install -g typescript ts-node
$ git clone git@github.com:tashuo/yargs-example.git
$ cd yargs-example && npm install
```

## run
### show all commands
```shell
$ ts-node app.ts --help
```

### add todo
```shell
$ ts-node app.ts add -t first -b xd # yargs Option
$ ts-node app.ts add2 second xdd # yargs PositionalOptions, 使用了装饰器
```

### list todos
```shell
$ ts-node app.ts all
$ ts-node app.ts all2:all2 # 使用了装饰器
```

### delete todo
```shell
$ ts-node app.ts remove -t first
```

## how it works
### basic.command.ts
`basicCommand`函数中的增删改查命令使用的常规的yargs声明及初始化方式，使用`parseAsync`解析中运行时的参数对其进行处理

### test.command.ts
`TestCommand`类使用了`yargs.CommandModule`，定义好必要的属性后注册到`yargs`中即可生效，参数的定义和解析处理分别在方法`builder`和`handler`中完成

### 装饰器
`decorator.ts`文件定义了一个类装饰器`Commands`和方法装饰器`Command`，`app.ts`入口中使用`scanner`模拟扫描`decorator.command.ts`中所有的类进行处理；

`@Command`定义单个命令；

`@Commands`定义多个命令，当一个类使用该装饰器时，会自动将所有方法注册为命令，具体可查看代码`Scanner.scan()`