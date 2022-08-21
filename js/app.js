// var list = [
//   {
//     id: 1,
//     content: "吃饭",
//     isFinish: false,
//     isEdit: false,
//   },
//   {
//     id: 2,
//     content: "睡觉",
//     isFinish: true,
//     isEdit: false,
//   },
//   {
//     id: 3,
//     content: "吃大东东",
//     isFinish: false,
//     isEdit: false,
//   },
// ];
var list = JSON.parse(window.localStorage.getItem('todos'))||[];
var type = "all"; //active completed
var container = document.querySelector(".todoapp");
bindHtml();

// 2 准备渲染函数
function bindHtml() {
  var bindlist = list;

  switch (type) {
    case "all":
      bindlist = list;
      break;
    case "active":
      bindlist = list.filter(function (t) {
        return t.isFinish == false;
      }); //!t.isFinish
      break;
    case "completed":
      bindlist = list.filter(function (t) {
        return t.isFinish == true;
      });
  }
  //计算所有未完成的数量
  var activeNum = list.filter(function (t) {
    return !t.isFinish;
  }).length;

  container.innerHTML = template("tmp", {
    bindlist: bindlist,
    activeNum: activeNum,
    length: list.length,
    type: type,
  });
  // console.log(bindlist);
  window.localStorage.setItem('todos',JSON.stringify(list));
}

//根据地址栏哈希值改变显示
window.addEventListener("hashchange", function (e) {
  type = window.location.hash.slice(2) || "all";
  bindHtml();
});

//4 事件委托的形式添加  因为input会变化 事件绑在了container 上
container.addEventListener("keydown", function (e) {
  e = e || window.event;
  var target = e.target || e.srcElement;
  var code = e.keyCode || e.which;

  if (target.className === "new-todo" && code === 13) {
    //拿到文本框里的内容 非空验证 组装一个对象 push到数组 表单置空（inerHtml 渲染时自动，操作节点时 需要手动置kong）

    var text = target.value.trim();
    if (!text) return;
    var id = 0;
   
    if (list.length) {
      id = list[list.length - 1].id + 1;
     
    } else {
      id = 1;
    }
    list.push({ id: id, content: text, isFinish: false, isEdit: false });
    bindHtml();
  }
  //10 在编辑的文本里回车  确认编辑  如果文本为空 删除  不为空 修改
  if (target.className === "edit" && code === 13) {
    var text= target.value.trim();
    var id = target.dataset.id -0;
    if(!text){
      list=list.filter(function(item){return item.id !== id;});
    }
    else{
      var todo = list. find(function(t){return t.id===id;});
      todo.content =text;
      todo.isEdit = false;
    }
    bindHtml();
  }

  //取消编辑
  if (target.className === "edit" && code === 27){
  
    var id = target.dataset.id -0;
    var todo = list.find(function(t){return t.id===id;});
    todo.isEdit=false;
    bindHtml();

  }
    
});

//5 事件的委托形式出现点击

container.addEventListener("click", function (e) {
  e = e || window.event;
  var target = e.target || e.srcElement;
  if (target.className === "toggle") {
    var id = target.dataset.id - 0;
    var todo = list.find(function (t) {
      return t.id === id;
    });
    todo.isFinish = !todo.isFinish;
    bindHtml();
  }
  //6 删除
  if (target.className === "destroy") {
    var id = target.dataset.id - 0;
    var index = list.findIndex(function (t) {
      return t.id === id;
    });
    // console.log(index);
    list.splice(index, 1);
    bindHtml();
  }

  //7 删除所有未完成的
  if (target.className === "clear-completed") {
    list = list.filter(function (t) {
      return !t.isFinish;
    });
    console.log("clear");
    bindHtml();
  }
  if (target.className === "toggle-all") {
    list.forEach(function (t) {
      t.isFinish = target.checked;
    });
    bindHtml();
  }
});

//9 进入编辑状态 双击事件委托 找到id 把isEdit true 渲染

container.addEventListener("dblclick", function (e) {
  e = e || window.event;
  var target = e.target || e.srcElement;

  if (target.className === "todo-item") {
    var id = target.dataset.id - 0;
    list.forEach(function (t) {
      t.isEdit = t.id === id ? true : false;
    });

    bindHtml();
  }
});
