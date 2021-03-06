# SocialSharer

最 Pure 的社会化分享按钮

## 演示

[DEMO](http://cople.github.io/SocialSharer)

## 安装

```sh
npm install social-sharer --save
```

## 使用

```html
<!-- HTML -->
<div class="social-sharer"></div>

<!-- CSS (optional) -->
<link href="../dist/social-sharer.min.css">

<!-- JS -->
<script src="../dist/social-sharer.min.js"></script>
<script>
var socialSharer = new SocialSharer(".social-sharer");
</script>

<!-- jQuery -->
<script src="../dist/jquery.social-sharer.min.js"></script>
<script>
$(".social-sharer").socialSharer();
</script>
```

如果元素内包含带 `data-service` 属性的元素，插件会直接使用这些元素，并忽选项中的`services` 参数：

```html
<div class="social-sharer">
    <a data-service="weibo"     title="分享到微博"></a>
    <a data-service="wechat"    title="分享到微信"></a>
    <a data-service="qq"        title="分享给QQ好友"></a>
    <a data-service="yingxiang" title="分享到印象笔记"></a>
</div>
```

## 选项

| 参数              | 类型       | 默认值                                      | 描述                                       |
| --------------- | -------- | ---------------------------------------- | ---------------------------------------- |
| url             | string   | ""                                       | 网址，`dataset.url` > `meta[property="og:url"]` > `link[rel="canonical"]` > `location.href` |
| title           | string   | ""                                       | 标题，`dataset.title` > `meta[property="og:title"]` > `document.title` |
| description     | string   | ""                                       | 描述，`dataset.description` > `meta[property="og:description"]` > `meta[name="description"]` |
| pic             | string   | ""                                       | 图片，`dataset.pic` > `meta[property="og:image"]` > `document.images[0]` |
| source          | string   | ""                                       | 网站名称，`meta[property="og:site_name"]`     |
| weiboKey        | string   | ""                                       | 显示微博来源的 AppKey                           |
| twitterVia      | string   | ""                                       | Twitter 参数                               |
| twitterHashTags | string   | ""                                       | 参见：https://dev.twitter.com/web/tweet-button/web-intent |
| wechatTitle     | string   | "分享到微信"                                  | 微信二维码标题                                  |
| wechatTip       | string   | "用微信「扫一扫」上方二维码即可。"                       | 微信二维码提示文字                                |
| qrcodeSize      | number   | 260                                      | 微信二维码尺寸                                  |
| services        | array    | ["weibo", "wechat", "qzone", "qq", "douban", "yingxiang"] | 要使用的服务列表，目前支持：weibo, wechat, qzone, qq, douban, yingxiang, renren, facebook, twitter, gplus, linkedin, evernote, email, webshare |
| classNamePrefix | string   | "icon icon-"                             | 分享图标的 CSS 类前缀                            |
| onRender        | function | null                                     | 生成分享图标后会调用该函数，参数：`icon:element`, `serviceName:string` |
| onClick         | function | null                                     | 点击分享图标后会调用该函数，参数：`event:object`, `serviceName:string` |

你可以通过给元素设置 `data-*` 属性来设置对应选项（`function`类型除外）。例如：

```html
<div class="social-sharer" data-title="标题" data-weibo-key="1234567" data-services="qq,weibo,linkedin"></div>
```

## 方法
### 静态方法
#### SocialSharer.addService(serviceName:string, urlTemplate:string)
添加服务

###  实例方法
#### getURL(serviceName:string)
返回服务的分享地址（微信返回二维码地址）

## License

[MIT](http://opensource.org/licenses/MIT)
