# sticker-by-number-generator
Take an image and split it up into numbered mosaic tiles that can then be printed on a sticker sheet for kids to rearrange on a grid.

# Generating the output
Type in the sticker size in inches (eg. '0.5' for half inch square stickers), the horizontal/vertical spacing between the square stickers on the sticker sheet, and the number of squares across your sticker sheet. Underneath, enter the # of rows and columns for the image you want to generate. Then choose your image file and click "Generate Image". This will generate two .png files - one of the scrambled image, and one of a grid that can be used to apply the stickers to.

# Printing the output
Printing is the output images is trickier than I'd like. Printers have a tendency to ignore your margins and add their own. The best luck I've had is to generate the raw scrambled image with 0 margins, import them into LibreOffice Draw, which seems to respect margins the best when printing. 

# Examples
See the 'examples' directory for an example input/output image.
