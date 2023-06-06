suggeestion_area = document.getElementById("suggeestion_area")
personal_area = document.getElementById("personal_area")
search_my_table = document.getElementById("search_my_table") 

async function get_user_info(fill_area){
    if(fill_area == null){
        return 0
    }
    var txt = ""
    if(fill_area == personal_area){
        txt = "get_user_info"
    }
    else if(fill_area == suggeestion_area){
        txt = "get_ai_inqury_info"
    }
    
    var tmp = await window.fetch(txt, {
        method: 'POST',
    }).then((response) => {
        //成功結果處理
        console.log(response);
        return response.json();
    })
    .catch((error) => {
        //錯誤結果處理
        console.log(error)
    })
    fill_area.innerHTML = tmp.user_info
}

function suggeestion_area_update(){
    return get_user_info(personal_area);
}

function personal_area_update(){
    return get_user_info(suggeestion_area);
}
if(search_my_table!=null) search_my_table.addEventListener("input", search_certain_user);

async function search_certain_user(){
    var tmp = await window.fetch("get_certain_user_info", {
        body: '{"value":"'+search_my_table.value+'"}',
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        }
    }).then((response) => {
        //成功結果處理
        console.log(response);
        return response.json();
    })
    .catch((error) => {
        //錯誤結果處理
        console.log(error)
    })
    // search_my_table.value
    suggeestion_area.innerHTML = tmp.user_info
}

(async() => {
    console.log('before start');
  
    await suggeestion_area_update();
    await personal_area_update();

    console.log('after start');
  })();
