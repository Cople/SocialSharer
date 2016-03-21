#SocialSharer

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
<link href="../dist/social-share.min.css">

<!-- JS -->
<script src="../dist/social-share.min.js"></script>
<script>
var socialSharer = new SocialSharer(".social-sharer");
// $(".social-sharer").socialSharer();
</script>
```

或者给元素添加 `data-social-sharer` 属性，插件会自动出初始化该元素：

```html
<div class="social-sharer" data-social-sharer='{"title":"pure"}'></div>
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

| 参数 | 类型 | 默认值 | 描述 |
|-----|-----|-------|-------|
| url | string | "" | 网址，`meta[property="og:url"]` > `link[rel="canonical"]` > `location.href` |
| title | string | "" | 标题，`meta[property="og:title"]` > `document.title` |
| summary | string | "" | 描述，`meta[property="og:description"]` > `meta[name="description"]` |
| pic | string | "" | 图片，`meta[property="og:image"]` > `document.images[0]` |
| source | string | "" | 网站名称，`meta[property="og:site_name"]` |
| weiboKey | string | "" | 显示微博来源的 AppKey |
| twitterVia | string | "" | Twitter 参数 |
| twitterHashTags | string | "" | 参见：https://dev.twitter.com/web/tweet-button/web-intent |
| wechatTitle | string | "分享到微信" | 微信二维码标题 |
| wechatTip | string | "用微信「扫一扫」上方二维码即可。" | 微信二维码提示文字 |
| services | array | ["weibo", "wechat", "qzone", "qq", "douban", "yingxiang"] | 要使用的服务列表，目前支持：weibo, wechat, qzone, qq, douban, yingxiang, renren, facebook, twitter, gplus, linkedin, evernote |
| classNamePrefix | string | "icon icon-" | 分享图标的 CSS 类前缀 |
| render | function | null | 生成分享图标后会调用该函数，参数：`icon:element`, `serviceName:string` |


## 方法

| 方法   | 参数               | 描述                                     |
|--------|--------------------|------------------------------------------|
| getURL | serviceName:string | 返回服务的分享地址（微信返回二维码地址） |

## License

[MIT](http://opensource.org/licenses/MIT)
