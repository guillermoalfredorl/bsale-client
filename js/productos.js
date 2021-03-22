var server = 'http://localhost:5000'

$(document).ready(function () {
    $.getJSON(server + "/category",
        function (data) {
            for (i = 0; i < data.category.length; i++) {
                var option = $(".category-select option[value='0']").clone()
                option.attr("value", (data.category)[i].id)
                option.html((data.category)[i].name)
                $(".category-select").append(option)
            }
        }
    )
    var controllerProducts = new ControllerProducts()
    $('.search').click(function () {
        $(".alert-results").hide()
        controllerProducts.searchProducts()
    })

    controllerProducts.searchProducts()
})

class ControllerProducts {
    constructor() {
        this.searchProducts = function (page, quantity) {
            var self = this;
            // var product = $(".product-search").val()
            var category = $(".category-select option:selected").attr("value")
            var order = $(".order-select option:selected").attr("value")

            var pageRequested = (page) ? page : 1

            var query_params = {
                page: pageRequested
            }

            /* if (product) {
                query_params.product = product
            } */

            if (category != 0) {
                query_params.category = category
            }
            if (order) {
                query_params.order = order
            }

            query_params.quantity = (quantity) ? quantity : 15

            var query = $.param(query_params)

            $.getJSON(server + "/products?" + query,
                function (data) {
                    self.loadList(data.products)
                }
            )
        }

        this.loadList = function (products) {
            $(".container-products").empty();
            var self = this;
            var quantity = products.length;
            if (quantity == 0) {
                $(".alert-results").show()
            } else {
                for (i = 0; i < quantity; i++) {
                    var product = $(".example-product").clone()
                    product.find(".image").attr("src", products[i].url_image)
                    product.find(".product-title").html(products[i].name)
                    product.find(".product-price").html(products[i].price)
                    product.find(".product-discount").html(products[i].discount)
                    product.attr("id", products[i].id)
                    product.appendTo($(".container-products"))
                    product.removeClass("example-product")
                    product.show()
                }
            }
        }
    }
}