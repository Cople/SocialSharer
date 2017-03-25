function plugin(method, param) {
    return this.each(function() {
        var $el = $(this);
        if (typeof method === "string") {
            $el.data("SocialSharer")[method](param);
        } else {
            if (!$el.data("SocialSharer")) $el.data("SocialSharer", new SocialSharer(this, method));
        }
    });
}
