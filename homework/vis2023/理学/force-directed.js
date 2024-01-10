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
	{name: "理学部", type: "理学部", size: 10, },
	{name: "数学科学学院", type: "理学部", size: 5, },
	{name: "物理学院", type: "理学部", size: 5, },
	{name: "化学与分子工程学院", type: "理学部", size: 5, },
	{name: "地球与空间科学学院", type: "理学部", size: 4, },
	{name: "城市与环境学院", type: "理学部", size: 4, },
	{name: "心理与认知科学学院", type: "理学部", size: 5, },
	{name: "建筑与景观设计学院", type: "理学部", size: 5, },
	{name: "生命科学学院", type: "理学部", size: 5, },
	{name: "哲学系", type: "人文学部", size: 5, },
	{name: "工学院", type: "信息与工程科学学部", size: 5, },
	{name: "环境科学与工程学院", type: "信息与工程科学学部", size: 5, },
	{name: "燕京大学", type: "其他学校", size: 6, },
	{name: "清华大学", type: "其他学校", size: 6, },
	{name: "复旦大学", type: "其他学校", size: 6, },
	{name: "厦门大学", type: "其他学校", size: 6, },
	{name: "吉林大学", type: "其他学校", size: 6, },
	{name: "南京大学", type: "其他学校", size: 6, },
];

// 节点关系
const links = [
    {source: 1, target: 0, },
    {source: 1, target: 10, },
    {source: 2, target: 0, },
    {source: 2, target: 5, },
    {source: 3, target: 0, },
    {source: 3, target: 4, },
    {source: 3, target: 11, },
    {source: 4, target: 0, },
    {source: 4, target: 5, },
    {source: 5, target: 0, },
    {source: 6, target: 0, },
    {source: 7, target: 0, },
    {source: 7, target: 9, },
    {source: 8, target: 0, },
    {source: 8, target: 10, },
    {source: 9, target: 6, },
    {source: 10, target: 7, },
    {source: 11, target: 3, },
    {source: 12, target: 1, },
    {source: 12, target: 2, },
    {source: 12, target: 3, },
    {source: 12, target: 8, },
    {source: 13, target: 1, },
    {source: 13, target: 2, },
    {source: 13, target: 3, },
    {source: 13, target: 8, },
    {source: 14, target: 2, },
    {source: 15, target: 2, },
    {source: 16, target: 2, },
    {source: 17, target: 2, },
];

// 颜色映射
const colorproj = {
	"理学部": "orange",
	"人文学部": "orange",
	"其他学校": "Cyan",
	"信息与工程科学学部": "#8B658B",
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
	{name: "社会科学学部", color: "orange",},
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