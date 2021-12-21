import React from "react";

/*
 * solution to https://exercism.org/tracks/javascript/exercises/rectangles
 * this solution is based on the idea that matching
 * corners on subsequent lines constitutes a rectangle
 */
export const Rectangles = () => {

  const asciiArt = `
+---+--+----+
|   +--+----+
+---+--+    |
|   +--+----+
+---+--+--+-+
+---+--+--+-+
+------+  | |
          +-+`;

  const corner = "+";


    /*
    * split string into an array of lines
    */
    const getLines = (asciiArt) => asciiArt.split(/\n/).slice(1);

    /*
    * find index of 'corner' for each line
    * and remove all lines with only 0 or 1 'corner'
    */
    const findIndices = (lines, corner) => {
    return lines.map((line) => {
        let thisIndices = [];
        for (let i = 0; i < line.length; i++) {
        if (line[i] === corner) thisIndices.push(i);
        }
        return thisIndices;
    });
    };

    /*
    * make pairs out of all the indices
    * for example, if we have the indices "0236",
    * we should get the following pairs:
    * [0,2], [0,3], [0,6], [2,3], [2,6], [3,6]
    */
    const getTuples = (indices, tuples = []) => {
    //console.log("my indices", indices);
    if (!indices.length) {
        return tuples;
    } else {
        let tuple = [];
        const myLine = indices[0];
        //console.log("my line", myLine);
        for (let i = 0; i < myLine.length; i++) {
        for (let j = i + 1; j < myLine.length; j++) {
            tuple.push(`${myLine[i]},${myLine[j]}`);
        }
        }
        tuples.push(tuple);
        return getTuples(indices.slice(1), tuples);
    }
    };

    /*
    * for each line of pairs
    * see if there's a matching pair on subsequent lines
    *
    * given:
    *    +--+
    *   ++  |
    * +-++--+
    * |  |  |
    * +--+--+
    *
    * the returned 'rectangles' object will be of the form:
    *
    * {
    *   0: {
    *     2: ['36'],
    *     4: ['36']
    *   },
    *   1: {
    *     2: ['23']
    *   },
    *   2: {
    *     4: ['03', '06', '36']
    *   }
    * }
    */
    const getRectangles = (tuples) => {
    const rectangles = {};
    for (let i = 0; i < tuples.length; i++) {
        const iTuples = tuples[i];
        if (iTuples) {
        for (let j = i + 1; j < tuples.length; j++) {
            const jTuples = tuples[j];
            // find the intersection of the 2 arrays
            const thisRectangle = iTuples.filter((value) =>
            jTuples.includes(value)
            );
            if (thisRectangle.length) {
            if (!rectangles.hasOwnProperty(i)) rectangles[`${i}`] = {};
            rectangles[`${i}`][`${j}`] = thisRectangle;
            }
        }
        }
    }
    return rectangles;
    };

    /*
    * outputs the html code for a space, if necessary
    */
    const getCharHTML = (char) => {
    if (char === " ") {
        return "&nbsp;";
    }
    return char;
    };

    /*
    * colours the found rectangle
    */
    const getRectangleHTML = (asciiArt, firstRow, lastRow, xCoord, yCoord) => {
    let thisHTML = "<pre>";
    let colourOn = false;
    for (let i = 0; i < asciiArt.length; i++) {
        const thisLine = asciiArt[i];
        if (i === firstRow) colourOn = true;
        for (let j = 0; j < thisLine.length; j++) {
        if (j === xCoord && colourOn) thisHTML += '<span style="color:red">';
        thisHTML += getCharHTML(thisLine[j]);
        if (j === yCoord && colourOn) thisHTML += "</span>";
        }
        if (i === lastRow) colourOn = false;
        thisHTML += "<br/>";
    }
    thisHTML += "</pre>";
    return thisHTML;
    };

    /*
    * creates the found rectangle's base row, last row
    * and the x and y cordinates of its corners
    */
    const getRectanglesHTML = (asciiArt, foundRectangles) => {
    let rectangleHTML = [];
    for (let i = 0; i < asciiArt.length; i++) {
        if (foundRectangles.hasOwnProperty(i)) {
        const baseRow = Number(i);
        const myMatches = Object.keys(foundRectangles[`${baseRow}`]);
        for (let j = 0; j < myMatches.length; j++) {
            const thisRow = Number(myMatches[`${j}`]);
            const thisCorners = foundRectangles[`${baseRow}`][`${thisRow}`];
            for (let k = 0; k < thisCorners.length; k++) {
            const coords = thisCorners[k].split(",");
            const xCoord = Number(coords[0]);
            const yCoord = Number(coords[1]);
            const thisHTML = getRectangleHTML(
                asciiArt,
                baseRow,
                thisRow,
                xCoord,
                yCoord
            );
            rectangleHTML.push(thisHTML);
            }
        }
        }
    }
    return rectangleHTML;
    };

  const thisArt = getLines(asciiArt);
  const foundRectangles = getRectangles(
    getTuples(findIndices(thisArt, corner))
  );
  const myRectanglesHTML = getRectanglesHTML(thisArt, foundRectangles);

  console.log('rectangles', myRectanglesHTML);

  return (
    <>
        <pre>{asciiArt}</pre>
        <h2>There are {myRectanglesHTML.length} rectangles</h2>
        {myRectanglesHTML.map((element, index) => {
            return (
                <div key={index} dangerouslySetInnerHTML={{ __html: element}} />
            )
        })}
        
    </>
  )
};
