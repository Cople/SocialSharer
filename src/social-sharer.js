"use strict";

var SocialSharer = function() {
    this.defaults = {
        url: this.getOpenGraphByName("og:url") || this.getCanonicalURL() || location.href,
        title: this.getOpenGraphByName("og:title") || document.title,
        summary: this.getOpenGraphByName("og:description") || this.getMetaContentByName("description") || "",
        pic: this.getOpenGraphByName("og:image") || (document.images.length ? document.images[0].src : ""),
        source: this.getOpenGraphByName("og:site_name") || "",
        weiboKey: "",
        twitterVia: "",
        twitterHashTags: "",
        wechatTitle: "分享到微信",
        wechatTip: "用微信「扫一扫」上方二维码即可。",
        qrcodeSize: 260,
        services: ["weibo", "wechat", "qzone", "qq", "douban", "yingxiang"],
        templates: {},
        classNamePrefix: "icon icon-",
        render: null
    };

    this.templates = {
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
        qrcode: "//pan.baidu.com/share/qrcode?w={qrcodeSize}&h={qrcodeSize}&url={url}"
    };

    this.init.apply(this, arguments);
};

SocialSharer.prototype = {
    extend: Object.assign || function(target, source) {
        for (var key in source) {
            if (source.hasOwnProperty(key)) target[key] = source[key];
        }
        return target;
    },

    init: function(container, options) {
        this.container = typeof container == "string" ? document.querySelector(container) : container;

        if (this.container._SocialSharer) return;

        this.container._SocialSharer = this;
        if (this.container.className.indexOf("social-sharer") == -1) this.container.className += " social-sharer";

        options = options || {};
        this.options = this.extend(this.defaults, options);
        this.options.qrcodeSize *= Math.min(2, window.devicePixelRatio || 1);
        if (options.templates) this.templates = this.extend(this.templates, options.templates);

        this.createIcons();
    },

    getMetaContentByName: function(name) {
        var el = document.querySelector("meta[name='" + name + "']");
        return el ? el.content : el;
    },

    getOpenGraphByName: function(name) {
        var el = document.querySelector("meta[property='" + name + "']");
        return el ? el.content : el;
    },

    getCanonicalURL: function() {
        var el = document.querySelector("link[rel='canonical']");
        return el ? el.href : el;
    },

    createIcons: function() {
        var defaultIcons = this.container.querySelectorAll("[data-service]");
        var i, len, icon, service;

        if (defaultIcons.length) {
            for (i = 0, len = defaultIcons.length; i < len; i++) {
                icon = defaultIcons[i];
                service = icon.getAttribute("data-service");
                icon.className += this.options.classNamePrefix + service;
                if (service == "wechat") {
                    this.createQRCode(icon);
                    icon.href = "javascript:;";
                } else {
                    icon.href = this.getURL(service);
                    icon.target = "_blank";
                }
                if (this.options.render) this.options.render.call(this, icon, service);
            }
        } else {
            for (i = 0, len = this.options.services.length; i < len; i++) {
                service = this.options.services[i];
                icon = document.createElement("a");
                icon.className = this.options.classNamePrefix + service;
                if (service == "wechat") {
                    this.createQRCode(icon);
                    icon.href = "javascript:;";
                } else {
                    icon.href = this.getURL(service);
                    icon.target = "_blank";
                }
                if (this.options.render) this.options.render.call(this, icon, service);
                this.container.appendChild(icon);
            }
        }
    },

    createQRCode: function(icon) {
        var box = document.createElement("div");
        box.className = "qrcode-box";
        box.innerHTML = "<h4>" + this.options.wechatTitle + "</h4><img src='" + this.getURL("qrcode") + "' /><p>" + this.options.wechatTip + "</p>";
        icon.appendChild(box);
    },

    getURL: function(service) {
        var template = this.templates[service];
        var options = this.options;
        return template ? template.replace(/\{(.*?)\}/g, function(match, key) {
            return encodeURIComponent(options[key]);
        }) : template;
    }
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
