# hna-city-selector
##省/市/区 联动选择器

该组件应用于上述3个层级的地点选取的场景，支持以下功能：

* 支持默认显示给定数据的省/市/县(区)
* 支持设置给定的省/市/县(区)
* 支持获取当前选中的省/市/县(区)的值
* 支持省/市选择对于整个选择器的联动

#API说明

##init(/\*province,city,area\*/)

* province：设置的省的名称
* city：设置的城市的名称
* area：设置的区、县的名称

* 参数不是必传，可以传入若干个参数，但是会被程序校验的最多是前3个参数，传入的参数会被放到给定的城市数据中进行校验，假设传入的数据是不存在的就会以相应数据的第一项作为下拉框的选中项，例如，假设传入罗超省，经过程序判断后没有该值，则默认为第一项北京。

##_draw(params,fragmentFrame)

* params：省、市、区的一个长度为3的数组
* fragmentFrame：动态通过createDocumentFragment创建的dom碎片集合，作为后续创建的下拉框的容器
* 功能说明：初始化渲染组件

##generateList(filter,data,className)

* filter：创建相应的下拉框的指定的值，没有的话可以设置为undefined
* data：数组类型，用以生成option集合
* className：可以给相应的列表添加类名，建议不用改
* 功能说明：返回创建的下拉框对象和相应的选中的值

##getSelectedData

* 功能说明：获取该组件当前选中的省、市、区的值


##listenSelect

* 功能说明：对创建的下拉框进行事件监听

##updateList(select,filter,data)

* select：待更新的下拉框
* filter：用于筛选的值
* data：用于更新下拉框的数据
* 功能说明：更新制定的下拉框

##update(params)

* params：['湖北','武汉市','市辖区']，省、市、区的数组
* 功能说明：更新城市和相应的区、县

##listen(dom,eventName,callback) 

* dom：待监听的目标dom
* eventName：事件名称
* callback：事件的处理函数
* 功能说明：兼容到ie8的事件监听

