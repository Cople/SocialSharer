function plugin(method, param) {
    if (typeof method === "string") {
        return $.data(this[0], "SocialSharer")[method](param);
    } else {
        return this.each(function() {
            if (!$.data(this, "SocialSharer")) $.data(this, "SocialSharer", new SocialSharer(this, method));
        });
    }
}
