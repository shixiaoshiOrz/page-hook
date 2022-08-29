
import md5 from 'js-md5';
//根据参数生成id
const getConfigId = function(config) {
    let method = config?.method || ""
    let url = config?.url || ""
    let body = config?.body || ""
    return md5( method + url + body)
}
const getUrlName = function(url){
    return url.split('/')[url.split('/').length -1] || '暂无信息'
}
function compare(prop) {
    return function (obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
            val1 = Number(val1);
            val2 = Number(val2);
        }
        if (val1 < val2) {
            return -1;
        } else if (val1 > val2) {
            return 1;
        } else {
            return 0;
        }
    };
}

// 根据权限获取权限树
function queryMenutree(appInfoArray) {

    const authorizations = appInfoArray || [];

    var newAuthorizations = [];

    const sort = compare("productOrder");
    newAuthorizations = authorizations.filter(function (item) {
        // 获取根级模块
        return !item.authorizationParentId;
    });
    newAuthorizations.map((item) => {
        item.child = [];
        authorizations.map((cu) => {
            cu.id = cu.authorizationId;
            cu.name = cu.authorizationName;
            if (cu.authorizationParentId == item.authorizationId) {
                item.child.push(cu);
            }
        });
    });
    newAuthorizations.sort(sort);


    let obj = {};
    let ids = newAuthorizations.reduce(function (item, next) {
        obj[next.productId]
            ? ""
            : (obj[next.productId] = true && item.push(next));
        return item;
    }, []);
    let arr = [];
    ids.map((item, index) => {
        let obj = {
            menuIconKey: item.menuIconKey,
            objType: item.objType,
            productIconKey: item.productIconKey,
            productId: item.productId,
            id: item.productId,
            name: item.productName,
            productName: item.productName,
            productOrder: item.productOrder,
            productUrl: item.productUrl,
            child: [],
        };
        let arr1 = newAuthorizations.filter((c) => {
            return item.productId == c.productId;
        });
        if (arr1.length) {
            obj.child = arr1;
            arr.push(obj);
        }
    });

    return arr;
}
 function isURL(str_url){ 
         var strRegex = "^((https|http|ftp|rtsp|mms)?://)"  
         + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@  
         + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184  
         + "|" // 允许IP和DOMAIN（域名） 
         + "([0-9a-z_!~*'()-]+\.)*" // 域名- www.  
         + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名  
         + "[a-z]{2,6})" // first level domain- .com or .museum  
         + "(:[0-9]{1,4})?" // 端口- :80  
         + "((/?)|" // a slash isn't required if there is no file name  
         + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";  
         var re=new RegExp(strRegex);  
       if (re.test(str_url)){ 
            return true  
        }else{  
            return false  
       } 
    }
      
function time(){
    var d = new Date();
    var year = d.getFullYear();
    var month = change(d.getMonth() + 1);
    var day = change(d.getDate());
    var hour = change(d.getHours());
    var minute = change(d.getMinutes());
    var second = change(d.getSeconds());
    function change(t) {
        if (t < 10) {
            return "0" + t;
        } else {
            return t;
        }
    }
    return year + month + day +hour + minute +second;
}
export {
    getConfigId,
    getUrlName,
    queryMenutree,
    compare,
    isURL,
    time
}