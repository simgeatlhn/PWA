//offline data
//db=database reference
//err.code => code is error object from firebase
db.enablePersistence()
    .catch(err => {
        if (err.code == "failed-precondition") {
            //probably multible tabs open at once
            console.log("persistence failed");
        } else if (err.code == "unimplemented") {
            //lack of browser support
            console.log("persistence is not available");
        }
    })



//real-time listener
//onSnapshot method listen to this collection recipes
db.collection("recipes").onSnapshot((snapshot) => { //snapshot callback 
    //console.log(snapshot.docChanges()); //snapshot object inside console
    snapshot.docChanges().forEach(change => {
        //console.log(change, change.doc.data(), //type and ingredients in console
        //change.doc.id);

        if (change.type === "added") {
            //add the document data to the web page
            renderRecipe(change.doc.data(), change.doc.id) //ui.js e renderRecipe fonksiyonu tanımla
        }
        if (change.type === "removed") {
            //remove the document data from the web page
            removeRecipe(change.doc.id);
        }
    })
})


//add new recipe
const form = document.querySelector("form");
form.addEventListener("submit", evt => {
    evt.preventDefault();

    const recipe = {
        //id="form" reference //inde.html
        title: form.title.value,
        ingredients: form.ingredients.value
    };

    db.collection("recipes").add(recipe)
        .catch(err => console.log(err));

    form.title.value = "";
    form.ingredients.value = "";
});

//delete a recipe
const recipeContainer = document.querySelector(".recipes");
recipeContainer.addEventListener("click", evt => {
    //console.log(evt);

    //??
    if (evt.target.tagName === "I") {
        //from ui.js template
        const id = evt.target.getAttribute("data-id");
        db.collection("recipes").doc(id).delete();
    }
});