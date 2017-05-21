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

var dataobj, data,index;
//判断用户是否是第一次使用（专指没有清空过缓存那些）
if (localStorage.getItem("data")) {
    dataobj = JSON.parse(localStorage.getItem("data"));
    console.log(dataobj)
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
        //当前用户信息
        showflag: false
    },
    /*
    computed: {
        textcontents: function() {
            return this.textcontent.reverse();
        }
    },*/
    methods: {
        showWrap: function() {
            //切换显示
            this.showflag = true;
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

            console.log(index);
            var text = document.getElementsByClassName("words")[0].value;
            var data = new Date().format("yyyy-MM-dd hh:mm:ss");

            if (text) {
                tempobj.id = index; //设置id
                tempobj.content = text; //设置内容
                tempobj.data = data; //设置时间

                localData.unshift(tempobj);
                this.textcontent = localData; //当前对象添加新增内容

                localStorage.setItem("data", JSON.stringify(localData));
                document.getElementsByClassName("words")[0].value = "";

                //切换隐藏
                this.showflag = false;

            } else {
                alert("请输入要记录的内容！");
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