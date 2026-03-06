const manageSpinner = (status) =>{
    if(status ==true){
        document.getElementById("spinner-section").classList.remove("hidden");
        document.getElementById("word-container").classList.add("hidden");
    }
    else{
        document.getElementById("spinner-section").classList.add("hidden");
        document.getElementById("word-container").classList.remove("hidden");
     }
}

// Function to remove active class from all lesson buttons
const removeActive = () => {
    const allbtn = document.getElementsByClassName("lesson-btn");
    for (let btn of allbtn) {
        btn.classList.remove("btn-active");
    }
}
//getting the synonyms with array mapping and join method
const createElement = (arr) =>{
    const element = arr.map((elem) => `<span class="btn">${elem}</span>`).join("");
    return element;
}

const loadLessons = () =>{
    fetch("https://openapi.programming-hero.com/api/levels/all").
    then(res => res.json()).
    then(data => displayLessons(data.data))
};


const loadLevelWord = (id) =>{
    manageSpinner(true);
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url).
    then(res => res.json()).
    then(data => {
        const allbtn = document.getElementsByClassName("lesson-btn");
        for(let btn of allbtn){
            btn.classList.remove("btn-active");
        }
        const clickedbtn = document.getElementById(`lesson-${id}`);
        clickedbtn.classList.add("btn-active");
        displayLevelWord(data.data);
    })
}

const loadWordDetails =async (id) =>{
    const response = await fetch(`https://openapi.programming-hero.com/api/word/${id}`);
    const data = await response.json();
    displayWordDetails(data.data);
};

const displayWordDetails = (word) =>{
        const wordDetailsContainer = document.getElementById("word-details-container");
        wordDetailsContainer.innerHTML = `
                    <div class="">
                        <h2>${word.word} (<i class="fa-solid fa-microphone-lines"></i>)  :${word.pronunciation}</h2>
                    </div>
                    <div>
                        <h2 class="font-bold">Meaning</h2>
                        <p>${word.meaning}</p>
                    </div>
                    <div>
                        <h2 class="font-bold">Example</h2>
                        <p>${word.sentence}</p>
                    </div>
                    <div>
                        <h2 class="font-bold">Synonym</h2>
                        <div class="flex flex-wrap gap-2">${createElement(word.synonyms)}  </div>
                    </div>`;
        document.getElementById("my_modal_5").showModal();

}
const displayLevelWord = (words) =>{
    //console.log(words);
    //get the container
    const wordContainer = document.getElementById("word-container");
    wordContainer.innerHTML = "";

    if(words.length === 0){
        wordContainer.innerHTML = `
            <div class="text-center col-span-full space-y-5">
            <img class="mx-auto" src="./assets/alert-error.png">
                <p class="font-bangla text-[#79716B]">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
                <h2 class="font-bangla text-3xl font-semibold">নেক্সট Lesson এ যান</h2>
            </div>
        `;
        manageSpinner(false);
        return;
    }
    //loop through the lessons
    words.forEach(word => {
        //create a element for each lesson
        const wordDiv = document.createElement("div");
        wordDiv.innerHTML = `
            <div class="bg-white w-11/12 mx-auto rounded-xl shadow-sm text-center py-6 px-5 space-y-4">
                <h2 class="font-bold text-xl">${word.word ? word.word: "শব্দ পাওয়া যায়নি"}</h2>
                <p class="font-semibold">Meaning / Pronunciation</p>
                <div class="font-bangla font-medium text-xl text-[#18181B]">${word.meaning ? word.meaning: "অর্থ পাওয়া যায়নি"} / ${word.pronunciation ? word.pronunciation: "উচ্চারণ পাওয়া যায়নি"}</div>
                <div class="flex justify-between items-center">
                    <button onclick="loadWordDetails(${word.id})" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i  class="fa-solid fa-circle-info"></i></button>
                    <button class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-volume-high"></i></button>
                </div>
            </div>
        `;
        wordContainer.appendChild(wordDiv);
    });
    manageSpinner(false);
};

const displayLessons = (lessons) =>{
    //console.log(lessons);
    //get the container
    const levelContainer = document.getElementById("level-container");
    levelContainer.innerHTML = "";

    //loop through the lessons
    for(let lesson of lessons){
        console.log(lesson);
        //create a element for each lesson
        const btnDiv = document.createElement("div");
        btnDiv.innerHTML = `
            <button id="lesson-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})"class="btn btn-outline btn-primary mx-4 lesson-btn">
                <i class="fa-solid fa-book-open"></i>Lesson - ${lesson.level_no}
            </button>
        `;
        //append the div to the container
        levelContainer.appendChild(btnDiv);
    }
}
loadLessons();

document.getElementById("btn-search").addEventListener("click", ()=>{
    removeActive();
    const searchInput = document.getElementById("search-input");
    // Implement search functionality here
    const searchValue = searchInput.value.trim().toLowerCase();
    manageSpinner(true);
    fetch("https://openapi.programming-hero.com/api/words/all").
    then(res => res.json()).
    then(data => {
        const allWords = data.data;
        const matchedWord = allWords.filter((word) => word.word.toLowerCase().includes(searchValue));
        // display the matched word details
        displayLevelWord(matchedWord);

    });
});


