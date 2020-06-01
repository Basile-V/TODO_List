function setUp(){
  load("script/data.txt");
  /*var register = document.getElementById('registration');
  register.addEventListener('submit', registration);*/
}


function load(fichier) {
  var list = document.getElementById("list");
  var choice = document.getElementById("choice");
  var xhr = new XMLHttpRequest();
  var i;
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      response = this.response;
      refresh();
    } else if (this.readyState == 4 && this.status == 404) {
      alert('Erreur 404 :/');
    }
  };
  xhr.open("GET", fichier, true);
  xhr.responseType = "json";
  xhr.send();
}

function refresh(){
  if(localStorage.getItem('user') != null){
    document.getElementById('disconnect').style.visibility = "hidden";
    document.getElementById('connect').style.visibility = "visible";
    var connect = document.getElementById('connect');
    connect.innerHTML = "<p>Hello " + localStorage.getItem('user') + "</p><input type=\"submit\" value=\"logout\" onclick=\"logout()\">";
  }
  else{
    document.getElementById('disconnect').style.visibility = "visible";
    document.getElementById('connect').style.visibility = "hidden";
  }
  var authors = response.users;
  var items = response.items;
  var tags = response.tags;
  choice.innerHTML = "<form id=\"tags\">Pick some tags :";
  for(i = 0; i < tags.length; i++){
    choice.innerHTML = choice.innerHTML + "<INPUT type=\"checkbox\" name=\"checkbox\" value=\"" + tags[i].id + "\">" + tags[i].name + " \t";
  }
  choice.innerHTML = choice.innerHTML + "<INPUT type=\"button\" value= \"filter\" onclick=\"filter()\"></form>";
  list.innerHTML = "";
  for(i = 0; i < items.length; i++){
    if(localStorage.getItem('user') == authors[items[i].author].name){
      list.innerHTML = list.innerHTML + "<div class=\"item\"><form id=\"" + items[i].id + "\"><p class=\"author\"> author : " + authors[items[i].author].name + "</p><input type=\"text\" name\"content\" value=\"" + items[i].content + "\"><br><input type=\"button\" value=\"Delete\" onclick=\"removeItem(" + items[i].id +  ")\"><input type=\"button\" value=\"Edit\" onclick=\"edit(" + items[i].id +  ")\"></form></div>";
    }
    else{
      list.innerHTML = list.innerHTML + "<div class=  \"item\"><form id=\"" + items[i].id + "\"><p class=\"author\"> author : " + authors[items[i].author].name + "</p><p class=\"content\">" + items[i].content + "</p></div>";
    }
  }
}


function filter(){
  var box = document.getElementsByName('checkbox');
  var choices = new Set();
  var i;
  for(i = 0; i < box.length; i++){
    if(box[i].checked){
      choices.add(parseInt(box[i].value));
    }
  }
  var list = document.getElementById("list");
  console.log(response);
  var authors = response.users;
  var items = response.items;
  var tags = response.tags;
  list.innerHTML = "";
  for(i = 0; i < items.length; i++){
    if(choices.has(items[i].tag)){
      if(localStorage.getItem('user') == authors[items[i].author].name){
        list.innerHTML = list.innerHTML + "<div class=  \"item\"><form id=\"" + items[i].id + "\"><p class=\"author\"> author : " + authors[items[i].author].name + "</p><input type=\"text\" name\"content\" value=\"" + items[i].content + "\"><br><input type=\"button\" value=\"Delete\" onclick=\"removeItem(" + items[i].id +  ")\"><input type=\"button\" value=\"Edit\" onclick=\"edit(" + items[i].id +  ")\"></form></div>";
      }
      else{
        list.innerHTML = list.innerHTML + "<div class=  \"item\"><form id=\"" + items[i].id + "\"><p class=\"author\"> author : " + authors[items[i].author].name + "</p><p class=\"content\">" + items[i].content + "</p><input type=\"button\" value=\"Delete\" disabled></form></div>";
      }    }
  }
}

function logout(){
  localStorage.removeItem('user');
  document.getElementById('disconnect').style.visibility = "visible";
  document.getElementById('connect').style.visibility = "hidden";
  console.log(response);
  refresh();
}

window.addEventListener("load", setUp);


function login(){
  var user = document.getElementById('login').pseudo.value;
  var psw = document.getElementById('login').psw.value;
  var users = response.users;
  var connected = false;
  for(var i = 0; i < users.length; i++){
    if(users[i].name == user && users[i].password == psw){
      localStorage.setItem('user', user);
      connected = true;
    }
  }
  if(!connected){
    document.getElementById("log_err").innerHTML = "wrong user name or password";
  }
  else{
    refresh();
  }
}


function registration(){
  var user = document.getElementById('registration').pseudo.value;
  var psw = document.getElementById('registration').psw.value;
  var users = response.users;
  var exist = false;
  for(var i = 0; i < users.length; i++){
    if(users[i].name == user){
      exist = true;
    }
  }
  if(!exist){
    var i = users.length;
    var id = users[i - 1].id + 1;
    var newUser = {"id" : id, "name" : user, "password" : psw};
    response.users.push(newUser);
    localStorage.setItem('user', user);
  }
  else{
    document.getElementById("regist_err").innerHTML = "this user name already exist";
  }
  refresh();
}


function newItem(){
  var content = document.getElementById('newItem').content.value;
  var tag = document.getElementById('newItem').tag.value;
  var users = response.users;
  var items = response.items;
  var tags = response.tags;
  var tagId
  var userId;
  var exist = false;
  for(var i = 0; i < tags.length && !exist; i++){
    if(tags[i].name == tag){
      tagId = tags[i].id;
      exist = true;
    }
  }
  if(!exist){
    var newTag = {"id" : tags[tags.length - 1].id + 1, "name" : tag};
    response.tags.push(newTag);
    tagId = newTag.id;
  }
  var user = localStorage.getItem('user');
  if(user != null){
    exist = false;
    for(var i = 0; i < users.length && !exist; i++){
      if(users[i].name == user){
        userId = users[i].id;
        exist = true;
      }
    }
  }
  else{
    var newUser = {"id" : users[users.length - 1].id + 1, "name" : "???"};
    response.users.push(newUser);
    userId = newUser.id;
  }
  console.log(items);
  if(items.length != 0){
    var newItem = {"id" : items[items.length - 1].id + 1, "author" : userId, "tag" : tagId, "content" : content};
  }
  else{
    var newItem = {"id" : 0, "author" : userId, "tag" : tagId, "content" : content};
  }
  response.items.push(newItem);
  refresh();
}


function removeItem(id){
  var items = response.items;
  var done = false;
  for(var i = 0; i < items.length && !done; i++){
    if(items[i].id == id){
      delete response.items[i];
      done = true;
      items.length -= 1;
    }
  }
  refresh();
}


function edit(id){
  var items = response.items;
  var done = false;
  var form = document.getElementById(id);
  var input = form.getElementsByTagName("input");
  for(var i = 0; i < items.length && !done; i++){
    if(items[i].id == id){
      response.items[i].content = input[0].value;
      done = true;
    }
  }
  refresh();
}
