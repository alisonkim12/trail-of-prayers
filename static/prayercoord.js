async function getCoordData() {
    try {
        const response = await fetch('../static/prayer_coordinates.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return null; // Return null to signify failure
    }
}

function getMinMaxRanges(coordData) {
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    // Iterate over the list of objects to find min and max values
    for (let point of coordData) {
        let x = parseFloat(point.x);
        let y = parseFloat(point.y);
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
    }
    return { minX, maxX, minY, maxY };
}

async function scaleData(coordData, minX, maxX, minY, maxY) {
    return coordData.map(item => {
        item.x = ((parseFloat(item.x) - minX) / (maxX - minX)) * window.innerWidth; 
        item.y = (((parseFloat(item.y) - minY) / (maxY - minY)) * window.innerHeight);
        //(window.innerHeight * 0.6))+ (window.innerHeight*0.1)
        return item; // Add this line to return the modified item
    });
}

async function createPrayerPoints(scaled_dataset) {
    let counter = 0;
    let writerNameLists = {}
    for (const data of scaled_dataset) {
        const createStar = document.createElement('article');
        createStar.className = 'prayer-point';
        createStar.id = `star-${counter}`;
        createStar.innerHTML = `<i class="ri-shining-fill"></i>`;
        createStar.style.transform = `translate(${data.x}px, ${data.y}px)`;
        document.body.append(createStar);
        const writerName = data['writer-name'];
        if (!writerNameLists[writerName]) {
            writerNameLists[writerName] = []; // Create a new list if it doesn't exist
        }
        writerNameLists[writerName].push(createStar); // Push the created element to the corresponding list
        counter++;
    }
    return writerNameLists;
}

async function connectPoints(scaled_dataset) {
    let test_data = scaled_dataset;
    test_data.forEach((data, i)=> {
        if (i === scaled_dataset.length-1) {
            var x1 = (test_data[0]["x"]); 
            var y1 = (test_data[0]["y"]); 
            var x2 = (test_data[i]["x"]); 
            var y2 = (test_data[i]["y"]); 
            
        } else {
            var x1 = (test_data[i+1]["x"]); 
            var y1 = (test_data[i+1]["y"]); 
            var x2 = (test_data[i]["x"]); 
            var y2 = (test_data[i]["y"]); 
        }
        var length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)); // Length of the line
        var angle = Math.atan2(y1 - y2, x1 - x2) * 180 / Math.PI;
        let connectingLine = document.createElement('article');
        connectingLine.classList.add('connecting-line');
        connectingLine.id = `line-${i}`;
        connectingLine.style.width = length + 'px';
        connectingLine.style.height = '0.25px'; 
        connectingLine.style.transformOrigin = 'left';
        connectingLine.style.transform = `translate(${x1+2}px, ${y1+2}px) rotate(${angle + 180}deg`; 
        connectingLine.style.transformOrigin = 'bottom left';
        document.body.append(connectingLine);
    });

}

function slidingScale(scaled_dataset) {
    const slider = document.getElementById("myRange");
    slider.setAttribute("min", 0);
    slider.setAttribute("max", scaled_dataset.length-1);
    let prevInput = 0;
    slider.oninput = function() {
        document.getElementById(`line-${prevInput}`).style.opacity = ".05";
        let getStarOne;
        let getStarTwo;
        const sliderValue = parseInt(this.value);
        if (sliderValue == scaled_dataset.length - 1){
            getStarOne = document.getElementById(`star-${sliderValue}`);
            getStarTwo = document.getElementById(`star-0`);
        } else {
            getStarOne = document.getElementById(`star-${sliderValue}`);
            getStarTwo = document.getElementById(`star-${sliderValue+1}`);
        }
        const getLine = document.getElementById(`line-${sliderValue}`);
        getStarOne.style.opacity = ".90";
        getStarTwo.style.opacity = ".90";
        getLine.style.opacity = ".50";
        prevInput = sliderValue;
    };
};

async function main() {
    const prayerSource = document.getElementById('prayer-source')
    const coordData = await getCoordData();
    if (coordData) {
        const { minX, maxX, minY, maxY } = getMinMaxRanges(coordData);
        console.log(minX, maxX, minY, maxY);
        let scaled_dataset = await scaleData(coordData, minX, maxX, minY, maxY);
        const writerNameLists = await createPrayerPoints(scaled_dataset);
        await connectPoints(scaled_dataset);
        slidingScale(scaled_dataset);
        document.querySelectorAll('.prayer-point').forEach((point)=>{
            point.addEventListener('mouseenter', () => {
                document.querySelectorAll('.connecting-line').forEach((each_line)=>{
                    each_line.style.opacity = "0.05";
                })
                document.querySelectorAll('.prayer-point').forEach((each_point)=>{
                    each_point.style.opacity = ".20";
                })
                point.style.opacity = ".90";
                let pointData = coordData[point.getAttribute('id').split('-')[1]];
                prayerSource.innerHTML = `${pointData['writer-name']}, ${pointData['writing-source-title']}`;
                document.getElementById(`line-${point.getAttribute('id').split('-')[1]}`).style.opacity = "0.2";
                writerNameLists[(pointData['writer-name'])].forEach((each_point)=>{
                    let pointIndex = each_point.getAttribute('id').split('-')[1];
                    document.getElementById(`line-${pointIndex}`).style.opacity = "0.2";
                    each_point.style.opacity = ".70";
                })
            })
            point.addEventListener('mouseleave', () => {
                // point.style.opacity = ".20";
                // prayerSource.innerHTML = "";
                // writerNameLists[(coordData[point.getAttribute('id')]['writer-name'])].forEach((each_point)=>{
                //     each_point.style.opacity = ".20";
                // })
                // document.querySelectorAll('.connecting-line').forEach((each_line)=>{
                //     each_line.style.opacity = "0.05";
                // })
                // document.querySelectorAll('.prayer-point').forEach((each_point)=>{
                //     each_point.style.opacity = ".20";
                // })
            })
        })
    }
}
main();

const closeButton = document.getElementById('overlay-close-button');
const bibLink = document.getElementById('bibliography');
bibLink.addEventListener('click', async function() {
    overlay.classList.add('blur'); 
    overlay.style.display = 'block';
});

closeButton.addEventListener('click', function() {
    overlay.classList.remove('blur');
    overlay.style.display = 'none';
});

