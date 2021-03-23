var server = 'https://bsaletestserver.herokuapp.com'

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

    $("#product-search").keypress("keyup", function (e) {
        if (e.keyCode === 13) {
            e.preventDefault()
            $(".search").click()
        }
    })

    $(".search").click(function () {
        $(".alert-results").hide()
        controllerProducts.searchProducts()
    })

    controllerProducts.searchProducts()
})

class ControllerProducts {
    constructor() {
        this.searchProducts = function (page, quantity) {
            var self = this;
            var name = $(".product-search").val()
            var category = $(".category-select option:selected").attr("value")
            var order = $(".order-select option:selected").attr("value")

            var pageRequested = (page) ? page : 1

            var query_params = {
                page: pageRequested
            }

            if (name) {
                query_params.name = name
            }

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
                    self.loadButtons(data.total)
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
                    product.find(".product-price").html(`Precio: $${products[i].price}`)
                    var discount = product.find(".product-discount")
                    if (products[i].discount == 0) {
                        (discount.hide())
                    } else {
                        discount.html(`Descuento: $${products[i].discount}`)
                    }
                    product.attr("id", products[i].id)
                    product.appendTo($(".container-products"))
                    product.removeClass("example-product")
                    product.show()
                }
            }
        }

        this.loadButtons = function (total) {
            var quantityPerPage = 15
            var self = this;
            var quantityOfPages = Math.ceil(total / quantityPerPage)

            $(".btn-group").empty()
            for (i = 0; i < quantityOfPages; i++) {
                var button = $(".example-button").clone()
                button.html(i + 1)
                button.attr("page-number", i + 1)
                button.appendTo($(".btn-group"))
                button.removeClass("example-button")
                button.show()
            }
            $(".page-button").click(function () {
                self.searchProducts($(this).attr("page-number"))
                scroll(0, 0)
            })
        }
    }
}