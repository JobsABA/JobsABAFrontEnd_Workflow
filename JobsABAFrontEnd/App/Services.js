app.service('httpService', function ($http) {
    this.getAll = function (url) {
        return $http.get(url);
    };

    this.getByID = function (id, url) {
        return $http.get(url + id);
    };

    this.post = function (data, url) {
        var request = $http({
            method: "post",
            url: url,
            data: data
        });
        return request;
    };

    this.put = function (data, url) {
        var request = $http({
            method: "put",
            url: url,
            data: data
        });
        return request;
    };

    this.delete = function (id, url) {
        var request = $http({
            method: "delete",
            url: url + id
        });
        return request;
    };

    this.get = function (data, url) {
        var request = $http({
            method: "get",
            url: url,
            data: data
        });
        return request;
    };

    this.createCookie = function (name, value, days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            var expires = "; expires=" + date.toGMTString();
        }
        else var expires = "";
        document.cookie = name + "=" + value + expires + "; path=/";
    }

    this.readCookie = function (name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    this.eraseCookie = function (name) {
        this.createCookie(name, "", -1);
    }
})

.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
})

