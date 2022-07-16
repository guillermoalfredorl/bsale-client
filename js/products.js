const server = 'http://localhost:5000';

$(document).ready(() => {
  $.getJSON(server + '/product/category', (data) => {
    data.category.forEach((e) => {
      let option = $(".category-select option[value='0']").clone();
      option.attr('value', e.id);
      option.html(e.name);
      $('.category-select').append(option);
    });
  });

  let controllerProducts = new ControllerProducts();

  $('#product-search').keypress('keyup', (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      $('.search').click();
    }
  });

  $('.search').click(() => {
    $('.alert-results').hide();
    controllerProducts.searchProducts();
  });

  controllerProducts.searchProducts();
});

class ControllerProducts {
  constructor() {
    this.searchProducts = (page, quantity) => {
      let self = this;
      let name = $('.product-search').val();
      let category = $('.category-select option:selected').attr('value');
      let order = $('.order-select option:selected').attr('value');

      let pageRequested = page ? page : 1;
      let query_params = {
        page: pageRequested,
      };

      if (name) {
        query_params.name = name;
      }
      if (category != 0) {
        query_params.category = category;
      }
      if (order) {
        query_params.order = order;
      }

      query_params.quantity = quantity ? quantity : 15;

      let query = $.param(query_params);

      $.getJSON(server + '/product/product?' + query, (data) => {
        self.loadList(data.products);
        self.loadButtons(data.total);
      });
    };

    this.loadList = (products) => {
      $('.container-products').empty();
      let quantity = products.length;
      if (quantity == 0) {
        $('.alert-results').show();
      } else {
        products.forEach((product) => {
          let item = $('.example-product').clone();
          item.find('.image').attr('src', product.url_image);
          item.find('.product-title').html(product.name);
          item.find('.product-price').html(`Precio: $${product.price}`);
          let discount = item.find('.product-discount');
          if (product.discount == 0) {
            discount.hide();
          } else {
            discount.html(`Descuento: $${product.discount}`);
          }
          item.attr('id', product.id);
          item.appendTo($('.container-products'));
          item.removeClass('example-product');
          item.show();
        });
      }
    };

    this.loadButtons = (total) => {
      let quantityPerPage = 15;
      let self = this;
      let quantityOfPages = Math.ceil(total / quantityPerPage);

      $('.btn-group').empty();
      for (let i = 0; i < quantityOfPages; i++) {
        let button = $('.example-button').clone();
        button.html(i + 1);
        button.attr('page-number', i + 1);
        button.appendTo($('.btn-group'));
        button.removeClass('example-button');
        button.show();
      }

      $('.page-button').click(function () {
        self.searchProducts($(this).attr('page-number'));
        scroll(0, 0);
      });
    };
  }
}
