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
	{name: "人文学部", type: "人文学部", size: 5, },

	{name: "考古文博学院", type: "人文学部", size: 5, },
	{name: "外国语学院", type: "人文学部", size: 5, },
	{name: "对外汉语教育学院", type: "人文学部", size: 5, },
	{name: "中国语言文学系", type: "人文学部", size: 5, },
	{name: "历史学系", type: "人文学部", size: 5, },
	{name: "艺术学系", type: "人文学部", size: 5, },
	{name: "歌剧研究院", type: "人文学部", size: 5, },
	{name: "哲学系", type: "人文学部", size: 5, },

	{name: "清华大学", type: "其他学校", size: 6, },
	{name: "燕京大学", type: "其他学校", size: 6, },


];

// 节点关系
const links = [
    {source: 1, target: 0, },
    {source: 2, target: 0, },
    {source: 3, target: 0, },
    {source: 4, target: 0, },
    {source: 5, target: 0, },
    {source: 6, target: 0, },
    {source: 7, target: 0, },
    {source: 8, target: 0, },
    {source: 5, target: 1, },
    {source: 6, target: 7, },
    {source: 3, target: 2, },
    {source: 9, target: 2, },
    {source: 9, target: 4, },
    {source: 9, target: 5, },
    {source: 10, target: 2, },
    {source: 10, target: 4, },
    {source: 10, target: 5, },
];

// 颜色映射
const colorproj = {
	"人文学部": "yellow",
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