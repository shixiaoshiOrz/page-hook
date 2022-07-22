const GM_setObject = function (name, value) {
	if (value instanceof Object) {
		// 使用 JSON.stringify 将值转换为文本。
		GM_setValue (name, JSON.stringify(value));
	}else{
        GM_setValue (name,value);
    }
    
}
const GM_getObject = function (name, value) {
	try {
		return JSON.parse (GM_getValue (name) || null );
	} catch (e) {
		// 如果抓取的数据有误报错就直接返回默认值。
		return value;
	}
};
//抓取所有储存的数据至对象数组
const getAllKey = function () {
	var ret = {};
	GM_listValues().map(function (thing) {
		ret[thing] = GM_getValue (thing); // 值如果为对象数据需要手动调用 JSON.parse 解析。
	});
};

const deleteAll = function() {
    GM_listValues().map(GM_deleteValue);
}

const GM_ajax = ({method = "POST",url,data}) => {
    return new Promise((resolve,reject)=>{
        GM_xmlhttpRequest({
            method: method,
            url,
            data,
            headers: {
                "Content-Type": "application/json"
            },
            onload: function(response) {
                if(response.status == 200){
                    resolve(response.response)
                }else{
                    reject(response)
                }
            }
        });
    })
}


export {
    GM_ajax,
    GM_setObject,
    GM_getObject
}