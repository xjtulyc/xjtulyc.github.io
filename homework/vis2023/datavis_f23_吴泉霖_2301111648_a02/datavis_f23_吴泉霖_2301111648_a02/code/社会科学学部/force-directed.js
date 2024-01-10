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
	{name: "社会科学学部", type: "社会科学学部", size: 10, },
	{name: "国际关系学院", type: "社会科学学部", size: 5, },
	{name: "法学院", type: "社会科学学部", size: 5, },
	{name: "信息管理系", type: "社会科学学部", size: 4, },
	{name: "社会学系", type: "社会科学学部", size: 4, },
	{name: "政府管理学院", type: "社会科学学部", size: 5, },
	{name: "马克思主义学院", type: "社会科学学部", size: 5, },
	{name: "教育学院", type: "社会科学学部", size: 5, },
	{name: "新闻与传播学院", type: "社会科学学部", size: 5, },
	{name: "体育教研部", type: "社会科学学部", size: 3, },
	{name: "西南联大", type: "其他学校", size: 6, },
	{name: "政治学系", type: "前身机构", size: 4, },
	{name: "国际政治学系", type: "前身机构", size: 4, },
	{name: "北京师范大学", type: "其他学校", size: 6, },
	{name: "高等教育研究所", type: "前身机构", size:3, },
	{name: "电教中心", type: "前身机构", size: 3, },
	{name: "北京政法学院", type: "其他学校", size: 6, },
	{name: "燕京大学", type: "其他学校", size: 6, },
	{name: "中国人民大学", type: "其他学校", size: 6, },
	{name: "图书馆学系", type: "前身机构", size: 4, },
];

// 节点关系
const links = [
    {source: 1, target: 0, },
    {source: 1, target: 12, },
    {source: 2, target: 0, },
    {source: 3, target: 0, },
    {source: 3, target: 19, },
    {source: 4, target: 0, },
    {source: 4, target: 17, },
    {source: 5, target: 0, },
    {source: 5, target: 11, },
    {source: 6, target: 0, },
    {source: 7, target: 0, },
    {source: 7, target: 14, },
    {source: 7, target: 15, },
    {source: 8, target: 0, },
    {source: 8, target: 17, },
    {source: 8, target: 18, },
    {source: 9, target: 0, },
    {source: 10, target: 5, },
    {source: 10, target: 4, },
    {source: 10, target: 7, },
    {source: 12, target: 11, },
    {source: 13, target: 7, },
    {source: 16, target: 2, },
    {source: 18, target: 8, },
];

// 颜色映射
const colorproj = {
	"社会科学学部": "orange",
	"其他学校": "Cyan",
	"前身机构": "#8B658B",
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