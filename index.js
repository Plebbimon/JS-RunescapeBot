//import robotJS lib
const robot = require('robotjs');
const {mouseClick} = require("robotjs");

function main() {
    console.log("Starting...");
    sleep(3000);
    let count = 0;

    const inv_space_x = 700;
    const inv_space_y = 501;

    while(count<50) {
        var tree = findTree();
        if (tree ==false) {
            rotateCamera();
            console.log("Could not find tree");
            continue;
        }
        moveClick(tree.x,tree.y);
        sleep(5000);
        dropItem(inv_space_x, inv_space_y);
        console.log(count);
        count++;

    }

    console.log("Done. ");
}



function moveClick(x,y) {
    robot.moveMouse(x,y);
    robot.mouseClick();
}

function moveClickSmooth(x,y) {
    robot.moveMouseSmooth(x,y);
    robot.mouseClick();
}

function dropItem(x,y) {
    let log_colors = ["765935", "6f5431", "8a693e","906e3f"];
    let i = 0;
    let pixel_color = robot.getPixelColor(x,y);
    while (i<4) {
        if (log_colors.includes(pixel_color)) {
            robot.moveMouse(x-(i*40),y);
            robot.mouseClick("right");
            sleep(500);
            moveClick(x-(i*40),y+25);
            sleep(500);
        } i++;
    }
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random()*(max-min+1)) + min;
}

function findTree() {
    var x = 0, y = 0, width = 500, height = 400;
    var img= robot.screen.capture(x, y, width, height);

    var tree_colors = ["87673c", "765935", "725633"];

    for (let i = 0; i < 100; i++) { //find colors in screenshot
        let random_x = getRandomInt(0, width-1);
        let random_y = getRandomInt(0, height-1)
        let sample_color = img.colorAt(random_x, random_y);
        if (tree_colors.includes(sample_color)) {
            var screen_x = random_x + x;
            var screen_y = random_y + y;

            if (confirmTree(screen_x,screen_y)){
                console.log("Found tree at: " + screen_x + "," + screen_y + ", color: " + sample_color);
                return {x: screen_x, y: screen_y};
            } else {
                console.log("Unconfirmed tree at:  " + screen_x + "," + screen_y + ", color: " + sample_color);
            }
        }
    } return false; //if chosen color is not found anywhere

}

function rotateCamera() {
    robot.keyToggle("right", "down");
    sleep(500);
    robot.keyToggle("right", "up");

}

function confirmTree(screen_x, screen_y) {
    robot.moveMouse(screen_x, screen_y);
    sleep(300);
    let check_x = 83;
    let check_y = 73;
    let pixel_color = robot.getPixelColor(check_x,check_y);
    return pixel_color == "00ffff";
}

function screenCaptureTest() {
    console.log("Starting screen capture..");
    sleep(3000);
    var img = robot.screen.capture(0, 0, 1920, 1080);
    var pixel_color = img.colorAt(83, 73);
    console.log("Pixel color", pixel_color);
}

function getColor(x,y) {
    console.log("Starting screen capture..");
    sleep(3000);
    var img = robot.screen.capture(0, 0, 1920, 1080);
    var pixel_color = img.colorAt(x, y);
    console.log("Pixel color", pixel_color);
    return pixel_color;

}

function sleep(ms) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms)
}

function colorOutlineDetect() {
    var x = 0, y = 0, width = 800, height = 600;
    var img = robot.screen.capture(x, y, width, height);
    let coords_x = [];
    let coords_y = [];
    let yellow = ["00ffff", "00fffe"];
    let sample_color = "000000";
    let counter = 0;
    for (let i=0; i<10000; i++) {
        let random_x = getRandomInt(100, width - 1);
        let random_y = getRandomInt(100, height - 1);
        let sample_color = img.colorAt(random_x, random_y);
        counter++;
        if (yellow.includes(sample_color)) {
            coords_x.push(random_x);
            coords_y.push(random_y);
            console.log("Cyan found at: ", random_x, random_y);
            let img = robot.screen.capture(random_x-50, random_y-50, 100, 100);
            while (coords_x.length < 5) {
                let random_x1 = getRandomInt(0,99);
                let random_y1 = getRandomInt(0,99);
                let sample_color1 = img.colorAt(random_x1, random_y1);
                if (yellow.includes(sample_color1)) {
                    coords_x.push(random_x1+random_x-50);
                    coords_y.push(random_y1+random_y-50);
                    console.log("Cyan edge found at: ", random_x1, random_y1);
                }
            }return {x: coords_x, y: coords_y};
        }
    }
    console.log({x: coords_x, y: coords_y});
    return {x: coords_x, y: coords_y};
}

function dropItemDumb(x,y) {
    let i = 0;
    robot.keyToggle("shift", "down");
    while (i<4) {
            robot.moveMouse(x-(i*40),y+getRandomInt(-105,0));
            robot.mouseClick("left");
            sleep(500);
            i++;
    }
    robot.keyToggle("shift", "up");
}


function miner() {
    console.log("Starting...");
    let inv_x = 825;
    let inv_y = 625;
    sleep(3000);
    let counter = 0;
    while (counter<500) {
        let coords = colorOutlineDetect();
        let sum_x = coords.x.reduce((a, b) => a + b, 0);
        let avg_x = (sum_x / coords.x.length) || 0;
        let sum_y = coords.y.reduce((a,b) => a + b, 0);
        let avg_y = (sum_y / coords.y.length) || 0;
        let min_x = Math.min(...coords.x);
        let max_x = Math.max(...coords.x);

        console.log(`The average is: ${avg_x}.`);
        moveClick(getRandomInt(min_x,max_x),avg_y+getRandomInt(-2,3));
        counter++;
        sleep(getRandomInt(7,10)*1000);
        if (counter % 6 == 0) {dropItemDumb(inv_x,inv_y);}
    }

}
miner();