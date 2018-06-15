const Koa = require('koa');
const path = require('path')
const bodyParser = require('koa-bodyparser'); // 表单解析中间件
const session = require('koa-session-minimal'); // 处理数据库的中间件
const MysqlStore = require('koa-mysql-session'); // 处理数据库的中间件
const config = require('./config/default.js');
const router = require('koa-router');
const koaStatic = require('koa-static'); // 静态资源加载中间件
const staticCache = require('koa-static-cache');
const cors = require('koa2-cors');
const app = new Koa();


// session存储配置
const sessionMysqlConfig= {
  user: config.database.USERNAME,
  password: config.database.PASSWORD,
  database: config.database.DATABASE,
  host: config.database.HOST,
};

// 配置session中间件
app.use(session({
  key: 'USER_SID',
  store: new MysqlStore(sessionMysqlConfig)
}));


// 配置静态资源加载中间件
app.use(koaStatic(
  path.join(__dirname , './public')
));
// 缓存
app.use(staticCache(path.join(__dirname, './public'), { dynamic: true }, {
  maxAge: 365 * 24 * 60 * 60
}));
app.use(staticCache(path.join(__dirname, './images'), { dynamic: true }, {
  maxAge: 365 * 24 * 60 * 60
}));
// 跨域

app.use(cors({
    origin: function (ctx) {
        if (ctx.url === '/test') {
            return "*"; // 允许来自所有域名请求
        }
        return '*'; // 这样就能只允许 http://localhost:8080 这个域名的请求了
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));


app.use(bodyParser({
  formLimit: '1mb'
}));

//  路由
app.use(require('./routers/signup.js').routes());


app.listen(config.port);

console.log(`listening on port ${config.port}`);
