export default {
    // 把数组转成树结构数据
    translateDataToTree(data, parentKey, titleKey, key) {
        let newData = [];
        data.forEach(item => {
            item = {
                ...item,
                scopedSlots: {title: 'node'},
                node: {
                    ...item,
                }
            };
            if (titleKey) {
                item.node['title'] = item[titleKey];
                item['title'] = item[titleKey];
                item['key'] = item[key];
                item['value'] = item[key];
            }
            delete item.isLeaf;
            newData.push(item);
        });
        let parents = newData.filter(value => value[parentKey] == 'undefined' || value[parentKey]  == null || value[parentKey]  == '0' || value[parentKey]  == '');
        let children = newData.filter(value => value[parentKey]  !== 'undefined' && value[parentKey]  != null && value[parentKey]  != '0' && value[parentKey]  != '');
        let translator = (parents, children) => {
            parents.forEach((parent) => {
                    children.forEach((current, index) => {
                            if (current[parentKey] === parent[key]) {
                                let temp = JSON.parse(JSON.stringify(children));
                                temp.splice(index, 1)
                                translator([current], temp)
                                typeof parent.children !== 'undefined' ? parent.children.push(current) : parent.children = [current]
                            }
                        }
                    )
                }
            )
        };
        translator(parents, children);
        return {
            data: newData,
            treeData: parents
        }
    },
    // 千分位以及小数点转换
    toThousandFix (value) {
        if (value === 0) {
            return '0.00'
        }
        if (value) {
            value = value.toString()
            /*原来用的是Number(value).toFixed(0)，这样取整时有问题，例如0.51取整之后为1，感谢Nils指正*/
            var intPart = Math.trunc(value) //获取整数部分

            var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') //将整数部分逢三一断

            var floatPart = '.00' //预定义小数部分
            var value2Array = value.split('.')

            //=2表示数据有小数位
            if (value2Array.length == 2) {
                floatPart = value2Array[1].toString() //拿到小数部分

                if (floatPart.length == 1) { //补0,实际上用不着
                    return intPartFormat + '.' + floatPart + '0'
                } else {
                    return intPartFormat + '.' + floatPart.substr(0, 2)
                }

            } else {
                return intPartFormat + floatPart
            }
        }
    },
    // 格式化下拉tree数据，返回完整数据和根节点
    formatTreeData(data, parentKey, titleKey, key, dataKey) {
        let newData = [];
        let newItem = {};
        data.forEach(item => {
            newItem = {
                id: item.id ? item.id : item[key],
                pId: item[parentKey],
                value: item[key],
                title: item[titleKey],
                isLeaf: item.isLeaf == '1' ? true : false,
                dataKey: dataKey,
                node: {
                    ...item,
                }
            };
            newData.push(newItem);
        });
        const parents = newData.filter(value => value.pId == 'undefined' || value.pId  == null || value.pId  == '0' || value.pId  == '');
        let children = newData.filter(value => value.pId  !== 'undefined' && value.pId  != null && value.pId  != '0' && value.pId  != '');
        return {
            childNode: children,
            rootNode: parents,
            allNode: newData
        }
    },
    // 获取tree节点
    getTreeNode(treeData, pId) {
        const childNode = treeData.filter(item => item.pId == pId);
        return childNode;
    }
}
