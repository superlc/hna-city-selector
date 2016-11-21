/**
 * author : chaoluo
 * date : 2016-10-20
 * description : 给定一个json数据构造一个城市选择器
 * */

/**
 * param.selector : 城市选择器的目标元素
 * param.data : 城市选择器的数据
 * */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(factory);
    }else if(typeof define === 'function' && define.cmd){
        define(factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS之类的
        module.exports = factory();
    } else {
        // 浏览器全局变量(root 即 window)
        root.CitySelector = factory();
    }
}(this, function (require,exports,module) {
    function CitySelector(param) {
        if(param === undefined || param === null){
            alert('请传递城市选择器需要的参数');
            return;
        }
        var selector = document.querySelector(param.selector);
        if(selector == null){
            alert('未找到指定的目标元素，请检查元素选择器是否正确');
            return;
        }
        this.selector = param.selector;
        //保存目标dom
        this.cityDom = selector;
        //保存城市数据
        this.data = param.data;
        //当前选取的数据
        this.selectedData = {
            province : '',
            city : '',
            area : ''
        };
    }
    CitySelector.prototype = {
        init : function (/*province,city,area*/) {
            var _this = this;
            var defaultPlace = [];
            for(var i = 0 ; i < arguments.length ; i++){
                defaultPlace.push(arguments[i]);
            }
            //初始化3个列表
            var fragmentFrame = document.createDocumentFragment();
            _this._draw(defaultPlace,fragmentFrame);
            //事件听
            setTimeout(function () {
                _this.listenSelect();
            },0);
        },
        _draw : function (params,fragmentFrame) {
            console.log(params);
            var _this = this;
            var data = this.data;

            var provinceResult,
                cityResult,
                areaResult;
            provinceResult= _this.generateList(params[0],data,'hna-province-list');
            fragmentFrame.appendChild(provinceResult.selectDom);

            var pCount = data.length;
            for(var i = 0 ; i < pCount ; i++){
                if(provinceResult.selectVal == data[i].name){
                    var cityData = data[i].cityList;
                    cityResult = _this.generateList(params[1],cityData,'hna-city-list');
                    var cCount = cityData.length;
                    for(var j = 0 ; j < cCount ; j++){
                        if(cityResult.selectVal == cityData[j].name){
                            areaResult = _this.generateList(params[2],cityData[j].areaList,'hna-area-list');
                        }
                    }
                }
            }
            fragmentFrame.appendChild(provinceResult.selectDom);
            fragmentFrame.appendChild(cityResult.selectDom);
            fragmentFrame.appendChild(areaResult.selectDom);

            _this.selectedData = {
                province : provinceResult.selectVal,
                city : cityResult.selectVal,
                area : areaResult.selectVal
            };
            //添加到指定的元素上
            var target = document.querySelector(_this.selector);
            target.innerHTML = '';
            target.appendChild(fragmentFrame);
        },
        /**
         * filter : 选中的值
         * data : 数组
         * */
        generateList : function (filter,data,className) {
            console.log(filter,data,className)
            //没有默认值
            var select = document.createElement('select');
            var count = data.length;
            var selectedValue = '';

            if(className != undefined && className != ''){
                select.setAttribute('class',className);
            }
            if(filter == undefined){
                selectedValue = data[0].name || data[0];
            }else{
                for(var i = 0 ; i < count ; i++){
                    if(filter == data[i].name || data[i]){
                        selectedValue = filter;
                        break;
                    }
                }
                if(i >= count){
                    selectedValue = data[0].name || data[i];
                }
            }

            //将选中的省份设置为选中
            for(var i = 0 ; i < count ; i++){
                var option = document.createElement('option');
                option.value = data[i].name || data[i];
                if(selectedValue == (data[i].name || data[i])){
                    option.setAttribute('selected','selected');
                }
                var textNode = document.createTextNode(data[i].name || data[i]);
                option.appendChild(textNode);
                select.appendChild(option);
            }

            return {
                selectDom : select,
                selectVal : selectedValue
            };
        },
        getSelectedData : function () {
            return this.selectedData;
        },
        listenSelect : function () {
            var _this = this;
            var pSelect = document.querySelector(this.selector + ' .hna-province-list');
            var cSelect = document.querySelector(this.selector + ' .hna-city-list');
            var aSelect = document.querySelector(this.selector + ' .hna-area-list');

            _this.listen(pSelect,'change',function (e) {
                var params = [];
                var data = _this.data;
                var select = e.target || e.srcElement;
                params[0] = select[select.selectedIndex].value;
                //刷新列表
                var pCount = data.length;
                for(var i = 0 ; i < pCount ; i++){
                    if(data[i].name == params[0]){
                        var cData = data[i].cityList;
                        var cCount = cData.length;
                        var cResult = _this.updateList(cSelect,undefined,cData);
                        console.log(cResult);
                        for(var j = 0 ; j < cCount ; j++){
                            if(cResult.selectVal == cData[j].name){
                                var aData = cData[j].areaList;
                                var aResult = _this.updateList(aSelect,undefined,aData);
                                _this.selectedData.province = params[0];
                                _this.selectedData.city = cResult.selectVal;
                                _this.selectedData.area = aResult.selectVal;
                                break;
                            }
                        }
                        break;
                    }
                }
            });
            _this.listen(cSelect,'change',function (e) {
                var params = [];
                var select = e.target || e.srcElement;
                var data = _this.data;
                params[0] = _this.selectedData.province;
                params[1] = select[select.selectedIndex].value;
                //刷新列表
                var pCount = data.length;
                for(var i = 0 ; i < pCount ; i++){
                    if(data[i].name == params[0]){
                        var cData = data[i].cityList;
                        var cCount = cData.length;
                        for(var j = 0 ; j < cCount ; j++){
                            if(cData[j].name == params[1]){
                                var aData =cData[j].areaList;
                                var aResult = _this.updateList(aSelect,undefined,aData);
                                //更新选中的值
                                _this.selectedData.city = params[1];
                                _this.selectedData.area = aResult.selectVal;
                            }
                        }
                    }
                }
            });
            _this.listen(aSelect,'change',function (e) {
                var select = e.target || e.srcElement;
                var area = select[select.selectedIndex].value;
                _this.selectedData.area = area;
                console.log(_this.selectedData);
            });
        },
        updateList : function (select,filter,data) {
            var fragment = document.createDocumentFragment();

            //没有默认值
            var count = data.length;
            var selectedValue = '';

            if(filter == undefined || filter == ''){
                selectedValue = data[0].name || data[0];
            }else{
                for(var i = 0 ; i < count ; i++){
                    if(filter == data[i].name){
                        selectedValue = data[i].name || data[i];
                        break;
                    }
                }
                if(i >= count){
                    selectedValue = data[0].name || data[i];
                }
            }
            console.log(selectedValue);
            //将选中的值设置为选中
            for(var i = 0 ; i < count ; i++){
                var option = document.createElement('option');
                option.value = data[i].name || data[i];
                if(selectedValue == (data[i].name || data[i])){
                    option.setAttribute('selected','selected');
                }
                var textNode = document.createTextNode(data[i].name || data[i]);
                option.appendChild(textNode);
                fragment.appendChild(option);
            }
            select.length = 0;
            select.appendChild(fragment);

            return {
                selectDom : select,
                selectVal : selectedValue
            };
        },
        listen : function (dom,eventName,callback) {
            if(dom.addEventListener){
                dom.addEventListener(eventName,callback);
            }else if(dom.attachEvent){
                dom.attachEvent('on' + eventName,callback);
            }else{
                console.log('不支持IE8以下的版本');
            }
        }
    };
    return CitySelector;
}));


