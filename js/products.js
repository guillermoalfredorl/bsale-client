const server = 'https://bsaletestserver.herokuapp.com'

$(document).ready(function () {
    $.getJSON(server + "/category",
        function (data) {
            for (i = 0; i < data.category.length; i++) {
                let option = $(".category-select option[value='0']").clone()
                option.attr("value", (data.category)[i].id)
                option.html((data.category)[i].name)
                $(".category-select").append(option)
            }
        }
    )
    let controllerProducts = new ControllerProducts()

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
            let self = this;
            let name = $(".product-search").val()
            let category = $(".category-select option:selected").attr("value")
            let order = $(".order-select option:selected").attr("value")

            let pageRequested = (page) ? page : 1

            let query_params = {
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

            let query = $.param(query_params)

            $.getJSON(server + "/products?" + query,
                function (data) {
                    self.loadList(data.products)
                    self.loadButtons(data.total)
                }
            )
        }

        this.loadList = function (products) {
            $(".container-products").empty();
            let self = this;
            let quantity = products.length;
            if (quantity == 0) {
                $(".alert-results").show()
            } else {
                for (i = 0; i < quantity; i++) {
                    let product = $(".example-product").clone()
                    product.find(".image").attr("src", products[i].url_image)
                    product.find(".product-title").html(products[i].name)
                    product.find(".product-price").html(`Precio: $${products[i].price}`)
                    let discount = product.find(".product-discount")
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
            let quantityPerPage = 15
            let self = this;
            let quantityOfPages = Math.ceil(total / quantityPerPage)

            $(".btn-group").empty()
            for (i = 0; i < quantityOfPages; i++) {
                let button = $(".example-button").clone()
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