;(function ($) {
  'use strict'
  //menu
  var dropdown = {}
  $('.menu')
    .on('dropdown-show', function (e) {
      dropdown.loadOnce($(this), dropdown.buildMenuItem)
    })
    .dropdown({
      css3: true,
      js: false,
    })

  dropdown.buildMenuItem = function ($elem, data) {
    var html = ''
    if (data.length === 0) return
    for (var i = 0; i < data.length; i++) {
      html +=
        '<li><a href="' +
        data[i].url +
        '" target="_blank" class="menu-item">' +
        data[i].name +
        '</a></li>'
    }
    $elem.find('.dropdown-layer').html(html)
  }

  //cart
  $('#cart')
    .on('dropdown-show', function () {
      dropdown.loadOnce($(this), function ($elem, data) {
        dropdown.buildCartItem($elem, data)
        dropdown.updateCart($elem, data)
      })
    })
    .dropdown({
      css3: true,
      js: false,
    })

  dropdown.buildCartItem = function ($elem, data) {
    var html = ''
    if (data.length === 0) {
      // no goods
      html +=
        '<div class="cart-nogoods"><i class="icon cart-nogoods-icon fl">&#xe600;</i><div class="cart-nogoods-text fl">No items selected yet<br />continue shopping</div></div>'
      $elem.find('.dropdown-layer').html(html)
      return
    }

    html += '<h4 class="cart-title">Products details</h4><ul class="cart-list">'
    var subtotal = 0
    for (var i = 0; i < data.length; i++) {
      html +=
        '<li class="cart-item"><a href="###" target="_blank" class="cart-item-pic fl"><img src="' +
        data[i].pic +
        '" alt="" /></a><div class="fl"><p class="cart-item-name text-ellipsis"><a href="###" target="_blank" class="link">' +
        data[i].name +
        '</a></p><p class="cart-item-price"><strong>$' +
        data[i].price +
        ' x ' +
        data[i].num +
        '</strong></p></div><a href="javascript:;" title="remove" class="cart-item-delete link fr">X</a></li>'
      subtotal += data[i].price * data[i].num
    }

    html +=
      '</ul><div class="cart-info"><span class="fl">Subtotal: <strong class="cart-total-price">$' +
      subtotal +
      '</strong></span><a href="###" target="_blank" class="cart-info-btn btn fr">Check Out</a></div>'

    setTimeout(function () {
      $elem.find('.dropdown-layer').html(html)
    }, 1000)
  }

  dropdown.updateCart = function ($elem, data) {
    var $cartNum = $elem.find('.cart-num'),
      $cartTotalNum = $elem.find('.cart-total-num'),
      $cartTotalPrice = $elem.find('.cart-total-price'),
      dataNum = data.length,
      totalNum = 0,
      totalPrice = 0

    if (dataNum === 0) {
      // no goods
      return
    }

    for (var i = 0; i < dataNum; i++) {
      totalNum += +data[i].num
      totalPrice += +data[i].num * +data[i].price
    }

    $cartNum.html(totalNum)
    $cartTotalNum.html(totalNum)
    $cartTotalPrice.html('$' + totalPrice)
  }

  //header search
  var search = {}
  search.$headerSearch = $('#header-search')
  search.$headerSearch.html = ''
  search.$headerSearch.maxNum = 10

  // get search results from ebay
  search.$headerSearch
    .on('search-getData', function (e, data) {
      var $this = $(this)
      search.$headerSearch.html = search.$headerSearch.createHeaderSearchLayer(
        data,
        search.$headerSearch.maxNum
      )
      $this.search('appendLayer', search.$headerSearch.html)
      // show the html on the web page
      if (search.$headerSearch.html) {
        $this.search('showLayer')
      } else {
        $this.search('hideLayer')
      }
    })
    .on('search-noData', function (e) {
      // got no results back
      $(this).search('hideLayer').search('appendLayer', '')
    })
    .on('click', '.search-layer-item', function () {
      // click on each search result
      search.$headerSearch.search('setInputVal', $(this).html())
      search.$headerSearch.search('submit')
    })

  search.$headerSearch.search({
    autocomplete: true,
    css3: false,
    js: false,
    animation: 'fade',
    getDataInterval: 0,
  })

  // get results
  search.$headerSearch.createHeaderSearchLayer = function (data, maxNum) {
    var html = '',
      dataNum = data['res']['sug'].length
    // console.log(data['res']['sug']);
    if (dataNum === 0) {
      return ''
    }

    for (var i = 0; i < dataNum; i++) {
      if (i >= maxNum) break
      html +=
        '<li class="search-layer-item text-ellipsis">' +
        data['res']['sug'][i] +
        '</li>'
      // console.log(html);
    }

    // console.log(html);
    return html
  }

  // focus-category

  $('#focus-category')
    .find('.dropdown')
    .on('dropdown-show', function () {
      dropdown.loadOnce($(this), dropdown.createCategoryDetails)
    })
    .dropdown({
      css3: false,
      js: false,
    })

  dropdown.createCategoryDetails = function ($elem, data) {
    var html = ''
    for (var i = 0; i < data.length; i++) {
      html +=
        '<dl class="category-details cf"><dt class="category-details-title fl"><a href="###" target="_blank" class="category-details-title-link">' +
        data[i].title +
        '</a></dt><dd class="category-details-item fl">'

      for (var j = 0; j < data[i].items.length; j++) {
        html +=
          '<a href="###" target="_blank" class="link">' +
          data[i].items[j] +
          '</a>'
      }
      html += '</dd></dl>'
    }
    // setTimeout(function () {
    $elem.find('.dropdown-layer').html(html)
    // },1000);
  }

  dropdown.loadOnce = function ($elem, success) {
    var dataLoad = $elem.data('load')
    if (!dataLoad) return
    if (!$elem.data('loaded')) {
      $elem.data('loaded', true)
      $.getJSON(dataLoad)
        .done(function (data) {
          if (typeof success === 'function') success($elem, data)
        })
        .fail(function () {
          $elem.data('loaded', false)
        })
    }
  }

  // foucs-slider
  var slider = {}
  slider.$focusSlider = $('#focus-slider')
  slider.loadImg = function (url, imgLoaded, imgFailed) {
    var image = new Image()
    image.onerror = function () {
      if (typeof imgFailed === 'function') imgFailed(url)
    }
    image.onload = function () {
      if (typeof imgLoaded === 'function') imgLoaded(url)
    }
    // image.src=url;
    setTimeout(function () {
      image.src = url
    }, 1000)
  }

  slider.lazyLoad = function ($elem) {
    $elem.items = {}
    $elem.loadedItemNum = 0
    $elem.totalItemNum = $elem.find('.slider-img').length
    $elem.on(
      'slider-show',
      ($elem.loadItem = function (e, index, elem) {
        // console.log(1);
        if ($elem.items[index] !== 'loaded') {
          $elem.trigger('slider-loadItem', [index, elem])
        }
      })
    )
    $elem.on('slider-loadItem', function (e, index, elem) {
      var $imgs = $(elem).find('.slider-img')
      $imgs.each(function (_, el) {
        var $img = $(el)
        slider.loadImg(
          $img.data('src'),
          function (url) {
            $img.attr('src', url)
            $elem.items[index] = 'loaded'
            $elem.loadedItemNum++
            // console.log(index + ': loaded');
            if ($elem.loadedItemNum === $elem.totalItemNum) {
              // all the stuff has been loaded
              $elem.trigger('slider-itemsLoaded')
            }
          },
          function (url) {
            console.log('从' + url + '加载图片失败')

            $img.attr('src', 'img/focus-slider/placeholder.png')
          }
        )
      })
    })

    $elem.on('slider-itemsLoaded', function (e) {
      // console.log('itemsLoaded');
      // removes the event handler loadItem
      $elem.off('slider-show', $elem.loadItem)
    })
  }

  slider.lazyLoad(slider.$focusSlider)
  slider.$focusSlider.slider({
    css3: true,
    js: false,
    animation: 'fade', // fade  slide
    activeIndex: 0,
    interval: 0,
  })

  // todays-slider
  slider.$todaysSlider = $('#todays-slider')
  slider.lazyLoad(slider.$todaysSlider)
  slider.$todaysSlider.slider({
    css3: true,
    js: false,
    animation: 'fade', // fade  slide
    activeIndex: 0,
    interval: 0,
  })

  //floor
  var $floor = $('.floor')

  function lazyLoadFloorImgs($elem) {
    var items = {},
      loadedItemNum = 0,
      totalItemNum = $elem.find('.floor-img').length,
      loadItemFn = null

    $elem.on(
      'tab-show',
      (loadItemFn = function (e, index, elem) {
        // console.log(1);
        if (items[index] !== 'loaded') {
          $elem.trigger('tab-loadItem', [index, elem])
        }
      })
    )
    $elem.on('tab-loadItem', function (e, index, elem) {
      var $imgs = $(elem).find('.floor-img')
      $imgs.each(function (_, el) {
        var $img = $(el)
        slider.loadImg(
          $img.data('src'),
          function (url) {
            $img.attr('src', url)
            items[index] = 'loaded'
            // console.log(items[index]);
            loadedItemNum++
            // console.log(index + ': loaded');
            if (loadedItemNum === totalItemNum) {
              $elem.trigger('tab-itemsLoaded')
            }
          },
          function (url) {
            console.log('从' + url + '加载图片失败')

            $img.attr('src', 'img/floor/placeholder.png')
          }
        )
      })
    })

    $elem.on('tab-itemsLoaded', function (e) {
      // console.log('tab-itemsLoaded');

      $elem.off('tab-show', loadItemFn)
    })
  }

  // $floor.each(function (_,elem) {

  //     lazyLoadFloorImgs($(elem));
  // });

  //  $floor.tab({
  //      event:'mouseenter',// mouseenter或click
  //      css3:false,
  //      js:false,
  //      animation:'fade',
  //      activeIndex:0,
  //      interval:0,
  //      delay:0
  //  });

  var floorData = [
    {
      num: '1',
      text: 'Clothing',
      tabs: ['Style', 'Men', 'Women'],
      items: [
        [
          {
            name: 'Converse men cardigan coat',
            price: 479,
          },
          {
            name: 'Adidas trains men',
            price: 335,
          },
          {
            name: 'BMAI knitted running T-shirt',
            price: 159,
          },
          {
            name: 'NBA half loop sport cotton socks',
            price: 65,
          },
          {
            name: 'Xtep official sports hats',
            price: 69,
          },
          {
            name: 'KELME windproof gloves',
            price: 99,
          },
          {
            name: 'Battlefield jeeps stormjacket',
            price: 289,
          },
          {
            name: 'Pathfinder men hiking shoes',
            price: 369,
          },
          {
            name: 'Down jacket 2015 autumn winter',
            price: 399,
          },
          {
            name: 'Hiking shoes wading shoes',
            price: 89,
          },
          {
            name: 'Travel multi-functional backpack',
            price: 269,
          },
          {
            name: 'Outdoor travel backpack OS0099',
            price: 99,
          },
        ],
        [
          {
            name: "Converse men's cardigan coat",
            price: 479,
          },
          {
            name: 'Battlefield jeeps stormjacket',
            price: 335,
          },
          {
            name: "Pathfinder men's hiking shoes",
            price: 159,
          },
          {
            name: 'Down jacket 2015 autumn winter',
            price: 65,
          },
          {
            name: 'BMAI knitted running T-shirt',
            price: 69,
          },
          {
            name: 'NBA half loop sport cotton socks',
            price: 4999,
          },
          {
            name: 'Xtep official sports hats',
            price: 289,
          },
          {
            name: 'KELME windproof gloves',
            price: 369,
          },
          {
            name: 'Hiking shoes wading',
            price: 399,
          },
          {
            name: "Pathfinder men's hiking shoes",
            price: 689,
          },
          {
            name: 'Down jacket 2015 autumn winter',
            price: 269,
          },
          {
            name: 'Outdoor travel backpack OS0099',
            price: 99,
          },
        ],
        [
          {
            name: 'Converse men cardigan coat',
            price: 479,
          },
          {
            name: 'Adidas trains men',
            price: 335,
          },
          {
            name: 'BMAI knitted running T-shirt',
            price: 159,
          },
          {
            name: 'NBA half loop sport cotton socks',
            price: 65,
          },
          {
            name: 'Xtep official sports hats',
            price: 69,
          },
          {
            name: 'KELME windproof gloves',
            price: 99,
          },
          {
            name: 'Battlefield jeeps stormjacket',
            price: 289,
          },
          {
            name: 'Pathfinder men hiking shoes',
            price: 369,
          },
          {
            name: 'Down jacket 2015 autumn winter',
            price: 399,
          },
          {
            name: 'Hiking shoes wading shoes',
            price: 89,
          },
          {
            name: 'Travel multi-functional backpack',
            price: 269,
          },
          {
            name: 'Outdoor travel backpack OS0099',
            price: 99,
          },
        ],
      ],
    },
    {
      num: '2',
      text: 'Beauty',
      tabs: ['Best Sellers', 'Featured Brand', 'Inspiration'],
      items: [
        [
          {
            name: 'Korean fresh water surplus seven suits',
            price: 169,
          },
          {
            name: 'Estée Lauder Eight glasses of water. Five suits',
            price: 198,
          },
          {
            name: 'Yunifang red wine transparent mineral silk mask stick',
            price: 79.9,
          },
          {
            name: 'Gillette manual shaver with hidden blade',
            price: 228,
          },
          {
            name: 'Mediheal Hydrating mask (1st edition)',
            price: 119,
          },
          {
            name: 'Aloe vera soothing moisturizing gel',
            price: 39,
          },
          {
            name: 'Paula Jane choose basic skin care travel set of four',
            price: 299,
          },
          {
            name: 'Lift + Firm for Smoother, Youthful-Looking Skin',
            price: 257,
          },
          {
            name: 'Olay multi-effect repair trilogy gift set',
            price: 199,
          },
          {
            name: 'LOREALVolcanic oil control acne cleansing cream',
            price: 36,
          },
          {
            name:
              '100 birds gazelle water tender times now filling essence water',
            price: 139,
          },
          {
            name: 'Pearl new soft ying embellish three sets',
            price: 99,
          },
        ],
        [
          {
            name: 'Korean fresh water surplus seven suits',
            price: 169,
          },
          {
            name: 'Estée Lauder Eight glasses of water. Five suits',
            price: 198,
          },
          {
            name: 'Yunifang red wine transparent mineral silk mask stick',
            price: 79.9,
          },
          {
            name: 'Gillette manual shaver with hidden blade',
            price: 228,
          },
          {
            name: 'Mediheal Hydrating mask (1st edition)',
            price: 119,
          },
          {
            name: 'Aloe vera soothing moisturizing gel',
            price: 39,
          },
          {
            name: 'Paula Jane choose basic skin care travel set of four',
            price: 299,
          },
          {
            name: 'Lift + Firm for Smoother, Youthful-Looking Skin',
            price: 257,
          },
          {
            name: 'Olay multi-effect repair trilogy gift set',
            price: 199,
          },
          {
            name: 'LOREALVolcanic oil control acne cleansing cream',
            price: 36,
          },
          {
            name:
              '100 birds gazelle water tender times now filling essence water',
            price: 139,
          },
          {
            name: 'Pearl new soft ying embellish three sets',
            price: 99,
          },
        ],
        [
          {
            name: 'Korean fresh water surplus seven suits',
            price: 169,
          },
          {
            name: 'Estée Lauder Eight glasses of water. Five suits',
            price: 198,
          },
          {
            name: 'Yunifang red wine transparent mineral silk mask stick',
            price: 79.9,
          },
          {
            name: 'Gillette manual shaver with hidden blade',
            price: 228,
          },
          {
            name: 'Mediheal Hydrating mask (1st edition)',
            price: 119,
          },
          {
            name: 'Aloe vera soothing moisturizing gel',
            price: 39,
          },
          {
            name: 'Paula Jane choose basic skin care travel set of four',
            price: 299,
          },
          {
            name: 'Lift + Firm for Smoother, Youthful-Looking Skin',
            price: 257,
          },
          {
            name: 'Olay multi-effect repair trilogy gift set',
            price: 199,
          },
          {
            name: 'LOREALVolcanic oil control acne cleansing cream',
            price: 36,
          },
          {
            name:
              '100 birds gazelle water tender times now filling essence water',
            price: 139,
          },
          {
            name: 'Pearl new soft ying embellish three sets',
            price: 99,
          },
        ],
      ],
    },
    {
      num: '3',
      text: 'Mobiles',
      tabs: ['Best Sellers', 'Prepaid Phones', 'Newest Phones'],
      items: [
        [
          {
            name: 'MOTOROLA Moto Z Play 64G 128G',
            price: 958,
          },
          {
            name: 'Apple iPhone 7 (A1660) 64GB (Clearly Pink)',
            price: 1856,
          },
          {
            name: 'Apple iPhone 7 64G 128G 256G (A1660)',
            price: 999,
          },
          {
            name: 'Google Pixel 3XL 64GB (Clearly White)',
            price: 1999,
          },
          {
            name: 'Google Pixel 3XL 128GB (Clearly White)',
            price: 1099,
          },
          {
            name: 'Glory 7i island blue mobile unicom 4G mobile phone',
            price: 1099,
          },
          {
            name: 'Letv (Le) 2 (X620) 32GB 64G 128G 256G',
            price: 1025,
          },
          {
            name: 'Companion blue note3 netcom public edition',
            price: 899,
          },
          {
            name: 'Philips X818 champagne gold all netcom 4G',
            price: 1998,
          },
          {
            name: 'samsung Galaxy S7 64G 128G（G9300）',
            price: 1875,
          },
          {
            name: 'Huawei honor 7 dual-card dual-standby dual-pass',
            price: 1128,
          },
          {
            name: 'Nubian(nubia)Z7Max(NX505J) 64G 128G',
            price: 728,
          },
        ],
        [
          {
            name: 'MOTOROLA Moto Z Play 64G 128G',
            price: 958,
          },
          {
            name: 'Apple iPhone 7 (A1660) 64GB (Clearly Pink)',
            price: 1856,
          },
          {
            name: 'Apple iPhone 7 64G 128G 256G (A1660)',
            price: 999,
          },
          {
            name: 'Google Pixel 3XL 64GB (Clearly White)',
            price: 1999,
          },
          {
            name: 'Google Pixel 3XL 128GB (Clearly White)',
            price: 1099,
          },
          {
            name: 'Glory 7i island blue mobile unicom 4G mobile phone',
            price: 1099,
          },
          {
            name: 'Letv (Le) 2 (X620) 32GB 64G 128G 256G',
            price: 1025,
          },
          {
            name: 'Companion blue note3 netcom public edition',
            price: 899,
          },
          {
            name: 'Philips X818 champagne gold all netcom 4G',
            price: 1998,
          },
          {
            name: 'samsung Galaxy S7 64G 128G（G9300）',
            price: 1875,
          },
          {
            name: 'Huawei honor 7 dual-card dual-standby dual-pass',
            price: 1128,
          },
          {
            name: 'Nubian(nubia)Z7Max(NX505J) 64G 128G',
            price: 728,
          },
        ],
        [
          {
            name: 'MOTOROLA Moto Z Play 64G 128G',
            price: 958,
          },
          {
            name: 'Apple iPhone 7 (A1660) 64GB (Clearly Pink)',
            price: 1856,
          },
          {
            name: 'Apple iPhone 7 64G 128G 256G (A1660)',
            price: 999,
          },
          {
            name: 'Google Pixel 3XL 64GB (Clearly White)',
            price: 1999,
          },
          {
            name: 'Google Pixel 3XL 128GB (Clearly White)',
            price: 1099,
          },
          {
            name: 'Glory 7i island blue mobile unicom 4G mobile phone',
            price: 1099,
          },
          {
            name: 'Letv (Le) 2 (X620) 32GB 64G 128G 256G',
            price: 1025,
          },
          {
            name: 'Companion blue note3 netcom public edition',
            price: 899,
          },
          {
            name: 'Philips X818 champagne gold all netcom 4G',
            price: 1998,
          },
          {
            name: 'samsung Galaxy S7 64G 128G（G9300）',
            price: 1875,
          },
          {
            name: 'Huawei honor 7 dual-card dual-standby dual-pass',
            price: 1128,
          },
          {
            name: 'Nubian(nubia)Z7Max(NX505J) 64G 128G',
            price: 728,
          },
        ],
      ],
    },
    {
      num: '4',
      text: 'Home Appliances',
      tabs: ['Best Sellers', 'Featured Brand', 'Household Appliances'],
      items: [
        [
          {
            name: '暴风TV 超体电视 40X 40英寸',
            price: 1299,
          },
          {
            name: '小米（MI）L55M5-AA 55英寸',
            price: 3699,
          },
          {
            name: '飞利浦HTD5580/93 音响',
            price: 2999,
          },
          {
            name: '金门子H108 5.1套装音响组合',
            price: 1198,
          },
          {
            name: '方太ENJOY云魔方抽油烟机',
            price: 4390,
          },
          {
            name: '美的60升预约洗浴电热水器',
            price: 1099,
          },
          {
            name: '九阳电饭煲多功能智能电饭锅',
            price: 159,
          },
          {
            name: '美的电烤箱家用大容量',
            price: 329,
          },
          {
            name: '奥克斯(AUX)936破壁料理机',
            price: 1599,
          },
          {
            name: '飞利浦面条机 HR2356/31',
            price: 665,
          },
          {
            name: '松下NU-JA100W 家用蒸烤箱',
            price: 1799,
          },
          {
            name: '飞利浦咖啡机 HD7751/00',
            price: 1299,
          },
        ],
        [
          {
            name: '暴风TV 超体电视 40X 40英寸',
            price: 1299,
          },
          {
            name: '小米（MI）L55M5-AA 55英寸',
            price: 3699,
          },
          {
            name: '飞利浦HTD5580/93 音响',
            price: 2999,
          },
          {
            name: '金门子H108 5.1套装音响组合',
            price: 1198,
          },
          {
            name: '方太ENJOY云魔方抽油烟机',
            price: 4390,
          },
          {
            name: '美的60升预约洗浴电热水器',
            price: 1099,
          },
          {
            name: '九阳电饭煲多功能智能电饭锅',
            price: 159,
          },
          {
            name: '美的电烤箱家用大容量',
            price: 329,
          },
          {
            name: '奥克斯(AUX)936破壁料理机',
            price: 1599,
          },
          {
            name: '飞利浦面条机 HR2356/31',
            price: 665,
          },
          {
            name: '松下NU-JA100W 家用蒸烤箱',
            price: 1799,
          },
          {
            name: '飞利浦咖啡机 HD7751/00',
            price: 1299,
          },
        ],
        [
          {
            name: '暴风TV 超体电视 40X 40英寸',
            price: 1299,
          },
          {
            name: '小米（MI）L55M5-AA 55英寸',
            price: 3699,
          },
          {
            name: '飞利浦HTD5580/93 音响',
            price: 2999,
          },
          {
            name: '金门子H108 5.1套装音响组合',
            price: 1198,
          },
          {
            name: '方太ENJOY云魔方抽油烟机',
            price: 4390,
          },
          {
            name: '美的60升预约洗浴电热水器',
            price: 1099,
          },
          {
            name: '九阳电饭煲多功能智能电饭锅',
            price: 159,
          },
          {
            name: '美的电烤箱家用大容量',
            price: 329,
          },
          {
            name: '奥克斯(AUX)936破壁料理机',
            price: 1599,
          },
          {
            name: '飞利浦面条机 HR2356/31',
            price: 665,
          },
          {
            name: '松下NU-JA100W 家用蒸烤箱',
            price: 1799,
          },
          {
            name: '飞利浦咖啡机 HD7751/00',
            price: 1299,
          },
        ],
      ],
    },
    {
      num: '5',
      text: 'Computers',
      tabs: ['Best Sellers', 'Tablets', 'Featured Brand'],
      items: [
        [
          {
            name: '戴尔成就Vostro 3800-R6308',
            price: 2999,
          },
          {
            name: '联想IdeaCentre C560',
            price: 5399,
          },
          {
            name: '惠普260-p039cn台式电脑',
            price: 3099,
          },
          {
            name: '华硕飞行堡垒旗舰版FX-PRO',
            price: 6599,
          },
          {
            name: '惠普(HP)暗影精灵II代PLUS',
            price: 12999,
          },
          {
            name: '联想(Lenovo)小新700电竞版',
            price: 5999,
          },
          {
            name: '游戏背光牧马人机械手感键盘',
            price: 499,
          },
          {
            name: '罗技iK1200背光键盘保护套',
            price: 799,
          },
          {
            name: '西部数据2.5英寸移动硬盘1TB',
            price: 419,
          },
          {
            name: '新睿翼3TB 2.5英寸 移动硬盘',
            price: 849,
          },
          {
            name: 'Rii mini i28无线迷你键盘鼠标',
            price: 349,
          },
          {
            name: '罗技G29 力反馈游戏方向盘',
            price: 2999,
          },
        ],
        [
          {
            name: '戴尔成就Vostro 3800-R6308',
            price: 2999,
          },
          {
            name: '联想IdeaCentre C560',
            price: 5399,
          },
          {
            name: '惠普260-p039cn台式电脑',
            price: 3099,
          },
          {
            name: '华硕飞行堡垒旗舰版FX-PRO',
            price: 6599,
          },
          {
            name: '惠普(HP)暗影精灵II代PLUS',
            price: 12999,
          },
          {
            name: '联想(Lenovo)小新700电竞版',
            price: 5999,
          },
          {
            name: '游戏背光牧马人机械手感键盘',
            price: 499,
          },
          {
            name: '罗技iK1200背光键盘保护套',
            price: 799,
          },
          {
            name: '西部数据2.5英寸移动硬盘1TB',
            price: 419,
          },
          {
            name: '新睿翼3TB 2.5英寸 移动硬盘',
            price: 849,
          },
          {
            name: 'Rii mini i28无线迷你键盘鼠标',
            price: 349,
          },
          {
            name: '罗技G29 力反馈游戏方向盘',
            price: 2999,
          },
        ],
        [
          {
            name: '戴尔成就Vostro 3800-R6308',
            price: 2999,
          },
          {
            name: '联想IdeaCentre C560',
            price: 5399,
          },
          {
            name: '惠普260-p039cn台式电脑',
            price: 3099,
          },
          {
            name: '华硕飞行堡垒旗舰版FX-PRO',
            price: 6599,
          },
          {
            name: '惠普(HP)暗影精灵II代PLUS',
            price: 12999,
          },
          {
            name: '联想(Lenovo)小新700电竞版',
            price: 5999,
          },
          {
            name: '游戏背光牧马人机械手感键盘',
            price: 499,
          },
          {
            name: '罗技iK1200背光键盘保护套',
            price: 799,
          },
          {
            name: '西部数据2.5英寸移动硬盘1TB',
            price: 419,
          },
          {
            name: '新睿翼3TB 2.5英寸 移动硬盘',
            price: 849,
          },
          {
            name: 'Rii mini i28无线迷你键盘鼠标',
            price: 349,
          },
          {
            name: '罗技G29 力反馈游戏方向盘',
            price: 2999,
          },
        ],
      ],
    },
  ]

  function lazyLoadFloor() {
    var items = {},
      loadedItemNum = 0,
      totalItemNum = $floor.length,
      loadItemFn = null

    $doc.on(
      'floor-show',
      (loadItemFn = function (e, index, elem) {
        // console.log(1);
        if (items[index] !== 'loaded') {
          $doc.trigger('floors-loadItem', [index, elem])
        }
      })
    )
    $doc.on('floors-loadItem', function (e, index, elem) {
      var html = buildFloor(floorData[index]),
        $elem = $(elem)

      items[index] = 'loaded'
      // console.log(items[index]);
      loadedItemNum++
      // console.log(index + ': loaded');
      if (loadedItemNum === totalItemNum) {
        $doc.trigger('floors-itemsLoaded')
      }

      setTimeout(function () {
        $elem.html(html)
        lazyLoadFloorImgs($elem)
        $elem.tab({
          event: 'mouseenter', // mouseenter or click
          css3: false,
          js: false,
          animation: 'fade',
          activeIndex: 0,
          interval: 0,
          delay: 0,
        })
      }, 1000)
    })

    $doc.on('floors-itemsLoaded', function (e) {
      // console.log('floors-itemsLoaded');
      $doc.off('floor-show', loadItemFn)
      $win.off('scroll resize', timeToShow)
    })
  }

  function buildFloor(floorData) {
    var html = ''

    html += '<div class="container">'
    html += buildFloorHead(floorData)
    html += buildFloorBody(floorData)
    html += '</div>'

    return html
  }

  function buildFloorHead(floorData) {
    var html = ''
    html += '<div class="floor-head">'
    html +=
      '<h2 class="floor-title fl"><span class="floor-title-num">' +
      floorData.num +
      'F</span><span class="floor-title-text">' +
      floorData.text +
      '</span></h2>'
    html += '<ul class="tab-item-wrap fr">'
    for (var i = 0; i < floorData.tabs.length; i++) {
      html +=
        '<li class="fl"><a href="javascript:;" class="tab-item">' +
        floorData.tabs[i] +
        '</a></li>'
      if (i !== floorData.tabs.length - 1) {
        html += '<li class="floor-divider fl text-hidden">分隔线</li>'
      }
    }
    html += '</ul>'
    html += '</div>'
    return html
  }

  function buildFloorBody(floorData) {
    var html = ''
    html += '<div class="floor-body">'
    for (var i = 0; i < floorData.items.length; i++) {
      html += '<ul class="tab-panel">'
      for (var j = 0; j < floorData.items[i].length; j++) {
        html += '<li class="floor-item fl">'
        html +=
          '<p class="floor-item-pic"><a href="###" target="_blank"><img src="img/floor/loading.gif" class="floor-img" data-src="img/floor/' +
          floorData.num +
          '/' +
          (i + 1) +
          '/' +
          (j + 1) +
          '.png" alt="" /></a></p>'
        html +=
          '<p class="floor-item-name"><a href="###" target="_blank" class="link">' +
          floorData.items[i][j].name +
          '</a></p>'
        html +=
          '<p class="floor-item-price">$' + floorData.items[i][j].price + '</p>'
        html += '</li>'
      }

      html += '</ul>'
    }

    html += '</div>'

    return html
  }

  var $win = $(window)
  var $doc = $(document)
  function isVisible($elem) {
    return (
      $win.height() + $win.scrollTop() > $elem.offset().top &&
      $win.scrollTop() < $elem.offset().top + $elem.height()
    )
  }

  function timeToShow() {
    // console.log('time to show');
    $floor.each(function (index, elem) {
      if (isVisible($(elem))) {
        // console.log('the'+(index+1)+'floor is visible');
        $doc.trigger('floor-show', [index, elem])
      }
    })
  }

  $win.on('scroll resize', timeToShow)
  lazyLoadFloor()

  timeToShow()

  // elevator
  function whichFloor() {
    var num = 1

    $floor.each(function (index, elem) {
      num = index

      if ($win.scrollTop() + $win.height() / 2 < $(elem).offset().top) {
        num = index - 1
        return false
      }
    })

    return num
  }

  var $elevator = $('#elevator'),
    $elevatorItems = $elevator.find('.elevator-item')

  function setElevator() {
    var num = whichFloor()
    console.log(num)
    if (num === -1) {
      $elevator.fadeOut()
    } else {
      $elevator.fadeIn()
      $elevatorItems.removeClass('elevator-active')
      $elevatorItems.eq(num).addClass('elevator-active')
    }
  }

  setElevator()

  $win.on('scroll resize', function () {
    setElevator()
  })

  $elevator.on('click', '.elevator-item', function () {
    $('html, body').animate({
      // scrollTop: $floor[$(this).index()].offset().top
      scrollTop: $floor.eq($(this).index()).offset().top,
    })
  })

  $('#backToTop').on('click', function () {
    $('html, body').animate({
      scrollTop: 0,
    })
  })
})(jQuery)
