class HoverBox {

    static obj = null;
    static div = document.querySelector("#hoverBox");
    static title = document.querySelector("#hoverBox > .titleHolder");
    static description = document.querySelector("#hoverBox > div:nth-child(2) > .descriptionHolder");
    static materials = document.querySelector('#hoverBox > div:nth-child(2) > .materialsHolder');

    static newHoverBox(Class) {
        let obj = Class;
        if(HoverBox.obj != obj) {
            if(HoverBox.obj != null) {
                HoverBox.getRidOfBox();
            }
            HoverBox.div.fadeIn(100, 'flex');
            HoverBox.obj = obj;
            HoverBox.title.innerHTML = obj.name;
            HoverBox.description.innerHTML = obj.description;
            HoverBox.materials.innerHTML = '';
            let object = {
                wood: "Tree",
                stone: "Rock",
                food: "Bush",
                gold: "Gold"
            }
            if(obj.type == 'Building') {
                Object.keys(obj.cost[0]).forEach(key => {
                    if(obj.cost[0][key] != 0) {
                        HoverBox.materials.innerHTML += `<div><img src="Images/${object[key]}/${object[key]}.png"><p>${obj.cost[0][key]}</p></div>`;
                    }
                });
            } else if(obj.type == 'Resource') {
                Object.keys(obj.cost).forEach(key => {
                    if(obj.cost[key] != 0) {
                        HoverBox.materials.innerHTML += `<div><img src="Images/${object[key]}/${object[key]}.png"><p>${obj.cost[key]}</p></div>`;
                    }
                });
            }
        }
    }

    static getRidOfBox() {
        HoverBox.obj = null;
        HoverBox.div.style.display = 'none';
    }
}