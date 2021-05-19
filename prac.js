//---------------------------- Your web app's Firebase configuration --------------------------------
var firebaseConfig = {
  apiKey: "AIzaSyCzg7cqdi0YTdTnmBTFmVHaKDcIOizPCSg",
  authDomain: "mevent-91033.firebaseapp.com",
  projectId: "mevent-91033",
  storageBucket: "mevent-91033.appspot.com",
  messagingSenderId: "265323651114",
  appId: "1:265323651114:web:e78d4d40ed8cf32ecea353"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


/*  *************************************************************************************   */

let clicks = [];

let label = document.createElement('label');
label.innerText = "";
document.getElementById('divTag').appendChild(label);
document.getElementById('divTag').addEventListener('mousemove', (e) => {
  let pos = `(${e.clientX}, ${e.clientY})`;
  label.innerText = pos;
  label.style.position = 'absolute';
  label.style.top = e.clientY + "px";
  label.style.left = (e.clientX + 10) + "px";
});

// MouseUp Event method

function mouseUp(e) {
  e.preventDefault();
  if (!(e.target && e.target.id == 'divTag'))
    return

  //--------------------------------------Div Element-------------------------------------

  let div = document.createElement('div');
  let divId = Date.now();
  console.log("DivId -> " + divId);
  div.setAttribute('id', `div${divId}`);
  document.getElementById('divTag').appendChild(div);
  div.style.position = 'absolute';
  div.style.top = e.clientY + "px";
  div.style.left = e.clientX + "px";

  let X = e.clientX;
  let Y = e.clientY;

  changeFunc(divId, X, Y);             // calling change method
  writeData(divId, X, Y);             // calling write method
}



function changeFunc(divId, X, Y){

 //----------------------------------------Label Element---------------------------------

 let demo = document.createElement('label');
 demo.setAttribute('id', `label${divId}`);
 demo.innerText = 'Hello';
 document.getElementById(`div${divId}`).appendChild(demo);

  clicks.push({
    'text': 'Hello',
    'x': X,
    'y': Y,
    'id': divId
  })
 
 console.log(clicks);

  //----------------------------------Edit Button----------------------------------------

  let editBtn = document.createElement('input');
  editBtn.setAttribute('type', 'button');
  editBtn.setAttribute('value', "edit");
  editBtn.setAttribute('id', `edit${divId}`);
  editBtn.setAttribute('onclick', `editFunc(${divId}, label${divId}, edit${divId}, cancel${divId}, save${divId})`);
  document.getElementById(`div${divId}`).appendChild(editBtn);

  //------------------------------------Save Button----------------------------------------

  let saveBtn = document.createElement('button');
  saveBtn.innerHTML = 'save';
  saveBtn.setAttribute('id', `save${divId}`);
  saveId = `save${divId}`;
  document.getElementById(`div${divId}`).appendChild(saveBtn);
  saveBtn.style.display = "none";

  //-------------------------------------Cancel Button----------------------------------------

  let cancelBtn = document.createElement('button');
  cancelBtn.innerHTML = 'Cancel';
  cancelBtn.setAttribute('id', `cancel${divId}`);
  cancelId = `cancel${divId}`;
  document.getElementById(`div${divId}`).appendChild(cancelBtn);
  cancelBtn.style.display = "none";

  // --------------------------------------Remove Button----------------------------------------

  let removeBtn = document.createElement('button');
  removeBtn.innerHTML = 'remove';
  removeBtn.setAttribute('id', `remove${divId}`);
  removeId = `remove${divId}`;
  removeBtn.setAttribute('onclick', `removeFunc(${divId} , div${divId})`);
  document.getElementById(`div${divId}`).appendChild(removeBtn);
   
}

//---------------------------------------Edit Function--------------------------------------------------

function editFunc(editId, labelEle, editEle, cancelEle, saveEle) {
  let value = labelEle.innerText;
  labelEle.innerText = "";

  let input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.setAttribute('value', value);
  inputId = `input${editId}`;
  input.setAttribute('id', inputId);
  labelEle.appendChild(input);

  editEle.style.display = "none";
  saveEle.style.display = "block";
  cancelEle.style.display = "block";

  //-----------------------------------------Save Event Occur--------------------------------------------

  saveEle.addEventListener('click', () => {

    let inputVal = input.value;
    console.log(inputVal);
    labelEle.innerText = inputVal;

    editEle.style.display = "block";
    saveEle.style.display = "none";
    cancelEle.style.display = "none";

    let x = editId;
    let index = clicks.findIndex(({ id }) => x === id);
    console.log(index);
    let val = clicks[index]
    val.text = inputVal;
    console.log(clicks);

    updateData(editId, inputVal);             //calling update method
  });

  //-----------------------------------------Cancel Event Occur------------------------------------

  cancelEle.addEventListener('click', () => {
    labelEle.innerText = value;
    editEle.style.display = "block";
    saveEle.style.display = "none";
    cancelEle.style.display = "none";
  });

}

//------------------------------------Remove Function-----------------------------

function removeFunc(Id, divEle) {
  var x = Id;
  console.log(x);
  let index = clicks.findIndex(({ id }) => x === id);
  console.log(index);
  clicks.splice(index, 1);

  divEle.remove();
  console.log(clicks);

  deleteData(Id);             //calling delete method
}

// -----------------------------Write data into Firestore----------------------------

function writeData(Id, X, Y) {
  let item = document.getElementById(`label${Id}`);
  firebase.firestore().collection("inputData").doc(`${Id}`).set({
    name: item.textContent,
    x: X,
    y: Y
  });
  
}

// ------------------------------Read data from Firestore------------------------------

window.onload = function getData() {

  firebase.firestore().collection("inputData").get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.data());
        // alert(doc.data());
        let div = document.createElement('div');
        div.style.position = "absolute";
        div.style.top = doc.data().y + "px";
        div.style.left = doc.data().x + "px";
        div.innerText = doc.data().name + " (" + doc.data().x + "," + doc.data().y + ")";
        div.setAttribute('id', `div${doc.id}`)
        console.log(`${doc.id}`);
        document.getElementById("divTag").appendChild(div);

        let Id = `${doc.id}`;
        let X = doc.data().x;
        let Y = doc.data().y;    

         changeFunc(Id, X, Y);
      });
    });
}

// ------------------------------Update data into firestore------------------------------

function updateData(Id, inputVal) {
  console.log(Id);
  console.log(inputVal);
  firebase.firestore().collection("inputData").doc(`${Id}`).update({
    name: inputVal
  })
  reRead(Id);
}

// ------------------------------Reread data from Firestore------------------------------

function reRead(Id) {
  firebase.firestore().collection("inputData").doc(`${Id}`).get()
    .then((doc) => {
      if (doc.exists) {
        // console.log("Document data:", doc.data());
        document.getElementById("data").innerHTML = doc.data().name;
        console.log("Document data:", doc.data());
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    })

}


// ------------------------------Delete data from Collection------------------------------

function deleteData(Id) {
  console.log(Id);
  firebase.firestore().collection("inputData").doc(`${Id}`).delete();
 }


