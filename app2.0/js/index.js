//日期格式化函数
Date.prototype.format = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};

var dataobj, data, index;
//判断用户是否是第一次使用（专指没有清空过缓存那些）
if (localStorage.getItem("data")) {
    dataobj = JSON.parse(localStorage.getItem("data"));
} else {
    dataobj = [];
    data = localStorage.setItem("data", JSON.stringify(dataobj));
}


var vue = new Vue({
    el: "#wordText",
    data: {
        //原始用户评论信息
        textcontent: dataobj,
        textcontents: [],
        //全部总计
        totalCount: [
            { totalWeight: '', totalIncome: '' },
            { hightWeight: '', hightIncome: '', hightPrice: '' }
        ],
        //本月总计
        crrMonthCount: [
            { totalWeight: '', totalIncome: '' },
            { hightWeight: '', hightIncome: '', hightPrice: '' }
        ],
        rcShowflag: false,
        allShowflag: false,
        crrShowflag: false
    },
    /*
    computed: {
        textcontents: function() {
            return this.textcontent.reverse();
        }
    },*/
    methods: {
        //点击遮罩层消失
        wraphide: function() {
            this.rcShowflag = false;
        },
        //阻止冒泡
        stopPro: function(e) {
            e = e || event;
            e.stopPropagation();
        },
        showWrap: function() {
            //切换显示
            this.rcShowflag = true;
        },
        //全部总计显示隐藏
        allwraphide: function() {
            this.allShowflag = false;
        },
        allshowWrap: function() {
            this.allShowflag = true;
            var totalWeight = 0,
                totalIncome = 0,
                hightWeight = 0,
                hightPrice = 0,
                hightIncome = 0;

            //获取本地缓存数据
            var localData = JSON.parse(localStorage.getItem("data"));
            for (var i = 0, len = localData.length; i < len; i++) {
                totalWeight += localData[i].weight;
                totalIncome = totalIncome + ((localData[i].price * localData[i].weight) * 100) / 100;
                //最高重量
                if (hightWeight < localData[i].weight) {
                    hightWeight = localData[i].weight;
                }
                //最高花价
                if (hightPrice < localData[i].price) {
                    hightPrice = localData[i].price;
                }
                //最高收入
                var temp = ((localData[i].price * localData[i].weight) * 100) / 100;
                if (hightIncome < temp) {
                    hightIncome = temp;
                }
            }
            //总计赋值
            this.totalCount[0].totalWeight = Math.round(totalWeight * 100) / 100;
            this.totalCount[0].totalIncome = Math.round(totalIncome * 100) / 100;
            //历史之最赋值
            this.totalCount[1].hightWeight = Math.round(hightWeight * 100) / 100;
            this.totalCount[1].hightIncome = Math.round(hightIncome * 100) / 100;
            this.totalCount[1].hightPrice = Math.round(hightPrice * 100) / 100;

        },
        //本月总计显示隐藏
        crrwraphide: function() {
            this.crrShowflag = false;
        },
        crrShowWrap: function() {
            this.crrShowflag = true;
            var localData = JSON.parse(localStorage.getItem("data"));
            var crrMonthData = []; //本月数据容器
            var data, crrMonth, crrYear;
            var nowYear = new Date().getFullYear();
            var nowMonth = new Date().getMonth() + 1;
            //过滤本月数据
            for (var i = 0, len = localData.length; i < len; i++) {
                data = (localData[i].data.split(" "))[0];
                crrMonth = parseInt((data.split("-"))[1]); //数据里面的月
                crrYear = parseInt((data.split("-"))[0]); //数据里面的年
                //判断数据里面日期是否等于当前月，等于则存储起来
                if (nowYear == crrYear && nowMonth == crrMonth) {
                    crrMonthData[crrMonthData.length] = localData[i];
                }
            }

            //赋值输出到页面
            var totalWeight = 0,
                totalIncome = 0,
                hightWeight = 0,
                hightPrice = 0,
                hightIncome = 0;

            //获取本地缓存数据
            for (var i = 0, len = crrMonthData.length; i < len; i++) {
                totalWeight += crrMonthData[i].weight;
                totalIncome = totalIncome + ((crrMonthData[i].price * crrMonthData[i].weight) * 100) / 100;
                //最高重量
                if (hightWeight < crrMonthData[i].weight) {
                    hightWeight = crrMonthData[i].weight;
                }
                //最高花价
                if (hightPrice < crrMonthData[i].price) {
                    hightPrice = crrMonthData[i].price;
                }
                //最高收入
                var temp = ((crrMonthData[i].price * crrMonthData[i].weight) * 100) / 100;
                if (hightIncome < temp) {
                    hightIncome = temp;
                }
            }
            //总计赋值
            this.crrMonthCount[0].totalWeight = Math.round(totalWeight * 100) / 100;
            this.crrMonthCount[0].totalIncome = Math.round(totalIncome * 100) / 100;
            //历史之最赋值
            this.crrMonthCount[1].hightWeight = Math.round(hightWeight * 100) / 100;
            this.crrMonthCount[1].hightIncome = Math.round(hightIncome * 100) / 100;
            this.crrMonthCount[1].hightPrice = Math.round(hightPrice * 100) / 100;

        },
        //添加工作记录
        addItem: function(e) {
            var e = e || event;
            var index = null;
            var tempobj = {}; //存储插入数据的容器

            var localData = JSON.parse(localStorage.getItem("data"));
            //判断开始的时候是否是否为空
            if (localData.length == 0) {
                index = 1;
            } else {
                index = parseInt(localData[0].id) + 1;
            }

            var numReg = /^\d+(\.\d+)?$/; //小数字正则
            var text = document.getElementsByClassName("words")[0].value;
            var price = document.getElementById("price").value;
            var weight = document.getElementById("weight").value;
            var floatprice = parseFloat(price);
            var floatweight = parseFloat(weight);

            var data = new Date().format("yyyy-MM-dd hh:mm:ss");
            var flag = (text !== "" && price !== "" && weight !== "" && numReg.test(price) && numReg.test(weight));
            if (flag) {
                tempobj.id = index; //设置id
                tempobj.price = floatprice; //设置花价
                tempobj.weight = floatweight; //设置重量
                tempobj.content = text; //设置内容
                tempobj.data = data; //设置时间

                localData.unshift(tempobj);
                this.textcontent = localData; //当前对象添加新增内容

                localStorage.setItem("data", JSON.stringify(localData));

                //重置表单
                document.getElementsByClassName("words")[0].value = "";
                document.getElementById("price").value = "";
                document.getElementById("weight").value = "";

                //切换隐藏
                this.rcShowflag = false;

            } else {
                alert("请按要求输入的内容！");
                e.stopPropagation();
            }
        },
        delItem: function(index) {

            this.textcontent.splice(index, 1); //删除vue数据中对应选项

            //删除本地localStorage中的对应的数据项
            var localData = JSON.parse(localStorage.getItem("data")); //先获取缓存数据
            localData.splice(index, 1); //删除缓存数据
            localStorage.setItem("data", JSON.stringify(localData)); //保存缓存数据
        }
    }
});