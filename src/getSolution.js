/*
 * solution to https://exercism.org/tracks/javascript/exercises/rectangles
 * this solution is based on the idea that matching
 * corners on subsequent lines constitutes a rectangle
 */

import { StoreActions } from './store'

/*
* split string into an array of lines
*/
const getLines = (asciiArt) => asciiArt.split(/\n/);

/* 
* find longest line
*/
const getMaxLineLength = (lines) => {
  let initialValue = 0
  if (lines.length) initialValue = lines[0].length
  const max = lines.reduce((previous, current) => {
    return previous >= current.length ? previous : current.length
  }, initialValue)
  return max
} 

/* 
* ensure all lines are the same length
* by padding short lines with ' '
* (doing this ensures getCharHTML, used later, does the right thing ;) )
*/
const padLines = (lines) => {
  const maxLineLength = getMaxLineLength(lines)
  const newLines = lines.map(line => line.padEnd(maxLineLength, ' '))
  return newLines
}

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
const getCharHTML = (char, doColour, corner ) => {
  if ( doColour ) {
    return corner
  } else if (char === " ") {
    return "&nbsp;";
  }
  return char;
};

/*
* colours the found rectangle
*/
const getRectangleHTML = (art, firstRow, lastRow, xCoord, yCoord, corner, colour) => {
  let thisHTML = "<pre>";
  let isFound, doColour = false;
  for (let i = 0; i < art.length; i++) {
      const thisLine = art[i];
      if (i === firstRow) isFound = true;
      for (let j = 0; j < thisLine.length; j++) {
        if (j === xCoord && isFound) {
          thisHTML += `<span style="color:${colour}">`;
          doColour = true;
        }
        thisHTML += getCharHTML(thisLine[j], doColour, corner);
        if (j === yCoord && isFound) {
          thisHTML += "</span>";
          doColour = false;
        }
      }
      if (i === lastRow) isFound = false;
      thisHTML += "<br/>";
  }
  thisHTML += "</pre>";
  return thisHTML;
};

/*
* creates the found rectangle's base row, last row
* and the x and y cordinates of its corners
*/
const getRectanglesHTML = (art, foundRectangles, corner, colour) => {
  let rectangleHTML = [];
  for (let i = 0; i < art.length; i++) {
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
                  art,
                  baseRow,
                  thisRow,
                  xCoord,
                  yCoord, 
                  corner,
                  colour
              );
              rectangleHTML.push(thisHTML);
            }
        }
      }
  }
  return rectangleHTML;
};

/*
   +--+
  ++  |
+-++--+
|  |  |
+--+--+

+---+--+----+
|   +--+----+
+---+--+    |
|   +--+----+
+---+--+--+-+
+---+--+--+-+
+------+  | |
          +-+

+---+--+----++---+--+----++---+--+----+
|   +--+----+|   +--+----+|   +--+----+
+---+--+    |+---+--+    |+---+--+    |
|   +--+----+|   +--+----+|   +--+----+
+---+--+--+-++---+--+--+-++---+--+--+-+
+---+--+--+-++---+--+--+-++---+--+--+-+
+------+  | |+------+  | |+------+  | |
          +-+          +-+          +-+
+---+--+----++---+--+----++---+--+----+
|   +--+----+|   +--+----+|   +--+----+
+---+--+    |+---+--+    |+---+--+    |
|   +--+----+|   +--+----+|   +--+----+
+---+--+--+-++---+--+--+-++---+--+--+-+
+---+--+--+-++---+--+--+-++---+--+--+-+
+------+  | |+------+  | |+------+  | |
          +-+          +-+          +-+
*/

export const findRectangles = async (dispatch, userHasSubmitted, asciiArt, corner, colour) => {
  const thisArt = await getLines(asciiArt)
  const newArt = await padLines(thisArt)
  const rectangles = await getRectangles(getTuples(findIndices(newArt, corner)))
  const rectanglesHTML = await getRectanglesHTML(newArt, rectangles, corner, colour)
  dispatch({
    type: StoreActions.update,
    payload: { 
      userHasSubmitted: userHasSubmitted,
      asciiArt: asciiArt,
      corner: corner,
      colour: colour,
      rectangles: rectanglesHTML
    }
  })
} 

