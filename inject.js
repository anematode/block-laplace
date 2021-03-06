// File that gets injected as a script tag into the document, before it fully loads.

// Most credit goes to https://stackoverflow.com/a/51594799.



(function() { // Define a closure.
    // Escape HTML utility function
    function unicodeEscape(str) {
        return str.replace(/[\n\r\t\/\\]/g, function(escape) {
            switch (escape) {
                case "\n": return "\\n";
                case "\r": return "\\r";
                case "\t": return "\\t";
                case "\\": return "\\\\";
                default: return "\\/";
            }
        }).replace(/[^a-zA-Z0-9=\-+_!@#$%^*()\[\]{}\\|?/.,: ]/g, function(character) {
            return '\\u' + ('0000' + character.charCodeAt().toString(16)).slice(-4).toUpperCase();
        })
    }

    // The general technique here is to use a XMLHttpRequest wrapper which uses the real one internally, and presents
    // itself as an XMLHttpRequest interface, but catches any requests to pausd.schoology.com/home/feed?page=[n] and
    // rewrites them so the page gets changed. All other requests are just passed on as-is.

    // Cache the real XMLHttpRequest function so that you can actually make requests, since otherwise it would be impossible
    var _open = XMLHttpRequest.prototype.open;

    // DOMParser object used later
    var parser = new DOMParser();

    // FlexTime course link
    var FLEX_TIME = "https://pausd.schoology.com/course/1887085609";

    // Redefine the XMLHttpRequest prototype so we can mess with Schoology!
    window.XMLHttpRequest.prototype.open = function (method, URL) {
        // Allow us to use the onreadystatechange event so we can pass these events on
        var _onreadystatechange = this.onreadystatechange,
            _this = this; // Define this so we can use it unambiguously later in a function

        // Define the custom onreadystatechange, run every time a state change occurs
        _this.onreadystatechange = function () {
            if (_this.readyState === 4 // if the state change is a complete operation (the request is complete)...
                && _this.status === 200 // and if the operation was a success...
                && ~URL.indexOf('home/feed?page=')) { // and if the URL contains "home/feed?page="...
                // note that this script is never run for sites other than schoology.pausd.org, so the other sites are safe.

                try {
                    setTimeout(function() {
                        var post_container = document.getElementsByClassName("s-edge-feed")[0];
                        // Unordered list (ul) containing the posts

                        var posts = Array.prototype.slice.call(
                            post_container.getElementsByTagName('li') // get all li tags (mostly posts)
                        ); // convert to Array from HTMLCollection

                        var bad_posts_indexes = [];

                        for (let i = 0; i < posts.length; i++) {
                            var post = posts[i]; // for each post

                            var links = Array.prototype.slice.call(post.getElementsByTagName("a")); // get all links in the post
                            for (let j = 0; j < links.length; j++) {
                                var link = links[j]; // for each link

                                if (link.href === FLEX_TIME) { // If the link goes to FlexTime
                                    post_container.removeChild(post);
                                    break; // Exit out of the loop, the execution is complete.
                                }

                                // Note this means that posts not in FlexTime, but contain links to FlexTime, also get removed. Good.
                            }
                        }
                    }, 1000);
                } catch (e) {console.log(e)} // we don't want to have any annoying errors cause the website to fail!
            }

            // Pass on the event, possibly manipulated by us ;)
            if (_onreadystatechange) _onreadystatechange.apply(this, arguments);
        };

        // Detect any onreadystatechange changing
        Object.defineProperty(this, "onreadystatechange", {
            get: function () {
                return _onreadystatechange;
            },
            set: function (value) {
                _onreadystatechange = value;
            }
        });

        // Return a request, but with our udderly injected code
        return _open.apply(_this, arguments);
    };

})(); // Close and call the closure.