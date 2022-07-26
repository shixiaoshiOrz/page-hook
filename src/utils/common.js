
import md5 from 'js-md5';
//根据参数生成id
const getConfigId = function(config) {
    let method = config?.method || ""
    let url = config?.url || ""
    let body = config?.body || ""
    // console.log(md5( method + url + body));
    return md5( method + url + body)

}
const getUrlName = function(url){
    return url.split('/')[url.split('/').length -1] || '暂无信息'
}

//设置16进制编码
const set16code = function(str){
    //使用请求体生成id，请求体可能会很长，很大
    let val = "";
    for(let i = 0; i < str.length; i++){
        if (val == "") 
            val = str.charCodeAt(i).toString(16);
        else 
            val += "," + str.charCodeAt(i).toString(16);
    }
    return val
}
//根据编码获取字符串
const get16code = function(code){
    let val="";
    let arr = code.split(",");
    for(let i = 0; i < arr.length; i++){
        val += String.fromCharCode(parseInt(arr[i],16));
    }
    return val
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
export {
    set16code,
    get16code,
    getConfigId,
    getUrlName,
    queryMenutree
}