// 定义画布大小
const width = 1200;
const height = 700;

// 创建画布
const svg = d3
  .select("body")
  .append("svg")
  .attr("id", "svg")
  .attr("width", width)
  .attr("height", height);

// 节点数据
const nodes = [
	{name: "信息科学技术学院", type: "信息与工程科学部", size: 5, },
	{name: "计算机学院", type: "信息与工程科学部", size: 5, },
	{name: "电子学院", type: "信息与工程科学部", size: 5, },
	{name: "智能学院", type: "信息与工程科学部", size: 5, },
	{name: "集成电路学院", type: "信息与工程科学部", size: 5, },
	{name: "工学院", type: "信息与工程科学部", size: 5, },
	{name: "环境科学与工程学院", type: "信息与工程科学部", size: 5, },
	{name: "软件与微电子学院", type: "信息与工程科学部", size: 5, },
	{name: "材料科学与工程学院", type: "信息与工程科学部", size: 5, },
	{name: "未来技术学院", type: "信息与工程科学部", size: 5, },
	{name: "王选计算机研究所", type: "信息与工程科学部", size: 3, },
	{name: "软件工程国家工程研究中心", type: "信息与工程科学部", size: 3, },
	{name: "数学科学学院", type: "理学部", size: 5, },
	{name: "物理学院", type: "理学部", size: 5, },
	{name: "计算机科学技术系", type: "前身机构", size: 4, },
	{name: "清华大学", type: "其他学校", size: 6, },
	{name: "天津大学", type: "其他学校", size: 6, },
	{name: "数学系力学专业", type: "前身机构", size: 3, },
	{name: "北京大学力学系", type: "前身机构", size: 4, },
	{name: "化学与分子工程学院", type: "理学部", size: 5, },
    {name: "环境化学专业", type: "前身机构", size: 3, },
    {name: "先进材料与纳米技术系", type: "前身机构", size: 4, },
    {name: "汉字信息处理技术研究室", type: "前身机构", size: 2, },
    {name: "信息与工程科学部", type: "信息与工程科学部", size: 10, },
];

// 节点关系
const links = [
    {source: 0, target: 14, },
    {source: 0, target: 23, },
    {source: 1, target: 0, },
    {source: 1, target: 23, },
    {source: 2, target: 0, },
    {source: 2, target: 23, },
    {source: 3, target: 0, },
    {source: 3, target: 23, },
    {source: 4, target: 0, },
    {source: 4, target: 23, },
    {source: 5, target: 15, },
    {source: 5, target: 16, },
    {source: 5, target: 18, },
    {source: 5, target: 23, },
    {source: 6, target: 20, },
    {source: 6, target: 23, },
    {source: 7, target: 23, },
    {source: 8, target: 21, },
    {source: 8, target: 23, },
    {source: 9, target: 23, },
    {source: 10, target: 22, },
    {source: 10, target: 23, },
    {source: 11, target: 23, },
    {source: 14, target: 12, },
    {source: 14, target: 13, },
    {source: 17, target: 12, },
    {source: 18, target: 17, },
    {source: 20, target: 19, },
    {source: 21, target: 19, },
    {source: 22, target: 2, },
];

// 颜色映射
const colorproj = {
	"信息与工程科学部": "yellow",
	"其他学校": "Cyan",
	"前身机构": "#8B658B",
    "理学部": "grey",
};

// 新建一个力导向图
let simulation = d3
    .forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(-200)) // 电荷力 相互之间的作用力
    .force("center", d3.forceCenter(width / 2, height / 2)) // 用指定的x坐标和y坐标创建一个居中力
    .force("link", d3.forceLink(links).distance(100)) //
    .on("tick", ticked);

console.log(simulation);

// 画线
function drawLine() {
    let lines = svg
        .append("g")
        .selectAll(".force-line")
        .data(links)
        .enter()
        .append("line")
        .attr("class", "line")
        .attr("stroke", "#999")
        .attr("stroke-width", "3px");

    return lines;
}
let lines = drawLine();

// 画节点节点盒子
function drawCircle() {
    let nodeGroups = svg
        .append("g")
        .attr("class", "nodes-box")
        .selectAll(".force-node")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "force-circle")
        .call(
            d3.drag().on("start", started).on("drag", dragged).on("end", ended)
        );

    nodeGroups
        .append("circle")
        .attr("class", "force-circle")
        .attr("r", function (d){
            return 5*d.size
        })
        .style("fill", function (d) {
            return colorproj[d.type];
        });

    nodeGroups
        .append("text")
        .attr("class", "force-text")
        .attr("dy", ".33em")
        .attr("font-size", "12px")
        .attr("text-anchor", "middle")
        .style("fill", "black")
        .text(function (d) {
            return d.name;
        });

    return nodeGroups;
}
let nodesCircle = drawCircle();

function ticked() {
	lines
		.attr("x1", (d) => {
		return d.source.x;
		})
		.attr("y1", (d) => {
		return d.source.y;
		})
		.attr("x2", (d) => {
		return d.target.x;
		})
		.attr("y2", (d) => {
		return d.target.y;
		});

	nodesCircle.attr("transform", function (d) {
		// d.fx=d.x;d.fy=d.y; 固定位置
		return "translate(" + d.x + ", " + d.y + ")";
	});
}

// 拖拽
function started(event) {
	if (!event.active) simulation.alphaTarget(0.3).restart();
	event.subject.fx = event.subject.x;
	event.subject.fy = event.subject.y;
}

function dragged(event) {
	event.subject.fx = event.x;
	event.subject.fy = event.y;
}

function ended(event) {
	if (!event.active) simulation.alphaTarget(0);
	event.subject.fx = null;
	event.subject.fy = null;
}


// 绘制图例
const data_legend = [
	{name: "理学部", color: "grey",},
    {name: "信息与工程科学部", color: "yellow",},
	{name: "其他学校", color: "Cyan",},
	{name: "前身机构", color: "#8B658B",},
]

var legend = svg.selectAll(".legend") 
    .data(data_legend)
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(-30," + (i * 20 + 30) + ")"; });  //transform属性便是整个图例的坐标
 
//绘制文字后方的颜色框或线
legend.append("rect")
    .attr("x", width - 25) //width是svg的宽度，x属性用来调整位置
    // .attr("x", (width / 160) * 157)  
    //或者可以用width的分数来表示，更稳定一些，这是我试出来的，下面同
    .attr("y", 8)
    .attr("width", 20)
    .attr("height", 10) //设低一些就是线，高一些就是面，很好理解
    .style("fill", function(d){
        return d.color
    });
 
//绘制图例文字
legend.append("text")
    .attr("x", width - 30)
    // .attr("x", (width / 40) * 39)
    .attr("y", 15)
    .style("text-anchor", "end") //样式对齐
    .text(function(d) { 
        return d.name;
    });