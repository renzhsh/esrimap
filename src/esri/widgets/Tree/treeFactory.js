export default function (nodes) {
    let result = [];

    result.push(...filter(nodes))

    result.forEach(ele => build(ele, nodes))

    return result;
}

function build(pNode, list) {
    let children = filter(list, pNode.id);
    if (children && children.length > 0) {
        pNode.children = children;
        children.forEach(ele => build(ele, list))
    }
}

function filter(list, parentId) {
    return list.filter(item => {
        if (parentId == null) {
            return item.parent == null || item.parent == "" ||
                list.filter(l => l.id == item.parent).length == 0;
        }
        return item.parent == parentId;
    })
}
