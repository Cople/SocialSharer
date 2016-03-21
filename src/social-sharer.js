"use strict";

var SocialSharer = function(container, options) {
    var self = this;
    var defaults = {
        url: getOpenGraphByName("og:url") || getCanonicalURL() || location.href,
        title: getOpenGraphByName("og:title") || document.title,
        summary: getOpenGraphByName("og:description") || getMetaContentByName("description") || "",
        pic: getOpenGraphByName("og:image") || (document.images.length ? document.images[0].src : ""),
        source: getOpenGraphByName("og:site_name") || "",
        weiboKey: "",
        twitterVia: "",
        twitterHashTags: "",
        wechatTitle: "分享到微信",
        wechatTip: "用微信「扫一扫」上方二维码即可。",
        services: ["weibo", "wechat", "qzone", "qq", "douban", "yingxiang"],
        classNamePrefix: "icon icon-",
        render: null
    };

    var dpr = Math.min(2, window.devicePixelRatio || 1);

    var templates = {
        weibo: "http://service.weibo.com/share/share.php?url={url}&title={title}&pic={pic}&appkey={weiboKey}",
        qq: "http://connect.qq.com/widget/shareqq/index.html?url={url}&title={title}&summary={summary}&pics={pic}&site={source}",
        qzone: "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url={url}&title={title}&summary={summary}&pics={pic}&site={source}",
        douban: "https://www.douban.com/share/service?url={url}&title={title}&text={summary}&image={pic}",
        facebook: "https://www.facebook.com/sharer/sharer.php?u={url}",
        twitter: "https://twitter.com/intent/tweet?url={url}&text={title}&via={twitterVia}&hashtags={twitterHashTags}",
        gplus: "https://plus.google.com/share?url={url}",
        linkedin: "http://www.linkedin.com/shareArticle?mini=true&url={url}&title={title}&summary={summary}&source={source}",
        evernote: "http://www.evernote.com/clip.action?url={url}&title={title}",
        yingxiang: "http://app.yinxiang.com/clip.action?url={url}&title={title}",
        qrcode: "http://qr.liantu.com/api.php?el=q&w=" + (200 * dpr) + "&m=" + (20 * dpr) + "&text={url}"
    };

    function extend(target, source) {
        if (typeof Object.assign != "function") {
            for (var key in source) {
                if (source.hasOwnProperty(key)) target[key] = source[key];
            }
            return target;
        } else {
            return Object.assign(target, source);
        }
    }

    function getMetaContentByName(name) {
        var el = document.querySelector("meta[name='" + name + "']");
        return el ? el.content : el;
    }

    function getOpenGraphByName(name) {
        var el = document.querySelector("meta[property='" + name + "']");
        return el ? el.content : el;
    }

    function getCanonicalURL() {
        var el = document.querySelector("link[rel='canonical']");
        return el ? el.href : el;
    }

    function getURL(service) {
        var template = templates[service];
        return template ? template.replace(/\{(.*?)\}/g, function(match, key) {
            return encodeURIComponent(options[key]);
        }) : template;
    }

    function buildIcons() {
        var defaultIcons = container.querySelectorAll("[data-service]");
        var i, len, icon, service;

        if (defaultIcons.length) {
            for (i = 0, len = defaultIcons.length; i < len; i++) {
                icon = defaultIcons[i];
                service = icon.getAttribute("data-service");
                icon.className += options.classNamePrefix + service;
                if (service == "wechat") {
                    buildQRCode(icon);
                    icon.href = "javascript:;";
                } else {
                    icon.href = getURL(service);
                    icon.target = "_blank";
                }
                if (options.render) options.render.call(self, icon, service);
            }
        } else {
            for (i = 0, len = options.services.length; i < len; i++) {
                service = options.services[i];
                icon = document.createElement("a");
                icon.className = options.classNamePrefix + service;
                if (service == "wechat") {
                    buildQRCode(icon);
                    icon.href = "javascript:;";
                } else {
                    icon.href = getURL(service);
                    icon.target = "_blank";
                }
                if (options.render) options.render.call(self, icon, service);
                container.appendChild(icon);
            }
        }
    }

    function buildQRCode(icon) {
        var box = document.createElement("div");
        box.className = "qrcode-box";
        box.innerHTML = "<h4>" + options.wechatTitle + "</h4><img src='" + getURL("qrcode") + "' /><p>" + options.wechatTip + "</p>";
        icon.appendChild(box);
    }

    function init() {
        container = typeof container == "string" ? document.querySelector(container) : container;
        options = extend(defaults, options || {});

        container._SocialSharer = self;
        container.className += " social-share";

        buildIcons();
    }

    self.getURL = getURL;

    if (!container._SocialSharer) init();
};

if (typeof jQuery !== "undefined") {
    var pluginName = "SocialSharer";
    jQuery.fn.socialSharer = function(method, param) {
        return this.each(function() {
            var $el = $(this);
            if (typeof method === "string") {
                $el.data(pluginName)[method](param);
            } else {
                if (!$el.data(pluginName)) $el.data(pluginName, new SocialSharer(this, method));
            }
        });
    };
}

Array.prototype.forEach.call(document.querySelectorAll("[data-social-sharer]"), function(container) {
    var options = null;
    try {
        options = JSON.parse(container.getAttribute("data-social-sharer"));
    } catch (err) {
        console.warn(err);
    }
    new SocialSharer(container, options);
});
