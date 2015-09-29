import os
import re

header = open("header.ejs").read()
footer = open("footer.ejs").read()

outfile = open("output.html", "w")

outfile.write(header)

outfile.write('<div id="listContainer" style="max-height:200px;overflow-y:auto">\n')
outfile.write('<ul id="expList">\n')

itemtypes = next(os.walk('ff_example'))[1]
itemtypes.sort()

for itemtype in itemtypes:
        if "Taco" in itemtype:
            multiplier = 1.1
            outfile.write('<li style="color:green">' + itemtype + "\n")
        else:
            multiplier = 1.2
            outfile.write("<li> " + itemtype + "\n")
        #outfile.write("<li> " + itemtype + "\n")
	outfile.write("<ul>\n")
        itemtype_clean = re.sub(" ", "", itemtype.lower())
        itemtype_html = re.sub(" ", "%20", itemtype)
	items = open("ff_example/" + itemtype + "/items.txt").read().split("\n")
        items = map(lambda s: s.split(";"), items)
        items = filter(lambda s: len(s) == 3, items)
        items.sort(key=lambda s: s[1])
        
	for item_spl in items:
		id = "ff_example/" + itemtype_html + "/" + item_spl[0] + ".jpg"
		name = item_spl[1].capitalize()
                price = "$" + "{0:.2f}".format(float(item_spl[2]) * multiplier)
		li = '<li class="shoppingitem">'
		li = li + ' <span data-imgpath="' + id + '" class="shoppingitemname"> ' + name + '</span>'
		li = li + ' <span class="shoppingprice">' + price + '</span>'
		li = li + ' <input class="shoppingquantity" type="text" placeholder="Qty" /></li>'
		outfile.write(li + "\n")
	outfile.write("</ul>\n")
	outfile.write("</li>\n")

outfile.write('</ul>\n')
outfile.write('</div>\n')
outfile.write(footer)
outfile.close()
