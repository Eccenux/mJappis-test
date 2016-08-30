Prepare single path SVG:

1. Create SVG of any size, but square.
2. Convert objects to path.
3. Join all paths into one.

Prepare view box (not needed if already drawn in x-black.svg): 

1. Name path in properties (to find it quicker).
5. Copy path to x-black.svg.
6. Open x-black.svg and in document properties fit to selected path.
7. Change doc dim. to be square.
8. Center path on page.

Minimize file:

1. Paste just the "d" attribute to new x-black.svg.
2. Add prepared viewBox (if different).
3. Round values by replacing "(\.[0-9])[0-9]+" with "$1". 
