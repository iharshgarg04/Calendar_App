document.addEventListener("DOMContentLoaded", async function () {

  let currentDate = new Date();
  let currentMonth = new Date().getMonth();
  console.log(currentMonth);
  let currentYear = new Date().getFullYear();
  console.log(currentYear);
  let tasks = JSON.parse(localStorage.getItem("tasks")) || {};
  let selectedContainerId = null;
  // let selectedEditContainerId = null;

  let holidaysdata = await fetchFromApi(currentYear);

  async function createcal() {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const smalldaysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
    let firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastdayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const daysinMonth = lastdayOfMonth.getDate();
    const firstweekDay = firstDayOfMonth.getDay();
    const lastweekDay = lastdayOfMonth.getDay();

    const calendar = document.querySelector(".largeCal");
    const smallCal = document.querySelector(".smallCal");
    const monthdays = document.querySelector("#monthdays");

    calendar.innerHTML = "";
    smallCal.innerHTML = "";
    let count = 0;

    for (let i = 0; i < 7; i++) {
      const dayHeader = document.createElement("div");
      dayHeader.classList.add("weekday");
      dayHeader.textContent = daysOfWeek[i];
      const smalldayHeader = document.createElement("div");
      smalldayHeader.classList.add("daysj");
      smalldayHeader.textContent = smalldaysOfWeek[i];
      calendar.appendChild(dayHeader);
      smallCal.appendChild(smalldayHeader);
    }

    for (let i = 0; i < firstweekDay; i++) {
      const emptyCell = document.createElement("div");
      const sempty = document.createElement("div");
      emptyCell.classList.add("day", "empty");
      calendar.appendChild(emptyCell);
      smallCal.appendChild(sempty);
      count++;
    }

    for (let day = 1; day <= daysinMonth; day++) {
      let curr_month = new Date().getMonth();
      const dayCell = document.createElement("div");
      const sday = document.createElement("div");
      dayCell.classList.add("day");
      sday.classList.add("daysj");
      if (day === currentDate.getDate() && currentMonth === curr_month && currentYear === new Date().getFullYear()) {
        sday.classList.add("background");
        // dayCell.classList.add("background");
      }
      sday.textContent = day;
      smallCal.appendChild(sday);
      dayCell.textContent = day;
      calendar.appendChild(dayCell);
      count++;
    }

    // for Handeling last rows

    let remainingRows = 0;
    if (count === 35 || count === 42) {
      remainingRows = 0;
    } else if (count < 35) {
      remainingRows = 35 - count;
    } else {
      remainingRows = 42 - count;
    }

    for (let i = 0; i < remainingRows; i++) {
      let emptyLastrows = document.createElement("div");
      emptyLastrows.classList.add("day");
      calendar.appendChild(emptyLastrows);
    }

    monthdays.textContent =
      new Date(currentYear, currentMonth).toLocaleString("default", {
        month: "long",
      }) +
      " " +
      currentYear;
      
      generate();
      if(holidaysdata!==null){
        populateEvents(holidaysdata);
      }
      populateContainersWithTasks();
  }
  createcal();

  const navright = document.querySelector(".navright");
  navright.addEventListener("click",async () => {
    currentMonth += 1;
    currentMonth %= 12;
    if (currentMonth === 0) {
      currentYear += 1;
      holidaysdata = await fetchFromApi(currentYear);
    }
    createcal();
  });

  const navleft = document.querySelector(".navleft");
  navleft.addEventListener("click", async() => {
    currentMonth = currentMonth - 1;
    console.log(currentMonth);
    if (currentMonth === -1) {
      currentMonth = 11;
      currentYear -= 1;
      holidaysdata = await fetchFromApi(currentYear);
    }
    createcal();
  });




  //fetch api

  async function fetchFromApi(currentYear){
    const apiUrl = `http://localhost:4000/api?year=${currentYear}`;
    console.log("Hello i am fecthApi");
    console.log(currentYear);
    try{
      const response = await fetch(apiUrl);

      if(!response.ok){
        throw new Error('HTTP error! Status');
      }

      const data = await response.json();
      console.log(data);
      return data;
    }
    catch(error){
      console.error('Fetch error:', error);
      return null;
    }
  }
  

    //populating Events
    function populateEvents(holidays) {
        holidays.forEach((event,index) => {
          const containerId = `${event.date}`;
          // console.log(containerId);
          const container = document.querySelector(`[data-container-id="${containerId}"]`);
    
          if (container) {
            const createElem = document.createElement("div");
            createElem.classList.add("tasksAdded2");
            const createp = document.createElement("p");
            createp.textContent = event.name;
            // console.log(event.name);
            createElem.appendChild(createp);
            container.appendChild(createElem);
            createElem.addEventListener("click",(e)=>{
              e.stopPropagation();
              console.log("clicked");
              showEventsDetails(container,containerId,index,event);
            })
          }
        });
      }  


      //function to show event details

      function showEventsDetails(container,containerId,index,e){

        console.log(e);
        const popup3 = document.getElementById("popup3");
        popup3.style.display = "flex";
        const overlay = document.getElementById('overlay');
        overlay.style.display="block";
        setElementsPosition(container,containerId,popup3);

        const titleE = document.getElementById("titleE");
        const descriptionE = document.getElementById("descriptionDataE");
        const datemonthyearE = document.getElementById("date-month-year-E");
        const dayofEvent = document.getElementById("dayofevent");
        console.log(e.name);
        titleE.textContent = e.name;
        descriptionE.textContent = e.type;
        datemonthyearE.textContent = e.date;
        dayofEvent.textContent = e.day;

      }


      // setElementsPosition

     function setElementsPosition(element,containerId,popup){
      const triggerRect = element.getBoundingClientRect();
      const popupRect = popup.getBoundingClientRect();
  
      const spaceLeft = triggerRect.left;
      const spaceRight = window.innerWidth - triggerRect.right;
  
      if (spaceRight >= popupRect.width) {
        popup.style.left = triggerRect.right + "px";
      } else if (spaceLeft >= popupRect.width) {
        popup.style.left = triggerRect.left - popupRect.width + "px";
      } else {
        popup.style.left = (window.innerWidth - popupRect.width) / 2 + "px";
      }
  
      const top = Math.min(
        triggerRect.bottom,
        window.innerHeight - popupRect.height
      );
      popup.style.top = top - 170 + "px";

      const closeEvent = document.getElementById("closeTask2");
      closeEvent.addEventListener("click",()=>{
        popup.style.display = "none";
        overlay.style.display="none";
     })

      }


  // -------------------Adding popup for tasks and todos--------------------

  const close = document.querySelector(".close");
  close.addEventListener("click", () => {
    closepopup();
  });

  function generate() {
    const containers = document.querySelectorAll(".day");
    console.log("generate")
    containers.forEach(function (container) {
      const year = currentYear;
      const month = (currentMonth + 1).toString().padStart(2,0);
      const date = container.textContent.trim();
      const containerId = `${year}-${month}-${date}`;
      console.log(containerId);

      container.dataset.containerId = containerId;
      container.removeEventListener("click",handleclickEvents);
      container.addEventListener("click",()=>handleclickEvents(container,containerId));
    });
  }


  function handleclickEvents(container,containerId){

    clickedContainer = containerId
    selectedContainerId=containerId;
    showpopup(container,containerId);

  }

  //createButton

    const btn = document.getElementById("createBtn");
  
    btn.addEventListener("click", () => openTaskCreationPopup());
  
  function openTaskCreationPopup() {
    const createInputval = document.getElementById("createInputval");
    const createdescrip = document.getElementById("createdescri");
  
    const popup4 = document.getElementById("popup4");
    popup4.style.display = "flex";
    overlay.style.display = "block";
  
    createInputval.value = "";
    createdescrip.value = "";
  
    const createInput = document.getElementById("createInput");
    createInput.value = "";
  
    const createsaveBtn = document.getElementById("createsaveBtn");
  
    createsaveBtn.removeEventListener("click",saveCreateTask);
    createsaveBtn.addEventListener("click", saveCreateTask);

    
    const closeCreate = document.getElementById("closeCreate");
    closeCreate.addEventListener("click", () => closeCreateTaskPopup());
  }
  
  function closeCreateTaskPopup() {
    const popup4 = document.getElementById("popup4");
    popup4.style.display = "none";
    overlay.style.display = "none";
  }
  
  function saveCreateTask() {
    const createInput = document.getElementById("createInput");
    const createInputval = document.getElementById("createInputval");
    const createdescrip = document.getElementById("createdescri");
  
    const cId = createInput.value;
  
    if (!cId) {
      // Handle case where cId is not provided
      return;
    }
    console.log("Hii i am cId",cId);
    if (!tasks[cId]) {
      tasks[cId] = [];
    }
    if(createInputval===""){
      closeCreateTaskPopup();
      return;
    }
  
    tasks[cId].push({
      title: createInputval.value,
      description: createdescrip.value
    });
  
    localStorage.setItem("tasks", JSON.stringify(tasks));
    createInputval.value = "";
    createdescrip.value = "";
    // populateContainersWithTasks();
    
    const elementCreate = document.querySelector(`[data-container-id="${cId}"]`);
    console.log(elementCreate);
    if(elementCreate){
      elementCreate.querySelectorAll(".tasksAdded").forEach((taskElem) => {
        taskElem.remove();
      });

      if (tasks[cId]) {
        tasks[cId].forEach((task, index) => {
          const createElem = document.createElement("div");
          createElem.classList.add("tasksAdded");
          const createp = document.createElement("p");
          createp.textContent = task.title;
          createElem.appendChild(createp);
  
          createElem.addEventListener("click", (event) => {
            event.stopPropagation();
            showTaskDetails(task, elementCreate, cId, index,elementCreate);
          });
  
          elementCreate.appendChild(createElem);
        });
      }
    }

    closeCreateTaskPopup();
  }
  
  
  // createButton();
  

  function populateContainersWithTasks() {
    const containers = document.querySelectorAll(".day");
    containers.forEach((container) => {
      const containerId = container.dataset.containerId;
      const tasksForContainer = tasks[containerId];
      if (tasksForContainer) {
       
        container.querySelectorAll(".tasksAdded").forEach((task) => {
          task.remove();
        });
        tasksForContainer.forEach((task, index) => {
          const createElem = document.createElement("div");
          createElem.classList.add("tasksAdded");
          const createp = document.createElement("p");
          createp.textContent = task.title;
          createElem.appendChild(createp);
          container.appendChild(createElem);

          createElem.addEventListener("click", (event) => {
            event.stopPropagation();
            console.log("clicked");
            showTaskDetails(task, container, containerId, index);
          });
        });
      }
    });
  }

  let selectedEditContainerId;
  function showTaskDetails(task, element, containerId, index) {
    if(!containerId)return;
    console.log("Hii i am containerId" , containerId);
    const title = document.getElementById("title");
    console.log(task.title);
    title.textContent = task.title;
    const descrip = document.getElementById("descriptionData");
    // console.log(task.description);
    descrip.textContent = task.description;
    const dateMonthYear = document.getElementById("date-month-year");
    dateMonthYear.textContent = containerId;

    const popup2 = document.getElementById("popup2");
    popup2.style.display = "flex";
    const overlay = document.getElementById('overlay');
    overlay.style.display="block";

    const triggerRect = element.getBoundingClientRect();
    const popupRect = popup2.getBoundingClientRect();

    const spaceLeft = triggerRect.left;
    const spaceRight = window.innerWidth - triggerRect.right;

    if (spaceRight >= popupRect.width) {
      popup2.style.left = triggerRect.right + "px";
    } else if (spaceLeft >= popupRect.width) {
      popup2.style.left = triggerRect.left - popupRect.width + "px";
    } else {
      popup2.style.left = (window.innerWidth - popupRect.width) / 2 + "px";
    }

    const top = Math.min(
      triggerRect.bottom,
      window.innerHeight - popupRect.height
    );
    popup2.style.top = top - 170 + "px";

    const closeTask = document.getElementById("closeTask");
    closeTask.addEventListener("click", () => {
      closepopup(element);
    });

    const deleteTask = document.getElementById("delete");
    deleteTask.addEventListener("click", () => {
      removeTask(containerId, index, element);
    });

    deleteTask.removeEventListener("click", () => {
      removeTask(containerId, index, element);
    });

    const update = document.getElementById("update");
    update.addEventListener("click", () => {
      selectedEditContainerId = containerId;
      console.log("clicked");
      const popup2 = document.getElementById("popup2");
      popup2.style.display = "none";

      const popup = document.getElementById("popup");
      popup.style.display = "flex";

      let inputdata = document.getElementById("myInput");
      inputdata.value = title.textContent;
      inputdata.select();
      let description = document.getElementById("descrip");
      description.value = descrip.textContent;

      const saveBtn = document.getElementById("saveBtn");
      // saveBtn.removeEventListener("click",()=>saveBtnfun(containerId,index));
      saveBtn.removeEventListener("click",()=>saveBtnfun(selectedEditContainerId,containerId,index,description,inputdata));
      saveBtn.addEventListener("click",()=>saveBtnfun(selectedEditContainerId,containerId,index,description,inputdata));

      update.removeEventListener("click", () => {
        selectedEditContainerId = containerId;
        console.log("clicked");
        const popup2 = document.getElementById("popup2");
        popup2.style.display = "none";
    
        const popup = document.getElementById("popup");
        popup.style.display = "flex";
    
        let inputdata = document.getElementById("myInput");
        inputdata.value = title.textContent;
        inputdata.select();
        let description = document.getElementById("descrip");
        description.value = descrip.textContent;
      });

    });
  }

  function saveBtnfun(selectedEditContainerId,containerId,taskIndex,description,inputdata){
    if(!selectedEditContainerId || selectedEditContainerId!==containerId) return;
    const descriptionInput = description.value;
    const titleInput = inputdata.value;


    if (titleInput === "") return;
    
    tasks[containerId][taskIndex]={
      title:titleInput,
      description:descriptionInput
    }
    
    localStorage.setItem("tasks", JSON.stringify(tasks));
    inputdata.value="";
    description.value="";
    popup.style.display = "none";
    overlay.style.display="none";
    populateContainersWithTasks();
    selectedEditContainerId=null;
  }

  function removeTask(containerId, index, container) {
    if (tasks[containerId]) {
      tasks[containerId].splice(index, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      console.log(tasks);

      populateContainersWithTasks();

      closepopup(container);
    }
  }

  const saveBtn = document.getElementById("saveBtn");

 
  function closepopup(containerId) {
    const popup = document.getElementById("popup");
    popup.style.display = "none";
    const popup2 = document.getElementById("popup2");
    popup2.style.display = "none";
    const overlay = document.getElementById('overlay');
    overlay.style.display="none";
 

    close.removeEventListener("click",closepopup);
    const saveBtn = document.getElementById("saveBtn");
    saveBtn.removeEventListener("click",()=> saveTask(containerId));
  }

  function showpopup(element, containerId) {
    if(!containerId) return;
    const popup = document.getElementById("popup");
    popup.style.display = "flex";
    const overlay = document.getElementById('overlay');
    overlay.style.display="block";

    const triggerRect = element.getBoundingClientRect();
    const popupRect = popup.getBoundingClientRect();

    const spaceLeft = triggerRect.left;
    const spaceRight = window.innerWidth - triggerRect.right;

    if (spaceRight >= popupRect.width) {
      popup.style.left = triggerRect.right + "px";
    } else if (spaceLeft >= popupRect.width) {
      popup.style.left = triggerRect.left - popupRect.width + "px";
    } else {
      popup.style.left = (window.innerWidth - popupRect.width) / 2 + "px";
    }

    const top = Math.min(
      triggerRect.bottom,
      window.innerHeight - popupRect.height
    );
    popup.style.top = top - 60 + "px";

    const saveBtn = document.getElementById("saveBtn");
    saveBtn.addEventListener("click", ()=>saveTask(containerId));


    function saveTask(containerId) {
      if(!selectedContainerId || selectedContainerId!==containerId) return;
      let inputdata = document.getElementById("myInput").value;
      let descriptiondata = document.querySelector(".descrip textarea").value;

      if (!tasks[containerId]) {
        tasks[containerId] = [];
      }
      
      if(inputdata===""){
        closepopup();
        return;
      }

      tasks[containerId].push({
        title: inputdata,
        description: descriptiondata,
      });

      localStorage.setItem("tasks", JSON.stringify(tasks));

      element.querySelectorAll(".tasksAdded").forEach((taskElem) => {
        taskElem.remove();
      });

      if (tasks[containerId]) {
        tasks[containerId].forEach((task, index) => {
          const createElem = document.createElement("div");
          createElem.classList.add("tasksAdded");
          const createp = document.createElement("p");
          createp.textContent = task.title;
          createElem.appendChild(createp);

          createElem.addEventListener("click", (event) => {
            event.stopPropagation();
            showTaskDetails(task, element, containerId, index);
          });

          element.appendChild(createElem);
        });

        inputdata = "";
        descriptiondata = "";
      }
      document.getElementById("myInput").value = "";
      document.querySelector(".descrip textarea").value = "";
      closepopup(containerId);
    }
    saveBtn.removeEventListener("click", saveTask);
  }
  selectedContainerId = null;
});
