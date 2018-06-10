"use strict";

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

var extend = Object.assign || function(target, source) {
    if (target === undefined || target === null) {
        return target;
    }

    for (var key in source) {
        if (source.hasOwnProperty(key)) target[key] = source[key];
    }
    return target;
};

var SocialSharer = function() {
    this.init.apply(this, arguments);
};

var defaults = SocialSharer.defaults = {
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
    qrcodeSize: 260,
    services: ["weibo", "wechat", "qzone", "qq", "douban", "yingxiang"],
    classNamePrefix: "icon icon-",
    onRender: null,
    onClick: null
};

var templates = SocialSharer.templates = {
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
    qrcode: "//api.qrserver.com/v1/create-qr-code/?size={qrcodeSize}x{qrcodeSize}&margin=20&data={url}",
    email: "mailto:?subject={title}&body={url}",
    webshare: "javascript:;"
};

SocialSharer.addService = function(name, template) {
    templates[name] = template;
    template.replace(/\{(.*?)\}/g, function(match, key) {
        defaults[key] = "";
    });
};

SocialSharer.prototype = {
    constructor: SocialSharer,

    init: function(container, options) {
        this.container = typeof container === "string" ? document.querySelector(container) : container;

        if (this.container._SocialSharer) return;

        this.container._SocialSharer = this;

        this.options = extend(defaults, this.mergeOptions(options || {}));
        this.options.qrcodeSize *= Math.min(2, window.devicePixelRatio || 1);

        this.createIcons();
    },

    mergeOptions: function(options) {
        var key, value;

        for (key in defaults) {
            if (key === "onRender" || key === "onClick") continue;

            value = this.container.getAttribute("data-" + key.replace(/[A-Z]/g, "-$&").toLowerCase());

            if (value) {
                options[key] = key === "services" ? value.split(",") : value;
            }
        }

        return options;
    },

    setIcon: function(icon, service) {
        var self = this;

        icon.className += " " + this.options.classNamePrefix + service;

        if (service === "wechat") {
            this.createQRCode(icon);
            icon.href = "javascript:;";
        } else {
            icon.href = this.getURL(service);
            if (service !== "email") icon.target = "_blank";
        }

        if (this.options.onClick) {
            icon.onclick = function(event) {
                return self.options.onClick.call(self, event, service);
            };
        }

        if (service === "webshare") {
            icon.origOnClick = icon.onclick;

            icon.onclick = function(event) {
                navigator.share({
                    title: self.options.title,
                    text: self.options.text,
                    url: self.options.url
                });

                if (icon.origOnClick) icon.origOnClick(event);
            };
        }

        if (this.options.onRender) {
            this.options.onRender.call(this, icon, service);
        }
    },

    createIcons: function() {
        var defaultIcons = this.container.querySelectorAll("[data-service]");
        var i, len, icon, service;

        if (defaultIcons.length) {
            for (i = 0, len = defaultIcons.length; i < len; i++) {
                icon = defaultIcons[i];
                service = icon.getAttribute("data-service");

                if (service === "webshare" && !navigator.share) {
                    this.container.removeChild(icon);
                    continue;
                }

                this.setIcon(icon, service);
            }
        } else {
            for (i = 0, len = this.options.services.length; i < len; i++) {
                service = this.options.services[i];

                if (service === "webshare" && !navigator.share) continue;

                icon = document.createElement("a");

                this.setIcon(icon, service);

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
        var template = templates[service === "wechat" ? "qrcode" : service];
        var options = this.options;
        return template ? template.replace(/\{(.*?)\}/g, function(match, key) {
            return encodeURIComponent(options[key]);
        }) : template;
    }
};
