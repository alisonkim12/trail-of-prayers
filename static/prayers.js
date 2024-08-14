// let prayerInOrder = [];
// let prayerRevealCounter = 0;

// left column of sentences and flowers below: 
function main() {    
    const field = document.getElementById('field');
    const sentenceOverlay = document.getElementById('sentence-overlay');
    const sentenceOverlayBounds = sentenceOverlay.getBoundingClientRect();
    const sentenceOverlayHeight = sentenceOverlay.offsetHeight;
    // const fieldWidth = field.offsetWidth;
    // const fieldHeight = field.offsetHeight;
    const uniqueWords = new Set([]);
    let currentSentenceIndex = 0;
    let direction = 1; // 1 for right, -1 for left
    let positionPercent = 50; // Start in the middle (50% of parent width) 
    let sentencePositionData = {};
   

    function applyZigZagPositioning(child, index) {
        // Apply horizontal positioning based on calculated percentage
        const verticalPosition = sentenceOverlayHeight - (index * 70);
        child.style.left = `${positionPercent}%`;
        // Update the next position percentage
        positionPercent += 10 * direction;

        // Switch direction at 3/4 or 1/4 of parent width
        if (positionPercent >= 70) {
            direction = -1; // Switch to moving left
        } else if (positionPercent <= 30) {
            direction = 1; // Switch to moving right
        }
        child.style.top = `${index * 100}px`; // Adjust spacing as needed
}

    function adjustFontSizeOnScroll() {
        const sentenceOverlayRect = sentenceOverlay.getBoundingClientRect();
        const sentencesDivs = document.querySelectorAll('.sentence');
        sentencesDivs.forEach((child) => {
            const childRect = child.getBoundingClientRect();
            const distanceFromTop = childRect.top - sentenceOverlayRect.top;

            // Adjust font size based on Y-axis position
            let newFontSize = 8 + (distanceFromTop / sentenceOverlayRect.height) * 3;
            newFontSize = Math.max(newFontSize, 8);
            child.style.fontSize = `${newFontSize}px`;
        });
    }

    // Adjust font size on scroll
    sentenceOverlay.addEventListener('scroll', adjustFontSizeOnScroll);


    async function addSentence(newSentence) {
        const sentenceList = document.getElementById('sentence-list');
        const prevSentence = document.querySelectorAll('.sentence.current');
        if (prevSentence.length > 0) {
            prevSentence[0].classList.remove('current');
        }
        const sentenceDiv = document.createElement('div');
        sentenceDiv.className = 'sentence';
        sentenceDiv.classList.add('current');
        sentenceDiv.textContent = newSentence;
        // sentenceList.prepend(sentenceDiv);
        sentenceOverlay.appendChild(sentenceDiv); 
        applyZigZagPositioning(sentenceDiv, currentSentenceIndex);
        adjustFontSizeOnScroll();
        // let sdfsd = sentenceDiv.getBoundingClientRect();
        // sentencePositionData[newSentence] = [];
        // sentencePositionData[newSentence].push({
        //     left_x: sdfsd.left,
        //     y: sdfsd.top
        // });
        // sentencePositionData[newSentence].push({
        //     right_x: sdfsd.right,
        //     y: sdfsd.top
        // });
        updateUniqueWords(uniqueWords, newSentence, sentenceDiv, currentSentenceIndex);
        mouseHoverReveal();
        adjustFlowerSizeOnScroll();
        currentSentenceIndex++;

    }

    function mouseHoverReveal() {
        const allSentences = document.querySelectorAll('.sentence');
        [...allSentences].forEach((sentence) => { // Use => instead of =
            sentence.addEventListener('mouseover', () => { // Remove extra parentheses around 'mouseover'
                sentenceHoverRevealFlower(sentence);
            });
            sentence.addEventListener('mouseout', () => { // Remove extra parentheses around 'mouseout'
                sentenceHoverResetFlower(sentence);
            });
        });

    }

    function updateUniqueWords(wordSet, sentence, sentenceDiv,currentSentenceIndex) {
        // Split the sentence into words using a regular expression to handle various delimiters
        const allFlowers = document.querySelectorAll('.flower');
        [...allFlowers].forEach((flower) => {
            flower.style.opacity = 0.4; //reset the opacity of all the flowers
            flower.lastChild.style.textShadow = `none`;
        });
        const words = sentence.match(/\b\w+\b/g).map(word => word.toLowerCase());
        if (!words) {
            return; // If no words are found in the sentence, return early
        }
        // Iterate over each word in the sentence
        let newWordsCounter = 0;
        words.forEach((word) => {
            if (uniqueWords.has(word)){
                revealFlower(word);
                // createFlower(word, sentenceDiv, sentence);
            } else {
                newWordsCounter++;
                wordSet.add(word);
                createFlower(word, sentenceDiv, sentence, currentSentenceIndex);
                revealFlower(word);
            }
        });
        let dfsdfs = 30 - newWordsCounter;
        for (let i = 0; i < dfsdfs; i++){
            createFlower("", sentenceDiv, sentence, currentSentenceIndex);
        }
    }

    function sentenceHoverRevealFlower (sentence) {
        let sentenceString = sentence.innerText;
        const words = sentenceString.match(/\b\w+\b/g).map(word => word.toLowerCase());
        if (!words) {
            return; 
        }
        words.forEach((word) => {
            if (uniqueWords.has(word)){
                revealFlower(word);
            }
        });
    }

    function sentenceHoverResetFlower(sentence) {
        let sentenceString = sentence.innerText;
        const words = sentenceString.match(/\b\w+\b/g).map(word => word.toLowerCase());
        if (!words) {
            return; 
        }
        words.forEach((word) => {
            if (uniqueWords.has(word)){
                let reset = document.getElementById(`flower-${word}`);
                reset.style.opacity = 0.4;
                reset.lastChild.style.textShadow = `none`;

            }
        });
    }

    function revealFlower(word) {
        let reveal = document.getElementById(`flower-${word}`);
        reveal.style.opacity = 1;
        let captionTextSize = reveal.lastChild.style.fontSize;
        let captionTextSizeValue = parseInt(captionTextSize, 10);
        let textShadowValue = `0 0 ${captionTextSizeValue + 5}px #fff, 
                            0 0 ${captionTextSizeValue + 10}px #fff, 
                            0 0 ${captionTextSizeValue + 15}px #fff, 
                            0 0 ${captionTextSizeValue + 20}px #fff`;
        reveal.lastChild.style.textShadow = textShadowValue;
    }

    function createFlower(word, sentenceDiv, sentence, currentSentenceIndex) {
        const newFlower = document.createElement('div');
        newFlower.className = "flower";
        newFlower.id = `flower-${word}`;
        const flowerImg = document.createElement('img');
        flowerImg.src = "/static/media/—Pngtree—simple vector rose line one_5580063.png";
        flowerImg.alt = "flower vector";
        const flowerCaption = document.createElement('div');
        flowerCaption.className = 'caption';
        flowerCaption.innerText = word;
        newFlower.append(flowerImg);
        newFlower.append(flowerCaption);

        const sentenceBounds = sentenceDiv.getBoundingClientRect();
        const relativeYPosition = sentenceBounds.top - sentenceOverlayBounds.top;
        const yPositionPercentage = (relativeYPosition / sentenceOverlayBounds.height) * 100;

        positionFlower(newFlower, flowerCaption, sentenceDiv, yPositionPercentage, sentence, currentSentenceIndex);
        sentenceOverlay.append(newFlower);
        let sdfdsfds = newFlower.getBoundingClientRect();
        // sentencePositionData[sentence].push({
        //     x: sdfdsfds.left,
        //     y: sdfdsfds.top
        // });
    }

    function positionFlower(newFlower,flowerCaption, sentenceDiv, yPositionPercentage, sentence, currentSentenceIndex) {
        let sentenceOverlayBounds = sentenceOverlay.getBoundingClientRect();
        const maxFlowerWidth = 20;
        const maxFlowerHeight = 40;
        const minFlowerWidth = 10;
        const minFlowerHeight = 20;
        const sentenceRect = sentenceDiv.getBoundingClientRect();
        const positionFactor = (yPositionPercentage * 0.01);
        const flowerWidth = minFlowerWidth + (maxFlowerWidth - minFlowerWidth) * positionFactor;
        const flowerHeight = minFlowerHeight + (maxFlowerHeight - minFlowerHeight) * positionFactor;
        // flowerImg.style.width = `${flowerWidth}px`;
        // flowerImg.style.height = `${flowerHeight}px`;
        // Calculate x and y ranges
        const xRangeStartLeftStart = (sentenceOverlayBounds.width)*0.15;
        const xRangeLeftEnd = sentenceRect.left - 50;
        const xRangeStartRightStart = sentenceRect.right + 50;
        const xRangeStartRightEnd = (sentenceOverlayBounds.width)*0.85;

        const yRangeStart = (currentSentenceIndex * 100) - 30;
        const yRangeEnd = (currentSentenceIndex * 100) + 30;

        let xPos;
        if (Math.random() < (sentenceRect.left/(sentenceOverlayBounds.width*0.8))) {
            // Choose from the left range
            xPos = Math.random() * (xRangeLeftEnd - xRangeStartLeftStart) + xRangeStartLeftStart;
        } else {
            // Choose from the right range
            xPos = Math.random() * (xRangeStartRightEnd - xRangeStartRightStart) + xRangeStartRightStart;
        }
        const yPos = Math.random() * (yRangeEnd - yRangeStart) + yRangeStart;

        const xPosPercentage = (xPos / sentenceOverlayBounds.width) * 100;
        const yPosPercentage = (yPos / sentenceOverlayBounds.height) * 100;

        // Position the flower in percentage values
        newFlower.style.left = `${xPosPercentage}%`;
        newFlower.style.top = `${yPosPercentage}%`;

        // sentencePositionData[sentence].push({
        //     x: `${xPosPercentage}%`,
        //     y: `${yPos}px`
        // });

        const maxFontSize = 10; // Maximum font size in pixels
        const minFontSize = 5;  // Minimum font size in pixels
        const fontSize = minFontSize + (maxFontSize - minFontSize) * positionFactor;
        flowerCaption.style.left = `${xPosPercentage}%`;
        flowerCaption.style.top = `${yPos}px`;
        flowerCaption.style.fontSize = `${fontSize}px`;
        
    }

    function adjustFlowerSizeOnScroll() {
        const sentenceOverlayRect = sentenceOverlay.getBoundingClientRect();
        const flowerDivs = document.querySelectorAll('.flower');
        flowerDivs.forEach((child) => {
            const childRect = child.getBoundingClientRect();
            const flowerCaption = child.querySelector('div');
            const distanceFromTop = childRect.top - sentenceOverlayRect.top;
            const parentHeight = sentenceOverlayRect.height;

            // Calculate the percentage of the way down the div (0 at top, 1 at bottom)
            const positionRatio = distanceFromTop / parentHeight;

            // Calculate new width and height based on the position ratio
            let newWidth = 10 + positionRatio * (20 - 10);
            let newHeight = 20 + positionRatio * (40 - 20);
            let newFontSize = 5 + positionRatio * (10-5);

            // Apply the new width and height to the flower div
            child.style.width = `${newWidth}px`;
            child.style.height = `${newHeight}px`;
            flowerCaption.style.fontSize = `${newFontSize}px`;
        });

    }

    sentenceOverlay.addEventListener('scroll', adjustFlowerSizeOnScroll);


    function handleResize() {
        const allFlowers = document.querySelectorAll('.flower');
        [...allFlowers].forEach((flower) => {
            const xPercent = flower.dataset.xPercent;
            const yPercent = flower.dataset.yPercent;
            // positionFlower(xPercent, yPercent, flower.firstChild, flower.lastChild);
        });
    }

    window.addEventListener('resize', handleResize);

    function getNewPrayers() {
        $.get('/get_text', async function(data) {
            if (data.element != undefined) {
                // sentences.push(data.element);
                addSentence(data.element);
                // updateUniqueWords(uniqueWords, data.element);
            } 
        });
    }
    setInterval(getNewPrayers, 4000); 
    mouseHoverReveal();


    // async function createWords(prayerTextList, prayerText){
    //     var newContent = prayerTextList.map(function(word) {
    //         return "<span class = 'prayer-span'>" + word + "</span>";
    //     }).join(" ");
    //     prayerText.innerHTML = newContent;
    // }

    // function disappearElements() {
    //     const words = [...document.querySelectorAll('.prayer-span')];
    //     const oneThird = Math.ceil(words.length / 3);
    //     let randomSpans = [];
    //     for (let i = 0; i < oneThird; i++) {
    //         let randomIndex = Math.floor(Math.random() * words.length);
    //         randomSpans.push(words[randomIndex]);
    //         words[randomIndex].classList.add('word-hide');
    //         words.splice(randomIndex, 1); // Remove the selected span to avoid selecting it again
    //     }
    //     function hideNextThird() {
    //         setTimeout(() => {
    //             for (let i = 0; i < oneThird; i++) {
    //                 if (words.length === 0) return; // If all spans are hidden, stop the function
    //                 let randomIndex = Math.floor(Math.random() * words.length);
    //                 randomSpans.push(words[randomIndex]);
    //                 words[randomIndex].classList.add('word-hide');
    //                 words.splice(randomIndex, 1); // Remove the selected span to avoid selecting it again
    //             }
    //             hideNextThird(); // Repeat the process recursively
    //         }, 800); // Delay for 1 seconds before hiding the next one-third
    //     }
    //     hideNextThird();
    // }
    
    // async function revealPrayer(prayer_string) {
    //     const prayerText = document.getElementById('prayer-text');
    //     let prayerTextList = prayer_string.split(/\s+/);
    //     await createWords(prayerTextList, prayerText);
    //     createPosition(prayer_string);
    //     const words = [...document.querySelectorAll('.prayer-span')];
    //     words.forEach((word) => {
    //         setTimeout(function () {
    //             word.classList.add('word-reveal');
    //         },100); 
    //     });
       
    //     setTimeout(disappearElements, 10000);
    //     // for (let index = 0; index < words.length; index++) {
    //     //     setTimeout(function () {
    //     //         words[index].classList.add('word-reveal');
    //     //     }, 1000 * index); 
    //     // }
    //     // const wordArray = Array.from(words); // Convert NodeList to Array
    //     // wordArray.forEach((each_span) => {
    //     //     setTimeout(function () {
    //     //         each_span.classList.add('prayer-disappear');
    //     //     }, (500 * words.length+ 2000)); // Set timeout to start disappearing after all words have been revealed
    //     // });
    //     // words.forEach((word) => {
    //     //     word.classList.remove('word-reveal', 'prayer-disappear');
    //     // });
    // }

    


    // async function changePrayers() {
    //     while (prayerRevealCounter < prayerInOrder.length){
    //         let nextstring = prayerInOrder[prayerRevealCounter];
    //         await revealPrayer(nextstring);
    //         prayerRevealCounter  = prayerRevealCounter + 1;
    //     }
    // }
    // setInterval(changePrayers, 20000); 
    // setInterval(() => {
    //     revealPrayer("Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, placeat ullam molestias facilis minima sapiente veniam ratione itaque aspernatur recusandae, maiores saepe reiciendis error cumque et perferendis ut. Ullam, iure?");
    // }, 10000);
    
}

main();